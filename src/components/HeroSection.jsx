import { useEffect, useState } from "react";

const FALLBACK_QUOTES = [
    {
        text: "Basari, her gun tekrarlanan kucuk cabalarin toplamidir.",
    },
    {
        text: "Mukemmellik bir hedef degil, surekli bir gelisim yolculugudur.",
    },
    {
        text: "Yarinlar bugun yaptiklarimizla insa edilir.",
    },
    {
        text: "Vazgecmemek, yetenekten daha gucludur.",
    },
];

function HeroSection() {
    const photoModules = import.meta.glob("../assets/personal_photos/*.jpg", {
        eager: true,
        import: "default",
    });
    const photos = Object.entries(photoModules)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, src]) => src);

    const [activeIndex, setActiveIndex] = useState(0);
    const [quote, setQuote] = useState(null);
    const [isQuoteLoading, setIsQuoteLoading] = useState(true);
    const [quoteError, setQuoteError] = useState("");

    const total = photos.length;

    const fetchQuote = async () => {
        try {
            setIsQuoteLoading(true);
            setQuoteError("");

            const response = await fetch("https://dummyjson.com/quotes/random");
            if (!response.ok) {
                throw new Error("Quote API request failed");
            }

            const data = await response.json();
            setQuote({
                text: data.quote,
                author: data.author,
            });
        } catch {
            const fallbackIndex = Math.floor(
                Math.random() * FALLBACK_QUOTES.length,
            );
            setQuote(FALLBACK_QUOTES[fallbackIndex]);
            setQuoteError("");
        } finally {
            setIsQuoteLoading(false);
        }
    };

    useEffect(() => {
        fetchQuote();
    }, []);

    if (total === 0) {
        return (
            <section id="about" className="section-wrap py-24 md:py-32">
                <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
                    <div>
                        <p className="mb-6 inline-flex rounded-full border border-sky-500/50 bg-sky-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-sky-300 light:border-sky-600/50 light:bg-sky-600/10 light:text-sky-700">
                            Available For New Opportunities
                        </p>
                        <h1 className="max-w-3xl font-['Space_Grotesk'] text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl light:text-slate-950">
                            Emre Tiryaki
                        </h1>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-slate-900/30 p-6 text-sm text-slate-300 light:text-slate-700">
                        No photos found in assets/personal_photos.
                    </div>
                </div>
            </section>
        );
    }

    const leftIndex = (activeIndex - 1 + total) % total;
    const rightIndex = (activeIndex + 1) % total;

    const getSlot = (index) => {
        if (index === activeIndex) return "center";
        if (index === leftIndex) return "left";
        if (index === rightIndex) return "right";
        return "hidden";
    };

    const handlePrev = () => {
        if (total < 2) return;
        setActiveIndex((prev) => (prev - 1 + total) % total);
    };

    const handleNext = () => {
        if (total < 2) return;
        setActiveIndex((prev) => (prev + 1) % total);
    };

    return (
        <section id="about" className="section-wrap py-24 md:py-32">
            <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                    <p className="mb-6 inline-flex rounded-full border border-sky-500/50 bg-sky-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-sky-300 light:border-sky-600/50 light:bg-sky-600/10 light:text-sky-700">
                        Available For New Opportunities
                    </p>
                    <h1 className="max-w-3xl font-['Space_Grotesk'] text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl light:text-slate-950">
                        Emre Tiryaki
                    </h1>
                    <p className="mt-3 text-xl text-slate-200 md:text-2xl light:text-slate-700">
                        Fullstack Developer{" "}
                        <span className="px-2 text-sky-400">|</span> Data
                        Scientist <span className="px-2 text-sky-400">|</span>{" "}
                        ML Engineer
                    </p>
                    <div className="mt-8 max-w-2xl text-sm leading-7 text-slate-400 light:text-slate-600">
                        <p className="mt-2 text-sm leading-7 text-slate-300 light:text-slate-700">
                            {isQuoteLoading && "Ozlu soz yukleniyor..."}
                            {!isQuoteLoading && quoteError}
                            {!isQuoteLoading &&
                                !quoteError &&
                                quote &&
                                `"${quote.text}"`}
                        </p>
                    </div>
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <a
                            href="#projects"
                            className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-400"
                        >
                            View Projects
                        </a>
                        <a
                            href="#contact"
                            className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:border-white/40 light:border-slate-400 light:bg-white light:text-slate-900"
                        >
                            Contact Me
                        </a>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-md lg:max-w-none">
                    <div className="relative h-[370px] sm:h-[430px] lg:h-[500px]">
                        {photos.map((photo, index) => {
                            const slot = getSlot(index);

                            return (
                                <article
                                    key={photo}
                                    className={`absolute left-1/2 top-1/2 w-[60%] -translate-y-1/2 overflow-hidden rounded-2xl border border-white/20 bg-slate-900/30 shadow-2xl transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform ${
                                        slot === "left"
                                            ? "z-10 -translate-x-[95%] scale-[0.88] opacity-65 blur-[1px]"
                                            : slot === "center"
                                              ? "z-30 -translate-x-1/2 scale-100 opacity-100 blur-0"
                                              : slot === "right"
                                                ? "z-20 -translate-x-[5%] scale-[0.88] opacity-75 blur-[1px]"
                                                : "pointer-events-none z-0 -translate-x-1/2 scale-[0.75] opacity-0 blur-[2px]"
                                    }`}
                                >
                                    <img
                                        src={photo}
                                        alt="Emre portrait"
                                        className={`aspect-square w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                                            slot === "center"
                                                ? "scale-100"
                                                : "scale-105"
                                        }`}
                                    />
                                </article>
                            );
                        })}

                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={total < 2}
                            className="absolute left-0 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/20 bg-[#05070b]/80 px-3 py-2 text-lg font-bold text-slate-200 backdrop-blur transition hover:border-sky-400 hover:text-sky-300 light:border-slate-400 light:bg-white/90 light:text-slate-700"
                            aria-label="Previous photo"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={total < 2}
                            className="absolute right-0 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/20 bg-[#05070b]/80 px-3 py-2 text-lg font-bold text-slate-200 backdrop-blur transition hover:border-sky-400 hover:text-sky-300 light:border-slate-400 light:bg-white/90 light:text-slate-700"
                            aria-label="Next photo"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
