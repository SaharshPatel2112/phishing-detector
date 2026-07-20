'use client'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertTriangle, CheckCircle2, ShieldAlert, TrendingUp } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const data = [
  { day: 'Mon', threats: 42, scans: 320 },
  { day: 'Tue', threats: 58, scans: 410 },
  { day: 'Wed', threats: 35, scans: 380 },
  { day: 'Thu', threats: 74, scans: 520 },
  { day: 'Fri', threats: 61, scans: 480 },
  { day: 'Sat', threats: 28, scans: 210 },
  { day: 'Sun', threats: 46, scans: 300 },
]

const recentScans = [
  { target: 'secure-paypa1-login.com', type: 'URL', risk: 'High', score: 94 },
  { target: 'invoice-2044@acme-billing.co', type: 'Email', risk: 'High', score: 88 },
  { target: 'dropbox-share.file-view.net', type: 'URL', risk: 'Medium', score: 61 },
  { target: 'newsletter@vercel.com', type: 'Email', risk: 'Safe', score: 4 },
]

const riskStyles: Record<string, string> = {
  High: 'text-destructive bg-destructive/10 border-destructive/30',
  Medium: 'text-warning bg-warning/10 border-warning/30',
  Safe: 'text-success bg-success/10 border-success/30',
}

export default function Dashboard() {
  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Dashboard
        </span>
        <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Your threat activity, at a glance
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Real-time visibility into every scan, detection and report across your
          organization.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-14 rounded-2xl border border-border bg-card/50 p-4 shadow-2xl shadow-black/40 sm:p-6">
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { icon: TrendingUp, label: 'Scans this week', value: '2,620', tint: 'text-primary' },
              { icon: ShieldAlert, label: 'Threats blocked', value: '344', tint: 'text-destructive' },
              { icon: AlertTriangle, label: 'Pending review', value: '17', tint: 'text-warning' },
              { icon: CheckCircle2, label: 'Marked safe', value: '2,259', tint: 'text-success' },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-border bg-background p-4">
                <kpi.icon className={`h-5 w-5 ${kpi.tint}`} />
                <p className="mt-3 font-heading text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-5">
            {/* Chart */}
            <div className="rounded-xl border border-border bg-background p-4 lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-heading text-sm font-semibold">Detections over time</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" /> Scans
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-destructive" /> Threats
                  </span>
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                    <defs>
                      <linearGradient id="scans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="threats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-destructive)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--color-destructive)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-popover)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 12,
                        color: 'var(--color-popover-foreground)',
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      fill="url(#scans)"
                    />
                    <Area
                      type="monotone"
                      dataKey="threats"
                      stroke="var(--color-destructive)"
                      strokeWidth={2}
                      fill="url(#threats)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent scans */}
            <div className="rounded-xl border border-border bg-background p-4 lg:col-span-2">
              <p className="mb-4 font-heading text-sm font-semibold">Recent scans</p>
              <ul className="flex flex-col gap-3">
                {recentScans.map((scan) => (
                  <li key={scan.target} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-foreground">{scan.target}</p>
                      <p className="text-xs text-muted-foreground">{scan.type}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskStyles[scan.risk]}`}
                    >
                      {scan.risk} · {scan.score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
