import { Hero } from '@/components/hero'
import { StatsBar } from '@/components/stats-bar'
import { Features } from '@/components/features'
import { AdminSection } from '@/components/admin-section'
import { CTA } from '@/components/cta'
import { SiteFooter } from '@/components/site-footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <StatsBar />
        <Features />
        <AdminSection />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  )
}
