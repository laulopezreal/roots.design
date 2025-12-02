import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CursorGradient() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Center the cursor
            mouseX.set(e.clientX - 150);
            mouseY.set(e.clientY - 150);

            if (!isVisible) setIsVisible(true);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed pointer-events-none z-50 mix-blend-multiply opacity-40 dark:mix-blend-screen"
            style={{
                x: springX,
                y: springY,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(234, 88, 12, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 70%)",
                filter: "blur(20px)",
            }}
        />
    );
}
