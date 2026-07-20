import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { StatsBar } from '@/components/stats-bar'
import { Features } from '@/components/features'
import { HowItWorks } from '@/components/how-it-works'
import { DashboardPreview } from '@/components/dashboard-preview'
import { AdminSection } from '@/components/admin-section'
import { CTA } from '@/components/cta'
import { SiteFooter } from '@/components/site-footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <StatsBar />
        <Features />
        <HowItWorks />
        <DashboardPreview />
        <AdminSection />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  )
}
