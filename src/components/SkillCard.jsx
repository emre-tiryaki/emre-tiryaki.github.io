function SkillCard({ title, items, Icon }) {
    return (
        <article className="glass-card p-6">
            <div className="mb-4 flex justify-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/40 bg-sky-500/10 text-sky-300 light:border-sky-500/40 light:bg-sky-500/10 light:text-sky-700">
                    <Icon className="h-8 w-8" aria-hidden="true" />
                </span>
            </div>
            <h3 className="text-center font-['Space_Grotesk'] text-lg font-bold text-white light:text-slate-900">
                {title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400 light:text-slate-600">
                {items.map((item) => (
                    <li key={item.label} className="flex items-center gap-2">
                        <item.Icon
                            className="h-4 w-4 text-sky-300"
                            aria-hidden="true"
                        />
                        <span>{item.label}</span>
                    </li>
                ))}
            </ul>
        </article>
    );
}

export default SkillCard;
