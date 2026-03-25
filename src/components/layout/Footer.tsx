import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/95 text-white/60">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <span className="text-lg font-bold text-white">
              <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">Nexus</span> Golf
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Play your game. Win big. Donate to causes that matter. The ultimate subscription platform for golfers who care.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/charity" className="hover:text-white transition-colors">Our Charities</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8 text-xs">
          <p>© {new Date().getFullYear()} Nexus Golf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
