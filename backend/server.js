import "dotenv/config";
import express from "express";
import cors from "cors";
import { checkSafeBrowsing } from "./services/safeBrowsing.js";
import { checkVirusTotal } from "./services/virusTotal.js";
import { calculateRisk } from "./services/riskScore.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/scan/url", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const [gsbResult, vtResult] = await Promise.all([
      checkSafeBrowsing(url),
      checkVirusTotal(url),
    ]);
    const risk = calculateRisk(gsbResult, vtResult);
    res.json({ url, riskLevel: risk.level, reason: risk.reason });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scan failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
