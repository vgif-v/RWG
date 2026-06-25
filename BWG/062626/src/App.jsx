import { useState, useEffect, useCallback, useRef } from 'react';
import { useLenis } from './lib/useLenis';
import FloatingDecorations from './components/FloatingDecorations';
import GiftBoxSection from './components/GiftBoxSection';
import ScrapbookSection from './components/ScrapbookSection';
import CakeTitle from './components/CakeTitle';
import MemoryGallery from './components/MemoryGallery';
import MemoryCounter from './components/MemoryCounter';
import SecretNotes from './components/SecretNotes';
import EnvelopeSection from './components/EnvelopeSection';

export default function App() {
  const [scrollUnlocked, setScrollUnlocked] = useState(false);

  // Anchors live in the actual section components (in normal layout
  // flow), but the single real cake+title pairing is rendered once,
  // here, by CakeTitle — fixed-positioned and reading these anchors'
  // live rects every scroll frame so it travels continuously between
  // them instead of being two separate elements pretending to hand off.
  const introAnchorRef = useRef(null);
  const dockAnchorRef = useRef(null);

  // Lenis only starts once scrolling is unlocked, so the user truly
  // cannot scroll during the gift-box intro sequence.
  useLenis(scrollUnlocked);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', !scrollUnlocked);
  }, [scrollUnlocked]);

  const handleUnlockScroll = useCallback(() => {
    setScrollUnlocked(true);
  }, []);

  return (
    <div className="relative w-full bg-blush-50">
      <FloatingDecorations count={14} />

      <main className="relative z-10">
        <GiftBoxSection introAnchorRef={introAnchorRef} introUnlocked={scrollUnlocked} />

        <ScrapbookSection dockAnchorRef={dockAnchorRef} />

        {/* <PageFlipTransition /> */}

        <MemoryGallery canPlay={scrollUnlocked} />

        <MemoryCounter />

        <SecretNotes canPlay={scrollUnlocked} />

        <EnvelopeSection />
      </main>

      {/* Rendered once, fixed on top of everything, never unmounted.
          This is the only real cake image and only real BirthdayTitle
          on the page — GiftBoxSection and ScrapbookSection only host
          invisible anchors that tell it where to be. */}
      <CakeTitle
        introAnchorRef={introAnchorRef}
        dockAnchorRef={dockAnchorRef}
        onIntroComplete={handleUnlockScroll}
      />
    </div>
  );
}
