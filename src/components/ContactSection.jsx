function ContactSection() {
  return (
    <section id="contact" className="border-t border-white/10 bg-black/25 py-20 light:border-slate-300/70 light:bg-white/60">
      <div className="section-wrap">
        <div>
          <h2 className="font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">Education</h2>
          <article className="glass-card mt-8 max-w-2xl p-6">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white light:text-slate-900">Computer Science & Engineering</h3>
            <p className="mt-2 text-sm font-semibold text-sky-400">Undergraduate Program</p>
            <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">Focusing on distributed systems, machine learning, and advanced algorithms.</p>
          </article>
          <div className="mt-8 space-y-3 text-sm">
            <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white light:text-slate-950">Connect</h3>
            <p className="text-slate-300 light:text-slate-700">tiryakiemre18@gmail.com</p>
            <a
              className="block text-slate-300 transition hover:text-sky-400 light:text-slate-700"
              href="https://github.com/emre-tiryaki"
              target="_blank"
              rel="noreferrer"
            >
              https://github.com/emre-tiryaki
            </a>
            <a
              className="block text-slate-300 transition hover:text-sky-400 light:text-slate-700"
              href="https://www.linkedin.com/in/emre-tiryaki-7448b6290/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.linkedin.com/in/emre-tiryaki-7448b6290/
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
