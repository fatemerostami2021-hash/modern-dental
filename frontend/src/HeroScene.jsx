import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, Float, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';
import { crownGeo } from './Scene.jsx';
import { PAL, setPalette } from './palette.js';

// PLACEHOLDER geometry: procedural dental arches. Replace with GLB assets (see public/models/README.md).
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = THREE.MathUtils.lerp;
const crown = crownGeo(1);
const TYPES = [[0.62, 0.95, 0.38], [0.5, 0.85, 0.36], [0.5, 0.95, 0.42], [0.5, 0.7, 0.48], [0.52, 0.68, 0.5], [0.7, 0.62, 0.62], [0.72, 0.6, 0.64]];
const TEETH = [];
for (const upper of [true, false]) for (const s of [-1, 1]) { let x = 0.02; TYPES.forEach(([w, h, d]) => { TEETH.push({ upper, x: s * (x + w / 2), w, h, d }); x += w * 1.03; }); }
const STAIN = TEETH.map((_, i) => new THREE.Color().setHSL(0.13 + (i % 5) * 0.004, 0.45 - (i % 3) * 0.04, 0.68 - (i % 4) * 0.025));
const WHITE = new THREE.Color('#fbfaf6');
const arch = (y) => new THREE.CatmullRomCurve3(Array.from({ length: 17 }, (_, i) => { const x = -4.3 + i * 0.5375; return new THREE.Vector3(x, y, -0.09 * x * x - 0.18); }));
// camera / jaw keyframes along scroll progress: [pos xyz, look xyz, jaw rotY]
const KEYS = [
  { p: 0, c: [0, 0.3, 11, 0, 0.2, 0, 0] }, { p: 0.3, c: [0.4, 0.2, 9.2, 0, 0, 0, -0.12] }, { p: 0.55, c: [1.2, 0.5, 9, 0, 0, 0, -0.4] },
  { p: 0.8, c: [-0.6, 0.4, 9.4, 0, 0, 0, 0.2] }, { p: 1, c: [0, 0.4, 10.2, 0, 0, 0, 0.1] },
];
function sample(p) {
  let i = 0; while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i], b = KEYS[i + 1], t = sstep(a.p, b.p, p);
  return a.c.map((v, k) => lerp(v, b.c[k], t));
}
const glass = () => ({ transparent: true, opacity: 0.34, roughness: 0.08, clearcoat: 1, color: PAL.glass });

function Smile({ prog, rtl, mobile }) {
  const g = useRef(), mats = useRef([]), core = useRef(), glow = useRef(), scan = useRef(), chips = useRef(), bubble = useRef(), dir = useRef(), deco = useRef();
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.TubeGeometry(arch(1.0), 80, 0.42, 12), []);
  const low = useMemo(() => new THREE.TubeGeometry(arch(-1.0), 80, 0.42, 12), []);
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 128; c.height = 4; const x = c.getContext('2d');
    const gr = x.createLinearGradient(0, 0, 128, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 128, 4); return new THREE.CanvasTexture(c);
  }, []);
  useFrame(() => {
    const p = prog.v, c = sample(p), m = mobile ? 1.3 : 1;
    camera.position.set(c[0] * m, c[1], c[2] * m); look.set(c[3], c[4], c[5]); camera.lookAt(look);
    const gx = mobile ? 0 : (rtl ? -1 : 1) * 2.7, show = Math.max(0.001, sstep(0.1, 0.3, p));   // jaw grows in while the photo fades
    g.current.position.set(gx, mobile ? -1.1 : 0, 0); g.current.rotation.y = c[6]; g.current.scale.setScalar((mobile ? 0.48 : 0.56) * show);
    const scanX = lerp(5.2, -5.2, sstep(0.3, 0.8, p)), vis = sstep(0.26, 0.32, p) * (1 - sstep(0.8, 0.86, p));
    scan.current.position.x = scanX; core.current.opacity = vis * 0.95; glow.current.opacity = vis * 0.8;
    if (chips.current) chips.current.style.opacity = vis;
    TEETH.forEach((t, i) => {
      const mt = mats.current[i]; if (!mt) return;
      const w = sstep(scanX - 0.3, scanX + 0.3, t.x);
      mt.color.copy(STAIN[i]).lerp(WHITE, w); mt.roughness = lerp(0.62, 0.2, w); mt.clearcoat = lerp(0.05, 0.95, w);
      mt.emissiveIntensity = Math.max(0, 1 - Math.abs(t.x - scanX) / 0.7) * 0.6 * vis;
    });
    bubble.current.scale.setScalar(Math.max(0.001, sstep(0.7, 0.92, p)));
    deco.current.scale.setScalar(Math.max(0.001, sstep(0.12, 0.34, p)));   // cubes/sparkles appear only after the photo hands over
    dir.current.intensity = lerp(1, 2, sstep(0.3, 0.8, p));
  });
  return (
    <>
      <ambientLight intensity={0.55} /><directionalLight ref={dir} position={[3, 5, 4]} />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 3, 1]} /><Lightformer intensity={1} position={[-4, 1, 2]} scale={[2, 5, 1]} color="#d6fff6" /><Lightformer intensity={1} position={[4, 0, -2]} scale={[2, 5, 1]} />
      </Environment>
      <group ref={g}>
        <mesh geometry={up}><meshPhysicalMaterial {...glass()} /></mesh><mesh geometry={low}><meshPhysicalMaterial {...glass()} /></mesh>
        {TEETH.map((t, i) => (
          <mesh key={i} geometry={crown} position={[t.x, t.upper ? 0.04 + t.h / 2 : -0.04 - t.h * 0.45, t.upper ? 0.05 - 0.09 * t.x * t.x : -0.09 * t.x * t.x]} rotation={[0, Math.atan(0.18 * t.x), t.upper ? Math.PI : 0]} scale={[t.w / 1.9, (t.h / 1.5) * (t.upper ? 1 : 0.9), t.d / 1.7]}>
            <meshPhysicalMaterial ref={(mt) => { if (mt) mats.current[i] = mt; }} color={STAIN[i]} roughness={0.62} clearcoat={0.05} emissive={PAL.scan} emissiveIntensity={0} />
          </mesh>
        ))}
        <group ref={scan}>
          <mesh><planeGeometry args={[0.035, 4.6]} /><meshBasicMaterial ref={core} color="#f2fffc" transparent opacity={0} depthWrite={false} /></mesh>
          <mesh position={[0, 0, -0.02]}><planeGeometry args={[1.1, 4.6]} /><meshBasicMaterial ref={glow} map={tex} color={PAL.scan} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
          <Html position={[0, 2.5, 0]} center style={{ pointerEvents: 'none' }}><div ref={chips} className="ba-chips" style={{ opacity: 0 }}><span className="b">Before</span><span className="a">After</span></div></Html>
        </group>
        <group ref={bubble} position={[4.9, 0.2, 1]}>
          <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
            <mesh><sphereGeometry args={[1.05, 48, 48]} /><meshPhysicalMaterial {...glass()} opacity={0.22} /></mesh>
            <mesh geometry={crown} scale={0.38}><meshPhysicalMaterial color="#fbfaf6" roughness={0.2} clearcoat={0.9} /></mesh>
          </Float>
        </group>
      </group>
      <group ref={deco}>
      {[[-6.2, 2.4, -4, 0.6], [6.4, -2.2, -5, 0.8], [-4.6, -2.8, -3, 0.45], [4.2, 3, -6, 0.55], [0, -3.8, -4, 0.5], [-7.5, 0, -7, 0.9]].slice(0, mobile ? 3 : 6).map(([x, y, z, s], i) => (
        <Float key={i} speed={1.2} rotationIntensity={1.2} floatIntensity={1.6}><RoundedBox args={[s, s, s]} radius={s * 0.18} smoothness={4} position={[x, y, z]}><meshPhysicalMaterial {...glass()} opacity={0.28} envMapIntensity={1.4} /></RoundedBox></Float>
      ))}
      {[[-4, 3, -1], [4.6, 2.8, -1.5]].map(([x, y, z], i) => <Float key={i} speed={1.5} rotationIntensity={1} floatIntensity={1.4}><mesh geometry={crown} position={[x, y, z]} scale={0.22}><meshPhysicalMaterial color="#fbfaf6" roughness={0.2} clearcoat={0.9} /></mesh></Float>)}
      <Sparkles count={mobile ? 24 : 70} scale={[12, 6, 6]} size={3} speed={0.3} color={PAL.spark} />
      </group>
    </>
  );
}

export default function HeroScene({ prog, rtl, mobile, labels, theme }) {
  setPalette(theme);
  const host = useRef(); const [vis, setVis] = useState(true);
  useEffect(() => { const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting)); io.observe(host.current.parentElement); return () => io.disconnect(); }, []);
  return (
    <div ref={host} style={{ width: '100%', height: '100%' }} data-before={labels[0]} data-after={labels[1]}>
      <Canvas dpr={[1, mobile ? 1.4 : 1.75]} frameloop={vis ? 'always' : 'never'} camera={{ position: [0, 0.3, 10.5], fov: 32 }} gl={{ antialias: true, alpha: true }}>
        <Smile prog={prog} rtl={rtl} mobile={mobile} />
      </Canvas>
    </div>
  );
}
