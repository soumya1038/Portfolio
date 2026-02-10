import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';

const glyphs = [
  (props) => (
    <svg viewBox="0 0 120 120" {...props}>
      <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M20 70 C40 40, 80 40, 100 70" fill="none" stroke="currentColor" strokeWidth="5" />
      <path d="M40 50 L60 30 L80 50" fill="none" stroke="currentColor" strokeWidth="5" />
    </svg>
  ),
  (props) => (
    <svg viewBox="0 0 120 120" {...props}>
      <path d="M24 88 L60 22 L96 88 Z" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M60 22 L60 96" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="60" cy="60" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  ),
  (props) => (
    <svg viewBox="0 0 120 120" {...props}>
      <path d="M20 60 C40 20, 80 20, 100 60 C80 100, 40 100, 20 60 Z" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M40 60 C50 45, 70 45, 80 60 C70 75, 50 75, 40 60 Z" fill="none" stroke="currentColor" strokeWidth="5" />
    </svg>
  ),
  (props) => (
    <svg viewBox="0 0 120 120" {...props}>
      <path d="M60 18 L72 42 L98 46 L78 64 L84 90 L60 76 L36 90 L42 64 L22 46 L48 42 Z" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="60" cy="60" r="8" fill="currentColor" />
    </svg>
  ),
];

function AchievementsSection({ achievements }) {
  const [visibleItems, setVisibleItems] = useState(() => new Set());
  const [activeImage, setActiveImage] = useState(null);
  const [paths, setPaths] = useState([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const anchorRefs = useRef([]);

  const timeline = useMemo(() => {
    const sorted = [...(achievements || [])].sort((a, b) => {
      const aTime = new Date(a.date || a.createdAt || 0).getTime() || 0;
      const bTime = new Date(b.date || b.createdAt || 0).getTime() || 0;
      return bTime - aTime;
    });
    return sorted.map((achievement, index) => ({
      ...achievement,
      index,
      dateLabel: achievement.date
        ? new Date(achievement.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '',
    }));
  }, [achievements]);

  useEffect(() => {
    if (!itemRefs.current.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleItems((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = Number(entry.target.dataset.index);
              if (!Number.isNaN(idx)) {
                next.add(idx);
              }
            }
          });
          return next;
        });
      },
      { threshold: 0.35 }
    );

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, [timeline.length]);

  useEffect(() => {
    if (!activeImage) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveImage(null);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeImage]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const computePaths = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const points = anchorRefs.current
        .map((el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - rect.left,
            y: r.top + r.height / 2 - rect.top,
          };
        })
        .filter(Boolean);

      setSvgSize({ width: rect.width, height: rect.height });

      const buildSmoothPath = (points, tension = 0.5) => {
        if (points.length < 2) return '';
        const clampPoint = (idx) => points[Math.max(0, Math.min(points.length - 1, idx))];
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i += 1) {
          const p0 = clampPoint(i - 1);
          const p1 = clampPoint(i);
          const p2 = clampPoint(i + 1);
          const p3 = clampPoint(i + 2);
          const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
          const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;
          const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
          const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;
          d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
        }
        return d;
      };

      const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

      const nextPaths = [];
      for (let i = 0; i < points.length - 1; i += 1) {
        const start = points[i];
        const end = points[i + 1];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const direction = i % 2 === 0 ? 1 : -1;
        const padding = 18;
        const amplitude = Math.min(
          rect.width * 0.28,
          Math.max(70, Math.abs(dx) * 0.9 + Math.abs(dy) * 0.12)
        );

        const samples = 20;
        const curvePoints = [];
        for (let s = 0; s <= samples; s += 1) {
          const t = s / samples;
          const baseX = start.x + dx * t;
          const baseY = start.y + dy * t;
          const wave = Math.sin(Math.PI * t);
          const offset = wave * amplitude * direction;
          const x = clamp(baseX + offset, padding, rect.width - padding);
          curvePoints.push({ x, y: baseY });
        }
        nextPaths.push({
          index: i,
          d: buildSmoothPath(curvePoints),
        });
      }
      setPaths(nextPaths);
    };

    computePaths();

    const resizeObserver = new ResizeObserver(() => computePaths());
    resizeObserver.observe(container);
    anchorRefs.current.forEach((el) => {
      if (el) resizeObserver.observe(el);
    });

    window.addEventListener('resize', computePaths);

    return () => {
      window.removeEventListener('resize', computePaths);
      resizeObserver.disconnect();
    };
  }, [timeline.length]);

  if (!timeline.length) return null;

  return (
    <section id="achievements" className="relative paper-texture text-ink py-20 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <defs>
          <filter id="muralGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="8" result="crumple" />
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="2" result="grain" />
            <feBlend in="crumple" in2="grain" mode="multiply" result="texture" />
            <feColorMatrix in="texture" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.18" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#muralGrain)" opacity="0.35" />
      </svg>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <header className="relative text-center mb-16">
          <p className="section-kicker">Achievements</p>
          <h2 className="section-title mt-2">Achievement Roadmap</h2>
          <p className="text-gray-600 mt-3">Certificates, awards, and milestones.</p>
        </header>

        <div ref={containerRef} className="relative overflow-visible">
          {svgSize.width > 0 && svgSize.height > 0 && paths.length > 0 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
              aria-hidden
            >
              <defs>
                <filter id="charcoalRough" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="2" />
                  <feDisplacementMap in="SourceGraphic" scale="1.2" />
                </filter>
              </defs>
              {paths.map((path) => {
                const isActive = visibleItems.has(path.index + 1);
                return (
                  <path
                    key={`path-${path.index}`}
                    d={path.d}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    strokeDasharray="10 14"
                    strokeLinecap="round"
                    style={{
                      opacity: isActive ? 0.6 : 0.18,
                      transition: 'opacity 0.8s ease',
                      transitionDelay: `${path.index * 0.1}s`,
                      filter: 'url(#charcoalRough)',
                    }}
                  />
                );
              })}
            </svg>
          )}

          <div className="space-y-16 relative z-10">
            {timeline.map((achievement, index) => {
              const isLeft = index % 2 === 0;
              const isVisible = visibleItems.has(index);
              const Glyph = glyphs[index % glyphs.length];
              const hasImage = Boolean(achievement.imageUrl);
              return (
                <div
                  key={achievement._id || `${achievement.title}-${index}`}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  data-index={index}
                  className={`grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_auto_minmax(0,1.05fr)] gap-6 md:gap-6 lg:gap-8 items-center transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <div className="flex justify-center order-2 md:order-2">
                    <div
                      ref={(el) => {
                        anchorRefs.current[index] = el;
                      }}
                      className="relative h-20 w-20 md:h-24 md:w-24 text-primary-300 flex items-center justify-center"
                    >
                      <div className="absolute inset-0 rounded-full border-2 border-primary-100 bg-white/70 shadow-soft" />
                      <Glyph className="h-14 w-14 md:h-16 md:w-16 glyph-wash relative" />
                    </div>
                  </div>

                  <div
                    className={`flex order-1 ${
                      isLeft
                        ? 'md:order-1 md:justify-end'
                        : 'md:order-3 md:justify-start'
                    }`}
                  >
                    <div
                      className={`relative max-w-sm w-full flex flex-col items-center gap-4 text-center ${
                        isLeft ? 'md:items-start md:text-left' : 'md:items-end md:text-right'
                      }`}
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                          Milestone {String(index + 1).padStart(2, '0')}
                        </p>
                        <h3 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-semibold text-ink leading-tight">
                          {achievement.title}
                        </h3>
                        <svg
                          viewBox="0 0 220 12"
                          className={`mt-2 w-48 mx-auto ${isLeft ? 'md:mx-0' : 'md:ml-auto'}`}
                        >
                          <path
                            d="M2 8 Q 50 2 110 8 T 218 8"
                            fill="none"
                            stroke="#0284c7"
                            strokeWidth="3"
                            strokeLinecap="round"
                            pathLength="1"
                            style={{
                              strokeDasharray: 1,
                              strokeDashoffset: isVisible ? 0 : 1,
                              transition: 'stroke-dashoffset 0.8s ease',
                              transitionDelay: `${index * 0.15}s`,
                            }}
                          />
                        </svg>
                        {achievement.dateLabel && (
                          <p className="font-script text-lg text-primary-600 mt-2">
                            {achievement.dateLabel}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex order-3 ${
                      isLeft
                        ? 'md:order-3 md:justify-start'
                        : 'md:order-1 md:justify-end'
                    }`}
                  >
                    <div className="stone-slab p-6 md:p-8">
                      <div
                        className={`grid gap-6 ${
                          hasImage
                            ? 'md:grid-cols-[1fr_1.15fr] md:gap-8 lg:grid-cols-[1fr_1.25fr] md:items-start'
                            : ''
                        }`}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">
                            {achievement.issuer && <span>{achievement.issuer}</span>}
                          </div>
                          {achievement.description && (
                            <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed max-w-prose">
                              {achievement.description}
                            </p>
                          )}
                          {achievement.credentialUrl && (
                            <a
                              href={achievement.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 mt-4"
                            >
                              View Credential
                              <FiExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        {hasImage && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveImage({
                                url: achievement.imageUrl,
                                title: achievement.title,
                              })
                            }
                            className="group relative overflow-hidden rounded-2xl border border-line focus:outline-none focus:ring-2 focus:ring-primary-300"
                          >
                            <img
                              src={achievement.imageUrl}
                              alt={achievement.title}
                              className="w-full aspect-[3/4] md:aspect-[3/4] lg:aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="text-xs uppercase tracking-[0.3em] text-white">
                                View
                              </span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 flex flex-col items-center gap-4">
            <svg viewBox="0 0 120 160" className="h-40 w-28 text-primary-400 opacity-70">
              <path
                d="M60 10 L90 40 L78 70 L98 100 L60 150 L22 100 L42 70 L30 40 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />
              <circle cx="60" cy="90" r="12" fill="currentColor" />
            </svg>
            <p className="font-script text-2xl text-primary-600">More milestones ahead...</p>
          </div>
        </div>
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeImage.url}
              alt={activeImage.title || 'Achievement image'}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <a
                href={activeImage.url}
                download
                className="px-3 py-2 text-xs uppercase tracking-[0.3em] bg-white/90 text-ink rounded-full shadow-soft hover:bg-white"
              >
                Download
              </a>
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="px-3 py-2 text-xs uppercase tracking-[0.3em] bg-white/90 text-ink rounded-full shadow-soft hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AchievementsSection;
