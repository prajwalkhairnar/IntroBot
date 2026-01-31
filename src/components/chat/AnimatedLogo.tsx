import { useEffect, useRef, useId } from 'react';

interface AnimatedLogoProps {
  /** Optional class for the outer wrapper */
  className?: string;
  /** size in pixels (default: 80) */
  size?: number;
}

export function AnimatedLogo({ className = '', size = 80 }: AnimatedLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null);

  // Generating a unique ID allows multiple instances of this logo on one page
  // without the SVG filters conflicting.
  const uniqueId = useId();
  const filterId = `goo-filter-${uniqueId}`;

  useEffect(() => {
    // Add random variation to animation delays for organic feel
    if (logoRef.current) {
      const blobs = logoRef.current.querySelectorAll('.blob');
      blobs.forEach((blob, index) => {
        (blob as HTMLElement).style.animationDelay = `${index * 0.3}s`;
      });
    }
  }, []);

  return (
    <div
      ref={logoRef}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Animated organic logo"
    >
      {/* SVG filters definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Container with goo filter */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ filter: `url(#${filterId})` }}
      >
        {/* Organic blob layers - using percentages for scalability */}
        <div className="blob blob-1 absolute w-[80%] h-[80%]" />
        <div className="blob blob-2 absolute w-[70%] h-[70%]" />
        <div className="blob blob-3 absolute w-[80%] h-[80%]" />
        <div className="blob blob-4 absolute w-[70%] h-[70%]" />
        <div className="blob blob-5 absolute w-[60%] h-[60%]" />
        <div className="blob blob-6 absolute w-[50%] h-[50%]" />
      </div>

      {/* Iridescent overlay */}
      <div className="absolute inset-0 rounded-full overflow-hidden opacity-60 pointer-events-none">
        <div className="iridescent-layer absolute inset-0" />
      </div>

      {/* Light reflection effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden opacity-70 pointer-events-none">
        <div className="light-reflection absolute w-full h-full" />
      </div>

      {/* Subtle glow */}
      <div className="absolute inset-0 glow-pulse pointer-events-none" />

      {/* Scoped Styles */}
      <style>{`
        @keyframes morph {
          0%, 100% {
            border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
            transform: rotate(0deg) scale(1);
          }
          14% {
            border-radius: 40% 60% 54% 46% / 49% 60% 40% 51%;
            transform: rotate(50deg) scale(1.08);
          }
          28% {
            border-radius: 54% 46% 38% 62% / 49% 70% 30% 51%;
            transform: rotate(110deg) scale(0.92);
          }
          42% {
            border-radius: 61% 39% 55% 45% / 61% 38% 62% 39%;
            transform: rotate(165deg) scale(1.12);
          }
          57% {
            border-radius: 48% 52% 69% 31% / 39% 53% 47% 61%;
            transform: rotate(230deg) scale(0.88);
          }
          71% {
            border-radius: 38% 62% 43% 57% / 58% 39% 61% 42%;
            transform: rotate(290deg) scale(1.05);
          }
          85% {
            border-radius: 59% 41% 52% 48% / 43% 62% 38% 57%;
            transform: rotate(340deg) scale(0.95);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          16% { transform: translateY(-8px) translateX(6px); }
          33% { transform: translateY(-14px) translateX(-4px); }
          50% { transform: translateY(-6px) translateX(10px); }
          66% { transform: translateY(8px) translateX(-8px); }
          83% { transform: translateY(4px) translateX(7px); }
        }

        @keyframes iridescent {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(200%) translateY(200%) rotate(45deg); }
        }

        @keyframes glow {
          0%, 100% { opacity: 0.4; filter: blur(25px); }
          50% { opacity: 0.7; filter: blur(35px); }
        }

        .blob {
          /* GPU Acceleration hint */
          will-change: transform, border-radius;
          animation: morph 8s ease-in-out infinite, float 6s ease-in-out infinite;
          background: linear-gradient(
            135deg,
            #8b5cf6,
            #3b82f6,
            #a855f7,
            #ec4899,
            #6366f1
          );
          background-size: 200% 200%;
        }

        .blob-1 { animation-duration: 13s, 9s; }
        .blob-2 { 
          animation-duration: 17s, 11s; 
          animation-direction: reverse; 
          opacity: 0.9; 
        }
        .blob-3 { 
          animation-duration: 19s, 13s; 
          animation-delay: 0.5s, 0.3s; 
          opacity: 0.85; 
        }
        .blob-4 { 
          animation-duration: 15s, 14s; 
          animation-direction: reverse; 
          animation-delay: 1s, 0.7s; 
          opacity: 0.8; 
        }
        .blob-5 { 
          animation-duration: 21s, 10s; 
          animation-delay: 1.5s, 1.2s; 
          opacity: 0.75; 
        }
        .blob-6 { 
          animation-duration: 16s, 12s; 
          animation-direction: reverse; 
          animation-delay: 2s, 1.5s; 
          opacity: 0.7; 
        }

        .iridescent-layer {
          background: linear-gradient(
            45deg,
            rgba(255, 0, 255, 0.8),
            rgba(0, 255, 255, 0.8),
            rgba(255, 255, 0, 0.8),
            rgba(255, 0, 255, 0.8)
          );
          background-size: 300% 300%;
          animation: iridescent 4s ease-in-out infinite;
          mix-blend-mode: overlay;
        }

        .light-reflection {
          background: linear-gradient(
            135deg,
            transparent 0%,
            rgba(255, 255, 255, 0.7) 45%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0.7) 55%,
            transparent 100%
          );
          animation: shimmer 3s ease-in-out infinite;
          mix-blend-mode: overlay;
        }

        .glow-pulse {
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.6),
            rgba(59, 130, 246, 0.4),
            transparent 70%
          );
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}