import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/95 text-white/60">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="col-span-4 flex flex-col items-center text-center">
            <span className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">Nexus</span> Golf
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/40">
              Play your game. Win big. Donate to causes that matter.
            </p>
          </div>
        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8 text-xs">
          <p>© {new Date().getFullYear()} Nexus Golf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
