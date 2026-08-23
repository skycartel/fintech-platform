import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ---------- helpers ---------- */

function useIsMobile() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
}

/* ---------- Flowing data-stream particles ---------- */

function DataStreams({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute in a wide band around the center
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 10;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      speeds[i] = 0.3 + Math.random() * 1.2;
      offsets[i] = Math.random() * 16;
    }
    return { positions, speeds, offsets };
  }, [count]);

  useFrame((state) => {
    const points = ref.current;
    if (!points) return;
    const t = state.clock.elapsedTime;
    const arr = points.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // Particles flow upward continuously, wrap around seamlessly
      arr[i * 3 + 1] = ((arr[i * 3 + 1] + speeds[i] * 0.02 + offsets[i]) % 16) - 8;
      // Subtle horizontal sway via sine — loops naturally
      const baseAngle = Math.atan2(arr[i * 3 + 2], arr[i * 3]);
      const sway = Math.sin(t * 0.3 + offsets[i]) * 0.3;
      const r = Math.sqrt(arr[i * 3] ** 2 + arr[i * 3 + 2] ** 2);
      arr[i * 3] = Math.cos(baseAngle + sway * 0.02) * r;
      arr[i * 3 + 2] = Math.sin(baseAngle + sway * 0.02) * r;
    }
    points.geometry.attributes.position.needsUpdate = true;

    // Gentle whole-group rotation
    points.rotation.y = t * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#34d399"
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- Pulsing wireframe core ---------- */

function CoreGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;
      // Pulse scale via sine — seamless loop
      const pulse = 1 + Math.sin(t * 0.8) * 0.04;
      meshRef.current.scale.setScalar(pulse);
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.25;
      innerRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.6, 4]} />
        <meshStandardMaterial
          color="#0b1124"
          emissive="#10b981"
          emissiveIntensity={0.06}
          metalness={0.85}
          roughness={0.25}
          flatShading
        />
      </mesh>
      <mesh ref={innerRef} scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

/* ---------- Orbiting rings ---------- */

function OrbitRings() {
  const groupRef = useRef<THREE.Group>(null);
  const rings = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        radius: 3.5 + i * 1.2,
        tilt: (i * Math.PI) / 5,
        speed: 0.15 + i * 0.08,
        color: i % 2 === 0 ? '#34d399' : '#60a5fa',
        opacity: 0.5 - i * 0.08,
      })),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = t * rings[i].speed;
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[r.tilt, 0, 0]}>
          <torusGeometry args={[r.radius, 0.012, 8, 128]} />
          <meshBasicMaterial color={r.color} transparent opacity={r.opacity} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Scrolling grid floor (infinite depth) ---------- */

function GridFloor({ mobile }: { mobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#04070f';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
    ctx.lineWidth = 1.5;
    const divisions = 8;
    const step = size / divisions;
    for (let i = 0; i <= divisions; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(mobile ? 8 : 14, mobile ? 8 : 14);
    return t;
  }, [mobile]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Scroll the texture continuously — seamless wrap
    tex.offset.y = (t * 0.04) % 1;
    tex.offset.x = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -4, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial map={tex} transparent opacity={0.35} depthWrite={false} />
    </mesh>
  );
}

/* ---------- Dynamic moving lights ---------- */

function MovingLights() {
  const l1 = useRef<THREE.PointLight>(null);
  const l2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (l1.current) {
      l1.current.position.x = Math.cos(t * 0.4) * 8;
      l1.current.position.z = Math.sin(t * 0.4) * 8;
      l1.current.intensity = 1.5 + Math.sin(t * 0.6) * 0.4;
    }
    if (l2.current) {
      l2.current.position.x = Math.cos(t * 0.3 + Math.PI) * 7;
      l2.current.position.z = Math.sin(t * 0.3 + Math.PI) * 7;
      l2.current.intensity = 1 + Math.cos(t * 0.5) * 0.3;
    }
  });

  return (
    <>
      <pointLight ref={l1} position={[8, 4, 8]} intensity={1.5} color="#34d399" distance={30} />
      <pointLight ref={l2} position={[-7, -3, -5]} intensity={1} color="#60a5fa" distance={30} />
    </>
  );
}

/* ---------- Floating geometric shards ---------- */

function FloatingShards({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        pos: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 10 - 2,
        ] as [number, number, number],
        scale: 0.15 + Math.random() * 0.3,
        rotSpeed: (Math.random() - 0.5) * 0.4,
        floatSpeed: 0.3 + Math.random() * 0.5,
        floatOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? '#34d399' : '#60a5fa',
      })),
    [count]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const s = shards[i];
      child.rotation.y = t * s.rotSpeed;
      child.rotation.x = t * s.rotSpeed * 0.7;
      child.position.y = s.pos[1] + Math.sin(t * s.floatSpeed + s.floatOffset) * 0.6;
    });
  });

  return (
    <group ref={groupRef}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} scale={s.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={s.color}
            wireframe
            transparent
            opacity={0.3}
            emissive={s.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Camera slow drift ---------- */

function CameraDrift() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Subtle camera sway — seamless sinusoidal loop
    state.camera.position.x = Math.sin(t * 0.12) * 0.8;
    state.camera.position.y = Math.cos(t * 0.09) * 0.5;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ---------- Main scene ---------- */

export default function HeroScene() {
  const mobile = useIsMobile();
  const particleCount = mobile ? 800 : 2200;
  const shardCount = mobile ? 4 : 10;
  const dpr: [number, number] = mobile ? [1, 1.5] : [1, 2];

  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: mobile ? 60 : 50 }}
      dpr={dpr}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      frameloop="always"
    >
      <ambientLight intensity={0.3} />
      <MovingLights />

      <DataStreams count={particleCount} />
      <CoreGlobe />
      <OrbitRings />
      <FloatingShards count={shardCount} />
      <GridFloor mobile={mobile} />
      <CameraDrift />
    </Canvas>
  );
}
