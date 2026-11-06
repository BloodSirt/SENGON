import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Tag,
  CheckCircle2,
  Zap,
  Globe,
  Sparkles
} from 'lucide-react';
import type { PostSlide } from '../types';

interface MediaCarouselProps {
  slides: PostSlide[];
  onOpenLightbox: (slideIndex: number) => void;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({ slides, onOpenLightbox }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  const currentSlide = slides[currentIndex];

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'verified':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'bolt':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'public':
        return <Globe className="w-3.5 h-3.5 text-[#40c2fd]" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-[#40c2fd]" />;
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-[#0c0e17] border border-[#737686]/25 shadow-2xl group select-none my-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#080910]">
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className="relative min-w-full h-full flex items-center justify-center overflow-hidden cursor-zoom-in"
              onClick={() => onOpenLightbox(idx)}
            >
              {/* Background image */}
              <img
                src={slide.imageUrl}
                alt={slide.altText}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />

              {/* High-tech gradient overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-[#090a10]/40 to-transparent opacity-95" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#004ac6]/15 via-transparent to-[#40c2fd]/10 mix-blend-overlay" />

              {/* Architectural Grid / Telemetry HUD overlay in the background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#40c2fd_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Top-left subtle tag indicators */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                {slide.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-[#0c0e17]/80 backdrop-blur-md border border-[#40c2fd]/30 text-[11px] font-mono font-medium text-[#40c2fd] shadow-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Center telemetry data metrics */}
              {slide.metrics && (
                <div className="absolute bottom-20 left-4 right-4 hidden sm:grid grid-cols-3 gap-2.5 pointer-events-none">
                  {slide.metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="px-3 py-2 rounded-xl bg-[#0e111d]/85 backdrop-blur-md border border-[#737686]/30 flex flex-col justify-between shadow-lg"
                    >
                      <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                        {m.label}
                      </span>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <span className="text-sm font-bold font-mono text-white">
                          {m.value}
                        </span>
                        {m.change && (
                          <span className="text-[10px] font-semibold text-emerald-400">
                            {m.change}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Top-Right: HD & Fullscreen Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0c0e17]/80 backdrop-blur-md border border-[#40c2fd]/40 text-[#40c2fd] text-[11px] font-mono font-semibold shadow-lg">
            <Sparkles className="w-3 h-3 text-[#40c2fd] animate-pulse" />
            <span>4K ULTRA HD</span>
          </div>

          <button
            onClick={() => onOpenLightbox(currentIndex)}
            className="p-2 rounded-full bg-[#0c0e17]/80 hover:bg-[#1a1e2d] backdrop-blur-md border border-white/10 hover:border-[#40c2fd]/50 text-gray-300 hover:text-white transition-all shadow-lg group/btn"
            title="Expand Fullscreen (Click to Inspect)"
            aria-label="Expand Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform text-[#40c2fd]" />
          </button>
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-[#0c0e17]/85 hover:bg-[#181c2b] border border-[#737686]/30 hover:border-[#40c2fd]/60 text-white shadow-xl backdrop-blur-md transition-all duration-200 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-80 sm:opacity-0 sm:group-hover:opacity-100'
          }`}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 text-gray-200 hover:text-[#40c2fd] transition-colors" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-[#0c0e17]/85 hover:bg-[#181c2b] border border-[#737686]/30 hover:border-[#40c2fd]/60 text-white shadow-xl backdrop-blur-md transition-all duration-200 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-80 sm:opacity-0 sm:group-hover:opacity-100'
          }`}
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 text-gray-200 hover:text-[#40c2fd] transition-colors" />
        </button>
      </div>

      {/* Overlay Caption Bar at Bottom */}
      <div className="relative px-4 sm:px-6 py-3.5 bg-[#0e101a] border-t border-[#737686]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-[#161a29] border border-[#737686]/40 text-[#40c2fd] text-[11px] font-mono font-bold tracking-wider shrink-0">
            {currentSlide.slideLabel}
          </span>
          <div>
            <h4 className="text-sm font-bold text-gray-100 tracking-tight leading-tight">
              {currentSlide.captionTitle}
            </h4>
            {currentSlide.tagline && (
              <p className="text-xs text-gray-400 font-normal line-clamp-1 mt-0.5">
                {currentSlide.tagline}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          {/* Slide detected badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141724] border border-[#737686]/30 text-xs font-medium text-gray-300">
            {getBadgeIcon(currentSlide.badgeIcon)}
            <span className="text-[11px] font-semibold">{currentSlide.badgeText}</span>
          </div>

          {/* Dot Pagination (4 dots) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {slides.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-6 bg-gradient-to-r from-[#004ac6] to-[#40c2fd] shadow-md shadow-[#40c2fd]/40'
                      : 'w-2 bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
