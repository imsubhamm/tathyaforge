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

      const story = document.querySelector("[data-story]");
      if (story) {
        const storyTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: story,
            start: "top 78%",
            toggleActions: "play none none none",
            once: true,
          },
        });
        storyTimeline
          .from("[data-story-line]", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
            ease: "power2.inOut",
          })
          .from(".story-node", {
            y: 70,
            z: -120,
            rotateX: 8,
            opacity: 0,
            stagger: 0.18,
            duration: 0.9,
            ease: "power2.out",
          }, 0);
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
