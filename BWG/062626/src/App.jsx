import { useState, useEffect, useCallback } from 'react';
import { useLenis } from './lib/useLenis';
import FloatingDecorations from './components/FloatingDecorations';
import GiftBoxSection from './components/GiftBoxSection';
import ScrapbookSection from './components/ScrapbookSection';
import PageFlipTransition from './components/PageFlipTransition';
import MemoryGallery from './components/MemoryGallery';
import MemoryCounter from './components/MemoryCounter';
import SecretNotes from './components/SecretNotes';
import EnvelopeSection from './components/EnvelopeSection';

export default function App() {
  const [scrollUnlocked, setScrollUnlocked] = useState(false);

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
        <GiftBoxSection onUnlockScroll={handleUnlockScroll} />

        <ScrapbookSection />

        {/* <PageFlipTransition /> */}

        <MemoryGallery canPlay={scrollUnlocked} />

        <MemoryCounter />

        <SecretNotes canPlay={scrollUnlocked} />

        <EnvelopeSection />
      </main>
    </div>
  );
}
