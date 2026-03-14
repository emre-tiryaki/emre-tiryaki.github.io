function ExperienceSection() {
  return (
    <section id="experience" className="section-wrap py-20">
      <h2 className="text-center font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">Experience</h2>
      <div className="relative mx-auto mt-12 max-w-2xl border-l border-sky-500/40 pl-8 before:absolute before:-left-[5px] before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-sky-500 md:border-none md:pl-0">
        <div className="grid gap-8">
          <article className="glass-card p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-400">2025</p>
            <h3 className="mt-2 font-['Space_Grotesk'] text-xl font-bold text-white light:text-slate-950">Anadolu Ajansi Hackathon</h3>
            <p className="mt-1 text-sm font-medium text-slate-300 light:text-slate-700">Participant / Competitor</p>
            <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">Collaborated in a high-intensity environment to develop a gamified new page.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection
