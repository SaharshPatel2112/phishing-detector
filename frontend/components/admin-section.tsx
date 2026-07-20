import { Users, ScrollText, MonitorCheck, KeyRound, BarChart3, Lock } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const adminFeatures = [
  { icon: Users, title: 'User Management', description: 'Add, suspend and assign roles across your whole team.' },
  { icon: ScrollText, title: 'Detection Logs', description: 'Inspect every scan event with full audit-grade detail.' },
  { icon: MonitorCheck, title: 'Monitor Reports', description: 'Review and triage threat reports submitted by users.' },
  { icon: KeyRound, title: 'Suspicious Keywords', description: 'Curate the keyword rules that power detection scoring.' },
  { icon: BarChart3, title: 'View Analytics', description: 'Platform-wide trends, accuracy metrics and volume.' },
  { icon: Lock, title: 'Access Control', description: 'Enforce granular, role-based permissions everywhere.' },
]

export function AdminSection() {
  return (
    <section id="admin" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              For administrators
            </span>
            <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Full control over your security operations
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              A dedicated admin console gives security leads everything they need to
              manage people, tune detection and keep an eye on the entire platform —
              without leaving PhishGuard AI.
            </p>
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-border bg-background p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading font-semibold">Role-based access built in</p>
                <p className="text-sm text-muted-foreground">
                  Separate admin and analyst experiences out of the box.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {adminFeatures.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-background p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
