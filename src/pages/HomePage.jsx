import TypewriterText from '../components/home/TypewriterText';
import AsciiAnimation from '../components/home/AsciiAnimation';
import { useTranslation } from '../hooks/translation';

export default function HomePage() {
  const { lang } = useTranslation();

  return (
    /* Full viewport minus navbar height — perfectly centered */
    <div
      className="w-full flex-1 flex items-center justify-center"
      style={{
        minHeight: 'calc(100dvh - 8rem)',
        marginBlock: 'auto',
        // px-4 sm:px-8 global reset tarafından ezildiği için inline: 1rem → 2rem
        paddingLeft: 'max(clamp(1rem, 4vw, 2rem), env(safe-area-inset-left))',
        paddingRight: 'max(clamp(1rem, 4vw, 2rem), env(safe-area-inset-right))',
      }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Left: Typewriter text */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
          <TypewriterText key={lang} />
        </div>

        {/* Right: ASCII terminal — transparent background */}
        <div className="flex justify-center lg:justify-end">
          <AsciiAnimation />
        </div>
      </div>
    </div>
  );
}
