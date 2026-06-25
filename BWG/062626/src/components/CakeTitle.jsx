import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BirthdayTitle from './BirthdayTitle';
import cake1 from '../assets/cake1.png';

gsap.registerPlugin(ScrollTrigger);

/**
 * CakeTitle is the single, persistent cake + title pairing that lives
 * once at the App level (never unmounted), rendered fixed on top of
 * the page. It never teleports between sections — instead it reads the
 * live on-screen rect of two anchor elements (one inside GiftBoxSection,
 * one inside ScrapbookSection) and tweens continuously between them as
 * the user scrolls, scrubbed 1:1 with scroll position.
 *
 * Stage 1 (intro, pinned with GiftBoxSection):
 *   - Cake fades in softly, blurred, zoomed in tight so the title fits
 *     inside its frame like a zoomed photograph.
 *   - BirthdayTitle draws itself on top via its own internal timeline.
 *   - Once BirthdayTitle finishes drawing, onIntroComplete fires so the
 *     parent can unlock scrolling.
 *
 * Stage 2 (scroll-scrubbed dock, GiftBoxSection -> ScrapbookSection):
 *   - As the user scrolls past the intro, the cake scales/moves/sharpens
 *     from the zoomed intro rect down to the ScrapbookSection anchor's
 *     real rect (its normal in-flow size). The cake itself stays level
 *     (no rotation) the whole time.
 *   - Independently, the title (rendered on top of the cake) tilts
 *     counterclockwise and shrinks slightly as it docks, giving it its
 *     own "settling into the scrapbook" feel without rotating the cake.
 *   - Fully scrub-driven: scrolling back up reverses it smoothly.
 *
 * introAnchorRef / dockAnchorRef are invisible elements the parent
 * sections render in their own normal layout flow — CakeTitle only
 * reads their getBoundingClientRect(), it never renders into them.
 */

// Tweak these to taste — they only affect the title, not the cake.
const TITLE_DOCK_ROTATION = -30; // degrees; negative = counterclockwise
const TITLE_DOCK_SCALE = 1; // 1 = title keeps its scale the whole time

// Title wrapper width as a fraction of the cake's width (0-1), used to
// compute the `left`/`width` CSS below. BirthdayTitle renders its own
// content at 2x whatever width this wrapper is given, growing rightward
// from the wrapper's left edge — so for the rendered title to stay
// horizontally centered, left is always set to (0.5 - width) as a
// fraction, regardless of which width value is currently active.
const TITLE_WIDTH_FRAC_INTRO = 0.62; // big, on first load / before scrolling
const TITLE_WIDTH_FRAC_DOCK = 0.32; // smaller, fits the cake's white face once docked
const TITLE_TOP_FRAC = 0.50; // vertical position (fraction of cake height), same in both states

export default function CakeTitle({ introAnchorRef, dockAnchorRef, onIntroComplete }) {
  const wrapRef = useRef(null);
  const cakeImgRef = useRef(null);
  const titleWrapRef = useRef(null);
  const introDoneRef = useRef(false);

  const handleTitleComplete = useCallback(() => {
    if (introDoneRef.current) return;
    introDoneRef.current = true;
    onIntroComplete?.();
  }, [onIntroComplete]);

  // The continuous scroll-scrubbed journey from intro rect -> dock rect.
  // This single source of truth owns opacity/scale/blur on the cake at
  // every frame (including frame 0, before any scroll happens) so there
  // is never a second tween fighting it for the same properties — the
  // "soft fade in, then sharpen" feel comes purely from where progress
  // 0 vs progress >0 land below, not from a separate intro animation.
  useEffect(() => {
    if (!introAnchorRef?.current || !dockAnchorRef?.current || !wrapRef.current) return;

    const ctx = gsap.context(() => {
      const wrap = wrapRef.current;
      const cakeImg = cakeImgRef.current;
      const titleWrap = titleWrapRef.current;

      ScrollTrigger.create({
        trigger: dockAnchorRef.current,
        start: 'top bottom',
        end: 'top 35%',
        scrub: true,
        onUpdate: (self) => applyFrame(self.progress),
        onRefresh: (self) => applyFrame(self.progress),
      });

      function applyFrame(progress) {
        const introRect = introAnchorRef.current?.getBoundingClientRect();
        const dockRect = dockAnchorRef.current?.getBoundingClientRect();
        if (!introRect || !dockRect || !wrap) return;

        const introCx = introRect.left + introRect.width / 2;
        const introCy = introRect.top + introRect.height / 2;
        const dockCx = dockRect.left + dockRect.width / 2;
        const dockCy = dockRect.top + dockRect.height / 2;

        const width = gsap.utils.interpolate(introRect.width, dockRect.width, progress);

        // Cake wrap no longer rotates — it stays level the whole journey.
        if (progress >= 1) {
          // Fully docked: stop tracking the viewport on every scroll
          // frame and instead sit in the document at the dock anchor's
          // current position, using absolute positioning relative to
          // the page rather than the viewport. From here it scrolls
          // away naturally with the rest of the scrapbook section
          // instead of staying pinned to a fixed spot on screen.
          const docX = dockCx + window.scrollX;
          const docY = dockCy + window.scrollY;
          gsap.set(wrap, {
            position: 'absolute',
            left: docX,
            top: docY,
            xPercent: -50,
            yPercent: -50,
            width: dockRect.width,
            rotation: 0,
            zIndex: 5,
          });
        } else {
          const x = gsap.utils.interpolate(introCx, dockCx, progress);
          const y = gsap.utils.interpolate(introCy, dockCy, progress);
          gsap.set(wrap, {
            position: 'fixed',
            left: x,
            top: y,
            xPercent: -50,
            yPercent: -50,
            width,
            rotation: 0,
            zIndex: progress > 0.02 ? 40 : 5,
          });
        }

        if (cakeImg) {
          gsap.set(cakeImg, {
            opacity: gsap.utils.interpolate(0.55, 1, progress),
            scale: gsap.utils.interpolate(2.2, 1, progress),
            filter: `blur(${gsap.utils.interpolate(6, 0, progress)}px)`,
          });
        }

        // Title tilts independently of the cake, and also resizes from
        // a bigger intro size down to a smaller size that fits inside
        // the cake's white face once docked. Rotates/scales around its
        // own center (set via transformOrigin in the JSX below) so it
        // transforms in place rather than swinging around the cake's
        // center.
        if (titleWrap) {
          const widthFrac = gsap.utils.interpolate(
            TITLE_WIDTH_FRAC_INTRO,
            TITLE_WIDTH_FRAC_DOCK,
            progress
          );
          gsap.set(titleWrap, {
            rotation: gsap.utils.interpolate(0, TITLE_DOCK_ROTATION, progress),
            scale: gsap.utils.interpolate(1, TITLE_DOCK_SCALE, progress),
            width: `${widthFrac * 100}%`,
            left: `${(0.5 - widthFrac) * 100}%`,
            top: `${TITLE_TOP_FRAC * 100}%`,
          });
        }
      }

      // One-time entrance: the cake fades in softly on first mount,
      // landing exactly at the values applyFrame(0) would also produce
      // (opacity 0.55, blur 6px) so there's no visible jump when the
      // scroll-driven frame logic takes over afterward.
      if (cakeImg) {
        gsap.set(cakeImg, { opacity: 0, filter: 'blur(14px)', scale: 2.2 });
        gsap.to(cakeImg, {
          opacity: 0.55,
          filter: 'blur(6px)',
          duration: 1.4,
          ease: 'sine.out',
          onComplete: () => applyFrame(0),
        });
      }

      // Initial paint for position/width (not opacity/blur, which the
      // entrance tween above owns until it finishes) so the wrap is
      // correctly placed over the intro anchor immediately, deferred a
      // frame so layout (fonts, images) has settled and the anchors
      // report real rects rather than a 0x0 flash on mount.
      requestAnimationFrame(() => {
        const introRect = introAnchorRef.current?.getBoundingClientRect();
        const dockRect = dockAnchorRef.current?.getBoundingClientRect();
        if (!introRect || !dockRect || !wrap) return;
        gsap.set(wrap, {
          position: 'fixed',
          left: introRect.left + introRect.width / 2,
          top: introRect.top + introRect.height / 2,
          xPercent: -50,
          yPercent: -50,
          width: introRect.width,
          rotation: 0,
          zIndex: 5,
        });
        if (titleWrap) {
          gsap.set(titleWrap, {
            rotation: 0,
            scale: 1,
            yPercent: -50,
            width: `${TITLE_WIDTH_FRAC_INTRO * 100}%`,
            left: `${(0.5 - TITLE_WIDTH_FRAC_INTRO) * 100}%`,
            top: `${TITLE_TOP_FRAC * 100}%`,
          });
        }
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    });

    return () => ctx.revert();
  }, [introAnchorRef, dockAnchorRef]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none"
      style={{ transformOrigin: 'center center' }}
    >
      <div className="relative w-full">
        <img
          ref={cakeImgRef}
          src={cake1}
          alt="Birthday Cake"
          className="block w-full h-auto select-none"
          draggable={false}
        />
        <div
          ref={titleWrapRef}
          className="absolute"
          style={{
            transformOrigin: 'center center',
            // width/left/top are set dynamically by the scroll-driven
            // applyFrame logic above (and matched on first paint), since
            // the title is bigger on first load and shrinks down to fit
            // the cake's white face once docked. See TITLE_WIDTH_FRAC_*
            // constants near the top of this file.
          }}
        >
          <BirthdayTitle active onComplete={handleTitleComplete} />
        </div>
      </div>
    </div>
  );
}