'use client';
import { useEffect, useRef, useState } from 'react';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';

export function ForgeVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const reduce = useHydratedReducedMotion();
  useEffect(() => {
    if (reduce) videoRef.current?.pause();
  }, [reduce]);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try { await video.play(); } catch { setPaused(true); }
    } else {
      video.pause();
    }
  }

  return <div className="hero-art hero-art-video">
    <video ref={videoRef} className="hero-video" src="/webbsmedjan-laptop.mp4" poster="/webbsmedjan-laptop-poster.webp" autoPlay muted loop playsInline preload="metadata" onPlay={() => setPaused(false)} onPause={() => setPaused(true)} aria-label="En laptop öppnas och visar en webbplats"/>
    <div className="hero-art-top"><span>WEBBSMEDJAN / VERKSTADEN</span><button type="button" className="hero-video-toggle" onClick={togglePlayback}>{paused ? 'Spela video' : 'Pausa video'}</button></div>
  </div>;
}
