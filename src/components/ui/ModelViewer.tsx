"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  ContactShadows,
  Html,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";

type Props = {
  url: string;
  className?: string;
};

function BoothModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const t = useRef(0);
  const animProgress = useRef(0); // 0 → 1
  const dropDone = useRef(false);

  useEffect(() => {
    if (!scene || !group.current) return;
    const g = group.current;

    // RESET
    g.position.set(0, 0, 0);
    g.rotation.set(0, 0, 0);
    g.scale.setScalar(1);

    // BOUNDS
    const box = new THREE.Box3().setFromObject(g);
    const size = new THREE.Vector3();
    box.getSize(size);

    const center = new THREE.Vector3();
    box.getCenter(center);

    // CENTER THE MODEL AT ORIGIN
    g.position.copy(center).multiplyScalar(-1);

    // SCALE IT TO FIT
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    g.scale.setScalar(scale);

    // MATERIAL FIX
    g.traverse((o: any) => {
      if (o.isMesh && o.material) {
        if ((o.material.color.r + o.material.color.g + o.material.color.b) / 3 < 0.08) {
          o.material.color = new THREE.Color("#ffffff");
        }
        o.material.side = THREE.DoubleSide;
        o.material.needsUpdate = true;
      }
    });

    // CAMERA
    camera.position.set(0, size.y * 0.6 + 1.5, 4);
    camera.lookAt(0, 0, 0);

    // INIT ANIMATION
    animProgress.current = 0;
    dropDone.current = false;

  }, [scene, camera]);

  // FRAME LOOP – SAFE & SMOOTH
  useFrame((state, dt) => {
    if (!group.current) return;
    const g = group.current;

    // DROP IN ANIMATION (0 → 1)
    if (!dropDone.current) {
      animProgress.current += dt * 1.5; // speed  
      const p = Math.min(animProgress.current, 1);

      // Smooth easing
      const eased = p * p * (3 - 2 * p);

      g.position.y = -0.8 * (1 - eased); // lift up
      g.scale.setScalar(0.02 + eased * 0.98);

      if (p >= 1) dropDone.current = true;
    }

    // IDLE FLOAT/ROTATION (ONLY AFTER DROP-IN FINISHES)
    if (dropDone.current) {
      t.current += dt;

      g.rotation.y = Math.sin(t.current * 0.4) * 0.15; // gentle yaw
      g.rotation.x = Math.sin(t.current * 0.2) * 0.04; // gentle tilt
    }
  });

  return <primitive object={scene} ref={group} />;
}


function Loader() {
  return (
    <Html center>
      <div style={{ color: "white", fontSize: 14 }}>Loading…</div>
    </Html>
  );
}

export default function ModelViewer({ url, className }: Props) {
  return (
    <div className={className} style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 45, near: 0.1, far: 100 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<Loader />}>
          <Environment preset="city" background={false} />

          {/* LIGHTING */}
          <ambientLight intensity={1.2} />
          <directionalLight castShadow position={[5, 8, 2]} intensity={1.8} />
          <directionalLight position={[-5, 6, -5]} intensity={0.8} />

          {/* REFLECTIVE FLOOR (glass-like) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <planeGeometry args={[10, 10]} />
            <MeshReflectorMaterial
              blur={[400, 100]}    // strong blur
              resolution={1024}
              mixBlur={0.8}
              mixStrength={1.2}
              roughness={0.3}
              metalness={0.7}
              mirror={0.5}
              depthScale={0.5}
              minDepthThreshold={0.5}
              maxDepthThreshold={1.5}
              color="#222"
            />
          </mesh>

          {/* CONTACT SHADOWS */}
          <ContactShadows position={[0, -0.5, 0]} opacity={0.35} scale={5} blur={2} />

          {/* MODEL */}
          <BoothModel url={url} />

          {/* DEPTH OF FIELD */}
          <EffectComposer>
            <DepthOfField
              focusDistance={0.015}
              focalLength={0.02}
              bokehScale={4}
              height={480}
            />
          </EffectComposer>

          {/* CONTROLS */}
          <OrbitControls enablePan={false} minDistance={1.4} maxDistance={10} />
        </Suspense>
      </Canvas>
    </div>
  );
}
