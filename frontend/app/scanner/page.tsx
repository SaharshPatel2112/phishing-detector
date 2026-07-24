"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Search,
  ShieldCheck,
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

const chartData = [
  { day: "Mon", threats: 0, scans: 0 },
  { day: "Tue", threats: 0, scans: 0 },
  { day: "Wed", threats: 0, scans: 0 },
  { day: "Thu", threats: 0, scans: 0 },
  { day: "Fri", threats: 0, scans: 0 },
  { day: "Sat", threats: 0, scans: 0 },
  { day: "Sun", threats: 0, scans: 0 },
];

const riskColor: Record<string, string> = {
  high: "text-destructive bg-destructive/10 border-destructive/30",
  medium: "text-warning bg-warning/10 border-warning/30",
  low: "text-success bg-success/10 border-success/30",
};

export default function Scanner() {
  const { getToken } = useAuth();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{
    riskLevel: string;
    reason: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    scansThisWeek: 0,
    threatsBlocked: 0,
    pendingReview: 0,
    markedSafe: 0,
  });
  const [recentScans, setRecentScans] = useState<Scan[]>([]);

  async function loadDashboard() {
    const token = await getToken();
    const headers = { Authorization: `Bearer ${token}` };

    const statsRes = await fetch("http://localhost:5000/api/dashboard/stats", {
      headers,
    });
    setStats(await statsRes.json());

    const recentRes = await fetch(
      "http://localhost:5000/api/dashboard/recent",
      { headers },
    );
    setRecentScans(await recentRes.json());
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleScan() {
    setLoading(true);
    setResult(null);
    const token = await getToken();
    const res = await fetch("http://localhost:5000/api/scan/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
    loadDashboard(); // refresh stats after a new scan
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
        className="px-6 py-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% -10%, rgba(249,115,22,0.35), #09090b 70%)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck size={16} className="text-primary" />
              Live URL scanner
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
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
                onClick={handleScan}
                disabled={loading || !url}
                className="rounded-lg bg-primary px-6 py-3 font-medium text-white disabled:opacity-50"
              >
                {loading ? "Scanning..." : "Scan URL"}
              </button>
            </div>
          </div>

          {result && (
            <div className="mt-6 rounded-lg border border-border bg-card p-4 text-left">
              <p className="font-semibold">
                Risk Level:{" "}
                <span
                  className={
                    result.riskLevel === "high"
                      ? "text-destructive"
                      : result.riskLevel === "medium"
                        ? "text-warning"
                        : "text-success"
                  }
                >
                  {result.riskLevel.toUpperCase()}
                </span>
              </p>
              <p className="mt-1 text-muted-foreground">{result.reason}</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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

          <div className="mt-4 grid gap-4 lg:grid-cols-5">
            <div className="rounded-xl border border-border bg-background p-4 lg:col-span-3">
              <p className="mb-4 text-sm font-semibold">Detections over time</p>
              <div className="h-56 w-full">
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

            <div className="rounded-xl border border-border bg-background p-4 lg:col-span-2">
              <p className="mb-4 text-sm font-semibold">Recent scans</p>
              {recentScans.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No scans saved yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {recentScans.map((scan, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3"
                    >
                      <p className="truncate text-xs">{scan.content}</p>
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
