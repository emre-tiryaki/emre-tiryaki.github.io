import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/translation';

// Bu oturumda typewriter efekti daha önce oynatıldı mı?
// sessionStorage sayfa yenilenince TEMİZLENİR (efekt tekrar oynar),
// SPA navigasyonunda (about -> home) KALIR (efekt oynamaz, son metin gösterilir).
const SESSION_KEY = 'typewriterPlayed';

export default function TypewriterText() {
  const { t } = useTranslation();
  const greeting = t('home.greeting');
  const name = 'Emre Tiryaki';
  const role = t('home.role');

  const fullLine1 = `${greeting} ${name}`;

  // Efekt bu oturumda zaten oynadıysa baştan "done" (son metin direkt)
  const alreadyPlayed = typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1';
  const [displayed1, setDisplayed1] = useState(alreadyPlayed ? fullLine1 : '');
  const [displayed2, setDisplayed2] = useState(alreadyPlayed ? role : '');
  const [phase, setPhase] = useState(alreadyPlayed ? 'done' : 'line1');
  const playedRef = useRef(alreadyPlayed);

  useEffect(() => {
    if (playedRef.current) return; // efekt bu oturumda zaten oynadı

    if (phase === 'line1') {
      if (displayed1.length < fullLine1.length) {
        const timer = setTimeout(() => {
          setDisplayed1(fullLine1.slice(0, displayed1.length + 1));
        }, 35);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setPhase('line2'), 180);
        return () => clearTimeout(timer);
      }
    }

    if (phase === 'line2') {
      if (displayed2.length < role.length) {
        const timer = setTimeout(() => {
          setDisplayed2(role.slice(0, displayed2.length + 1));
        }, 40);
        return () => clearTimeout(timer);
      } else {
        // Efekt bitti -> bu oturumda oynatıldı olarak işaretle
        sessionStorage.setItem(SESSION_KEY, '1');
        playedRef.current = true;
        queueMicrotask(() => setPhase('done'));
      }
    }
  }, [phase, displayed1, displayed2, fullLine1, role]);

  return (
    <div className="space-y-4">
      {/* Small Eyebrow Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-orange-400">
        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
        <span>Backend Developer & Software Engineer</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
        {displayed1}
        {phase === 'line1' && (
          <span className="inline-block w-1.5 h-10 ml-1 bg-orange-500 align-middle animate-pulse" />
        )}
      </h1>

      {/* Role Subheading */}
      <div className="min-h-[3rem]">
        {(phase === 'line2' || phase === 'done') && (
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
            {displayed2}
            {phase !== 'done' && (
              <span className="inline-block w-1.5 h-8 ml-1 bg-orange-400 align-middle" />
            )}
            {phase === 'done' && (
              <span className="inline-block w-1.5 h-8 ml-1 bg-orange-400 align-middle opacity-80 animate-pulse" />
            )}
          </p>
        )}
      </div>
    </div>
  );
}
