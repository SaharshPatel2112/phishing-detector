import { UserPlus, ScanLine, BrainCircuit, ShieldCheck } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create your account',
    description:
      'Sign up securely in seconds. Individual analysts and full security teams both get a personalized workspace.',
  },
  {
    icon: ScanLine,
    step: '02',
    title: 'Submit a URL or email',
    description:
      'Paste a link, forward an email or upload a message. PhishGuard AI immediately begins its analysis.',
  },
  {
    icon: BrainCircuit,
    step: '03',
    title: 'AI scores the risk',
    description:
      'Our models weigh dozens of signals — domain age, keywords, spoofing and reputation — into one clear score.',
  },
  {
    icon: ShieldCheck,
    step: '04',
    title: 'Act with confidence',
    description:
      'Get a verdict, save it to history, generate a report and keep your organization protected.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </span>
          <h2 className="mt-3 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            From suspicious link to safe decision
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <div className="relative h-full rounded-2xl border border-border bg-background p-6">
                <span className="font-heading text-sm font-bold text-primary">
                  {s.step}
                </span>
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
