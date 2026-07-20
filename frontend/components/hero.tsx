'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type ScanState = 'idle' | 'scanning' | 'danger' | 'safe'

export function Hero() {
  const [value, setValue] = useState('http://secure-paypa1-login.verify-account.com')
  const [state, setState] = useState<ScanState>('idle')

  function runScan() {
    if (!value.trim()) return
    setState('scanning')
    const suspicious = /paypa1|verify|login|free|-account|bit\.ly|xn--/i.test(value)
    window.setTimeout(() => {
      setState(suspicious ? 'danger' : 'safe')
    }, 1600)
  }

  return (
    <section id="top" className="relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 lg:px-8 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          AI-powered threat detection in real time
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 max-w-4xl text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Stop phishing attacks{' '}
          <span className="text-primary">before they reach your inbox.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          PhishGuard AI scans suspicious URLs and emails, scores their risk with
          machine learning, and gives your team a live view of every threat — all
          from one dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start scanning free
          </Button>
          <Button size="lg" variant="outline" className="border-border bg-card/40">
            Book a demo
          </Button>
        </motion.div>

        {/* Live URL scanner card */}
        {/* <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 w-full max-w-2xl rounded-2xl border border-border bg-card/70 p-4 text-left shadow-2xl shadow-black/40 backdrop-blur sm:p-6"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Live URL scanner
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  setState('idle')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) runScan()
                }}
                placeholder="Paste a URL to analyze…"
                aria-label="URL to scan"
                className="h-11 w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button
              onClick={runScan}
              disabled={state === 'scanning'}
              className="h-11 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {state === 'scanning' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Scanning
                </>
              ) : (
                'Scan URL'
              )}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {state === 'danger' && (
              <motion.div
                key="danger"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      High risk — 94% phishing probability
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Look-alike domain, deceptive keywords (&quot;verify&quot;,
                      &quot;login&quot;) and a spoofed brand name detected. Do not
                      enter credentials.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            {state === 'safe' && (
              <motion.div
                key="safe"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="flex items-start gap-3 rounded-xl border border-success/40 bg-success/10 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Looks safe — 3% phishing probability
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No deceptive patterns found. Domain reputation and SSL
                      certificate check out.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div> */}
      </div>
    </section>
  )
}
