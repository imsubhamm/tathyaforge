"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; z: number; speed: number };

export function DataEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const points: Point[] = Array.from({ length: mobile ? 14 : 38 }, (_, index) => ({
      x: ((index * 79) % 101) / 100,
      y: ((index * 47) % 97) / 100,
      z: 0.25 + ((index * 31) % 70) / 100,
      speed: 0.00002 + ((index % 5) * 0.000006),
    }));
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let lastDraw = 0;
    let pointerX = 0;
    let pointerY = 0;

    const resize = () => {
      const ratio = mobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time = 0) => {
      if (!visible || document.hidden) {
        frame = 0;
        return;
      }
      if (mobile && time - lastDraw < 33) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;
      context.clearRect(0, 0, width, height);
      const projected = points.map((point, index) => {
        const drift = reduced ? 0 : Math.sin(time * point.speed + index) * 7;
        return {
          x: point.x * width + pointerX * point.z * 13 + drift,
          y: point.y * height + pointerY * point.z * 9 + Math.cos(time * point.speed + index) * 5,
          z: point.z,
        };
      });

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance < 145) {
            context.strokeStyle = `rgba(51, 65, 85, ${0.18 * (1 - distance / 145)})`;
            context.lineWidth = 0.7;
            context.beginPath();
            context.moveTo(projected[i].x, projected[i].y);
            context.lineTo(projected[j].x, projected[j].y);
            context.stroke();
          }
        }
      }

      projected.forEach((point, index) => {
        const pulse = reduced ? 0 : Math.sin(time * 0.001 + index) * 0.5;
        context.fillStyle = index % 7 === 0 ? "rgba(217,119,6,.9)" : "rgba(37,99,235,.58)";
        context.beginPath();
        context.arc(point.x, point.y, 1.4 + point.z * 2 + pulse, 0, Math.PI * 2);
        context.fill();
      });

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const onPointer = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };
    resize();
    draw();
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduced && !frame && !document.hidden) {
          frame = requestAnimationFrame(draw);
        } else if (!visible && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden && visible && !reduced && !frame) {
        frame = requestAnimationFrame(draw);
      }
    };
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    if (!mobile) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="data-engine" data-hero-depth aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="data-core">
        <span />
        <span />
        <span />
        <b>TF</b>
      </div>
      <div className="data-panel panel-one">INGEST / 01</div>
      <div className="data-panel panel-two">MODEL / 02</div>
      <div className="data-panel panel-three">ACT / 03</div>
    </div>
  );
}
