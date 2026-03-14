function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-8 light:border-slate-300/70">
      <div className="section-wrap text-center">
        <p className="font-['Space_Grotesk'] text-lg font-bold">ET.</p>
        <p className="mt-2 text-sm text-slate-400 light:text-slate-600">© 2026 Emre Tiryaki. Built with precision and passion.</p>
        <div className="mt-4 flex justify-center gap-6 text-xs uppercase tracking-[0.16em] text-slate-400 light:text-slate-500">
          <a href="#" className="transition hover:text-sky-400">Twitter</a>
          <a href="#" className="transition hover:text-sky-400">LinkedIn</a>
          <a href="#" className="transition hover:text-sky-400">Instagram</a>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
