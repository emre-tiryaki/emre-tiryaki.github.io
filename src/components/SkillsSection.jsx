function SkillsSection() {
  const skills = [
    ['Backend', 'Python (Django/FastAPI) Node.js / Express Go Lang API Development'],
    ['DevOps', 'Docker & K8s CI/CD Pipelines AWS / GCP Terraform'],
    ['Database', 'PostgreSQL MongoDB Redis / Caching Elasticsearch'],
    ['Linux', 'Shell Scripting Ubuntu/Debian Nginx/Apache Kernel Tuning'],
  ]

  return (
    <section id="skills" className="section-wrap py-20">
      <h2 className="text-center font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">Technical Arsenal</h2>
      <p className="mt-3 text-center text-sm text-slate-400 light:text-slate-600">Specialized toolsets for end-to-end engineering.</p>
      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {skills.map(([title, content]) => (
          <article key={title} className="glass-card p-6">
            <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 text-sm text-sky-300">o</div>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white light:text-slate-900">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400 light:text-slate-600">{content}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
