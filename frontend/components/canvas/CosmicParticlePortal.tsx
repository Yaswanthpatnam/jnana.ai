"use client";

/**
 * =============================================================================
 * jnana.ai — Universal Responsive 3D Vector Particle Portal (Landing Page)
 * =============================================================================
 * 
 * CORE RESPONSIBILITY:
 * Renders a full-screen, ultra-polished 3D WebGL particle portal on a pristine
 * white background, fully responsive across ALL aspect ratios:
 * - Mobile Phones (Pixel 9 Pro, iPhone SE/16, Galaxy S-series, portrait ~ 9:19 to 9:21)
 * - Narrow Foldables (Galaxy Fold cover ~ 9:23)
 * - Tablets (iPad, iPad Mini, iPad Pro in portrait & landscape)
 * - Laptops (16:10), Desktops (16:9), and Ultrawides (21:9, 32:9).
 * 
 * UNIVERSAL RESPONSIVE FRAMING MATHEMATICS:
 * Dynamically computes the exact camera distance Z for any aspect ratio A = W/H:
 *   Z_k(A) = max( h_k / fill_h, w_k / (fill_w * A) ) / (2 * tan(FOV / 2))
 * This guarantees:
 * - On Mobile: Exactly 14% white space margin on left & right, 28-40% margin on top & bottom.
 * - On Desktop: 25-40% white space margin on left & right, 23% margin on top & bottom.
 * - ZERO horizontal cropping or vertical clipping of ANY manifestation.
 * 
 * 4 MANIFESTATION STAGES:
 * 1. The Sacred Flute & Peacock Feather (Bansuri & Mayura Pichha) — Initial View
 * 2. Sri Krishna in Cosmic Nataraja / Yoga Stance
 * 3. Sri Krishna with the Extended Hand (Abhaya Mudra)
 * 4. The Bodhana of Kurukshetra (Arjuna kneeling before Krishna)
 * =============================================================================
 */

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import vectorDataset from "@/public/particles/scenes_3d_vectors.json";
import JnanaChat from "@/components/chat/JnanaChat";
import AboutModal from "@/components/about/AboutModal";



interface FormationStageContent {
  idx: number;
  badge: string;
  headline: string;
  subtext: string;
  showCta?: boolean;
}

const FORMATION_STAGES: FormationStageContent[] = [
  {
    idx: 0,
    badge: "YOUR SACRED COMPANION",
    headline: "When life feels like a battlefield, talk with Krishna.",
    subtext: "Share your worries, doubts, and hard decisions. A safe, peaceful space to find clarity.",
  },
  {
    idx: 1,
    badge: "A PURPOSEFUL CHOICE",
    headline: "Made for your peace of mind, not for daily noise.",
    subtext: "We chose not to write code or answer trivia. This space is kept quiet strictly for your life and inner calm.",
  },
  {
    idx: 2,
    badge: "PURE TRUTH · ZERO GUESSWORK",
    headline: "Guidance you can trust — zero guesswork, only truth.",
    subtext: "Every answer comes straight from sacred scripture. Nothing is invented or made up.",
  },
  {
    idx: 3,
    badge: "701 SACRED VERSES",
    headline: "The timeless Gita, ready for your life today.",
    subtext: "Grounded in all 701 verses. Step into the chariot and speak directly with Krishna.",
    showCta: true,
  },
];

/**
 * Word component with interactive golden radiance on hover.
 */
function GlowingWord({ word }: { word: string }) {
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
  const isAccent =
    clean === "krishna" ||
    clean === "truth" ||
    clean === "701" ||
    clean === "zero" ||
    clean === "peace" ||
    clean === "gita";

  return (
    <span
      className={`inline-block transition-all duration-300 cursor-pointer select-none relative hover:text-[#9A6A15] hover:-translate-y-0.5 hover:scale-[1.02] ${
        isAccent ? "text-[#9A6A15] font-semibold" : ""
      }`}
      onMouseEnter={(e) => {
        e.currentTarget.style.textShadow = "0 0 16px rgba(212, 160, 52, 0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textShadow = "none";
      }}
    >
      {word}&nbsp;
    </span>
  );
}

function InteractiveSentence({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <GlowingWord key={i} word={w} />
      ))}
    </span>
  );
}

export default function CosmicParticlePortal() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0); // Normalized scroll: 0.0 to 3.0
  const [activeStage, setActiveStage] = useState(1);       // 1: Flute, 2: Cosmic, 3: Hand, 4: Bodhana
  const [isTouchDevice] = useState(
    () =>
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Performance ref: pause WebGL render loop when modal or chat overlay is open
  const isOverlayOpenRef = useRef(false);
  useEffect(() => {
    isOverlayOpenRef.current = isAboutOpen || isChatOpen;
  }, [isAboutOpen, isChatOpen]);



  // Scrubber bar interaction references
  const barRef = useRef<HTMLDivElement>(null);
  const isDraggingBar = useRef(false);

  const updateScrollFromPointer = (clientX: number) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const targetVal = ratio * 3.0;
    scrollRef.current.target = targetVal;
    scrollRef.current.current = targetVal;
  };

  const handleBarPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDraggingBar.current = true;
    updateScrollFromPointer(e.clientX);

    const onPointerMove = (ev: PointerEvent) => {
      if (isDraggingBar.current) {
        updateScrollFromPointer(ev.clientX);
      }
    };

    const onPointerUp = () => {
      isDraggingBar.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  // Smooth momentum scroll tracking
  const scrollRef = useRef({
    current: 0,
    target: 0,
    max: 3.0,
  });

  // Mouse / cursor parallax coordinates
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  /**
   * Helper function to jump directly to any of the 4 stages when a HUD pill is clicked.
   */
  const jumpToStage = (stageNum: number) => {
    const targets: Record<number, number> = {
      1: 0.0,
      2: 1.0,
      3: 2.0,
      4: 3.0,
    };
    if (targets[stageNum] !== undefined) {
      scrollRef.current.target = targets[stageNum];
    }
  };

  useEffect(() => {
    // Expose helpers on window for automated verification and test harnesses
    if (typeof window !== "undefined") {
      const win = window as unknown as {
        jumpToStage?: (s: number) => void;
        setScroll?: (v: number) => void;
      };
      win.jumpToStage = jumpToStage;
      win.setScroll = (val: number) => {
        scrollRef.current.current = val;
        scrollRef.current.target = val;
      };
    }


    const currentMount = mountRef.current;
    if (!currentMount) return;

    let isMounted = true;
    let animId: number;

    // Viewport dimensions
    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;


    // -------------------------------------------------------------------------
    // 1. THREE.JS SCENE, PERSPECTIVE CAMERA, AND WEBGL RENDERER
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene();

    const FOV_VERT = 46;
    const TAN_HALF_FOV = Math.tan((FOV_VERT / 2) * (Math.PI / 180));

    const camera = new THREE.PerspectiveCamera(FOV_VERT, width / height, 0.1, 150);
    camera.position.set(0, 0, 11.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 1.0); // Pristine radiant white background

    currentMount.innerHTML = "";
    currentMount.appendChild(renderer.domElement);


    // -------------------------------------------------------------------------
    // 2. SCENE LIGHTING
    // -------------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // -------------------------------------------------------------------------
    // 3. SOLID ROUND CIRCLE CANVAS TEXTURE
    // -------------------------------------------------------------------------
    const createRoundSprite = () => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext("2d")!;
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      grad.addColorStop(0.78, "rgba(255, 255, 255, 1.0)"); // Solid round core
      grad.addColorStop(0.96, "rgba(255, 255, 255, 0.35)"); // Smooth antialiased border
      grad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(pCanvas);
    };

    const roundTexture = createRoundSprite();

    // -------------------------------------------------------------------------
    // 4. AMBIENT FLOATING ROUND CELESTIAL DUST
    // -------------------------------------------------------------------------
    const ambientCount = 650;
    const ambientGeo = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientColors = new Float32Array(ambientCount * 3);

    const palette = [
      new THREE.Color(0xd4af37), // Sacred gold
      new THREE.Color(0x2e8b57), // Peacock jade
      new THREE.Color(0x40b5ad), // Turquoise
      new THREE.Color(0xb87333), // Burnished copper
    ];

    for (let i = 0; i < ambientCount; i++) {
      ambientPositions[i * 3] = (Math.random() - 0.5) * 26.0;
      ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * 20.0;
      ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * 16.0 - 2.0;

      const col = palette[Math.floor(Math.random() * palette.length)];
      ambientColors[i * 3] = col.r;
      ambientColors[i * 3 + 1] = col.g;
      ambientColors[i * 3 + 2] = col.b;
    }
    ambientGeo.setAttribute("position", new THREE.BufferAttribute(ambientPositions, 3));
    ambientGeo.setAttribute("color", new THREE.BufferAttribute(ambientColors, 3));

    const ambientMat = new THREE.PointsMaterial({
      size: 0.085,
      map: roundTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.52,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    const ambientDust = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientDust);

    // -------------------------------------------------------------------------
    // 5. 10,000 3D VECTOR PARTICLES (Synchronously Bundled)
    // -------------------------------------------------------------------------
    const count = vectorDataset.particle_count;
    const stride = vectorDataset.stride; // 6: [x, y, z, r, g, b]

    const parseScene = (rawList: number[]) => {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = rawList[i * stride];
        positions[i * 3 + 1] = rawList[i * stride + 1];
        positions[i * 3 + 2] = rawList[i * stride + 2];

        colors[i * 3] = rawList[i * stride + 3];
        colors[i * 3 + 1] = rawList[i * stride + 4];
        colors[i * 3 + 2] = rawList[i * stride + 5];
      }
      return { positions, colors };
    };

    const fluteScene = parseScene(vectorDataset.scenes.flute_feather);
    const cosmicScene = parseScene(vectorDataset.scenes.cosmic);
    const handScene = parseScene(vectorDataset.scenes.hand);
    const bodhanaScene = parseScene(vectorDataset.scenes.bodhana);

    // Full-screen widescreen dispersion deltas
    const burstDeltas = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const spreadX = (Math.random() - 0.5) * 18.0;
      const spreadY = (Math.random() - 0.5) * 14.0;
      const spreadZ = (Math.random() - 0.5) * 6.0;

      burstDeltas[i * 3] = spreadX + Math.cos(theta) * 2.5;
      burstDeltas[i * 3 + 1] = spreadY + Math.sin(theta) * 2.5;
      burstDeltas[i * 3 + 2] = spreadZ;
    }

    const sceneCoords = {
      flute: fluteScene.positions,
      cosmic: cosmicScene.positions,
      hand: handScene.positions,
      bodhana: bodhanaScene.positions,
      burstDeltas,
      colorsFlute: fluteScene.colors,
      colorsCosmic: cosmicScene.colors,
      colorsHand: handScene.colors,
      colorsBodhana: bodhanaScene.colors,
    };

    const geo = new THREE.BufferGeometry();
    const currentPos = new Float32Array(fluteScene.positions);
    const currentCol = new Float32Array(fluteScene.colors);

    const particlePosAttr = new THREE.BufferAttribute(currentPos, 3);
    const particleColorAttr = new THREE.BufferAttribute(currentCol, 3);

    geo.setAttribute("position", particlePosAttr);
    geo.setAttribute("color", particleColorAttr);

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: roundTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const mainParticles = new THREE.Points(geo, particleMat);
    scene.add(mainParticles);

    // -------------------------------------------------------------------------
    // 6. EXACT STAGE BOUNDING DIMENSIONS & RESPONSIVE CAMERA CALCULATION
    // -------------------------------------------------------------------------
    const STAGE_DIMS = [
      { w: 5.30, h: 5.34 }, // 0: Flute & Feather (Square)
      { w: 4.31, h: 5.40 }, // 1: Cosmic Stance (Tall Portrait)
      { w: 3.83, h: 5.33 }, // 2: Extended Hand (Tall Portrait)
      { w: 9.07, h: 5.40 }, // 3: Bodhana (Widescreen Landscape)
    ];

    /**
     * Mathematically guarantees that for ANY aspect ratio, the figure fits
     * with generous, luxurious white space padding around it:
     * - On Desktop: Leaves ~23% margin top/bottom and 25-40% margin left/right.
     * - On Mobile: Leaves ~28-40% margin top/bottom and 14% margin left/right.
     */
    const computeStageZ = (stageIdx: number, aspect: number): number => {
      const { w, h } = STAGE_DIMS[stageIdx];
      const isPortrait = aspect < 1.0;
      
      // Compact vertical framing to guarantee 35%+ unobstructed white space for text at the top
      const fillH = isPortrait ? 0.38 : 0.38;
      const fillW = isPortrait ? 0.68 : 0.52;

      const reqH_fromH = h / fillH;
      const reqH_fromW = w / (fillW * aspect);
      const reqH = Math.max(reqH_fromH, reqH_fromW);

      return reqH / (2 * TAN_HALF_FOV);
    };

    // -------------------------------------------------------------------------
    // 7. INPUT LISTENERS: NATURAL TRACKPAD & TOUCH GESTURES
    // -------------------------------------------------------------------------
    const onWheel = (e: WheelEvent) => {
      if (isOverlayOpenRef.current) return;
      const delta = e.deltaY * 0.0009;
      scrollRef.current.target = Math.min(
        Math.max(scrollRef.current.target + delta, 0),
        scrollRef.current.max
      );
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (isOverlayOpenRef.current) return;
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isOverlayOpenRef.current) return;
      if (e.touches.length > 0) {
        const touchY = e.touches[0].clientY;
        const delta = (touchStartY - touchY) * 0.0035;
        touchStartY = touchY;
        scrollRef.current.target = Math.min(
          Math.max(scrollRef.current.target + delta, 0),
          scrollRef.current.max
        );
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isOverlayOpenRef.current) return;
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 1.5;
    };


    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth || window.innerWidth;
      const h = mountRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    // -------------------------------------------------------------------------
    // 8. MASTER ANIMATION & MORPHING LOOP (60 FPS)
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isMounted) return;
      animId = requestAnimationFrame(animate);

      // If About modal or Chat overlay is active, pause heavy WebGL frame computing & rendering
      // to preserve 120 FPS / 60 FPS silky smooth UI interaction
      if (isOverlayOpenRef.current) {
        return;
      }


      const time = clock.getElapsedTime();


      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Smooth scroll lerp (momentum)
      scrollRef.current.current +=
        (scrollRef.current.target - scrollRef.current.current) * 0.065;
      const t = scrollRef.current.current;
      setScrollProgress(t);

      // Determine active stage for UI HUD
      if (t < 0.65) setActiveStage(1);
      else if (t < 1.65) setActiveStage(2);
      else if (t < 2.5) setActiveStage(3);
      else setActiveStage(4);

      // Ambient dust drift
      ambientDust.rotation.y = time * 0.015;
      ambientDust.rotation.x = Math.sin(time * 0.01) * 0.03;

      // -----------------------------------------------------------------------
      // UNIVERSAL RESPONSIVE CAMERA FRAMING DYNAMICS
      // -----------------------------------------------------------------------
      const currentAspect = camera.aspect;
      const z1 = computeStageZ(0, currentAspect);
      const z2 = computeStageZ(1, currentAspect);
      const z3 = computeStageZ(2, currentAspect);
      const z4 = computeStageZ(3, currentAspect);

      let targetBaseZ = z1;
      let splash = 0;

      const posArray = particlePosAttr.array as Float32Array;
      const colArray = particleColorAttr.array as Float32Array;

      // STAGE 1 -> STAGE 2 (t in [0.0, 1.0])
      if (t <= 1.0) {
        const factor = t;
        targetBaseZ = THREE.MathUtils.lerp(z1, z2, factor);
        splash = Math.sin(factor * Math.PI) * 1.5;

        const from = sceneCoords.flute;
        const to = sceneCoords.cosmic;
        const fromCol = sceneCoords.colorsFlute;
        const toCol = sceneCoords.colorsCosmic;
        const burst = sceneCoords.burstDeltas;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          posArray[i3] =
            THREE.MathUtils.lerp(from[i3], to[i3], factor) + burst[i3] * splash * 0.38;
          posArray[i3 + 1] =
            THREE.MathUtils.lerp(from[i3 + 1], to[i3 + 1], factor) +
            burst[i3 + 1] * splash * 0.38;
          posArray[i3 + 2] =
            THREE.MathUtils.lerp(from[i3 + 2], to[i3 + 2], factor) +
            burst[i3 + 2] * splash * 0.38;

          colArray[i3] = THREE.MathUtils.lerp(fromCol[i3], toCol[i3], factor);
          colArray[i3 + 1] = THREE.MathUtils.lerp(fromCol[i3 + 1], toCol[i3 + 1], factor);
          colArray[i3 + 2] = THREE.MathUtils.lerp(fromCol[i3 + 2], toCol[i3 + 2], factor);
        }
      }
      // STAGE 2 -> STAGE 3 (t in [1.0, 2.0])
      else if (t <= 2.0) {
        const factor = t - 1.0;
        targetBaseZ = THREE.MathUtils.lerp(z2, z3, factor);
        splash = Math.sin(factor * Math.PI) * 1.6;

        const from = sceneCoords.cosmic;
        const to = sceneCoords.hand;
        const fromCol = sceneCoords.colorsCosmic;
        const toCol = sceneCoords.colorsHand;
        const burst = sceneCoords.burstDeltas;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          posArray[i3] =
            THREE.MathUtils.lerp(from[i3], to[i3], factor) + burst[i3] * splash * 0.40;
          posArray[i3 + 1] =
            THREE.MathUtils.lerp(from[i3 + 1], to[i3 + 1], factor) +
            burst[i3 + 1] * splash * 0.40;
          posArray[i3 + 2] =
            THREE.MathUtils.lerp(from[i3 + 2], to[i3 + 2], factor) +
            burst[i3 + 2] * splash * 0.40;

          colArray[i3] = THREE.MathUtils.lerp(fromCol[i3], toCol[i3], factor);
          colArray[i3 + 1] = THREE.MathUtils.lerp(fromCol[i3 + 1], toCol[i3 + 1], factor);
          colArray[i3 + 2] = THREE.MathUtils.lerp(fromCol[i3 + 2], toCol[i3 + 2], factor);
        }
      }
      // STAGE 3 -> STAGE 4 (t in [2.0, 3.0])
      else {
        const factor = t - 2.0;
        targetBaseZ = THREE.MathUtils.lerp(z3, z4, factor);
        splash = Math.sin(factor * Math.PI) * 1.45;

        const from = sceneCoords.hand;
        const to = sceneCoords.bodhana;
        const fromCol = sceneCoords.colorsHand;
        const toCol = sceneCoords.colorsBodhana;
        const burst = sceneCoords.burstDeltas;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          posArray[i3] =
            THREE.MathUtils.lerp(from[i3], to[i3], factor) + burst[i3] * splash * 0.36;
          posArray[i3 + 1] =
            THREE.MathUtils.lerp(from[i3 + 1], to[i3 + 1], factor) +
            burst[i3 + 1] * splash * 0.36;
          posArray[i3 + 2] =
            THREE.MathUtils.lerp(from[i3 + 2], to[i3 + 2], factor) +
            burst[i3 + 2] * splash * 0.36;

          colArray[i3] = THREE.MathUtils.lerp(fromCol[i3], toCol[i3], factor);
          colArray[i3 + 1] = THREE.MathUtils.lerp(fromCol[i3 + 1], toCol[i3 + 1], factor);
          colArray[i3 + 2] = THREE.MathUtils.lerp(fromCol[i3 + 2], toCol[i3 + 2], factor);
        }
      }

      // Dynamic camera elevation: positions the 3D figures in the 38%-75% vertical zone,
      // creating an untouchable 35%+ pure white space buffer for the headline & text at the top.
      const isPortrait = currentAspect < 1.0;
      const stageCamY = isPortrait
        ? [0.52, 0.65, 0.65, 0.70]
        : [0.46, 0.58, 0.58, 0.65];

      let targetCamY = stageCamY[0];
      if (t < 1.0) {
        targetCamY = THREE.MathUtils.lerp(stageCamY[0], stageCamY[1], t);
      } else if (t < 2.0) {
        targetCamY = THREE.MathUtils.lerp(stageCamY[1], stageCamY[2], t - 1.0);
      } else {
        targetCamY = THREE.MathUtils.lerp(stageCamY[2], stageCamY[3], t - 2.0);
      }

      camera.position.x = mouseRef.current.x * 0.2;
      camera.position.y = targetCamY + mouseRef.current.y * 0.2;
      camera.position.z = targetBaseZ;

      // Scale particle size dynamically with camera distance Z so particles remain
      // crisp, lush, and visible without shrinking to pinpricks or blowing up
      const zRef = 11.6;
      const dynamicSize = 0.11 * (targetBaseZ / zRef);
      particleMat.size = Math.min(Math.max(dynamicSize, 0.09), 0.35);

      particlePosAttr.needsUpdate = true;
      particleColorAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------------------
    // 9. CLEANUP LIFECYCLE
    // -------------------------------------------------------------------------
    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };

  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-white">
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Responsive Minimal Sacred Logo & Watermark */}
      <div className="absolute top-3.5 left-4 sm:top-6 sm:left-8 z-10 pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white border border-[#D4A034]/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="jnana.ai Sacred Flute and Peacock Feather Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-serif text-xs sm:text-lg tracking-[0.22em] sm:tracking-[0.3em] font-semibold uppercase text-[#1C1A17]">
              jnana<span className="text-[#9A6A15]">.ai</span>
            </span>
          </div>
        </div>
      </div>

      {/* Top Right Header Actions: About & Speak with Krishna */}
      <div className="absolute top-3.5 right-3 sm:top-6 sm:right-8 z-10 pointer-events-auto flex items-center gap-1.5 sm:gap-3">
        <button
          type="button"
          onClick={() => setIsAboutOpen(true)}
          className="inline-flex items-center px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E2D9C8] hover:border-[#D4A034] text-[#5A5042] hover:text-[#9A6A15] font-serif text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.14em] uppercase font-semibold transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-sm shrink-0"
        >
          About
        </button>
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#D4A034]/60 shadow-2xs hover:shadow-sm hover:border-[#9A6A15] text-[#7A4E0B] font-serif text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.16em] uppercase font-semibold transition-all duration-300 cursor-pointer group shrink-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#9A6A15] animate-pulse shrink-0" />
          <span>Speak<span className="hidden sm:inline"> with Krishna</span></span>
          <span className="text-xs group-hover:translate-x-0.5 transition-transform font-sans">→</span>
        </button>
      </div>

      {/* 4 Manifestation Stages: Synchronized Formation Wisdom */}
      {FORMATION_STAGES.map((st) => {
        const dist = Math.abs(scrollProgress - st.idx);
        // Mathematical opacity window: fades out when dist > 0.22, full at 0
        const opacity = Math.max(0, Math.min(1, 1 - dist / 0.22));
        const translateY = (1 - opacity) * 14;

        if (opacity <= 0.001) return null;

        return (
          <div
            key={st.idx}
            className="absolute top-15 sm:top-16 md:top-20 left-0 right-0 mx-auto w-full max-w-xl md:max-w-2xl px-4 sm:px-8 text-center z-10 pointer-events-none transition-transform duration-100 ease-out"
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
            }}
          >
            {/* Domain Kicker Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/92 backdrop-blur-md border border-[#E5DECE] shadow-2xs mb-1.5 sm:mb-2 pointer-events-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A6A15] animate-pulse" />
              <span className="font-serif text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-[#7A4E0B] font-semibold">
                {st.badge}
              </span>
            </div>

            {/* Core One-Liner Headline */}
            <h2 className="font-serif text-[13.5px] sm:text-xl md:text-2xl font-medium sm:font-semibold text-[#1F1D1A] leading-snug tracking-[0.015em] mb-1 sm:mb-2 max-w-[320px] sm:max-w-xl mx-auto pointer-events-auto">
              <InteractiveSentence text={st.headline} />
            </h2>

            {/* Sub-Content (Plus Jakarta Sans - previous font) */}
            <p className="font-sans text-[10.5px] sm:text-sm text-[#554D42] leading-relaxed max-w-[280px] sm:max-w-lg mx-auto pointer-events-auto">
              <InteractiveSentence text={st.subtext} />
            </p>

            {/* Optional CTA Button for Stage 4 */}
            {st.showCta && (
              <div className="mt-2.5 sm:mt-3.5 pointer-events-auto">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#9A6A15] via-[#B68424] to-[#9A6A15] text-white font-serif text-[10px] sm:text-xs tracking-[0.16em] sm:tracking-[0.18em] font-semibold uppercase shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <span>Talk with Krishna</span>
                  <span className="text-xs sm:text-sm font-sans">→</span>
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Responsive Bottom Navigation & Stage Progress HUD */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-auto pb-[env(safe-area-inset-bottom)] max-w-[95vw]">
        {/* Stage Indicator Pills (Clickable to jump directly to any manifestation - NO Roman numerals) */}
        <div className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border bg-white/92 backdrop-blur-md border-[#E5E0D5]/90 shadow-sm overflow-hidden">
          {[
            { num: 1, label: "The Divine Flute", short: "Flute" },
            { num: 2, label: "Cosmic Stance", short: "Cosmic" },
            { num: 3, label: "The Extended Hand", short: "Hand" },
            { num: 4, label: "The Bodhana", short: "Bodhana" },
          ].map((st) => (
            <button
              key={st.num}
              onClick={() => jumpToStage(st.num)}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-0.5 rounded-full font-mono cursor-pointer transition-all duration-300 shrink-0 ${
                activeStage === st.num
                  ? "bg-[#9A6A15]/15 text-[#7A4E0B] border border-[#9A6A15]/40 font-semibold shadow-xs"
                  : "text-[#8C8477] border border-transparent hover:text-[#524B40]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  activeStage === st.num ? "bg-[#9A6A15] scale-125 animate-pulse" : "bg-[#C4BDAD]"
                }`}
              />
              {/* Full label on desktop, clean short label when active on mobile (zero Roman numbers) */}
              <span className="hidden sm:inline text-[11px]">{st.label}</span>
              <span className="inline sm:hidden text-[10px]">
                {activeStage === st.num ? st.short : ""}
              </span>
            </button>
          ))}
        </div>

        {/* Movable Interactive Scrubber Bar (Drag or tap anywhere to select individual scenes) */}
        <div
          ref={barRef}
          onPointerDown={handleBarPointerDown}
          className="relative w-44 sm:w-56 h-7 flex items-center cursor-pointer select-none touch-none py-2"
          title="Drag bar to select scenes"
        >
          {/* Track background */}
          <div className="w-full h-1.5 rounded-full bg-[#E8E2D5] border border-[#D9D1C1]/60 relative">
            {/* Active gold fill */}
            <div
              className="h-full bg-gradient-to-r from-[#D7A432] via-[#F3CA65] to-[#E5A93C] rounded-full pointer-events-none"
              style={{ width: `${(scrollProgress / 3.0) * 100}%` }}
            />

            {/* 4 Scene Snap Marker Dots (Clickable to jump directly to any scene) */}
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToStage(idx + 1);
                }}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
                  scrollProgress >= idx - 0.15 && scrollProgress <= idx + 0.15
                    ? "bg-[#9A6A15] border-white scale-125 shadow-xs"
                    : "bg-[#D5CEBF] border-white hover:bg-[#B5AD9E]"
                }`}
                style={{ left: `${(idx / 3.0) * 100}%` }}
                title={`Scene ${idx + 1}`}
              />
            ))}

            {/* Movable Golden Thumb / Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#9A6A15] shadow-md pointer-events-none transition-transform active:scale-125"
              style={{ left: `${(scrollProgress / 3.0) * 100}%` }}
            />
          </div>
        </div>

        {/* Dynamic Context-Aware Guidance */}
        <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-mono text-[#7A7264] text-center px-4">
          {scrollProgress < 2.9
            ? isTouchDevice
              ? "Drag bar or swipe to journey"
              : "Drag bar or scroll to journey"
            : "The Sacred Dialogue Awaits"}
        </span>
      </div>

      {/* About Modal Overlay */}
      {isAboutOpen && (
        <AboutModal
          onClose={() => setIsAboutOpen(false)}
          onOpenChat={() => {
            setIsAboutOpen(false);
            setIsChatOpen(true);
          }}
        />
      )}

      {/* Sacred Chat Dialogue Overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
          <JnanaChat onClose={() => setIsChatOpen(false)} isOverlay={true} />
        </div>
      )}


    </div>
  );
}
