'use client';
import { useEffect, useRef, useState } from 'react';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';

export function ForgeVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const allowReducedPlayback = useRef(false);
  const [paused, setPaused] = useState(true);
  const reduce = useHydratedReducedMotion();
  useEffect(() => {
    if (reduce) {
      allowReducedPlayback.current = false;
      videoRef.current?.pause();
      setPaused(true);
    } else {
      // Set the muted property before play: Safari can reject attribute-only autoplay.
      const video = videoRef.current;
      if (video) { video.muted = true; void video.play().catch(() => setPaused(true)); }
    }
  }, [reduce]);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      allowReducedPlayback.current = true;
      try { await video.play(); } catch { setPaused(true); }
    } else {
      allowReducedPlayback.current = false;
      video.pause();
    }
  }

  return <div className="hero-art hero-art-video">
    <video ref={videoRef} className="hero-video" src="/webbsmedjan-laptop.mp4" poster="/webbsmedjan-laptop-poster.webp" autoPlay={!reduce} muted loop playsInline preload="auto" onPlay={() => {
      // A late autoplay event can arrive after the preference effect has run.
      if (reduce && !allowReducedPlayback.current) { videoRef.current?.pause(); setPaused(true); }
      else setPaused(false);
    }} onPause={() => setPaused(true)} aria-label="En laptop öppnas och visar en webbplats"/>
    <div className="hero-art-top"><span>WEBBSMEDJAN / VERKSTADEN</span><button type="button" className="hero-video-toggle" onClick={togglePlayback}>{paused ? 'Spela video' : 'Pausa video'}</button></div>
  </div>;
}
