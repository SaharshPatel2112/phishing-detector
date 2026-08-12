import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import {
  clerkMiddleware,
  requireAuth,
  getAuth,
  clerkClient,
} from "@clerk/express";
import { checkSafeBrowsing } from "./services/safeBrowsing.js";
import { checkVirusTotal } from "./services/virusTotal.js";
import { calculateRisk } from "./services/riskScore.js";
import { getOrCreateUser } from "./services/users.js";
import { getDashboardStats, getRecentScans } from "./services/stats.js";
import { getDetectionsOverTime } from "./services/chart.js";
import { analyzeEmail } from "./services/emailAnalyzer.js";
import { extractPdfText } from "./services/pdfExtractor.js";
import { getKeywords, addKeyword, deleteKeyword } from "./services/keywords.js";
import {
  getAllUsers,
  getAllScans,
  getAdminAnalytics,
} from "./services/adminData.js";
import { requireAdmin } from "./middleware/requireAdmin.js";
import { getCachedUrlScan } from "./services/cache.js";
import { getReport } from "./services/reports.js";
import { supabase } from "./db.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "2mb" }));
app.use(clerkMiddleware());

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(generalLimiter);

const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many scan requests. Wait a minute and try again." },
});

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

app.post("/api/scan/url", scanLimiter, requireAuth(), async (req, res) => {
  const { url } = req.body;
  const { userId } = getAuth(req);
  if (!url || typeof url !== "string")
    return res.status(400).json({ error: "URL is required" });
  if (!isValidUrl(url))
    return res.status(400).json({ error: "Not a valid http/https URL" });

  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const user = await getOrCreateUser(userId, email);

    let gsbResult,
      vtResult,
      fromCache = false;
    const cached = await getCachedUrlScan(url);

    if (cached) {
      gsbResult = cached.result.gsbResult;
      vtResult = cached.result.vtResult;
      fromCache = true;
    } else {
      [gsbResult, vtResult] = await Promise.all([
        checkSafeBrowsing(url),
        checkVirusTotal(url),
      ]);
    }

    const risk = calculateRisk(gsbResult, vtResult, url);

    await supabase.from("scan_history").insert({
      user_id: user.id,
      scan_type: "url",
      content: url,
      result: { gsbResult, vtResult, score: risk.score },
      risk_level: risk.level,
    });

    res.json({
      url,
      riskLevel: risk.level,
      score: risk.score,
      reason: fromCache ? `${risk.reason} (cached result)` : risk.reason,
      sources: risk.sources,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scan failed" });
  }
});

app.post("/api/scan/email", scanLimiter, requireAuth(), async (req, res) => {
  const { content } = req.body;
  const { userId } = getAuth(req);
  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Email content is required" });
  }
  if (content.length > 20000) {
    return res
      .status(400)
      .json({ error: "Email content too long (max 20,000 characters)" });
  }

  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const user = await getOrCreateUser(userId, email);

    const analysis = await analyzeEmail(content);

    await supabase.from("scan_history").insert({
      user_id: user.id,
      scan_type: "email",
      content: content,
      result: { matched: analysis.matched },
      risk_level: analysis.level,
    });

    res.json({ riskLevel: analysis.level, reason: analysis.reason });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

app.post(
  "/api/scan/pdf",
  scanLimiter,
  requireAuth(),
  upload.single("file"),
  async (req, res) => {
    const { userId } = getAuth(req);
    if (!req.file)
      return res.status(400).json({ error: "PDF file is required" });
    if (req.file.mimetype !== "application/pdf")
      return res.status(400).json({ error: "File must be a PDF" });

    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || "";
      const user = await getOrCreateUser(userId, email);

      const text = await extractPdfText(req.file.buffer);
      if (!text.trim()) {
        return res
          .status(400)
          .json({
            error:
              "Could not extract text from this PDF (it may be a scanned image)",
          });
      }

      const analysis = await analyzeEmail(text);

      await supabase.from("scan_history").insert({
        user_id: user.id,
        scan_type: "pdf",
        content: `[${req.file.originalname}]\n\n${text}`,
        result: { matched: analysis.matched, filename: req.file.originalname },
        risk_level: analysis.level,
      });

      res.json({
        riskLevel: analysis.level,
        reason: analysis.reason,
        filename: req.file.originalname,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "PDF scan failed" });
    }
  },
);

app.get("/api/dashboard/stats", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const user = await getOrCreateUser(userId, email);
  res.json(await getDashboardStats(user.id));
});

app.get("/api/dashboard/recent", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const user = await getOrCreateUser(userId, email);
  res.json(await getRecentScans(user.id));
});

app.get("/api/dashboard/chart", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const user = await getOrCreateUser(userId, email);
  res.json(await getDetectionsOverTime(user.id));
});

app.get("/api/reports", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const user = await getOrCreateUser(userId, email);
  const { riskLevel, scanType, days } = req.query;
  res.json(await getReport(user.id, { riskLevel, scanType, days }));
});

app.get(
  "/api/admin/keywords",
  requireAuth(),
  requireAdmin,
  async (req, res) => {
    res.json(await getKeywords());
  },
);

app.post(
  "/api/admin/keywords",
  requireAuth(),
  requireAdmin,
  async (req, res) => {
    const { phrase, weight } = req.body;
    if (!phrase || typeof phrase !== "string" || !phrase.trim()) {
      return res.status(400).json({ error: "Phrase is required" });
    }
    res.json(await addKeyword(phrase, weight || 1));
  },
);

app.delete(
  "/api/admin/keywords/:id",
  requireAuth(),
  requireAdmin,
  async (req, res) => {
    await deleteKeyword(req.params.id);
    res.json({ success: true });
  },
);

app.get("/api/admin/users", requireAuth(), requireAdmin, async (req, res) => {
  res.json(await getAllUsers());
});

app.get("/api/admin/logs", requireAuth(), requireAdmin, async (req, res) => {
  const { riskLevel, scanType, days, search } = req.query;
  res.json(await getAllScans({ riskLevel, scanType, days, search }));
});

app.get(
  "/api/admin/analytics",
  requireAuth(),
  requireAdmin,
  async (req, res) => {
    res.json(await getAdminAnalytics());
  },
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
