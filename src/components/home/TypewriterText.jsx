import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/translation';

// Modül-seviye flag: sayfa yenilenince modül yeniden yüklenir → false olur.
// SPA navigasyonunda modül bellekte kalır → true kalır, efekt tekrar oynamaz.
let hasPlayedThisSession = false;

export default function TypewriterText() {
  const { t } = useTranslation();
  const greeting = t('home.greeting');
  const name = 'Emre Tiryaki';
  const role = t('home.role');

  const fullLine1 = `${greeting} ${name}`;

  // İlk mount'ta flag'e bak
  const alreadyPlayed = hasPlayedThisSession;
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
        // Efekt bitti → modül flag'ini set et
        hasPlayedThisSession = true;
        playedRef.current = true;
        queueMicrotask(() => setPhase('done'));
      }
    }
  }, [phase, displayed1, displayed2, fullLine1, role]);

  return (
    <div className="space-y-4 select-none">
      {/* Main Heading — \u200B keeps line height even when text is empty */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
        {displayed1 || '\u200B'}
        {phase === 'line1' && (
          <span className="inline-block w-1.5 h-10 ml-1 bg-orange-500 align-middle animate-pulse" />
        )}
      </h1>

      {/* Role Subheading — always rendered, invisible until phase reaches line2 */}
      <p
        className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent"
        style={{ visibility: phase === 'line1' ? 'hidden' : 'visible' }}
      >
        {displayed2 || '\u200B'}
        {phase === 'line2' && (
          <span className="inline-block w-1.5 h-8 ml-1 bg-orange-400 align-middle" />
        )}
        {phase === 'done' && (
          <span className="inline-block w-1.5 h-8 ml-1 bg-orange-400 align-middle opacity-80 animate-pulse" />
        )}
      </p>
    </div>
  );
}
