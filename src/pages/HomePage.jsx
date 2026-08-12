import TypewriterText from '../components/home/TypewriterText';
import AsciiAnimation from '../components/home/AsciiAnimation';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Typewriter Text */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
          <TypewriterText />
        </div>

        {/* Right Side: Random ASCII Animation */}
        <div className="flex justify-center lg:justify-end overflow-hidden">
          <AsciiAnimation />
        </div>
      </div>
    </div>
  );
}
