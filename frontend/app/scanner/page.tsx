"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Search,
  ShieldCheck,
  Mail,
  FileText,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Navbar from "../components/Navbar";
import { API_URL } from "../../lib/api";

type Stats = {
  scansThisWeek: number;
  threatsBlocked: number;
  pendingReview: number;
  markedSafe: number;
};
type Scan = {
  content: string;
  scan_type: string;
  risk_level: string;
  created_at: string;
};
type ChartPoint = { day: string; scans: number; threats: number };
type UrlResult = {
  riskLevel: string;
  score: number;
  reason: string;
  sources?: {
    googleSafeBrowsing: string;
    virusTotal: string;
    heuristics: string;
  };
};
type SimpleResult = { riskLevel: string; reason: string };

const riskColor: Record<string, string> = {
  high: "text-destructive bg-destructive/10 border-destructive/30",
  medium: "text-warning bg-warning/10 border-warning/30",
  low: "text-success bg-success/10 border-success/30",
};

function scoreColor(score: number) {
  const hue = 120 - (score / 100) * 120;
  return `hsl(${hue}, 85%, 50%)`;
}

function ScanIcon({ type }: { type: string }) {
  if (type === "pdf")
    return <FileText size={16} className="shrink-0 text-primary" />;
  const src = type === "url" ? "/url.svg" : "/email.svg";
  return (
    <div
      className="h-4 w-4 shrink-0 bg-primary"
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export default function Scanner() {
  const { getToken } = useAuth();

  const [url, setUrl] = useState("");
  const [urlResult, setUrlResult] = useState<UrlResult | null>(null);
  const [urlError, setUrlError] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);

  const [emailContent, setEmailContent] = useState("");
  const [emailResult, setEmailResult] = useState<SimpleResult | null>(null);
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfResult, setPdfResult] = useState<SimpleResult | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [stats, setStats] = useState<Stats>({
    scansThisWeek: 0,
    threatsBlocked: 0,
    pendingReview: 0,
    markedSafe: 0,
  });
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  async function loadDashboard() {
    const token = await getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const statsRes = await fetch(`${API_URL}/api/dashboard/stats`, { headers });
    setStats(await statsRes.json());
    const recentRes = await fetch(`${API_URL}/api/dashboard/recent`, {
      headers,
    });
    setRecentScans(await recentRes.json());
    const chartRes = await fetch(`${API_URL}/api/dashboard/chart`, { headers });
    setChartData(await chartRes.json());
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleScanUrl() {
    setUrlLoading(true);
    setUrlResult(null);
    setUrlError("");
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/scan/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (res.ok) {
      setUrlResult(data);
    } else {
      setUrlError(data.error || "Scan failed");
    }
    setUrlLoading(false);
    loadDashboard();
  }

  async function handleAnalyzeEmail() {
    setEmailLoading(true);
    setEmailResult(null);
    setEmailError("");
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/scan/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: emailContent }),
    });
    const data = await res.json();
    if (res.ok) {
      setEmailResult(data);
    } else {
      setEmailError(data.error || "Analysis failed");
    }
    setEmailLoading(false);
    loadDashboard();
  }

  async function handleScanPdf() {
    if (!pdfFile) return;
    setPdfLoading(true);
    setPdfResult(null);
    const token = await getToken();
    const formData = new FormData();
    formData.append("file", pdfFile);
    const res = await fetch(`${API_URL}/api/scan/pdf`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    setPdfResult(res.ok ? data : { riskLevel: "low", reason: data.error });
    setPdfLoading(false);
    loadDashboard();
  }

  const statCards = [
    {
      icon: TrendingUp,
      label: "Scans this week",
      value: stats.scansThisWeek,
      tint: "text-primary",
    },
    {
      icon: ShieldAlert,
      label: "Threats blocked",
      value: stats.threatsBlocked,
      tint: "text-destructive",
    },
    {
      icon: AlertTriangle,
      label: "Pending review",
      value: stats.pendingReview,
      tint: "text-warning",
    },
    {
      icon: CheckCircle2,
      label: "Marked safe",
      value: stats.markedSafe,
      tint: "text-success",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section
        className="px-8 py-6"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% -10%, rgba(249,115,22,0.35), #09090b 70%)",
        }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck size={16} className="text-primary" />
                Live URL scanner
              </div>
              <div className="relative mb-3">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="http://secure-paypal-login.verify-account.com"
                  className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={handleScanUrl}
                disabled={urlLoading || !url}
                className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white disabled:opacity-50"
              >
                {urlLoading ? "Scanning..." : "Scan URL"}
              </button>
              {urlError && (
                <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {urlError}
                </div>
              )}
              {urlResult && (
                <div className="mt-4 rounded-lg border border-border bg-background p-3 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      Risk:{" "}
                      <span
                        className={
                          urlResult.riskLevel === "high"
                            ? "text-destructive"
                            : urlResult.riskLevel === "medium"
                              ? "text-warning"
                              : "text-success"
                        }
                      >
                        {urlResult.riskLevel.toUpperCase()}
                      </span>
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: scoreColor(urlResult.score) }}
                    >
                      {urlResult.score}
                      <span className="text-xs text-muted-foreground">
                        /100
                      </span>
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {urlResult.reason}
                  </p>
                  {urlResult.sources && (
                    <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2 text-xs text-muted-foreground">
                      <p>
                        Google Safe Browsing:{" "}
                        <span className="text-foreground">
                          {urlResult.sources.googleSafeBrowsing}
                        </span>
                      </p>
                      <p>
                        VirusTotal:{" "}
                        <span className="text-foreground">
                          {urlResult.sources.virusTotal}
                        </span>
                      </p>
                      <p>
                        Heuristics:{" "}
                        <span className="text-foreground">
                          {urlResult.sources.heuristics}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={16} className="text-primary" />
                Email content analyzer
              </div>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste the email content here..."
                rows={4}
                className="mb-3 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary"
              />
              <button
                onClick={handleAnalyzeEmail}
                disabled={emailLoading || !emailContent}
                className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white disabled:opacity-50"
              >
                {emailLoading ? "Analyzing..." : "Analyze Email"}
              </button>
              {emailError && (
                <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {emailError}
                </div>
              )}
              {emailResult && (
                <div className="mt-4 rounded-lg border border-border bg-background p-3 text-left">
                  <p className="text-sm font-semibold">
                    Risk:{" "}
                    <span
                      className={
                        emailResult.riskLevel === "high"
                          ? "text-destructive"
                          : emailResult.riskLevel === "medium"
                            ? "text-warning"
                            : "text-success"
                      }
                    >
                      {emailResult.riskLevel.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {emailResult.reason}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <FileText size={16} className="text-primary" />
                PDF content scanner
              </div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="mb-3 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
              />
              <button
                onClick={handleScanPdf}
                disabled={pdfLoading || !pdfFile}
                className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white disabled:opacity-50"
              >
                {pdfLoading ? "Scanning..." : "Scan PDF"}
              </button>
              {pdfResult && (
                <div className="mt-4 rounded-lg border border-border bg-background p-3 text-left">
                  <p className="text-sm font-semibold">
                    Risk:{" "}
                    <span
                      className={
                        pdfResult.riskLevel === "high"
                          ? "text-destructive"
                          : pdfResult.riskLevel === "medium"
                            ? "text-warning"
                            : "text-success"
                      }
                    >
                      {pdfResult.riskLevel.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {pdfResult.reason}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 p-4 sm:p-6 lg:col-span-3">
            <span className="text-sm font-semibold text-primary">
              DASHBOARD
            </span>

            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {statCards.map(({ icon: Icon, label, value, tint }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <Icon className={`h-5 w-5 ${tint}`} />
                  <p className="mt-3 text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="mb-4 text-sm font-semibold">Detections over time</p>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 4, right: 4, bottom: 0, left: -24 }}
                  >
                    <defs>
                      <linearGradient id="scans" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#f97316"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="100%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="threats" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#ef4444"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="100%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid horizontal vertical stroke="#27272a" />
                    <XAxis
                      dataKey="day"
                      stroke="#a1a1aa"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#a1a1aa"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: 12,
                        color: "#fafafa",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      stroke="#f97316"
                      strokeWidth={2}
                      fill="url(#scans)"
                    />
                    <Area
                      type="monotone"
                      dataKey="threats"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="url(#threats)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="mb-4 text-sm font-semibold">Recent scans</p>
              {recentScans.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No scans saved yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {recentScans.map((scan, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <ScanIcon type={scan.scan_type} />
                      <p className="flex-1 truncate text-xs">{scan.content}</p>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskColor[scan.risk_level]}`}
                      >
                        {scan.risk_level}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
