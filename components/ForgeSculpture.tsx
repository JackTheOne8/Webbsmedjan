'use client';

import { useEffect, useRef, useState } from 'react';
import Link from '@/components/SafeLink';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';

type SculptureControls = { turn: (amount: number) => void; material: (copper: boolean) => void; reset: () => void };

export function ForgeSculpture() {
  const hostRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<SculptureControls | null>(null);
  const reduce = useHydratedReducedMotion();
  const [rotating, setRotating] = useState(true);
  const [copper, setCopper] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const motionRef = useRef({ rotating, reduce });
  useEffect(() => { motionRef.current = { rotating, reduce }; }, [rotating, reduce]);
  useEffect(() => { if (reduce) setRotating(false); }, [reduce]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let started = false;
    let visible = false;
    let cleanup: (() => void) | undefined;

    async function start() {
      try {
        // The renderer and its bundle are only loaded when the showcase approaches the viewport.
        const [THREE, { RoomEnvironment }] = await Promise.all([import('three'), import('three/addons/environments/RoomEnvironment.js')]);
        if (disposed || !host) return;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        host.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, .1, 30);
        camera.position.set(0, 0, 7.7);
        const pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const environment = pmrem.fromScene(room, .04);
        scene.environment = environment.texture;
        room.dispose(); pmrem.dispose();

        // Each triangular face receives an irregular raised tip, forming a forged, crystalline surface.
        const source = new THREE.IcosahedronGeometry(1.3, 1);
        const points = source.getAttribute('position');
        const vertices: number[] = [];
        const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
        for (let i = 0; i < points.count; i += 3) {
          a.fromBufferAttribute(points, i); b.fromBufferAttribute(points, i + 1); c.fromBufferAttribute(points, i + 2);
          const tip = a.clone().add(b).add(c).divideScalar(3).normalize().multiplyScalar(1.58 + .62 * (.5 + .5 * Math.sin(i * 12.9898)));
          for (const [p, q] of [[a, b], [b, c], [c, a]]) vertices.push(...p.toArray(), ...q.toArray(), ...tip.toArray());
        }
        source.dispose();
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({ color: '#596574', metalness: 1, roughness: .18, flatShading: true, envMapIntensity: 1.2 });
        const sculpture = new THREE.Mesh(geometry, material);
        sculpture.rotation.set(.16, .35, -.12);
        scene.add(sculpture);
        const edgesGeometry = new THREE.EdgesGeometry(geometry, 20);
        const edgesMaterial = new THREE.LineBasicMaterial({ color: '#e2ecf2', transparent: true, opacity: .08 });
        sculpture.add(new THREE.LineSegments(edgesGeometry, edgesMaterial));
        const key = new THREE.DirectionalLight('#d5e7ff', 1.8); key.position.set(-3, 4, 4); scene.add(key);
        const rim = new THREE.DirectionalLight('#ffad77', 1.7); rim.position.set(3, -1, -2); scene.add(rim);
        const fill = new THREE.DirectionalLight('#ffffff', .7); fill.position.set(2, 1, 4); scene.add(fill);
        const draw = () => renderer.render(scene, camera);
        const resize = new ResizeObserver(() => {
          const { width, height } = host.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); draw();
        });
        resize.observe(host);
        controlsRef.current = {
          turn: amount => { sculpture.rotation.y += amount; draw(); },
          material: isCopper => { material.color.set(isCopper ? '#b87143' : '#596574'); draw(); },
          reset: () => { sculpture.rotation.set(.16, .35, -.12); draw(); },
        };
        let dragging = false, previousX = 0, previousY = 0;
        const down = (event: PointerEvent) => {
          if (event.button !== 0) return;
          dragging = true; previousX = event.clientX; previousY = event.clientY;
          host.setPointerCapture(event.pointerId);
        };
        const move = (event: PointerEvent) => {
          if (!dragging) return;
          sculpture.rotation.y += (event.clientX - previousX) * .009;
          if (event.pointerType === 'mouse') sculpture.rotation.x += (event.clientY - previousY) * .006;
          previousX = event.clientX; previousY = event.clientY; draw();
        };
        const up = () => { dragging = false; };
        const lost = (event: Event) => { event.preventDefault(); setStatus('fallback'); };
        host.addEventListener('pointerdown', down); host.addEventListener('pointermove', move);
        host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
        host.addEventListener('lostpointercapture', up); renderer.domElement.addEventListener('webglcontextlost', lost);
        let frame = 0, previousTime = 0;
        const animate = (time: number) => {
          const delta = Math.min((time - previousTime) / 1000, .05); previousTime = time;
          if (visible && !document.hidden && motionRef.current.rotating && !dragging) {
            sculpture.rotation.y += delta * .13; draw();
          }
          frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        cleanup = () => {
          cancelAnimationFrame(frame); resize.disconnect(); controlsRef.current = null;
          host.removeEventListener('pointerdown', down); host.removeEventListener('pointermove', move);
          host.removeEventListener('pointerup', up); host.removeEventListener('pointercancel', up); host.removeEventListener('lostpointercapture', up);
          renderer.domElement.removeEventListener('webglcontextlost', lost);
          geometry.dispose(); material.dispose(); edgesGeometry.dispose(); edgesMaterial.dispose(); environment.dispose(); renderer.dispose();
          renderer.domElement.remove();
        };
        if (disposed) cleanup(); else { draw(); setStatus('ready'); }
      } catch { if (!disposed) setStatus('fallback'); }
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && !started) { started = true; void start(); }
    }, { rootMargin: '180px' });
    observer.observe(host);
    return () => { disposed = true; observer.disconnect(); cleanup?.(); };
  }, []);

  return <article className="sculpture-showcase" aria-labelledby="sculpture-title">
    <div className="sculpture-copy"><span className="showcase-tag">INTERAKTIVT KONCEPT</span><h3 id="sculpture-title">Digitalt.<br/><em>Med en ny dimension.</em></h3><p>En idé behöver inte vara platt. Utforska form, ljus och rörelse.</p><Link href="/bestall" className="inline-link">Skapa något eget <span aria-hidden="true">↗</span></Link></div>
    <div className="sculpture-stage">
      <div className="sculpture-topline"><span>SMIDD I DIGITALT STÅL</span><span>3D / LIVE</span></div>
      <div ref={hostRef} className="sculpture-canvas" data-status={status} aria-hidden="true"/>
      {status !== 'ready' && <div className="sculpture-placeholder" role="status">{status === 'loading' ? 'Laddar 3D-koncept…' : '3D-visningen stöds inte av din webbläsare.'}</div>}
      <div className="sculpture-bottom"><p>{status === 'ready' ? 'Dra för att utforska. Eller använd knapparna.' : 'Form · ljus · rörelse'}</p><div className="sculpture-controls" aria-label="Styr 3D-objektet">
        <button type="button" disabled={status !== 'ready'} aria-label="Rotera åt vänster" onClick={() => controlsRef.current?.turn(-.35)}>←</button>
        <button type="button" disabled={status !== 'ready'} aria-label="Rotera åt höger" onClick={() => controlsRef.current?.turn(.35)}>→</button>
        <button type="button" disabled={status !== 'ready'} aria-pressed={copper} onClick={() => { setCopper(!copper); controlsRef.current?.material(!copper); }}>{copper ? 'Koppar' : 'Stål'}</button>
        <button type="button" disabled={status !== 'ready'} aria-pressed={rotating} onClick={() => setRotating(!rotating)}>{rotating ? 'Pausa' : 'Rotera'}</button>
        <button type="button" disabled={status !== 'ready'} onClick={() => controlsRef.current?.reset()}>Återställ</button>
      </div></div>
    </div>
  </article>;
}
