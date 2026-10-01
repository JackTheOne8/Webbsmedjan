'use client';
import { useEffect, useRef, useState } from 'react';

export function ForgeVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completed = useRef(false);
  const eligible = useRef(false);
  const toggleRef = useRef<(() => void) | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = false;
    let userPaused = false;
    video.muted = true;
    video.defaultMuted = true;
    const start = () => {
      // Wait for the actual hero view and cookie dialog dismissal, not just page load.
      eligible.current = visible && !document.hidden && !video.closest('[inert]');
      video.autoplay = eligible.current && !completed.current && !userPaused;
      if (!eligible.current || completed.current || userPaused) { video.pause(); return; }
      void video.play().catch(() => { /* A direct click on the video can retry a browser block. */ });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .35;
      start();
    }, { threshold: [0, .35] });
    observer.observe(video);
    const main = video.closest('main');
    const dialogObserver = new MutationObserver(start);
    if (main) dialogObserver.observe(main, { attributes: true, attributeFilter: ['inert'] });
    document.addEventListener('visibilitychange', start);
    const retry = (event: PointerEvent) => {
      if (event.target instanceof Node && video.parentElement?.contains(event.target)) return;
      start();
    };
    document.addEventListener('pointerdown', retry, { passive: true });
    video.addEventListener('canplay', start);
    toggleRef.current = () => {
      if (!video.paused) { userPaused = true; video.pause(); return; }
      userPaused = false;
      if (completed.current || video.ended) { completed.current = false; video.currentTime = 0; }
      start();
    };
    return () => {
      observer.disconnect(); dialogObserver.disconnect();
      document.removeEventListener('visibilitychange', start);
      document.removeEventListener('pointerdown', retry);
      video.removeEventListener('canplay', start);
      eligible.current = false; toggleRef.current = null; video.pause();
    };
  }, []);

  // The owner explicitly requested video autoplay even with reduced motion enabled.
  // The rest of the site's animation preferences remain handled by their own components.
  return <div className="hero-art hero-art-video" role="button" tabIndex={0}
    aria-label={playing ? 'Pausa videon' : 'Spela videon'}
    onClick={() => toggleRef.current?.()}
    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleRef.current?.(); } }}>
    <video ref={videoRef} className="hero-video" aria-hidden="true" src="/webbsmedjan-laptop.mp4"
      poster="/webbsmedjan-laptop-poster.webp" muted playsInline preload="auto"
      onPlay={() => { if (!eligible.current || completed.current) videoRef.current?.pause(); else setPlaying(true); }}
      onPause={() => setPlaying(false)}
      onTimeUpdate={() => {
        const video = videoRef.current;
        if (video && video.currentTime >= 3 && !completed.current) { completed.current = true; video.pause(); }
      }} onEnded={() => { completed.current = true; setPlaying(false); }}/>
  </div>;
}
