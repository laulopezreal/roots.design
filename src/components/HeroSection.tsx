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
  onCtaClick = () => {},
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
        <span>{displayedWord}</span>
        <span
          aria-hidden="true"
          className={`ml-1 inline-block h-[1em] w-[2px] bg-gray-900 ${
            isComplete ? "opacity-0" : "animate-pulse"
          }`}
        />
      </span>
    </span>
  );

  const finalStaticTitle = `${TYPEWRITER_BASE_TITLE} ${TYPEWRITER_WORDS[TYPEWRITER_WORDS.length - 1]}`;
  const headingContent = shouldAnimateTitle ? animatedTitle : title ?? finalStaticTitle;

  return (
    <section className="relative w-full h-[800px] bg-white overflow-hidden">
      <div className="h-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20 px-19 md:px-14 lg:px-10">
        {/* Text left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full md:w-6/12 max-w-2xl"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-light text-gray-900 mb-6">
            {headingContent}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10">{subtitle}</p>
          <Button
            onClick={onCtaClick}
            variant="default"
            size="lg"
            className="shadow-none transition-all duration-300"
          >
            {ctaText}
          </Button>
        </motion.div>

        {/* Image right */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="relative w-full md:w-7/12 flex justify-center md:justify-end mt-10 md:mt-0"
        >
          <div className="w-full">
            <img
              src="/images/rootszug.png"
              alt="Sculptural floor lamp on a terrace overlooking a lake at sunset"
              className="w-full h-auto rounded-3xl shadow-xl shadow-gray-900/10"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
