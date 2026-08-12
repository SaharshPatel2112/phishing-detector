import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ShieldCheck,
  Link2,
  Mail,
  FileText,
  BarChart3,
  Lock,
  KeyRound,
  Gauge,
  ExternalLink,
} from "lucide-react";

const stack = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "Supabase",
  "Clerk",
  "Google Safe Browsing API",
  "VirusTotal API",
];

const features = [
  {
    icon: Link2,
    title: "URL Scanner",
    body: "Paste a URL and click Scan URL. It gets checked against Google Safe Browsing, VirusTotal, and local heuristics (HTTPS, IP-based domains, shorteners, suspicious keywords). Returns a risk level and a 0-100 score.",
  },
  {
    icon: Mail,
    title: "Email Analyzer",
    body: "Paste email content and click Analyze Email. The text is matched against a phishing-phrase list (managed in Admin -> Keywords) — more matches, higher risk.",
  },
  {
    icon: FileText,
    title: "PDF Analyzer",
    body: "Upload a PDF and click Scan PDF. Text is extracted and scored the same way as the email analyzer. Scanned image PDFs with no extractable text return an error.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    body: "Your full scan history, filterable by date, risk level, and type. Click any row for the full detection breakdown.",
  },
];

const security = [
  {
    icon: KeyRound,
    title: "Authentication",
    body: "Handled entirely by Clerk. Passwords are never stored in this app's own database.",
  },
  {
    icon: Lock,
    title: "Admin access",
    body: "Restricted to one specific account, checked directly against your signed-in email on every request — not a database flag that could go stale.",
  },
  {
    icon: Gauge,
    title: "Rate limiting",
    body: "Scan endpoints are rate-limited per client to prevent abuse and protect the free-tier quota on the underlying threat-intel APIs.",
  },
  {
    icon: ShieldCheck,
    title: "Transport & headers",
    body: "Standard security headers (via Helmet), and cross-origin requests are restricted to this site's own domain.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section
        className="px-8 py-16"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% -10%, rgba(249,115,22,0.35), #09090b 70%)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <h1 className="mt-2 text-3xl font-bold">About PhishGuard AI</h1>
          <p className="mt-4 text-muted-foreground">
            PhishGuard AI checks URLs, email content, and PDF attachments for
            signs of phishing. It is a rule-based system combining two
            threat-intelligence APIs with local heuristics and a keyword scoring
            engine — not a trained machine learning model. Built independently
            as a hands-on project in full-stack development and third-party API
            integration.
          </p>

          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <ShieldCheck size={18} className="text-primary" /> Built with
            </h3>
            <div className="flex flex-wrap gap-2">
              {stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="px-8 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold">How to use it</h2>
          <div className="mt-6 flex flex-col gap-4">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <Icon size={18} className="text-primary" /> {title}
                </div>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="px-8 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold">Security</h2>
          <div className="mt-6 flex flex-col gap-4">
            {security.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <Icon size={18} className="text-primary" /> {title}
                </div>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="privacy" className="px-8 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold">Privacy</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This is an independent, non-commercial project. Here is what it
            stores and why.
          </p>
          <div className="mt-6 flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold">What is stored</h3>
              <p className="text-sm text-muted-foreground">
                Your email address and account details (managed by Clerk), plus
                every scan you run — the URL, pasted email text, or extracted
                PDF text, with its risk result. This powers your dashboard and
                report history.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold">What is shared externally</h3>
              <p className="text-sm text-muted-foreground">
                Scanned URLs are sent to Google Safe Browsing and VirusTotal to
                check reputation. No email or PDF content is ever sent to a
                third party — that analysis runs locally on the server.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold">What this is not</h3>
              <p className="text-sm text-muted-foreground">
                Data is never sold or shared for advertising. No analytics or
                tracking beyond what is needed for the app to function.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-2 font-semibold">A practical note</h3>
              <p className="text-sm text-muted-foreground">
                Do not paste real passwords, OTPs, or other sensitive personal
                data into the email or PDF scanners — only content you are
                checking for phishing signs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-8 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold">Get in touch</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Questions, feedback, or bug reports — reach out through either of
            these.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <a
              href="mailto:your-email@example.com"
              className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary"
            >
              <Mail size={20} className="text-primary" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-muted-foreground">
                  1patelsaharsh2112@gmail.com
                </p>
              </div>
            </a>
            <a
              href="https://github.com/SaharshPatel2112/phishing-detector"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary"
            >
              <ExternalLink size={20} className="text-primary" />
              <div>
                <p className="font-semibold">GitHub</p>
                <p className="text-sm text-muted-foreground">
                  View the source code
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
