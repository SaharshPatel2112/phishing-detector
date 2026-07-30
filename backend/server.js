import "dotenv/config";
import express from "express";
import cors from "cors";
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
import { analyzeEmail } from "./services/emailAnalyzer.js";
import { getKeywords, addKeyword, deleteKeyword } from "./services/keywords.js";
import { requireAdmin } from "./middleware/requireAdmin.js";
import { getCachedUrlScan } from "./services/cache.js";
import { supabase } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.post("/api/scan/url", requireAuth(), async (req, res) => {
  const { url } = req.body;
  const { userId } = getAuth(req);
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const user = await getOrCreateUser(userId, email);

    let riskLevel, reason, resultPayload;
    const cached = await getCachedUrlScan(url);

    if (cached) {
      riskLevel = cached.risk_level;
      reason = "Result from cache (already scanned in the last 24 hours)";
      resultPayload = cached.result;
    } else {
      const [gsbResult, vtResult] = await Promise.all([
        checkSafeBrowsing(url),
        checkVirusTotal(url),
      ]);
      const risk = calculateRisk(gsbResult, vtResult);
      riskLevel = risk.level;
      reason = risk.reason;
      resultPayload = { gsbResult, vtResult };
    }

    await supabase.from("scan_history").insert({
      user_id: user.id,
      scan_type: "url",
      content: url,
      result: resultPayload,
      risk_level: riskLevel,
    });

    res.json({ url, riskLevel, reason });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scan failed" });
  }
});

app.post("/api/scan/email", requireAuth(), async (req, res) => {
  const { content } = req.body;
  const { userId } = getAuth(req);
  if (!content)
    return res.status(400).json({ error: "Email content is required" });

  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const user = await getOrCreateUser(userId, email);

    const analysis = await analyzeEmail(content);

    await supabase.from("scan_history").insert({
      user_id: user.id,
      scan_type: "email",
      content: content.slice(0, 500),
      result: { matched: analysis.matched },
      risk_level: analysis.level,
    });

    res.json({ riskLevel: analysis.level, reason: analysis.reason });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

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
    if (!phrase) return res.status(400).json({ error: "Phrase is required" });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
