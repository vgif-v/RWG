import { useRef } from 'react';

/**
 * GiftBoxSection is now an intro "stage" rather than the owner of any
 * visible cake or title — those live once in the shared <CakeTitle>
 * component rendered by App, fixed on top of the page.
 *
 * This section's only job is to:
 *  1. Reserve a full-viewport block so the page has the right scroll
 *     geometry for the intro.
 *  2. Render an invisible anchor (introAnchorRef) sized/positioned
 *     where the zoomed-in cake+title should sit. CakeTitle reads this
 *     anchor's live getBoundingClientRect() every frame, so resizing
 *     the anchor (e.g. via Tailwind responsive classes) is all that's
 *     needed to retarget the zoomed framing — no JS changes required.
 *  3. Show the "scroll to continue" cue once the intro animation
 *     (forwarded via `introUnlocked`) has finished.
 */
export default function GiftBoxSection({ introAnchorRef, introUnlocked }) {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-blush-gradient">
      {/* Invisible anchor: defines the on-screen rect CakeTitle treats as
          its zoomed-in "frame" during the intro. Sized intentionally
          tighter than the viewport so the cake reads as zoomed in. */}
      <div
        ref={introAnchorRef}
        className="pointer-events-none h-[58vh] w-[58vh] max-w-[480px] opacity-0"
        aria-hidden="true"
      />

      {introUnlocked && (
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-ink-700">
          <span className="font-body text-sm font-medium tracking-wide">Scroll to continue</span>
          <span className="animate-bounceArrow text-xl">↓</span>
        </div>
      )}
    </section>
  );
}
