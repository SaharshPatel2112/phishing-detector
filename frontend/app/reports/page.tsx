"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { FileText, X, ShieldCheck, Clock } from "lucide-react";
import Navbar from "../components/Navbar";

type Scan = {
    id: string;
    content: string;
    scan_type: string;
    risk_level: string;
    created_at: string;
    result: {
        gsbResult?: { flagged: boolean };
        vtResult?: {
            found: boolean;
            malicious: number;
            suspicious: number;
            harmless: number;
        };
        matched?: string[];
    };
};
type Report = {
    scans: Scan[];
    summary: { total: number; high: number; medium: number; low: number };
};

const dotColor: Record<string, string> = {
    high: "bg-destructive",
    medium: "bg-warning",
    low: "bg-success",
};

function ScanIcon({ type }: { type: string }) {
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

function ScanDetailModal({
    scan,
    onClose,
}: {
    scan: Scan;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
        >
            <div
                className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-card p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <ScanIcon type={scan.scan_type} />
                        <span className="text-sm font-semibold text-primary uppercase">
                            {scan.scan_type} scan
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto">
                    <p className="whitespace-pre-wrap break-words text-sm">
                        {scan.content}
                    </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={14} />
                    {new Date(scan.created_at).toLocaleString()}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${dotColor[scan.risk_level]}`}
                    />
                    <span className="text-sm font-semibold capitalize">
                        {scan.risk_level} risk
                    </span>
                </div>

                {scan.scan_type === "url" && scan.result && (
                    <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4 text-xs text-muted-foreground">
                        <p className="mb-1 flex items-center gap-1.5 text-foreground">
                            <ShieldCheck size={14} className="text-primary" /> Detection
                            breakdown
                        </p>
                        <p>
                            Google Safe Browsing:{" "}
                            <span className="text-foreground">
                                {scan.result.gsbResult?.flagged ? "flagged" : "clean"}
                            </span>
                        </p>
                        <p>
                            VirusTotal:{" "}
                            <span className="text-foreground">
                                {scan.result.vtResult?.found
                                    ? `${scan.result.vtResult.malicious} malicious, ${scan.result.vtResult.suspicious} suspicious, ${scan.result.vtResult.harmless} harmless`
                                    : "not previously scanned"}
                            </span>
                        </p>
                    </div>
                )}

                {scan.scan_type === "email" && scan.result?.matched && (
                    <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                        <p className="mb-1 text-foreground">Matched phrases</p>
                        <p>
                            {scan.result.matched.length > 0
                                ? scan.result.matched.join(", ")
                                : "None"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Reports() {
    const { getToken } = useAuth();
    const [report, setReport] = useState<Report>({
        scans: [],
        summary: { total: 0, high: 0, medium: 0, low: 0 },
    });
    const [riskLevel, setRiskLevel] = useState("all");
    const [scanType, setScanType] = useState("all");
    const [days, setDays] = useState("7");
    const [selectedScan, setSelectedScan] = useState<Scan | null>(null);

    async function loadReport() {
        const token = await getToken();
        const params = new URLSearchParams({ riskLevel, scanType, days });
        const res = await fetch(`http://localhost:5000/api/reports?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setReport(await res.json());
    }

    useEffect(() => {
        loadReport();
    }, [riskLevel, scanType, days]);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <section
                className="px-8 py-16"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 60% at 50% -10%, rgba(249,115,22,0.35), #09090b 70%)",
                }}
            >
                <div className="mx-auto max-w-4xl">
                    <span className="text-sm font-semibold text-primary">REPORTS</span>
                    <h1 className="mt-2 text-2xl font-bold">Your threat report</h1>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <select
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="rounded-lg border border-border bg-card px-4 py-2 text-sm"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="3650">All time</option>
                        </select>
                        <select
                            value={riskLevel}
                            onChange={(e) => setRiskLevel(e.target.value)}
                            className="rounded-lg border border-border bg-card px-4 py-2 text-sm"
                        >
                            <option value="all">All risk levels</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <select
                            value={scanType}
                            onChange={(e) => setScanType(e.target.value)}
                            className="rounded-lg border border-border bg-card px-4 py-2 text-sm"
                        >
                            <option value="all">URL + Email</option>
                            <option value="url">URL only</option>
                            <option value="email">Email only</option>
                        </select>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-2xl font-bold">{report.summary.total}</p>
                            <p className="text-xs text-muted-foreground">Total scans</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-2xl font-bold text-destructive">
                                {report.summary.high}
                            </p>
                            <p className="text-xs text-muted-foreground">High risk</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-2xl font-bold text-warning">
                                {report.summary.medium}
                            </p>
                            <p className="text-xs text-muted-foreground">Medium risk</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4">
                            <p className="text-2xl font-bold text-success">
                                {report.summary.low}
                            </p>
                            <p className="text-xs text-muted-foreground">Low risk</p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-border bg-card p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText size={16} className="text-primary" />
                            {report.scans.length} scan{report.scans.length !== 1 ? "s" : ""}
                        </div>
                        {report.scans.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No scans match this filter.
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-1">
                                {report.scans.map((scan) => (
                                    <li
                                        key={scan.id}
                                        onClick={() => setSelectedScan(scan)}
                                        className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-background"
                                    >
                                        <ScanIcon type={scan.scan_type} />
                                        <p className="flex-1 truncate text-xs">{scan.content}</p>
                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            {new Date(scan.created_at).toLocaleDateString()}
                                        </span>
                                        <span
                                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor[scan.risk_level]}`}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            {selectedScan && (
                <ScanDetailModal
                    scan={selectedScan}
                    onClose={() => setSelectedScan(null)}
                />
            )}
        </main>
    );
}