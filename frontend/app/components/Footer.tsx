import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-8 py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <ShieldCheck size={18} />
            </span>
            PhishGuard<span className="text-orange-500">AI</span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            Rule-based phishing detection for individuals and security teams.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>URL Scanner</li>
            <li>Email Analyzer</li>
            <li>Risk Detection</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>About</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Resources</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>Documentation</li>
            <li>Security</li>
            <li>Privacy</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-5xl border-t border-zinc-800 pt-6 text-sm text-zinc-500">
        © 2026 PhishGuard AI. All rights reserved.
      </div>
    </footer>
  );
}
