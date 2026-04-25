/**
 * Lightweight 3D UI effects system.
 * GPU-friendly only — uses transform + opacity, nothing else.
 * All effects are disabled automatically on mobile and reduced-motion.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type Intensity = "low" | "medium" | "high";

export interface TiltConfig {
  maxTilt: number;          // degrees
  perspective: number;      // px
  shadowStrength: number;   // 0–1
  transitionMs: number;
}

export interface ScrollParallaxConfig {
  scale3dFactor: number;    // how much hero scales on scroll
  zDepth: number;           // max translateZ px
}

// ── Intensity maps ────────────────────────────────────────────────────────────

const TILT_CONFIG: Record<Intensity, TiltConfig> = {
  low:    { maxTilt: 4,  perspective: 1200, shadowStrength: 0.10, transitionMs: 200 },
  medium: { maxTilt: 8,  perspective: 1000, shadowStrength: 0.18, transitionMs: 150 },
  high:   { maxTilt: 14, perspective: 800,  shadowStrength: 0.28, transitionMs: 120 },
};

const SCROLL_CONFIG: Record<Intensity, ScrollParallaxConfig> = {
  low:    { scale3dFactor: 0.03, zDepth: 60  },
  medium: { scale3dFactor: 0.06, zDepth: 120 },
  high:   { scale3dFactor: 0.10, zDepth: 200 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function isMobile(): boolean {
  if (typeof window === "undefined") return true;
  return window.innerWidth < 768;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isLowEnd(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency !== undefined &&
    (navigator as Navigator & { hardwareConcurrency: number }).hardwareConcurrency <= 2;
}

export function shouldEnable3D(): boolean {
  return !isMobile() && !prefersReducedMotion() && !isLowEnd();
}

// ── Card tilt ─────────────────────────────────────────────────────────────────

/**
 * Attach mouse-move 3D tilt to a card element.
 * Returns a cleanup function — call it in useEffect cleanup.
 */
export function attachCardTilt(
  el: HTMLElement,
  intensity: Intensity = "medium"
): () => void {
  if (!shouldEnable3D()) return () => {};

  const cfg = TILT_CONFIG[intensity];
  let rafId: number;

  const onMove = (e: MouseEvent) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;

      // Normalise -1 → +1
      const nx = (e.clientX - cx) / (rect.width  / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);

      const rx =  ny * cfg.maxTilt;  // rotateX (tilt up/down)
      const ry = -nx * cfg.maxTilt;  // rotateY (tilt left/right)

      const shadow = cfg.shadowStrength;
      const dx = nx * 8;
      const dy = ny * 8;

      el.style.transform = `perspective(${cfg.perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      el.style.boxShadow = `${dx}px ${dy}px 32px rgba(0,0,0,${shadow}), 0 8px 16px rgba(0,0,0,${shadow * 0.6})`;
      el.style.transition = "none";
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(rafId);
    el.style.transition = `transform ${cfg.transitionMs}ms ease, box-shadow ${cfg.transitionMs}ms ease`;
    el.style.transform  = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    el.style.boxShadow  = "";
  };

  el.style.willChange     = "transform";
  el.style.transformStyle = "preserve-3d";

  el.addEventListener("mousemove", onMove, { passive: true });
  el.addEventListener("mouseleave", onLeave);

  return () => {
    cancelAnimationFrame(rafId);
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
    el.style.willChange     = "";
    el.style.transform      = "";
    el.style.transformStyle = "";
    el.style.boxShadow      = "";
    el.style.transition     = "";
  };
}

// ── Hero scroll 3D ────────────────────────────────────────────────────────────

/**
 * Attach scroll-based 3D depth effect to hero section.
 * Returns cleanup function.
 */
export function attachHeroScroll3D(
  heroEl: HTMLElement,
  intensity: Intensity = "medium"
): () => void {
  if (!shouldEnable3D()) return () => {};

  const cfg = SCROLL_CONFIG[intensity];
  let rafId: number;

  const onScroll = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect = heroEl.getBoundingClientRect();
      const h    = heroEl.offsetHeight;
      if (h === 0) return;

      // progress: 0 when hero fully visible, 1 when fully scrolled out
      const progress = Math.max(0, Math.min(1, -rect.top / h));

      const scale = 1 - progress * cfg.scale3dFactor;
      const tz    = progress * cfg.zDepth;
      const op    = Math.max(0, 1 - progress * 1.2);

      heroEl.style.transform  = `perspective(1000px) scale(${scale}) translateZ(-${tz}px)`;
      heroEl.style.opacity    = String(op);
      heroEl.style.transition = "none"; // managed by rAF — no CSS transition
    });
  };

  heroEl.style.willChange     = "transform, opacity";
  heroEl.style.transformStyle = "preserve-3d";
  heroEl.style.backfaceVisibility = "hidden";

  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", onScroll);
    heroEl.style.willChange     = "";
    heroEl.style.transform      = "";
    heroEl.style.transformStyle = "";
    heroEl.style.opacity        = "";
    heroEl.style.backfaceVisibility = "";
  };
}

// ── Section scroll-in ─────────────────────────────────────────────────────────

/**
 * Attach IntersectionObserver fade+slide-up to any section element.
 */
export function attachScrollIn(
  el: HTMLElement,
  options: { delay?: number; translateY?: number } = {}
): () => void {
  const { delay = 0, translateY = 28 } = options;

  if (prefersReducedMotion()) {
    el.style.opacity   = "1";
    el.style.transform = "none";
    return () => {};
  }

  // Initial hidden state
  el.style.opacity    = "0";
  el.style.transform  = `translateY(${translateY}px)`;
  el.style.transition = `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity   = "1";
        el.style.transform = "translateY(0)";
        observer.disconnect();
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );

  observer.observe(el);

  return () => observer.disconnect();
}

// ── Button press depth ────────────────────────────────────────────────────────

/**
 * Add 3D press depth effect to a button.
 */
export function attachButtonDepth(el: HTMLElement): () => void {
  if (!shouldEnable3D()) return () => {};

  const onDown  = () => { el.style.transform = "translateY(2px) scale(0.97)"; };
  const onUp    = () => { el.style.transform = ""; };

  el.style.transition = "transform 0.08s ease";

  el.addEventListener("mousedown",  onDown);
  el.addEventListener("mouseup",    onUp);
  el.addEventListener("mouseleave", onUp);
  el.addEventListener("touchstart", onDown, { passive: true });
  el.addEventListener("touchend",   onUp);

  return () => {
    el.removeEventListener("mousedown",  onDown);
    el.removeEventListener("mouseup",    onUp);
    el.removeEventListener("mouseleave", onUp);
    el.removeEventListener("touchstart", onDown);
    el.removeEventListener("touchend",   onUp);
    el.style.transition = "";
    el.style.transform  = "";
  };
}

// ── React hook wrappers (re-exported for convenience) ─────────────────────────

export { isMobile, prefersReducedMotion };
