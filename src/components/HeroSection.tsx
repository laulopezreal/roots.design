import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "./ui/button";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const TYPEWRITER_WORDS = ["Pieces", "Furniture", "Art", "Design"] as const;
const TYPEWRITER_BASE_TITLE = "Timeless";
const TYPING_DELAY = 130;
const DELETING_DELAY = 80;
const WORD_HOLD_DELAY = 1100;

type TypewriterState = {
  wordIndex: number;
  charIndex: number;
  isDeleting: boolean;
};

const createInitialTypewriterState = (): TypewriterState => ({
  wordIndex: 0,
  charIndex: 0,
  isDeleting: false,
});

const HeroSection = ({
  title,
  subtitle = "Elevate your space with our curated collection of design furniture",
  ctaText = "Explore The Collection",
  onCtaClick = () => { },
}: HeroSectionProps) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimateTitle = useMemo(
    () => !title && !prefersReducedMotion,
    [prefersReducedMotion, title],
  );

  const [typewriterState, setTypewriterState] = useState<TypewriterState>(() =>
    createInitialTypewriterState(),
  );
  const [displayedWord, setDisplayedWord] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!shouldAnimateTitle) {
      return;
    }

    setDisplayedWord("");
    setTypewriterState(createInitialTypewriterState());
    setIsComplete(false);
  }, [shouldAnimateTitle]);

  useEffect(() => {
    if (!shouldAnimateTitle || isComplete) {
      return;
    }

    const { wordIndex, charIndex, isDeleting } = typewriterState;
    const currentWord = TYPEWRITER_WORDS[wordIndex];
    const isLastWord = wordIndex === TYPEWRITER_WORDS.length - 1;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (isDeleting) {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayedWord(currentWord.slice(0, charIndex - 1));
          setTypewriterState((prev) => ({
            ...prev,
            charIndex: Math.max(prev.charIndex - 1, 0),
          }));
        }, DELETING_DELAY);
      } else {
        setDisplayedWord("");
        setTypewriterState((prev) => ({
          wordIndex: Math.min(prev.wordIndex + 1, TYPEWRITER_WORDS.length - 1),
          charIndex: 0,
          isDeleting: false,
        }));
      }
    } else if (charIndex < currentWord.length) {
      timeout = setTimeout(() => {
        setDisplayedWord(currentWord.slice(0, charIndex + 1));
        setTypewriterState((prev) => ({
          ...prev,
          charIndex: prev.charIndex + 1,
        }));
      }, TYPING_DELAY);
    } else if (isLastWord) {
      setIsComplete(true);
    } else {
      timeout = setTimeout(() => {
        setTypewriterState((prev) => ({
          ...prev,
          isDeleting: true,
        }));
      }, WORD_HOLD_DELAY);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isComplete, shouldAnimateTitle, typewriterState]);

  const animatedTitle = (
    <span
      className="inline-flex flex-wrap items-baseline"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="whitespace-nowrap">{TYPEWRITER_BASE_TITLE}&nbsp;</span>
      <span className="inline-flex items-baseline">
        <span className="text-gradient-luxury inline-block" style={{ paddingBottom: '0.35em' }}>
          {displayedWord}
        </span>
        <span
          aria-hidden="true"
          className={`ml-1 inline-block h-[1em] w-[2px] bg-gray-900 ${isComplete ? "opacity-0" : "animate-pulse"
            }`}
        />
      </span>
    </span>
  );

  const finalStaticTitle = `${TYPEWRITER_BASE_TITLE} ${TYPEWRITER_WORDS[TYPEWRITER_WORDS.length - 1]}`;
  const headingContent = shouldAnimateTitle ? animatedTitle : title ?? finalStaticTitle;

  return (
    <section className="hero">

      <div className="relative h-full min-h-[90vh] max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20 px-6 md:px-12 lg:px-16 py-20 md:py-24">
        {/* Text left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full md:w-1/2 max-w-2xl z-10"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-light text-gray-900 mb-8 leading-[1.15] tracking-tight overflow-visible pb-2 min-h-[4.5rem] md:min-h-[5rem]">
            {headingContent}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-light tracking-wide max-w-xl">
            {subtitle}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              onClick={onCtaClick}
              variant="default"
              size="lg"
              className="group relative overflow-hidden bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-base font-normal tracking-wide transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-[1.02] border-0"
            >
              <span className="relative z-10">{ctaText}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Image right */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full md:w-1/2 flex justify-center md:justify-end z-10"
        >
          <div className="relative w-full max-w-2xl group aspect-square">
            {/* Decorative frame effect - warm monochromatic with rich accents */}
            <div className="absolute -inset-4 bg-gradient-to-br from-orange-200/40 via-amber-100/35 to-rose-100/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-gray-900/10 transition-luxury group-hover:shadow-3xl group-hover:shadow-gray-900/20">
              <img
                src="/images/hero_warm_chair.png"
                alt="Contemporary sculptural armchair in terracotta leather"
                width="800"
                height="800"
                className="w-full h-auto transition-all duration-700 group-hover:scale-[1.03]"
                loading="eager"
                fetchPriority="high"
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
