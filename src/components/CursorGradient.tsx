import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CURSOR_SIZE = 300;
const CURSOR_SIZE_SMALL = 20;

export default function CursorGradient() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const [isVisible, setIsVisible] = useState(false);
    const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);

    // Use ref to access latest hoveredRect in event handlers without re-creating them
    const hoveredRectRef = useRef<DOMRect | null>(null);

    // Keep ref in sync with state
    useEffect(() => {
        hoveredRectRef.current = hoveredRect;
    }, [hoveredRect]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);

            // Always update position based on whether we're hovering or not
            if (hoveredRectRef.current) {
                // Small cursor centered on mouse
                mouseX.set(e.clientX - CURSOR_SIZE_SMALL / 2);
                mouseY.set(e.clientY - CURSOR_SIZE_SMALL / 2);
            } else {
                // Large cursor centered on mouse
                mouseX.set(e.clientX - CURSOR_SIZE / 2);
                mouseY.set(e.clientY - CURSOR_SIZE / 2);
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if the target is clickable or inside a clickable element
            const clickable = target.closest("button, a, [role='button']");

            if (clickable) {
                const rect = clickable.getBoundingClientRect();
                setHoveredRect(rect);

                // Keep the cursor at the current mouse position, centered for small size
                mouseX.set(e.clientX - CURSOR_SIZE_SMALL / 2);
                mouseY.set(e.clientY - CURSOR_SIZE_SMALL / 2);
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clickable = target.closest("button, a, [role='button']");

            if (clickable) {
                const related = e.relatedTarget as HTMLElement;
                // If moving to a child element, don't reset
                if (related && clickable.contains(related)) {
                    return;
                }

                setHoveredRect(null);

                // Reset to current mouse position with large size centering
                mouseX.set(e.clientX - CURSOR_SIZE / 2);
                mouseY.set(e.clientY - CURSOR_SIZE / 2);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("mouseout", handleMouseOut);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mouseout", handleMouseOut);
        };
    }, [mouseX, mouseY, isVisible]); // Removed hoveredRect from dependencies

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed pointer-events-none z-50 mix-blend-multiply opacity-40 dark:mix-blend-screen"
            animate={{
                width: hoveredRect ? CURSOR_SIZE_SMALL : CURSOR_SIZE,
                height: hoveredRect ? CURSOR_SIZE_SMALL : CURSOR_SIZE,
                borderRadius: "50%",
            }}
            transition={{ type: "spring", ...springConfig }}
            style={{
                x: springX,
                y: springY,
                background: "radial-gradient(circle, rgba(234, 88, 12, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 70%)",
                filter: hoveredRect ? "blur(5px)" : "blur(20px)",
            }}
        />
    );
}
