"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface Props {
  particleCount?: number;
  lineDistance?: number;
  particleColor?: string;
  lineColor?: string;
  backgroundColor?: string;
  mouseInteraction?: boolean;
}

export default function ParticleBackground({
  particleCount = 45,
  lineDistance = 130,
  particleColor = "255,255,255",
  lineColor = "255,255,255",
  backgroundColor = "#000000",
  mouseInteraction = true,
}: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const rafRef     = useRef<number>(0);
  const isMobile   = typeof window !== "undefined" && window.innerWidth < 768;

  // Reduce particles on mobile
  const count = isMobile ? Math.floor(particleCount * 0.5) : particleCount;

  useEffect(() => {
    const canvas  = canvasRef.current;
    if (!canvas) return;
    const ctx     = canvas.getContext("2d");
    if (!ctx) return;

    let width  = 0;
    let height = 0;
    let particles: Particle[] = [];

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      width  = canvas.width  = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    // ── Init particles ───────────────────────────────────────────────────────
    const init = () => {
      particles = Array.from({ length: count }, () => ({
        x:       Math.random() * width,
        y:       Math.random() * height,
        vx:      (Math.random() - 0.5) * 0.45,
        vy:      (Math.random() - 0.5) * 0.45,
        radius:  Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.5 + 0.25,
      }));
    };

    // ── Draw ─────────────────────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > width)  p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Subtle mouse repulsion
        if (mouseInteraction && !isMobile) {
          const dx   = p.x - mx;
          const dy   = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const force = (80 - dist) / 80 * 0.012;
            p.vx += dx * force;
            p.vy += dy * force;
            // Clamp speed
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 1.2) {
              p.vx = (p.vx / speed) * 1.2;
              p.vy = (p.vy / speed) * 1.2;
            }
          }
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor},${p.opacity})`;
        ctx.fill();
      }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < lineDistance) {
            const alpha = (1 - dist / lineDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
            ctx.lineWidth   = 0.7;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // ── Mouse ────────────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect         = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    // ── ResizeObserver ───────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas);

    resize();
    init();
    draw();

    if (mouseInteraction && !isMobile) {
      canvas.addEventListener("mousemove",  onMouseMove, { passive: true });
      canvas.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (mouseInteraction && !isMobile) {
        canvas.removeEventListener("mousemove",  onMouseMove);
        canvas.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, lineDistance, particleColor, lineColor, mouseInteraction]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ backgroundColor }}
      className="absolute inset-0 w-full h-full z-0 block"
    />
  );
}
