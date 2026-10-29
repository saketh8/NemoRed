"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";

const stages = [
  {
    name: "Probe",
    line: "Five specialists. Every angle.",
    detail: "Challenge the boundaries of your agent.",
  },
  {
    name: "Inspect",
    line: "See exactly what happened.",
    detail: "Follow the payload, response, and verdict.",
  },
  {
    name: "Harden",
    line: "A better defense starts here.",
    detail: "Patch the prompt. Replay the test.",
  },
];

export function Experience({
  onSample,
  disabled,
}: {
  onSample: () => void;
  disabled: boolean;
}) {
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const sculpture = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (paused || reduced) return;
    const timer = setInterval(() => {
      if (
        !document.hidden &&
        (section.current?.getBoundingClientRect().bottom || 0) > 0
      )
        setStage((s) => (s + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, reduced]);
  function selectStage(value: number) {
    setStage(value);
    setPaused(true);
  }
  return (
    <section
      id="overview"
      ref={section}
      className={`product-experience ${paused || reduced ? "motion-paused" : ""}`}
    >
      <nav className="product-nav" aria-label="Main navigation">
        <a className="wordmark" href="#overview">
          NEMO <span>/ RED</span>
        </a>
        <div>
          <a href="#explore">Explore</a>
          <a href="#studio">Studio</a>
          <a className="nav-launch" href="#studio">
            Launch studio <ArrowUpRight size={14} />
          </a>
        </div>
      </nav>
      <div className="product-hero">
        <div className="product-heading">
          <p className="product-kicker">AI AGENT SECURITY, REIMAGINED.</p>
          <h1>
            Break it here.
            <br />
            <span>Not out there.</span>
          </h1>
          <p className="product-subtitle">Your AI. Put to the test.</p>
          <div className="product-actions">
            <a href="#studio" className="primary-action">
              Open studio <ArrowUpRight size={16} />
            </a>
            <button
              className="text-action"
              disabled={disabled}
              onClick={onSample}
            >
              Try the demo <Play size={12} />
            </button>
          </div>
        </div>
        <div
          id="explore"
          className={`sculpture-scene phase-${stage}`}
          ref={sculpture}
          onPointerMove={(e) => {
            if (reduced) return;
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty(
              "--pointer-x",
              `${(e.clientX - r.left - r.width / 2) / 70}deg`,
            );
            e.currentTarget.style.setProperty(
              "--pointer-y",
              `${-(e.clientY - r.top - r.height / 2) / 65}deg`,
            );
          }}
          onPointerLeave={() => {
            sculpture.current?.style.setProperty("--pointer-x", "0deg");
            sculpture.current?.style.setProperty("--pointer-y", "0deg");
          }}
        >
          <div className="sculpture-light" aria-hidden="true" />
          <div className="sculpture-object">
            <Image
              src="/images/nemo-core.png"
              width={1536}
              height={1024}
              priority
              sizes="(max-width: 700px) 100vw, 1100px"
              alt="Smoked-glass ring with an illuminated coral core"
            />
            <div className="ring-scan" aria-hidden="true" />
          </div>
          <div className="sculpture-hotspots">
            {stages.map((item, i) => (
              <button
                key={item.name}
                className={`hotspot hotspot-${i} ${stage === i ? "selected" : ""}`}
                onClick={() => selectStage(i)}
                aria-label={`Explore ${item.name}`}
                aria-pressed={stage === i}
              >
                <span className="hotspot-dot" />
                <span className="hotspot-name">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="explore-console">
          <div className="explore-controls">
            <div className="stage-switch" aria-label="Explore the workflow">
              {stages.map((item, i) => (
                <button
                  key={item.name}
                  aria-pressed={stage === i}
                  onClick={() => selectStage(i)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <button
              className="tour-toggle"
              aria-label={
                paused || reduced ? "Play product tour" : "Pause product tour"
              }
              onClick={() => {
                if (reduced) {
                  setStage((s) => (s + 1) % 3);
                } else setPaused(!paused);
              }}
            >
              {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
            </button>
          </div>
          <div className="explore-caption" key={stage}>
            <strong>{stages[stage].line}</strong>
            <span>{stages[stage].detail}</span>
          </div>
          <span className="illustration-label">INTERACTIVE PREVIEW</span>
        </div>
      </div>
      <div className="product-signoff">
        <span>
          NVIDIA Nemotron <i>×</i> Nebius Token Factory
        </span>
        <a href="#studio">
          Meet your testing ground <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
}
