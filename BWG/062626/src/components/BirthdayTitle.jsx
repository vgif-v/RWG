import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { BIRTHDAY_TITLE } from '../content';
import ribbonPathUrl from '../assets/ribbonPath/Happy Birthday Baby.svg';

gsap.registerPlugin(MotionPathPlugin);

const RIBBON_PATH_SRC = ribbonPathUrl; // the actual SVG asset path

/**
 * After the ribbon unravels, this component takes over: the ribbon
 * becomes a moving stroke that "writes" the birthday title, using the
 * real font-outline paths exported from /asset/ribbonPath/Happy
 * Birthday Amber.svg, combined with SVG stroke-dashoffset drawing.
 * A small dot (the "ribbon pen") travels along each path while it draws,
 * trailing a soft glow, and visibly lifts/travels between strokes that
 * are far apart (mimicking a real pen lifting between letters) rather
 * than instantly teleporting.
 *
 * The source SVG's own <path> elements are used as the draw strokes,
 * played back in document order. These are NOT one-per-letter: this is
 * a filled font-outline export where curves, serifs, and decorative
 * details split unpredictably across <path> elements and subpaths
 * (e.g. a single <path> can hold a letter's main stroke plus an
 * unrelated dot or flourish as a second M...Z segment). We never index
 * into them by letter anywhere below — we just play whatever paths
 * exist, in order, and let the geometry do the work.
 *
 * This component only draws the title and reports completion via
 * onComplete — it has no opinion about where it sits on the page or
 * how it travels between sections. That positioning/zoom/docking logic
 * lives in the shared <CakeTitle> wrapper, which renders this component
 * once and animates the wrapper around it continuously across scroll.
 *
 * Sizing: this component fills 100% of whatever width its parent gives
 * it (no internal max-width cap), and the glyphs are centered inside
 * the SVG's own viewBox (xMidYMid). That means "how big the title looks"
 * and "whether it's centered" are both controlled entirely by the
 * parent's box (see CakeTitle's title wrapper div) — not by anything
 * in here.
 */
export default function BirthdayTitle({ active, onComplete }) {
  const containerRef = useRef(null);
  const penRef = useRef(null);
  const penGlowRef = useRef(null);
  const pathRefs = useRef([]);
  const fillGroupRef = useRef(null);
  const [decorationsVisible, setDecorationsVisible] = useState(false);
  const [ribbonSvg, setRibbonSvg] = useState(null); // { viewBox, pathData: string[] }
  const [loadError, setLoadError] = useState(false);

  // Fetch and parse the real ribbon-path SVG asset once.
  useEffect(() => {
    let cancelled = false;

    fetch(RIBBON_PATH_SRC)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${RIBBON_PATH_SRC}: ${res.status}`);
        return res.text();
      })
      .then((svgText) => {
        if (cancelled) return;
        const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
        const parseError = doc.querySelector('parsererror');
        if (parseError) throw new Error('Could not parse ribbon path SVG');

        const svgEl = doc.querySelector('svg');
        const fallbackViewBox = svgEl?.getAttribute('viewBox') || '0 0 543 73';
        const pathData = Array.from(doc.querySelectorAll('path'))
          .map((p) => p.getAttribute('d'))
          .filter(Boolean);

        if (pathData.length === 0) throw new Error('Ribbon path SVG has no paths');

        // The source SVG's own viewBox often has extra padding (left
        // and/or right) baked in from however it was exported, which
        // makes the centered glyphs look off-center inside whatever
        // box we render them in. To avoid that, measure the actual
        // combined bounding box of every path in a throwaway offscreen
        // SVG and use that exact box as our viewBox instead — so the
        // rendered title always fills its container edge-to-edge with
        // no invisible padding on either side.
        const measureSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        measureSvg.setAttribute('viewBox', fallbackViewBox);
        measureSvg.style.position = 'absolute';
        measureSvg.style.width = '0';
        measureSvg.style.height = '0';
        measureSvg.style.overflow = 'hidden';
        document.body.appendChild(measureSvg);

        let viewBox = fallbackViewBox;
        try {
          let minX = Infinity;
          let minY = Infinity;
          let maxX = -Infinity;
          let maxY = -Infinity;

          pathData.forEach((d) => {
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d', d);
            measureSvg.appendChild(pathEl);
            const box = pathEl.getBBox();
            if (box.width > 0 || box.height > 0) {
              minX = Math.min(minX, box.x);
              minY = Math.min(minY, box.y);
              maxX = Math.max(maxX, box.x + box.width);
              maxY = Math.max(maxY, box.y + box.height);
            }
          });

          if (Number.isFinite(minX) && maxX > minX) {
            // Small uniform padding so stroke caps/glow don't get clipped.
            const pad = Math.max(2, (maxX - minX) * 0.015);
            viewBox = `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`;
          }
        } catch {
          // getBBox can throw in some environments (e.g. display:none
          // ancestors) — fall back to the source viewBox in that case.
        } finally {
          document.body.removeChild(measureSvg);
        }

        setRibbonSvg({ viewBox, pathData });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setLoadError(true);
        onComplete?.();
      });

    return () => {
      cancelled = true;
    };
    // onComplete intentionally omitted from deps: this effect should only
    // re-run if the source asset path changes, not on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active || !ribbonSvg) return;

    const paths = pathRefs.current.filter(Boolean);
    if (paths.length === 0) {
      onComplete?.();
      return;
    }

    // Pre-measure every path: length, and start/end points in local SVG
    // space, so we can detect real gaps between strokes (a "pen lift")
    // versus strokes that continue from roughly the same spot.
    const measurements = paths.map((path) => {
      const length = path.getTotalLength();
      const start = path.getPointAtLength(0);
      const end = path.getPointAtLength(length);
      return { path, length, start, end };
    });

    // Calculate total duration first, then scale everything to land at
    // a gentle, unhurried total so pacing stays consistent regardless of
    // glyph count. Slower than before on purpose — a relaxed pen, not a
    // race against the clock.
    let rawDuration = 0;
    measurements.forEach(({ length }, i) => {
      rawDuration += Math.max(0.12, length / 280);
      if (i > 0) {
        const prev = measurements[i - 1];
        const gap = Math.hypot(
          measurements[i].start.x - prev.end.x,
          measurements[i].start.y - prev.end.y
        );
        // A real pen lift only costs time when the next stroke starts
        // somewhere genuinely different (new letter), not mid-glyph.
        if (gap > 14) rawDuration += Math.min(0.22, gap / 240);
      }
    });

    // Target total runtime scales gently with how much there is to write,
    // with a floor so short titles don't feel rushed either.
    const targetTotal = Math.max(4.5, Math.min(7, rawDuration * 1.6));
    const scaleFactor = targetTotal / rawDuration;

    const tl = gsap.timeline({
      onComplete: () => {
        // Soft ink "settle" + glow bloom once the full phrase is drawn.
        gsap.to(fillGroupRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
        gsap.to(penGlowRef.current, {
          scale: 2.2,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
        gsap.to(penRef.current, {
          opacity: 0,
          duration: 0.25,
          onComplete: () => {
            setDecorationsVisible(true);
            onComplete?.();
          },
        });
      },
    });

    // Pen appears with a soft, gentle fade-in rather than a bouncy snap.
    if (penRef.current) {
      tl.fromTo(
        penRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'sine.out' }
      );
    }
    if (penGlowRef.current) {
      tl.to(penGlowRef.current, { opacity: 0.5, duration: 0.4 }, '<');
    }

    measurements.forEach(({ path, length }, i) => {
      const baseDuration = Math.max(0.12, length / 280) * scaleFactor;

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });

      // Slight per-stroke variation so every letter doesn't draw at
      // identical metronome speed — closer to natural hand variance.
      // Kept subtle so the pacing stays calm rather than jittery.
      const wobble = 0.96 + Math.random() * 0.08;
      const duration = baseDuration * wobble;

      // Soft, rounded easing throughout — nothing snaps or accelerates
      // hard. Longer strokes ease gently through their curve; short
      // strokes (serifs, dots) get a touch more ease-out so they settle
      // rather than flick.
      const ease = length > 40 ? 'sine.inOut' : 'sine.out';

      if (i === 0) {
        tl.to(path, { strokeDashoffset: 0, duration, ease });
      } else {
        const prev = measurements[i - 1];
        const gap = Math.hypot(
          measurements[i].start.x - prev.end.x,
          measurements[i].start.y - prev.end.y
        );

        if (gap > 14) {
          // Visible pen lift: travel time scales with distance instead
          // of a flat overlap, so jumps across the page read as a calm,
          // deliberate hand movement rather than a snap-cut or a dart.
          const liftDuration = Math.min(0.4, 0.12 + gap / 600) * scaleFactor;
          tl.to(path, { strokeDashoffset: 0, duration, ease }, `+=${liftDuration}`);
        } else {
          // Same glyph, strokes continue almost seamlessly.
          tl.to(path, { strokeDashoffset: 0, duration, ease }, '>-0.02');
        }
      }

      // The ribbon-pen dot travels along this path while it draws.
      if (penRef.current) {
        tl.to(
          penRef.current,
          {
            motionPath: {
              path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration,
            ease,
          },
          '<'
        );
      }
      if (penGlowRef.current) {
        tl.to(
          penGlowRef.current,
          {
            motionPath: {
              path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration,
            ease,
          },
          '<'
        );
      }
    });

    return () => tl.kill();
  }, [active, onComplete, ribbonSvg]);

  // If the asset failed to load, skip straight to the final state so the
  // page doesn't get stuck waiting on a draw animation that can't happen.
  useEffect(() => {
    if (loadError) setDecorationsVisible(true);
  }, [loadError]);

  if (!ribbonSvg) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-start"
      style={{
        width: '200%',
        height: 'fit-content',
        transformOrigin: 'left center',
      }}
    >
      <svg
        viewBox={ribbonSvg.viewBox}
        preserveAspectRatio="xMinYMid meet"
        className="w-full max-w-[800px]"
        style={{ height: 'auto', display: 'block' }}
        aria-label={BIRTHDAY_TITLE}
        role="img"
      >
        <title>{BIRTHDAY_TITLE}</title>

        <defs>
          <filter id="penGlowFilter" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Soft glow trail under the pen, slightly blurred and behind the stroke */}
        <circle ref={penGlowRef} r="7" fill="#FFB6D5" opacity="0" filter="url(#penGlowFilter)" />

        {ribbonSvg.pathData.map((d, i) => (
          <path
            key={i}
            ref={(el) => (pathRefs.current[i] = el)}
            d={d}
            stroke="#FF9FC9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0"
          />
        ))}

        {/* Final settled fill: the same glyphs softly filled in once drawing
            completes, giving the stroke animation a real payoff instead of
            just stopping mid-line. Starts invisible, fades in on finish. */}
        <g ref={fillGroupRef} opacity="0">
          {ribbonSvg.pathData.map((d, i) => (
            <path key={`fill-${i}`} d={d} fill="#FF6FA8" stroke="none" />
          ))}
        </g>

        <circle ref={penRef} r="3" fill="#FF6FA8" opacity="0" />
      </svg>

      {/* decorationsVisible is read by the parent CakeTitle wrapper via
          onComplete timing to know the fill-in glow has finished, so it
          can safely begin the zoom-out/dock transition. */}
    </div>
  );
}