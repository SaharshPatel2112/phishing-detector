import { Reveal } from '@/components/reveal'

const stats = [
  { value: '12.4M+', label: 'URLs scanned' },
  { value: '99.2%', label: 'Detection accuracy' },
  { value: '<400ms', label: 'Average scan time' },
  { value: '4,800+', label: 'Teams protected' },
]

export function StatsBar() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 0.08}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <span className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {stat.value}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
