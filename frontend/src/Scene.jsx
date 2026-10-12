import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Lightformer, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { INFO } from './data.js';

const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// Molar crown: sphere with four cusps (|x|*|z| lift) separated by a cross fissure, narrower neck.
export function crownGeo(s = 1) {
  const g = new THREE.SphereGeometry(1, 64, 48), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i); let y = p.getY(i);
    y += Math.max(0, y) * 0.67 * Math.abs(x) * Math.abs(z);
    const neck = 0.8 + 0.2 * sstep(-0.9, 0.3, y);
    p.setXYZ(i, x * 0.95 * neck * s, y * 0.72 * s, z * 0.85 * neck * s);
  }
  g.computeVertexNormals(); return g;
}
// Tapered, slightly curved root (lathe from tip to top so normals face outward).
export function rootGeo(side) {
  const L = 1.7, pts = [];
  for (let i = 0; i <= 14; i++) { const t = 1 - i / 14; pts.push(new THREE.Vector2(0.04 + 0.32 * Math.pow(1 - t, 0.7), -t * L)); }
  const g = new THREE.LatheGeometry(pts, 28), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const t = -p.getY(i) / L; p.setX(i, p.getX(i) + side * 0.16 * t * t); }
  g.computeVertexNormals(); return g;
}
const gumGeo = () => new THREE.LatheGeometry([[0.5, -0.95], [1.0, -0.95], [1.12, -0.6], [0.98, -0.25], [0.78, -0.08], [0.58, 0.04]].map(([x, y]) => new THREE.Vector2(x, y)), 48);

const G = { crown: crownGeo(1), dent: crownGeo(0.78), crownI: crownGeo(0.9), rootL: rootGeo(-1), rootR: rootGeo(1), gum: gumGeo() };
const M = (c, h, o = {}) => <meshPhysicalMaterial color={c} roughness={0.38} clearcoat={0.7} clearcoatRoughness={0.25} emissive={h ? '#2fb59f' : '#000000'} emissiveIntensity={h ? 0.4 : 0} {...o} />;
const BONE = { transparent: true, opacity: 0.38, roughness: 0.85, clearcoat: 0, depthWrite: false };
const METAL = { metalness: 0.9, roughness: 0.25 };

// Named parts (replaceable by GLB later). ex = vertical travel when fully exploded, ly = label height.
const PARTS = {
  tooth: [
    { id: 'bone', ex: -0.7, ly: -1.5, el: (h) => <RoundedBox args={[2.8, 1.5, 2.1]} radius={0.18} smoothness={4} position={[0, -1.45, 0]}>{M('#d9ccb3', h, BONE)}</RoundedBox> },
    { id: 'root', ex: -0.4, ly: -1.4, el: (h) => <group>{[['rootL', -0.32], ['rootR', 0.32]].map(([k, x]) => <mesh key={k} geometry={G[k]} position={[x, -0.05, 0]}>{M('#ecdcb8', h)}</mesh>)}</group> },
    { id: 'gum', ex: -0.12, ly: -0.5, el: (h) => <mesh geometry={G.gum}>{M('#e07f8c', h, { roughness: 0.55, side: THREE.DoubleSide })}</mesh> },
    { id: 'pulp', ex: 0, ly: 0.3, el: (h) => <group><mesh position={[0, 0.45, 0]} scale={[0.2, 0.32, 0.2]}><sphereGeometry args={[1, 24, 24]} />{M('#d23a4a', h)}</mesh>{[-0.19, 0.19].map((x) => <mesh key={x} position={[x, -0.5, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.05, 1.3, 12]} />{M('#d23a4a', h)}</mesh>)}</group> },
    { id: 'dentin', ex: 0.7, ly: 0.75, el: (h) => <mesh geometry={G.dent} position={[0, 0.5, 0]}>{M('#e9c46f', h)}</mesh> },
    { id: 'enamel', ex: 1.4, ly: 1.1, el: (h) => <mesh geometry={G.crown} position={[0, 0.55, 0]}>{M('#f7fbfa', h, { transparent: true, opacity: 0.6 })}</mesh> },
  ],
  implant: [
    { id: 'bone', ex: -0.6, ly: -1.2, el: (h) => <RoundedBox args={[2.6, 1.4, 2]} radius={0.18} smoothness={4} position={[0, -1.2, 0]}>{M('#d9ccb3', h, BONE)}</RoundedBox> },
    { id: 'screw', ex: -0.3, ly: -0.9, el: (h) => <group position={[0, -0.9, 0]}><mesh><cylinderGeometry args={[0.3, 0.2, 1.6, 24]} />{M('#9aa7b2', h, METAL)}</mesh>{[-0.6, -0.3, 0, 0.3, 0.6].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.27 - (y + 0.7) * 0.05, 0.045, 8, 28]} />{M('#9aa7b2', h, METAL)}</mesh>)}</group> },
    { id: 'abutment', ex: 0.6, ly: 0.1, el: (h) => <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.2, 0.32, 0.6, 24]} />{M('#c9a24a', h, { metalness: 0.8, roughness: 0.3 })}</mesh> },
    { id: 'crown', ex: 1.4, ly: 0.9, el: (h) => <mesh geometry={G.crownI} position={[0, 0.9, 0]}>{M('#fbfdfc', h)}</mesh> },
  ],
};

function Part({ p, amt, on, label, onPick, onHover }) {
  const g = useRef();
  useFrame((_, dt) => { g.current.position.y += (p.ex * amt - g.current.position.y) * (1 - Math.pow(0.0005, dt)); });
  return (
    <group ref={g} onClick={(e) => { e.stopPropagation(); onPick(p.id); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(p.id); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { onHover(null); document.body.style.cursor = ''; }}>
      {p.el(on)}
      <Html position={[1.7, p.ly, 0]} center style={{ pointerEvents: 'none' }}><span className={'tag' + (amt > 0.55 || on ? ' on' : '')}>{label}</span></Html>
    </group>
  );
}

export default function Scene({ mode, amt, selected, onPick, resetKey, still, lang }) {
  const ctl = useRef(), host = useRef();
  const [vis, setVis] = useState(true);
  const [hov, setHov] = useState(null);
  useEffect(() => { ctl.current?.reset(); }, [resetKey]);
  useEffect(() => { const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting)); io.observe(host.current.parentElement); return () => io.disconnect(); }, []);
  return (
    <div ref={host} style={{ width: '100%', height: '100%' }}>
      <Canvas dpr={[1, 1.75]} frameloop={vis ? 'always' : 'never'} camera={{ position: [0, 0.6, 9.5], fov: 36 }} onPointerMissed={() => onPick(null)}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 5, 4]} intensity={1.7} />
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 3, 1]} />
          <Lightformer intensity={1} position={[-4, 1, 2]} scale={[2, 5, 1]} color="#bff3ea" />
          <Lightformer intensity={1} position={[4, 0, -2]} scale={[2, 5, 1]} />
        </Environment>
        <group position={[0, 0.2, 0]}>
          {PARTS[mode].map((p) => (
            <Part key={mode + p.id} p={p} amt={amt} on={selected === p.id || hov === p.id} label={INFO[mode][p.id][lang][0]} onPick={onPick} onHover={setHov} />
          ))}
        </group>
        <OrbitControls ref={ctl} enablePan={false} minDistance={4.5} maxDistance={13} autoRotate={!still && !selected} autoRotateSpeed={0.7} />
      </Canvas>
    </div>
  );
}
