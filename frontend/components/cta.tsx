import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:px-12">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Start protecting your inbox today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Join thousands of teams using PhishGuard AI to detect phishing before
              it causes damage. No credit card required.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get started free
              </Button>
              <Button size="lg" variant="outline" className="border-border bg-background">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
