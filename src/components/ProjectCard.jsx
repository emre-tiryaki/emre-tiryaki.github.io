function ProjectCard({ image, name, description, githubLink, siteLink }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f131d] transition-transform duration-300 ease-out hover:scale-[1.02] light:border-slate-300 light:bg-white">
            <div
                className="h-56 w-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: image }}
                aria-hidden="true"
            />
            <div className="p-6">
                <div className="mb-4 flex gap-2">
                    <span className="rounded-full bg-sky-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300 light:text-sky-700">
                        Project
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300 light:bg-slate-200 light:text-slate-700">
                        Preview
                    </span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white light:text-slate-950">
                    {name}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">
                    {description}
                </p>
                <div className="mt-5 flex flex-wrap gap-4">
                    <a
                        href={githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-sm font-semibold text-sky-400 transition hover:text-sky-300 light:text-sky-700"
                    >
                        GitHub →
                    </a>
                    {siteLink && (
                        <a
                            href={siteLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex text-sm font-semibold text-emerald-400 transition hover:text-emerald-300 light:text-emerald-700"
                        >
                            Live Site →
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

export default ProjectCard;
