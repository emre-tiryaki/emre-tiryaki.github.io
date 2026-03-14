function ProjectsSection() {
  const projects = [
    [
      'Project-Toolkit',
      'A comprehensive suite of CI tools and libraries designed to automate the initial setup of microservices architectures, including Docker configuration and CI/CD templates.',
      'Source Code',
    ],
    [
      'Typing Game',
      'A high-performance web-based typing tutor featuring real-time WPM calculation, accuracy tracking, and a global leaderboard backend with Redis caching.',
      'Live Demo',
    ],
  ]

  return (
    <section id="projects" className="border-y border-white/10 bg-black/25 py-20 light:border-slate-300/70 light:bg-white/60">
      <div className="section-wrap">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">Featured Work</h2>
            <p className="mt-3 text-sm text-slate-400 light:text-slate-600">Selected projects demonstrating architecture and logic.</p>
          </div>
          <a href="#" className="text-sm font-semibold text-sky-400 transition hover:text-sky-300 light:text-sky-700">View All Github →</a>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {projects.map(([title, description, cta], index) => (
            <article key={title} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f131d] light:border-slate-300 light:bg-white">
              <div className={`h-56 w-full ${index === 0 ? 'bg-[linear-gradient(130deg,#112f45,#1a4968,#183753)]' : 'bg-[linear-gradient(130deg,#b0f3ef,#8dd3d7,#9de0f1)]'}`} />
              <div className="p-6">
                <div className="mb-4 flex gap-2">
                  <span className="rounded-full bg-sky-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300 light:text-sky-700">Project</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300 light:bg-slate-200 light:text-slate-700">Preview</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white light:text-slate-950">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">{description}</p>
                <a href="#" className="mt-5 inline-flex text-sm font-semibold text-sky-400 transition hover:text-sky-300 light:text-sky-700">{cta} →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
