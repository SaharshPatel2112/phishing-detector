"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { KeyRound, Trash2, Users, FileText, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import { API_URL } from "../../lib/api";

type Keyword = { id: string; phrase: string; weight: number };
type AdminUser = {
  id: string;
  email: string;
  role: string;
  created_at: string;
  scanCount: number;
  highRiskCount: number;
};
type Scan = {
  id: string;
  content: string;
  scan_type: string;
  risk_level: string;
  created_at: string;
  users?: { email: string };
};
type Analytics = {
  totalUsers: number;
  totalScans: number;
  scansThisWeek: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  byType: { url: number; email: number; pdf: number };
};

const dotColor: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-success",
};

const TABS = ["Overview", "Users", "Detection Logs", "Keywords"] as const;
type Tab = (typeof TABS)[number];

export default function Admin() {
  const { getToken } = useAuth();
  const [tab, setTab] = useState<Tab>("Overview");
  const [error, setError] = useState("");

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<Scan[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [phrase, setPhrase] = useState("");

  const [logRisk, setLogRisk] = useState("all");
  const [logType, setLogType] = useState("all");
  const [logSearch, setLogSearch] = useState("");

  async function authedFetch(path: string) {
    const token = await getToken();
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 403) {
      setError("Admin access is restricted to the project owner's account.");
      throw new Error("forbidden");
    }
    return res.json();
  }

  async function loadOverview() {
    try {
      setAnalytics(await authedFetch("/api/admin/analytics"));
    } catch {}
  }
  async function loadUsers() {
    try {
      setUsers(await authedFetch("/api/admin/users"));
    } catch {}
  }
  async function loadLogs() {
    const params = new URLSearchParams({
      riskLevel: logRisk,
      scanType: logType,
      search: logSearch,
    });
    try {
      setLogs(await authedFetch(`/api/admin/logs?${params}`));
    } catch {}
  }
  async function loadKeywords() {
    try {
      setKeywords(await authedFetch("/api/admin/keywords"));
    } catch {}
  }

  useEffect(() => {
    loadOverview();
    loadUsers();
    loadLogs();
    loadKeywords();
  }, []);
  useEffect(() => {
    loadLogs();
  }, [logRisk, logType, logSearch]);

  async function handleAddKeyword() {
    if (!phrase) return;
    const token = await getToken();
    await fetch(`${API_URL}/api/admin/keywords`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phrase }),
    });
    setPhrase("");
    loadKeywords();
  }

  async function handleDeleteKeyword(id: string) {
    const token = await getToken();
    await fetch(`${API_URL}/api/admin/keywords/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadKeywords();
  }

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
        <div className="mx-auto max-w-6xl">
          <h1 className="mt-2 text-2xl font-bold">Admin dashboard</h1>

          {error ? (
            <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </p>
          ) : (
            <>
              <div className="mt-6 flex gap-2 border-b border-border">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      tab === t
                        ? "border-primary text-white"
                        : "border-transparent text-muted-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {tab === "Overview" && analytics && (
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="text-2xl font-bold">
                        {analytics.totalUsers}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total users
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="text-2xl font-bold">
                        {analytics.totalScans}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total scans
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="text-2xl font-bold text-primary">
                        {analytics.scansThisWeek}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Scans this week
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="text-2xl font-bold text-destructive">
                        {analytics.highRisk}
                      </p>
                      <p className="text-xs text-muted-foreground">High risk</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="mb-3 text-sm font-semibold">
                        Risk breakdown
                      </p>
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-destructive" />{" "}
                            High
                          </span>
                          <span>{analytics.highRisk}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-warning" />{" "}
                            Medium
                          </span>
                          <span>{analytics.mediumRisk}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-success" />{" "}
                            Low
                          </span>
                          <span>{analytics.lowRisk}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="mb-3 text-sm font-semibold">
                        Scans by type
                      </p>
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>URL</span>
                          <span>{analytics.byType.url}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Email</span>
                          <span>{analytics.byType.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>PDF</span>
                          <span>{analytics.byType.pdf}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === "Users" && (
                <div className="mt-6 rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={16} className="text-primary" />
                    {users.length} user{users.length !== 1 ? "s" : ""}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs text-muted-foreground">
                          <th className="py-2 pr-4">Email</th>
                          <th className="py-2 pr-4">Role</th>
                          <th className="py-2 pr-4">Total scans</th>
                          <th className="py-2 pr-4">High risk</th>
                          <th className="py-2 pr-4">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b border-border/50">
                            <td className="py-2 pr-4">{u.email}</td>
                            <td className="py-2 pr-4 capitalize">{u.role}</td>
                            <td className="py-2 pr-4">{u.scanCount}</td>
                            <td className="py-2 pr-4 text-destructive">
                              {u.highRiskCount}
                            </td>
                            <td className="py-2 pr-4 text-muted-foreground">
                              {new Date(u.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === "Detection Logs" && (
                <div className="mt-6">
                  <div className="mb-4 flex flex-wrap gap-3">
                    <div className="relative">
                      <Search
                        size={14}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <input
                        value={logSearch}
                        onChange={(e) => setLogSearch(e.target.value)}
                        placeholder="Search content..."
                        className="rounded-lg border border-border bg-card py-2 pl-8 pr-3 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <select
                      value={logRisk}
                      onChange={(e) => setLogRisk(e.target.value)}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    >
                      <option value="all">All risk levels</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <select
                      value={logType}
                      onChange={(e) => setLogType(e.target.value)}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    >
                      <option value="all">All types</option>
                      <option value="url">URL</option>
                      <option value="email">Email</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText size={16} className="text-primary" />
                      {logs.length} scan{logs.length !== 1 ? "s" : ""} across
                      all users
                    </div>
                    {logs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No scans match this filter.
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-1">
                        {logs.map((log) => (
                          <li
                            key={log.id}
                            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-background"
                          >
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor[log.risk_level]}`}
                            />
                            <p className="flex-1 truncate text-xs">
                              {log.content}
                            </p>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {log.users?.email || "unknown"}
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleDateString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {tab === "Keywords" && (
                <div className="mt-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={phrase}
                      onChange={(e) => setPhrase(e.target.value)}
                      placeholder="e.g. confirm your billing details"
                      className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                    />
                    <button
                      onClick={handleAddKeyword}
                      className="rounded-lg bg-primary px-6 py-3 font-medium text-white"
                    >
                      Add
                    </button>
                  </div>

                  <div className="mt-6 rounded-xl border border-border bg-card p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <KeyRound size={16} className="text-primary" />
                      {keywords.length} keyword
                      {keywords.length !== 1 ? "s" : ""}
                    </div>
                    <ul className="flex flex-col gap-2">
                      {keywords.map((k) => (
                        <li
                          key={k.id}
                          className="flex items-center justify-between rounded-lg bg-background px-4 py-2"
                        >
                          <span className="text-sm">{k.phrase}</span>
                          <button
                            onClick={() => handleDeleteKeyword(k.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
