import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import Typed from "typed.js";

import "./App.css";
import { TerminalOverlay } from "./components/ui/TerminalOverlay.jsx";
import { ErrorBoundary } from "./components/ui/ErrorBoundary.jsx";

const HeroScene = lazy(() => import("./components/scene/HeroScene.jsx"));

export default function App() {
  const [isHuman, setIsHuman] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [logs, setLogs] = useState(["[SYS] Initializing core..."]);

  const typedEl = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedEl.current, {
      strings: [
        "I am a Software Developer...",
        "^400 No wait... a Full Stack Developer...",
        "^400 Actually... a Cloud Architect...",
        "^400 Uhh... DevOps Engineer?",
        "^400 Honestly... a professional bug creator...",
        `^800 Ugh, never mind. <br> <span class="warm">I'm a human being.</span>`,
      ],
      typeSpeed: 40,
      backSpeed: 30,
      onStringTyped: (pos) => {
        if (pos < 4) {
          setGlitch(true);
          setTimeout(() => setGlitch(false), 300);
          setLogs((prev) => [
            ...prev.slice(-4),
            `[ERR] mismatch_at_index_${pos}`,
          ]);
        }

        if (pos === 5) {
          setIsHuman(true);
          setLogs((prev) => [...prev, "[OK] Bio-signature match found."]);
        }
      },
    });
    console.log("typed initialized");
    return () => typed.destroy();
  }, []);

  return (
    <div className={`page ${isHuman ? "is-human" : ""}`}>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <HeroScene isHuman={isHuman} glitch={glitch} />
        </Suspense>
      </ErrorBoundary>

      <TerminalOverlay logs={logs} />
      <div className="grid" />

      <div className="container">
        <span ref={typedEl} id="typed" />
        <div className="status-bar">
          <div className="scanline-bar" />
          {isHuman ? "IDENTITY: VERIFIED HUMAN" : "SCANNING BIOMETRICS..."}
        </div>
        <button className="enter-btn">View My Work</button>
      </div>
    </div>
  );
}
