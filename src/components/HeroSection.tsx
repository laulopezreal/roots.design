import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "./ui/button";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  imageUrl?: string;
  onCtaClick?: () => void;
}

const TYPEWRITER_WORDS = ["Lighting", "Furniture", "Art", "Soul"] as const;
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
  subtitle = "Elevate your space with our curated collection of handcrafted lighting fixtures",
  ctaText = "Explore Collections",
  imageUrl = "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1512&q=80",
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
          className={`ml-1 inline-block h-[1em] w-[2px] bg-white ${
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
      {/* Background image with parallax effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Content overlay */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
            {headingContent}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10">{subtitle}</p>
          <Button
            onClick={onCtaClick}
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-300"
          >
            {ctaText}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
