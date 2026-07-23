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
          z: -120,
          yPercent: 8,
          rotateX: 3,
          scale: 0.985,
          transformOrigin: "center center",
        });
        gsap.set(panels[0], {
          autoAlpha: 1,
          z: 0,
          yPercent: 0,
          rotateX: 0,
          scale: 1,
          zIndex: 3,
        });

        const cameraTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: cameraStory,
            start: "top top",
            end: "+=2400",
            pin: ".camera-stage",
            scrub: 0.35,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cameraTimeline
          .to("[data-camera-progress]", {
            scaleY: 0.34,
            transformOrigin: "top",
            duration: 0.72,
            ease: "none",
          }, 0)
          .to(panels[0], {
            autoAlpha: 0,
            z: 260,
            yPercent: -22,
            rotateX: -7,
            scale: 1.025,
            duration: 0.22,
            ease: "power2.in",
          }, 0.72)
          .set(panels[0], { zIndex: 1 }, 0.94)
          .set(panels[1], { zIndex: 3 }, 0.94)
          .to(panels[1], {
            autoAlpha: 1,
            z: 0,
            yPercent: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.22,
            ease: "power3.out",
          }, 0.94)
          .to("[data-camera-world]", {
            rotateY: -2.5,
            duration: 0.44,
            ease: "sine.inOut",
          }, 0.94)
          .to("[data-camera-progress]", {
            scaleY: 0.67,
            duration: 0.72,
            ease: "none",
          }, 1.16)
          .to(panels[1], {
            autoAlpha: 0,
            z: 260,
            yPercent: -22,
            rotateX: -7,
            scale: 1.025,
            duration: 0.22,
            ease: "power2.in",
          }, 1.88)
          .set(panels[1], { zIndex: 1 }, 2.1)
          .set(panels[2], { zIndex: 3 }, 2.1)
          .to(panels[2], {
            autoAlpha: 1,
            z: 0,
            yPercent: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.22,
            ease: "power3.out",
          }, 2.1)
          .to("[data-camera-world]", {
            rotateY: 2.5,
            duration: 0.44,
            ease: "sine.inOut",
          }, 2.1)
          .to("[data-camera-progress]", {
            scaleY: 1,
            duration: 0.72,
            ease: "none",
          }, 2.32)
          .to(panels[2], {
            scale: 1.025,
            duration: 0.3,
            ease: "power2.out",
          }, 3.04);
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
