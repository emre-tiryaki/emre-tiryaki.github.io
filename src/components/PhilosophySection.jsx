function PhilosophySection() {
  const stats = [
    ['99%', 'Uptime Focus'],
    ['Clean', 'Code Standards'],
    ['SOLID', 'Arch Patterns'],
    ['Fast', 'ML Pipelines'],
  ]

  return (
    <section className="border-y border-white/10 bg-black/25 py-20 light:border-slate-300/70 light:bg-white/60">
      <div className="section-wrap grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-sky-400">Philosophy</p>
          <h2 className="max-w-xl font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">Clean Code & Scalable Architecture</h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400 light:text-slate-600">I believe software is as much about people as it is about machines. Writing clean, maintainable code is not just a preference, it is a requirement for long-term project health.</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 light:text-slate-600">My approach integrates rigorous SOLID principles with modern DevOps practices, ensuring that from development to production, every line of code is optimized for performance and reliability.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map(([title, subtitle]) => (
            <article key={title} className="glass-card p-6">
              <h3 className="font-['Space_Grotesk'] text-3xl font-bold text-sky-400">{title}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 light:text-slate-500">{subtitle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PhilosophySection
