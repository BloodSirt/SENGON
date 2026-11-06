import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Tag, CheckCircle2, Zap, Globe } from 'lucide-react';
import type { PostSlide } from '../types';

interface LightboxModalProps {
  slides: PostSlide[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  slides,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  const currentSlide = slides[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!currentSlide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-md bg-[#161a28] border border-[#737686]/40 text-[#40c2fd] font-mono text-xs font-bold">
            {currentSlide.slideLabel}
          </span>
          <span className="text-sm font-bold text-white hidden sm:inline">
            {currentSlide.captionTitle}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close Fullscreen"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative max-w-6xl max-h-[85vh] w-full flex flex-col items-center justify-center">
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#090b14]">
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.altText}
            className="w-full max-h-[70vh] object-contain mx-auto"
          />

          {/* Bottom Info bar in lightbox */}
          <div className="p-4 sm:p-6 bg-[#0e111d]/95 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                {currentSlide.captionTitle}
              </h3>
              {currentSlide.tagline && (
                <p className="text-xs text-gray-400 mt-1">
                  {currentSlide.tagline}
                </p>
              )}
            </div>

            {currentSlide.metrics && (
              <div className="flex items-center gap-4">
                {currentSlide.metrics.map((m, i) => (
                  <div key={i} className="text-right">
                    <span className="text-[10px] uppercase font-mono text-gray-500 block">
                      {m.label}
                    </span>
                    <span className="text-xs font-bold font-mono text-[#40c2fd]">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prev / Next Buttons */}
        <button
          onClick={onPrev}
          className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#1d68ff] text-white border border-white/20 transition-all"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#1d68ff] text-white border border-white/20 transition-all"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
