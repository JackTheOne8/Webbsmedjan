import type * as Three from 'three';
export type ForgeMotion = { rotating: boolean; reduce: boolean; expanded: boolean };
export type ForgeScene = { turn: (amount: number) => void; material: (copper: boolean) => void; reset: () => void; setVisible: (visible: boolean) => void; dispose: () => void };
type Fragment = { direction: Three.Vector3; position: Three.Vector3; orientation: Three.Quaternion; scale: Three.Vector3; axis: Three.Vector3; distance: number; velocity: number; variation: number };
const motion = { stiffness: 82, damping: 13, rotation: .22, impulseDecay: 2.8, maxStep: 1 / 60 };

export async function createForgeScene(host: HTMLDivElement, preference: () => ForgeMotion, onLost: () => void): Promise<ForgeScene> {
  const [T, { RoomEnvironment }, { ConvexGeometry }] = await Promise.all([import('three'), import('three/addons/environments/RoomEnvironment.js'), import('three/addons/geometries/ConvexGeometry.js')]);
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.18;
  host.appendChild(renderer.domElement);
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(38, 1, .1, 30);
  camera.position.set(0, 0, 8);
  const pmrem = new T.PMREMGenerator(renderer), room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .025); scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  // Truncated corners create actual bevel faces that catch studio reflections.
  const corners = [new T.Vector3(-.58, -.35, 0), new T.Vector3(.58, -.35, 0), new T.Vector3(-.08, .7, 0), new T.Vector3(.12, .04, .95)];
  const bevelPoints: Three.Vector3[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (i !== j) bevelPoints.push(corners[i].clone().lerp(corners[j], .035));
  const geometry = new ConvexGeometry(bevelPoints);
  const material = new T.MeshPhysicalMaterial({ color: '#8995a8', metalness: 1, roughness: .21, clearcoat: .8, clearcoatRoughness: .16, flatShading: true, envMapIntensity: 1.35 });
  const source = new T.IcosahedronGeometry(1, 3), points = source.getAttribute('position');
  const count = points.count / 3, shards = new T.InstancedMesh(geometry, material, count);
  shards.instanceMatrix.setUsage(T.DynamicDrawUsage);
  shards.boundingSphere = new T.Sphere(new T.Vector3(), 4);
  const sculpture = new T.Group(); sculpture.rotation.set(.16, .35, -.12); sculpture.add(shards); scene.add(sculpture);
  const random = (i: number) => { const value = Math.sin(i * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value); };
  const parts: Fragment[] = [], z = new T.Vector3(0, 0, 1);
  for (let i = 0; i < count; i++) {
    const direction = new T.Vector3().fromBufferAttribute(points, i * 3).add(new T.Vector3().fromBufferAttribute(points, i * 3 + 1)).add(new T.Vector3().fromBufferAttribute(points, i * 3 + 2)).normalize();
    const orientation = new T.Quaternion().setFromUnitVectors(z, direction).multiply(new T.Quaternion().setFromAxisAngle(z, random(i + 9) * Math.PI * 2));
    const shade = .48 + random(i + 4) * .5; shards.setColorAt(i, new T.Color(shade, shade * 1.015, shade * 1.04));
    parts.push({ direction, position: direction.clone().multiplyScalar(1.08 + random(i + 1) * .19), orientation, scale: new T.Vector3(.28 + random(i + 2) * .37, .48 + random(i + 3) * .52, .36 + random(i + 5) * .76), axis: new T.Vector3(random(i + 6) - .5, random(i + 7) - .5, random(i + 8) - .5).normalize(), distance: 0, velocity: 0, variation: random(i + 10) });
  }
  source.dispose();
  const key = new T.DirectionalLight('#d7e7ff', 2.5); key.position.set(-3, 5, 3); scene.add(key);
  const rim = new T.DirectionalLight('#ffb78d', 3); rim.position.set(3, -2, -3); scene.add(rim);
  const fill = new T.DirectionalLight('#b7c9ff', 1.2); fill.position.set(4, 1, 2); scene.add(fill);
  const transform = new T.Object3D(), spin = new T.Quaternion();
  let visible = true, disposed = false, lostContext = false, frame = 0, previousTime = 0;
  let hovering = false, pointerInside = false, dragging = false, previousX = 0, previousY = 0, impulse = 0, expansion = 0;
  const pointer = new T.Vector2(10, 10), ray = new T.Raycaster(), sphere = new T.Sphere(new T.Vector3(), 1.92), hit = new T.Vector3(), localHit = new T.Vector3();
  let lastExpanded = preference().expanded, lastReduce = preference().reduce;
  const draw = () => { if (!disposed && !lostContext) renderer.render(scene, camera); };
  function updateParts(delta: number) {
    const { reduce, expanded } = preference(); let sum = 0;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i], proximity = hovering ? Math.pow(Math.max(0, part.direction.dot(localHit)), 3) : 0;
      const target = expanded ? .85 + part.variation * .55 : !reduce && hovering ? .24 + proximity * .6 + impulse * (.35 + part.variation * .25) : 0;
      if (reduce) { part.distance = target; part.velocity = 0; }
      else {
        // Bounded substeps prevent an unstable spring after a slow or interrupted frame.
        part.velocity += ((target - part.distance) * (motion.stiffness + part.variation * 35) - part.velocity * motion.damping) * delta;
        part.distance = Math.max(0, part.distance + part.velocity * delta);
        if (Math.abs(part.velocity) + Math.abs(target - part.distance) < .0002) { part.distance = target; part.velocity = 0; }
      }
      transform.position.copy(part.position).addScaledVector(part.direction, part.distance);
      spin.setFromAxisAngle(part.axis, part.distance * (.32 + part.variation * .55));
      transform.quaternion.copy(part.orientation).multiply(spin); transform.scale.copy(part.scale); transform.updateMatrix(); shards.setMatrixAt(i, transform.matrix);
      sum += part.distance;
    }
    shards.instanceMatrix.needsUpdate = true; expansion = sum / parts.length;
    // Camera retreat preserves the exploded silhouette inside the reserved canvas area.
    camera.position.z = 8 + expansion * 2.25; host.dataset.expansion = expansion.toFixed(3);
  }
  updateParts(0); host.dataset.fragments = String(count);
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect(); if (!width || !height) return;
    renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); draw();
  }); resize.observe(host);
  const updatePointer = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect(), x = (event.clientX - rect.left) / rect.width * 2 - 1, y = -(event.clientY - rect.top) / rect.height * 2 + 1;
    if (Math.hypot(pointer.x - x, pointer.y - y) > .008 && event.pointerType === 'mouse') impulse = Math.min(1, impulse + .35);
    pointer.set(x, y); pointerInside = event.pointerType === 'mouse';
  };
  const down = (event: PointerEvent) => { if (event.button !== 0) return; updatePointer(event); dragging = true; previousX = event.clientX; previousY = event.clientY; host.setPointerCapture(event.pointerId); };
  const move = (event: PointerEvent) => {
    updatePointer(event); if (!dragging) return;
    sculpture.rotation.y += (event.clientX - previousX) * .009;
    if (event.pointerType === 'mouse') sculpture.rotation.x += (event.clientY - previousY) * .006;
    previousX = event.clientX; previousY = event.clientY; draw();
  };
  const up = () => { dragging = false; }, leave = () => { pointerInside = false; hovering = false; };
  const lost = (event: Event) => { event.preventDefault(); lostContext = true; cancelAnimationFrame(frame); frame = 0; onLost(); };
  host.addEventListener('pointerdown', down); host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave);
  host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up); host.addEventListener('lostpointercapture', up);
  renderer.domElement.addEventListener('webglcontextlost', lost);
  const animate = (time: number) => {
    frame = 0; if (disposed || lostContext || !visible || document.hidden) return;
    const delta = Math.min((time - previousTime) / 1000, .05); previousTime = time;
    const settings = preference();
    if (settings.rotating && !dragging) sculpture.rotation.y += delta * motion.rotation;
    if (pointerInside && !settings.reduce) {
      ray.setFromCamera(pointer, camera); hovering = ray.ray.intersectSphere(sphere, hit) !== null;
      if (hovering) { sculpture.updateMatrixWorld(); localHit.copy(hit); sculpture.worldToLocal(localHit); localHit.normalize(); }
    } else hovering = false;
    impulse *= Math.exp(-delta * motion.impulseDecay);
    const changing = settings.rotating || hovering || impulse > .001 || settings.expanded !== lastExpanded || settings.reduce !== lastReduce || parts.some(part => part.velocity !== 0);
    if (changing) {
      let remaining = delta;
      while (remaining > 0) { const step = Math.min(remaining, motion.maxStep); updateParts(step); remaining -= step; }
      draw();
    }
    lastExpanded = settings.expanded; lastReduce = settings.reduce;
    frame = requestAnimationFrame(animate);
  };
  const resume = () => { if (!frame && visible && !document.hidden && !disposed && !lostContext) { previousTime = performance.now(); frame = requestAnimationFrame(animate); } };
  const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; pointerInside = false; } else resume(); };
  document.addEventListener('visibilitychange', visibility); resume();
  return {
    turn: amount => { sculpture.rotation.y += amount; draw(); },
    material: copper => { material.color.set(copper ? '#c08757' : '#8995a8'); draw(); },
    reset: () => { sculpture.rotation.set(.16, .35, -.12); impulse = 0; pointerInside = false; hovering = false; for (const part of parts) { part.distance = 0; part.velocity = 0; } updateParts(0); draw(); },
    setVisible: value => { visible = value; if (value) resume(); else { cancelAnimationFrame(frame); frame = 0; pointerInside = false; hovering = false; } },
    dispose: () => {
      disposed = true; cancelAnimationFrame(frame); resize.disconnect(); document.removeEventListener('visibilitychange', visibility);
      host.removeEventListener('pointerdown', down); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointerup', up); host.removeEventListener('pointercancel', up); host.removeEventListener('lostpointercapture', up);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      shards.dispose(); geometry.dispose(); material.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
      delete host.dataset.expansion; delete host.dataset.fragments;
    },
  };
}
