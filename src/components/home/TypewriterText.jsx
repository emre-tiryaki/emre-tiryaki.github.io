import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

export default function TypewriterText() {
  const { t } = useTranslation();
  const greeting = t('home.greeting');
  const name = 'Emre Tiryaki';
  const role = t('home.role');

  const fullLine1 = `${greeting} ${name}`;
  const [displayed1, setDisplayed1] = useState('');
  const [displayed2, setDisplayed2] = useState('');
  const [phase, setPhase] = useState('line1'); // 'line1' | 'line2' | 'done'

  useEffect(() => {
    setDisplayed1('');
    setDisplayed2('');
    setPhase('line1');
  }, [greeting, role]);

  useEffect(() => {
    if (phase === 'line1') {
      if (displayed1.length < fullLine1.length) {
        const timer = setTimeout(() => {
          setDisplayed1(fullLine1.slice(0, displayed1.length + 1));
        }, 40);
        return () => clearTimeout(timer);
      } else {
        // Small pause before line2
        const timer = setTimeout(() => setPhase('line2'), 200);
        return () => clearTimeout(timer);
      }
    }

    if (phase === 'line2') {
      if (displayed2.length < role.length) {
        const timer = setTimeout(() => {
          setDisplayed2(role.slice(0, displayed2.length + 1));
        }, 45);
        return () => clearTimeout(timer);
      } else {
        setPhase('done');
      }
    }
  }, [phase, displayed1, displayed2, fullLine1, role]);

  return (
    <div className="space-y-3">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-100 leading-tight">
        {displayed1}
        {phase === 'line1' && (
          <span
            className="inline-block w-0.5 h-10 ml-1 bg-orange-400 align-middle"
            style={{ animation: phase === 'done' ? 'cursor-blink 1s infinite' : 'none' }}
          />
        )}
      </h1>
      <div className="h-10 sm:h-12">
        {(phase === 'line2' || phase === 'done') && (
          <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-orange-400">
            {displayed2}
            {phase !== 'done' && (
              <span
                className="inline-block w-0.5 h-7 ml-1 bg-orange-400 align-middle"
                style={{ animation: 'none' }}
              />
            )}
            {phase === 'done' && (
              <span
                className="inline-block w-0.5 h-7 ml-1 bg-orange-400 align-middle opacity-0"
                style={{ animation: 'cursor-blink 1.2s infinite' }}
              />
            )}
          </p>
        )}
      </div>
    </div>
  );
}
