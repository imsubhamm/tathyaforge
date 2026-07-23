"use client";

import { PointerEvent, useEffect, useRef } from "react";

type ServiceCardProps = {
  title: string;
  summary: string;
};

export function ServiceCard({ title, summary }: ServiceCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const updateTilt = () => {
    frameRef.current = 0;
    const card = cardRef.current;
    if (!card) return;
    const { x, y } = pointerRef.current;
    card.style.setProperty("--pointer-x", `${x * 100}%`);
    card.style.setProperty("--pointer-y", `${y * 100}%`);
    card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg) translateY(-4px)`;
  };

  const onEnter = () => {
    rectRef.current = cardRef.current?.getBoundingClientRect() ?? null;
  };

  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)").matches) return;
    const rect = rectRef.current;
    if (!rect) return;
    pointerRef.current = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
    if (!frameRef.current) frameRef.current = requestAnimationFrame(updateTilt);
  };
  const onLeave = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    rectRef.current = null;
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <article ref={cardRef} onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave} className="service-card surface rounded-xl p-6">
      <div className="mb-5 h-1 w-12 rounded-full bg-amber-300" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{summary}</p>
    </article>
  );
}
