"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MotionProvider() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.from("[data-nav]", { y: -22, opacity: 0, duration: 0.75, ease: "power3.out" });
      gsap.from("[data-hero-reveal]", {
        yPercent: 110,
        opacity: 0,
        stagger: 0.11,
        duration: 1,
        ease: "power4.out",
        delay: 0.1,
      });
      gsap.from("[data-hero-copy]", {
        y: 24,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: "power3.out",
        delay: 0.55,
      });
      gsap.to("[data-hero-depth]", {
        yPercent: 8,
        scale: 0.97,
        opacity: 0.72,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top -2%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      gsap.from(".ai-system", {
        rotateY: -14,
        rotateX: 7,
        z: -180,
        scale: 0.84,
        opacity: 0,
        duration: 1.25,
        delay: 0.35,
        ease: "power4.out",
      });

      const cameraStory = document.querySelector("[data-camera-story]");
      if (cameraStory) {
        const panels = gsap.utils.toArray<HTMLElement>("[data-camera-panel]");
        panels.forEach((panel) => {
          gsap.from(panel, {
            y: 72,
            rotateX: 5,
            scale: 0.965,
            opacity: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 88%",
              once: true,
            },
          });
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 38,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.from(group.children, {
          y: 45,
          rotateX: 7,
          scale: 0.97,
          opacity: 0,
          stagger: 0.09,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 84%", once: true },
        });
      });
    });

    return () => {
      context.revert();
    };
  }, []);

  return null;
}
