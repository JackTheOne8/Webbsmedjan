'use client';
import { useEffect, useRef } from 'react';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';

export function ForgeVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completed = useRef(false);
  const reduce = useHydratedReducedMotion();
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduce) { video.pause(); return; }
    // Keep the clean, control-free hero to one short opening sequence, then a still frame.
    video.muted = true;
    if (!completed.current) void video.play().catch(() => {});
    const hide = () => { if (document.hidden) video.pause(); else if (!completed.current) void video.play().catch(() => {}); };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, [reduce]);
  return <div className="hero-art hero-art-video" aria-hidden="true"><video ref={videoRef} className="hero-video" src="/webbsmedjan-laptop.mp4" poster="/webbsmedjan-laptop-poster.webp" autoPlay={!reduce} muted playsInline preload="auto" onPlay={() => { if (reduce || completed.current) videoRef.current?.pause(); }} onTimeUpdate={() => {
    const video = videoRef.current;
    if (video && video.currentTime >= 3 && !completed.current) {
      completed.current = true; video.pause();
    }
  }} onEnded={() => { completed.current = true; }}/></div>;
}
