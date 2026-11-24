import { useEffect, useRef, useState } from "react";
import type { FocusEvent, PointerEvent } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { APP_TOUR_IMAGE_HEIGHT, APP_TOUR_IMAGE_WIDTH, type AppTourScreen } from "@/data/appTour";
import "./AppTourPhone.css";

const ADVANCE_MS = 4500;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION_QUERY).matches;

interface AppTourPhoneProps {
  screens: AppTourScreen[];
}

// A phone-shaped frame that plays app screenshots one at a time, with the
// caption beside it (under it on a phone). It advances every 4.5 seconds,
// stops while the mouse is over it or keyboard focus is inside it, and has a
// Pause/Play button. With reduced motion it never advances on its own and
// screens change instantly.
export default function AppTourPhone({ screens }: AppTourPhoneProps) {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [hovered, setHovered] = useState(false);
  const [keyboardInside, setKeyboardInside] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const count = screens.length;
  const advancing = playing && !hovered && !keyboardInside && count > 1;

  const goTo = (next: number) => {
    const target = ((next % count) + count) % count;
    if (target === index) return;
    setPrevious(index);
    setIndex(target);
  };

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = () => {
      setReducedMotion(query.matches);
      if (query.matches) setPlaying(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!advancing) return;
    const timer = window.setTimeout(() => {
      setPrevious(index);
      setIndex((index + 1) % count);
    }, ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [advancing, count, index]);

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") setHovered(true);
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "mouse") setHovered(false);
  };

  // Keyboard focus on a screen button stops the tour; focus on the Pause/Play
  // button does not, so pressing Play actually plays.
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target === toggleRef.current) {
      setKeyboardInside(false);
      return;
    }
    let keyboard = false;
    try {
      keyboard = target.matches(":focus-visible");
    } catch {
      keyboard = false;
    }
    if (keyboard) setKeyboardInside(true);
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null;
    if (!next || !event.currentTarget.contains(next)) setKeyboardInside(false);
  };

  if (count === 0) return null;
  const screen = screens[index];

  return (
    <section
      className={`shl-tour${reducedMotion ? " shl-tour-reduced" : ""}`}
      aria-roledescription="carousel"
      aria-label="Screens from the Sober Helpline app"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className="shl-tour-phone">
        <span className="shl-tour-button shl-tour-button-action" aria-hidden="true" />
        <span className="shl-tour-button shl-tour-button-volume-up" aria-hidden="true" />
        <span className="shl-tour-button shl-tour-button-volume-down" aria-hidden="true" />
        <span className="shl-tour-button shl-tour-button-side" aria-hidden="true" />
        <div className="shl-tour-screen">
          {screens.map((item, i) => {
            const state = i === index ? " is-active" : i === previous ? " is-leaving" : "";
            return (
              <div
                key={item.image}
                className={`shl-tour-slide${state}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${item.title}`}
                aria-hidden={i === index ? undefined : true}
              >
                <img
                  src={`/sober-helpline-app/${item.image}.webp`}
                  alt={item.alt}
                  width={APP_TOUR_IMAGE_WIDTH}
                  height={APP_TOUR_IMAGE_HEIGHT}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </div>
            );
          })}
          <span className="shl-tour-island" aria-hidden="true" />
        </div>
      </div>

      <div className="shl-tour-panel">
        <div className="shl-tour-caption" aria-live={advancing ? "off" : "polite"} aria-atomic="true">
          <p className="shl-tour-step">
            Screen {index + 1} of {count}
          </p>
          <div key={index} className="shl-tour-caption-body">
            <h2>{screen.title}</h2>
            <p>{screen.text}</p>
          </div>
        </div>

        <div className="shl-tour-progress" aria-hidden="true">
          {advancing && !reducedMotion && <span key={index} style={{ animationDuration: `${ADVANCE_MS}ms` }} />}
        </div>

        <div className="shl-tour-controls">
          <button
            type="button"
            className="shl-tour-arrow"
            onClick={() => goTo(index - 1)}
            aria-label="Previous screen"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <ol className="shl-tour-dots">
            {screens.map((item, i) => (
              <li key={item.image}>
                <button
                  type="button"
                  className={`shl-tour-dot${i === index ? " is-active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`${item.label}, screen ${i + 1} of ${count}`}
                  aria-current={i === index ? "true" : undefined}
                >
                  <span className="shl-tour-dot-mark" aria-hidden="true" />
                  <span className="shl-tour-dot-label" aria-hidden="true">
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="shl-tour-arrow"
            onClick={() => goTo(index + 1)}
            aria-label="Next screen"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="shl-tour-toggle"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause the tour" : "Play the tour"}
        >
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          <span>{playing ? "Pause" : "Play"}</span>
        </button>
      </div>
    </section>
  );
}
