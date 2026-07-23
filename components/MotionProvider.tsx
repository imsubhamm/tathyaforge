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

      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      const cameraStory = document.querySelector("[data-camera-story]");
      if (cameraStory && desktop) {
        const panels = gsap.utils.toArray<HTMLElement>("[data-camera-panel]");
        gsap.set(panels, {
          autoAlpha: 0,
          yPercent: 6,
          clipPath: "inset(100% 0% 0% 0% round 22px)",
          transformOrigin: "center center",
        });
        gsap.set(panels[0], {
          autoAlpha: 1,
          yPercent: 0,
          clipPath: "inset(0% 0% 0% 0% round 22px)",
          zIndex: 3,
        });

        const cameraTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: cameraStory,
            start: "top top",
            end: "+=3800",
            pin: ".camera-stage",
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cameraTimeline
          .to("[data-camera-progress]", {
            scaleY: 0.34,
            transformOrigin: "top",
            duration: 1.25,
            ease: "none",
          }, 0)
          .set(panels[1], {
            autoAlpha: 1,
            zIndex: 4,
            yPercent: 6,
            clipPath: "inset(100% 0% 0% 0% round 22px)",
          }, 1.25)
          .to(panels[1], {
            yPercent: 0,
            clipPath: "inset(0% 0% 0% 0% round 22px)",
            duration: 0.72,
            ease: "power2.inOut",
          }, 1.25)
          .set(panels[0], { autoAlpha: 0, zIndex: 1 }, 1.97)
          .set(panels[1], { zIndex: 3 }, 1.97)
          .to("[data-camera-world]", {
            rotateY: -2.5,
            duration: 0.72,
            ease: "sine.inOut",
          }, 1.25)
          .to("[data-camera-progress]", {
            scaleY: 0.67,
            duration: 1.25,
            ease: "none",
          }, 1.97)
          .set(panels[2], {
            autoAlpha: 1,
            zIndex: 4,
            yPercent: 6,
            clipPath: "inset(100% 0% 0% 0% round 22px)",
          }, 3.22)
          .to(panels[2], {
            yPercent: 0,
            clipPath: "inset(0% 0% 0% 0% round 22px)",
            duration: 0.72,
            ease: "power2.inOut",
          }, 3.22)
          .set(panels[1], { autoAlpha: 0, zIndex: 1 }, 3.94)
          .set(panels[2], { zIndex: 3 }, 3.94)
          .to("[data-camera-world]", {
            rotateY: 2.5,
            duration: 0.72,
            ease: "sine.inOut",
          }, 3.22)
          .to("[data-camera-progress]", {
            scaleY: 1,
            duration: 1.25,
            ease: "none",
          }, 3.94)
          .to(panels[2], {
            scale: 1.025,
            duration: 0.45,
            ease: "power2.out",
          }, 5.19);
      } else if (cameraStory) {
        gsap.from("[data-camera-panel]", {
          y: 45,
          opacity: 0,
          stagger: 0.12,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: cameraStory, start: "top 82%", once: true },
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
