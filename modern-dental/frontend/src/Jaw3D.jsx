import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { crownGeo } from './Scene.jsx';

const crown = crownGeo(1);
const TEETH = [[-2.15, 0.55, 0.85, 0.3], [-1.1, 0.25, 0.95, 0.15], [0, 0.1, 1.05, 0], [1.1, 0.25, 0.95, -0.15], [2.15, 0.55, 0.85, -0.3]]; // x, z, scale, rotY
function Jaw() {
  const g = useRef();
  useFrame(({ pointer, clock }) => {
    const t = clock.elapsedTime, r = g.current.rotation;
    r.y += (Math.sin(t * 0.4) * 0.25 + pointer.x * 0.35 - r.y) * 0.05;
    r.x += (0.2 - pointer.y * 0.15 - r.x) * 0.05;
  });
  return (
    <group ref={g} position={[0, -0.2, 0]}>
      <RoundedBox args={[5.8, 1.5, 2.5]} radius={0.55} smoothness={6} position={[0, -0.95, 0]}>
        <meshPhysicalMaterial color="#8fd3c6" roughness={0.22} clearcoat={1} transparent opacity={0.93} />
      </RoundedBox>
      {TEETH.map(([x, z, s, r], i) => (
        <mesh key={i} geometry={crown} position={[x, -0.3 + 0.72 * s, z]} scale={s} rotation={[0, r, 0]}>
          <meshPhysicalMaterial color="#f6efe4" roughness={0.28} clearcoat={0.9} clearcoatRoughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, -0.18, 0.1]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.62, 0.035, 12, 48]} /><meshPhysicalMaterial color="#35b3a4" clearcoat={1} roughness={0.2} /></mesh>
    </group>
  );
}
export default function Jaw3D() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 1.2, 8.5], fov: 34 }}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer intensity={1} position={[-4, 1, 2]} scale={[2, 5, 1]} color="#d6fff6" />
        <Lightformer intensity={1} position={[4, 0, -2]} scale={[2, 5, 1]} />
      </Environment>
      <Jaw />
    </Canvas>
  );
}
