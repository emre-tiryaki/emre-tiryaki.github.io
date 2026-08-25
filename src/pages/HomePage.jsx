import TypewriterText from '../components/home/TypewriterText';
import AsciiAnimation from '../components/home/AsciiAnimation';

export default function HomePage() {
  return (
    /* Full viewport minus navbar height — perfectly centered */
    <div className="w-full flex-1 flex items-center justify-center px-4 sm:px-8 my-auto" style={{ minHeight: 'calc(100vh - 8rem)' }}>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Typewriter text */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
          <TypewriterText />
        </div>

        {/* Right: ASCII terminal — transparent background */}
        <div className="flex justify-center lg:justify-end">
          <AsciiAnimation />
        </div>
      </div>
    </div>
  );
}
