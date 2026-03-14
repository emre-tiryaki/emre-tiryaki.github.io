const MINDSET_COPY = {
    en: {
        badge: "Mindset",
        title: "Clean Code & Scalability Is My Passion",
        paragraph1:
            "I really enjoy building the backend side of things, where the core of the system lives. Seeing data move from raw input to meaningful Data Science output is one of the parts I love most.",
        paragraph2:
            "What motivates me every day is taking complex problems, breaking them into manageable pieces, and putting everything back together in a clean and efficient way.",
    },
    tr: {
        badge: "Yaklasim",
        title: "Temiz Kod ve Olceklenebilirlik Benim Tutkum",
        paragraph1:
            "Sistemin kalbinin attigi backend tarafini gelistirmekten buyuk keyif aliyorum. Verinin ham girdiden anlamli Data Science ciktilarina donusmesini gormek en sevdigim kisimlardan biri.",
        paragraph2:
            "Beni her gun motive eden sey, karmasik problemleri yonetilebilir parcalara ayirmak ve tum yapbozu temiz, verimli bir sekilde yeniden birlestirmek.",
    },
    es: {
        badge: "Enfoque",
        title: "El Codigo Limpio y la Escalabilidad Son Mi Pasion",
        paragraph1:
            "Disfruto mucho construir el lado backend, donde vive el nucleo del sistema. Ver como los datos pasan de entrada bruta a resultados de Data Science significativos es una de las partes que mas me gustan.",
        paragraph2:
            "Lo que me motiva cada dia es tomar problemas complejos, dividirlos en partes manejables y unir todo nuevamente de forma limpia y eficiente.",
    },
};

function MindsetSection({ language = "en" }) {
    const copy = MINDSET_COPY[language] ?? MINDSET_COPY.en;

    return (
        <section className="border-y border-white/10 bg-black/25 py-20 light:border-slate-300/70 light:bg-white/60">
            <div className="section-wrap">
                <div className="text-center">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-sky-400">
                        {copy.badge}
                    </p>
                    <h2 className="mx-auto max-w-2xl font-['Space_Grotesk'] text-4xl font-bold text-white light:text-slate-950">
                        {copy.title}
                    </h2>
                    <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-400 light:text-slate-600">
                        {copy.paragraph1}
                    </p>
                    <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-400 light:text-slate-600">
                        {copy.paragraph2}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default MindsetSection;
