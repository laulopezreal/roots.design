import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CURSOR_SIZE = 300;

export default function CursorGradient() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);

    // Optimization: Use ref to track if rAF is pending
    const rafId = useRef<number | null>(null);

    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Optimization: Check for touch device to avoid running on mobile
        const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        if (isTouchDevice) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (rafId.current) return;

            rafId.current = requestAnimationFrame(() => {
                // Center the cursor based on its current size
                const currentSize = isHovering ? 20 : CURSOR_SIZE;
                mouseX.set(e.clientX - currentSize / 2);
                mouseY.set(e.clientY - currentSize / 2);

                if (!isVisible) setIsVisible(true);
                rafId.current = null;
            });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("mouseout", handleMouseOut);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mouseout", handleMouseOut);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [mouseX, mouseY, isVisible, isHovering]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed pointer-events-none z-[9999] mix-blend-multiply opacity-40 dark:mix-blend-screen"
            animate={{
                width: isHovering ? 20 : CURSOR_SIZE,
                height: isHovering ? 20 : CURSOR_SIZE,
                filter: isHovering ? "blur(0px)" : "blur(20px)",
                background: isHovering
                    ? "radial-gradient(circle, rgba(234, 88, 12, 0.8) 0%, rgba(251, 191, 36, 0.8) 100%)"
                    : "radial-gradient(circle, rgba(234, 88, 12, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 70%)"
            }}
            style={{
                x: springX,
                y: springY,
                borderRadius: "50%",
            }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1
            }}
        />
    );
}
