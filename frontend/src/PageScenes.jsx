import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { crownGeo, rootGeo } from './Scene.jsx';
import { PAL, setPalette } from './palette.js';

// One distinct code-built 3D hero per page (placeholders; swap for GLB assets later).
const crown = crownGeo(1), rootL = rootGeo(-1), rootR = rootGeo(1);
const Gl = ({ o = 0.38, c = PAL.glass, ...r }) => <meshPhysicalMaterial color={c} transparent opacity={o} roughness={0.08} clearcoat={1} envMapIntensity={1.3} depthWrite={false} {...r} />;
const En = (p) => <meshPhysicalMaterial color="#fbfaf6" roughness={0.2} clearcoat={0.9} {...p} />;
const Tur = (p) => <meshPhysicalMaterial color={PAL.acc} emissive={PAL.emi} emissiveIntensity={0.7} roughness={0.2} clearcoat={1} transparent opacity={0.85} side={THREE.DoubleSide} {...p} />;
const Metal = (p) => <meshPhysicalMaterial color="#9aa7b2" metalness={0.9} roughness={0.25} {...p} />;
const arch = (y, zo, n = 15, w = 3.7) => new THREE.CatmullRomCurve3(Array.from({ length: n }, (_, i) => { const x = -w + (i * 2 * w) / (n - 1); return new THREE.Vector3(x, y, -0.1 * x * x + zo); }));

function Rig({ children, s = 1 }) {
  const g = useRef();
  useFrame(({ pointer }) => { const r = g.current.rotation; r.y += (pointer.x * 0.4 - r.y) * 0.05; r.x += (-pointer.y * 0.2 - r.x) * 0.05; });
  return <group ref={g} scale={s}>{children}</group>;
}

/* Orthodontics: crowded teeth glide into line along a wire with brackets */
const OT = Array.from({ length: 12 }, (_, i) => { const x = (i - 5.5) * 0.62; return { x, z: -0.1 * x * x, ry: Math.atan(0.2 * x), j: [Math.sin(i * 12.9) * 0.28, Math.cos(i * 7.7) * 0.22, Math.sin(i * 5.3) * 0.7, Math.cos(i * 3.1) * 0.35] }; });
function Ortho() {
  const t = useRef([]), b = useRef([]);
  const wire = useMemo(() => new THREE.TubeGeometry(arch(-0.06, 0.34, 15, 3.5), 80, 0.03, 8), []);
  const gum = useMemo(() => new THREE.TubeGeometry(arch(0.55, -0.1, 15, 3.6), 60, 0.36, 12), []);
  useFrame(({ clock }) => {
    const k = 1 - (0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.8 - 1.2));   // 1 = crowded, 0 = aligned
    OT.forEach((o, i) => {
      const x = o.x + o.j[0] * k, z = o.z + o.j[1] * k, ry = o.ry + o.j[2] * k;
      t.current[i].position.set(x, 0, z); t.current[i].rotation.set(0, ry, Math.PI + o.j[3] * k * 0.5);
      b.current[i].position.set(x + Math.sin(ry) * 0.32, -0.06, z + Math.cos(ry) * 0.32); b.current[i].rotation.y = ry;
    });
  });
  return (
    <group position={[0, -0.2, 0]}>
      <mesh geometry={gum}><Gl o={0.3} /></mesh><mesh geometry={wire}><Tur /></mesh>
      {OT.map((o, i) => <group key={i}>
        <mesh ref={(m) => (t.current[i] = m)} geometry={crown} scale={[0.3, 0.42, 0.3]}><En /></mesh>
        <mesh ref={(m) => (b.current[i] = m)}><boxGeometry args={[0.16, 0.12, 0.07]} /><Tur opacity={1} /></mesh>
      </group>)}
    </group>
  );
}

/* Surgery: implant crown + abutment lower into a translucent jaw section */
function Surgery() {
  const sc = useRef(), up = useRef(), ring = useRef();
  useFrame(({ clock }) => { const t = clock.elapsedTime; sc.current.rotation.y = t * 0.9; up.current.position.y = 0.6 + (0.5 + 0.5 * Math.sin(t * 0.9)) * 1.0; ring.current.scale.setScalar(1 + 0.12 * Math.sin(t * 2)); });
  return (
    <group position={[0, -0.2, 0]}>
      <RoundedBox args={[4.4, 1.7, 2.4]} radius={0.2} smoothness={4} position={[0, -1.05, 0]}><Gl o={0.34} c="#eadfc6" /></RoundedBox>
      <RoundedBox args={[4.4, 0.34, 2.4]} radius={0.15} smoothness={4} position={[0, 0.05, 0]}><Gl o={0.5} c="#f2a0ab" /></RoundedBox>
      {[-1.7, 1.7].map((x) => <mesh key={x} geometry={crown} position={[x, 0.78, 0]} scale={[0.55, 0.6, 0.5]}><En /></mesh>)}
      <group ref={sc} position={[0, -0.55, 0]}>
        <mesh><cylinderGeometry args={[0.3, 0.2, 1.5, 24]} /><Metal /></mesh>
        {[-0.6, -0.3, 0, 0.3, 0.6].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.27 - (y + 0.7) * 0.05, 0.045, 8, 28]} /><Metal /></mesh>)}
      </group>
      <group ref={up} position={[0, 0.6, 0]}>
        <mesh><cylinderGeometry args={[0.2, 0.32, 0.55, 24]} /><Metal color="#c9a24a" /></mesh>
        <mesh geometry={crown} position={[0, 0.7, 0]} scale={[0.5, 0.55, 0.45]}><En /></mesh>
      </group>
      <mesh ref={ring} position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.6, 0.03, 8, 48]} /><Tur /></mesh>
    </group>
  );
}

/* Services: an orbiting ring of six glass orbs, each holding a different shape */
function Services() {
  const g = useRef();
  useFrame((_, d) => { g.current.rotation.y += d * 0.35; });
  const icon = [<mesh geometry={crown} scale={0.3}><En /></mesh>, <mesh><torusKnotGeometry args={[0.26, 0.08, 64, 8]} /><Tur /></mesh>, <mesh><cylinderGeometry args={[0.16, 0.1, 0.7, 16]} /><Metal /></mesh>, <mesh><octahedronGeometry args={[0.34]} /><En /></mesh>, <mesh><icosahedronGeometry args={[0.3]} /><Tur /></mesh>, <mesh><coneGeometry args={[0.26, 0.6, 24]} /><En /></mesh>];
  return (
    <group ref={g}>
      {icon.map((el, i) => { const a = (i / 6) * Math.PI * 2; return (
        <Float key={i} speed={1.4} floatIntensity={1.2}><group position={[Math.cos(a) * 2.7, Math.sin(i * 1.7) * 0.4, Math.sin(a) * 2.7]}><mesh><sphereGeometry args={[0.72, 40, 40]} /><Gl o={0.22} /></mesh>{el}</group></Float>); })}
    </group>
  );
}

/* About: glass tooth emblem with a luminous orbiting ribbon (echoes the logo) */
function About() {
  const r = useRef(), g = useRef();
  useFrame(({ clock }) => { const t = clock.elapsedTime; r.current.rotation.y = t * 0.6; r.current.position.y = Math.sin(t * 0.9) * 0.25; g.current.rotation.y = Math.sin(t * 0.4) * 0.5; });
  return (
    <group ref={g}>
      <group position={[0, -0.9, 0]} scale={1.3}>
        <mesh geometry={crown} position={[0, 0.55, 0]}><Gl o={0.55} c="#dff7f2" /></mesh>
        {[[-0.3, rootL], [0.3, rootR]].map(([x, geo]) => <mesh key={x} geometry={geo} position={[x, -0.05, 0]}><Gl o={0.55} c="#dff7f2" /></mesh>)}
      </group>
      <group ref={r} rotation={[0.35, 0, 0.2]}><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[1.9, 1.9, 0.2, 96, 1, true]} /><Tur /></mesh></group>
    </group>
  );
}

/* FAQs: a glass question mark with floating speech panels */
function Faq() {
  const g = useRef();
  useFrame(({ clock }) => { g.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.6; });
  return (
    <group ref={g}>
      <group position={[0, 0.2, 0]}>
        <mesh position={[0, 1.0, 0]} rotation={[0, 0, -Math.PI / 2]}><torusGeometry args={[0.85, 0.24, 24, 64, 4.36]} /><Gl o={0.6} c={PAL.glass} /></mesh>
        <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.24, 0.24, 0.6, 24]} /><Gl o={0.6} c={PAL.glass} /></mesh>
        <mesh position={[0, -0.95, 0]}><sphereGeometry args={[0.3, 32, 32]} /><Gl o={0.65} c={PAL.glass} /></mesh>
      </group>
      {[[-2.4, 1.6, -0.5], [2.5, -0.2, -0.8], [-2.1, -1.8, 0]].map(([x, y, z], i) => <Float key={i} speed={1.3} floatIntensity={1.5}><RoundedBox args={[1.3, 0.85, 0.12]} radius={0.12} position={[x, y, z]}><Gl o={0.32} /></RoundedBox></Float>)}
    </group>
  );
}

/* Contact: a glass clock and calendar */
function Contact() {
  const h = useRef(), m = useRef();
  useFrame(({ clock }) => { const t = clock.elapsedTime; m.current.rotation.z = -t * 1.2; h.current.rotation.z = -t * 0.1; });
  return (
    <group>
      <group position={[-1.4, 0, 0]}>
        <mesh><torusGeometry args={[1.25, 0.09, 16, 64]} /><Tur /></mesh><mesh><circleGeometry args={[1.2, 48]} /><Gl o={0.18} /></mesh>
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <mesh key={i} position={[Math.sin(a), Math.cos(a), 0.02]} rotation={[0, 0, -a]}><boxGeometry args={[0.04, i % 3 ? 0.1 : 0.2, 0.04]} /><En /></mesh>; })}
        <group ref={h}><mesh position={[0, 0.3, 0.05]}><boxGeometry args={[0.07, 0.6, 0.05]} /><En /></mesh></group>
        <group ref={m}><mesh position={[0, 0.45, 0.08]}><boxGeometry args={[0.05, 0.9, 0.05]} /><Tur opacity={1} /></mesh></group>
      </group>
      <Float speed={1.3} floatIntensity={1.2}>
        <group position={[1.8, 0.2, -0.3]} rotation={[0, -0.25, 0]}>
          <RoundedBox args={[1.7, 2, 0.16]} radius={0.12}><Gl o={0.4} /></RoundedBox>
          <mesh position={[0, 0.75, 0.1]}><boxGeometry args={[1.5, 0.3, 0.05]} /><Tur opacity={1} /></mesh>
          {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[((i % 3) - 1) * 0.45, 0.2 - Math.floor(i / 3) * 0.45, 0.1]}><boxGeometry args={[0.28, 0.28, 0.04]} /><En /></mesh>)}
        </group>
      </Float>
    </group>
  );
}
const SCENES = { ortho: Ortho, surgery: Surgery, services: Services, about: About, faqs: Faq, contact: Contact };

export default function PageScene({ kind, theme }) {
  setPalette(theme);
  const host = useRef(); const [vis, setVis] = useState(true);
  const mobile = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 860px)').matches;
  useEffect(() => { const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting)); io.observe(host.current); return () => io.disconnect(); }, []);
  const S = SCENES[kind] || About;
  return (
    <div ref={host} style={{ width: '100%', height: '100%' }}>
      <Canvas dpr={[1, mobile ? 1.4 : 1.75]} frameloop={vis ? 'always' : 'never'} camera={{ position: [0, 0.6, 9.5], fov: 34 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.55} /><directionalLight position={[3, 5, 4]} intensity={1.7} />
        <Environment resolution={256}><Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 3, 1]} /><Lightformer intensity={1} position={[-4, 1, 2]} scale={[2, 5, 1]} color="#d6fff6" /><Lightformer intensity={1} position={[4, 0, -2]} scale={[2, 5, 1]} /></Environment>
        <Rig s={mobile ? 0.72 : 1}><S /></Rig>
        <Sparkles count={mobile ? 20 : 50} scale={[10, 6, 5]} size={3} speed={0.3} color={PAL.spark} />
      </Canvas>
    </div>
  );
}
