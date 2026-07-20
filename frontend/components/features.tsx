import {
  Link2,
  Mail,
  Gauge,
  History,
  LayoutDashboard,
  FileWarning,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'

const features = [
  {
    icon: Link2,
    title: 'URL Scanner',
    description:
      'Paste any link and get an instant AI verdict. We inspect domains, redirects, SSL and look-alike patterns in milliseconds.',
  },
  {
    icon: Mail,
    title: 'Email Analyzer',
    description:
      'Forward or upload emails to detect spoofed senders, malicious attachments and social-engineering language.',
  },
  {
    icon: Gauge,
    title: 'Risk Detection',
    description:
      'Every scan returns a calibrated risk score from 0–100 so your team knows exactly what to act on first.',
  },
  {
    icon: History,
    title: 'Scan History',
    description:
      'A searchable, exportable log of every URL and email you have analyzed, with verdicts and timestamps.',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description:
      'Track threats over time, monitor scan volume and see live detection trends across your whole organization.',
  },
  {
    icon: FileWarning,
    title: 'Threat Reports',
    description:
      'Generate detailed, shareable reports on incidents and download them for audits and compliance.',
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Platform
        </span>
        <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to catch phishing
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          A complete toolkit for individuals and security teams — from a single
          suspicious link to organization-wide threat monitoring.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Reveal key={feature.title} delay={(i % 3) * 0.08}>
            <div className="group h-full rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/40 hover:bg-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
