import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Link2, Mail, Gauge, History, KeyRound, FileText } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "URL Scanner",
    desc: "Paste any link and get an instant verdict — domains, redirects, HTTPS, look-alike patterns.",
  },
  {
    icon: Mail,
    title: "Email Analyzer",
    desc: "Paste email content to detect spoofed language and credential-harvesting attempts.",
  },
  {
    icon: Gauge,
    title: "Risk Detection",
    desc: "Every scan returns a risk level — low, medium, or high.",
  },
  {
    icon: History,
    title: "Scan History",
    desc: "Every scan is saved to your account so you can look back later.",
  },
  {
    icon: KeyRound,
    title: "Keyword Management",
    desc: "Admins tune the keyword list that powers email risk scoring.",
  },
  {
    icon: FileText,
    title: "Threat Reports",
    desc: "See your high-risk scans from the last 7 days at a glance.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section
        className="px-6 py-24"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% -10%, rgba(249,115,22,0.35), #09090b 70%)",
        }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="rounded-full border border-primary bg-primary/10 px-4 py-1 text-sm text-primary">
            Rule-based threat detection, in real time
          </span>
          <h1 className="text-5xl font-bold leading-tight">
            Stop phishing attacks{" "}
            <span className="text-primary">before they reach your inbox.</span>
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Scans suspicious URLs and emails, scores their risk, and gives you a
            clear view of every threat.
          </p>
          <div className="flex gap-4">
            <Link
              href="/scanner"
              className="rounded-full bg-primary px-6 py-3 font-medium text-white"
            >
              Start scanning free
            </Link>
            <a
              href="#features"
              className="rounded-full border border-border px-6 py-3 font-medium"
            >
              See features
            </a>
          </div>
        </div>
      </section>
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-sm font-semibold text-primary">PLATFORM</span>
          <h2 className="mt-2 text-3xl font-bold">
            Everything you need to catch phishing
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={20} />
              </div>
              <h3 className="mb-2 font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
