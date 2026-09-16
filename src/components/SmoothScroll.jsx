import { useEffect } from "react";
import Lenis from "lenis";

function SmoothScroll({ disabled = false }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    if (disabled) {
      lenis.stop();
    }

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [disabled]);

  return null;
}

export default SmoothScroll;