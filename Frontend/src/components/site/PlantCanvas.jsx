import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Loader2, Move3d } from "lucide-react";

const angleMap = [0, 0.6108, 1.2217, -0.6108, -1.2217, 1.5708, -1.5708]; // 0°, 35°, 70°, -35°, -70°, 90°, -90° in radians

function PlantModel({ selectedIndex, controlsRef }) {
  const { scene } = useGLTF("/base_basic_pbr.glb");
  const groupRef = useRef();
  const targetAngleRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const previousIndexRef = useRef(selectedIndex);

  useEffect(() => {
    if (previousIndexRef.current !== selectedIndex) {
      previousIndexRef.current = selectedIndex;
      const angle = angleMap[selectedIndex % angleMap.length] || 0;
      targetAngleRef.current = angle;
      isTransitioningRef.current = true;

      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }
    }
  }, [selectedIndex, controlsRef]);

  useFrame((state) => {
    if (groupRef.current) {
      // 1. Organic floating animation (2-5px vertical movement)
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;

      // 2. Scroll-based smooth zoom effect as user scrolls top/down
      const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
      const scrollProgress = Math.min(Math.max(scrollY / 500, 0), 1);
      const minScale = 1.05;
      const maxScale = 1.38;
      const targetScale = minScale + (maxScale - minScale) * scrollProgress;

      const currentScale = groupRef.current.scale.x || minScale;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      groupRef.current.scale.set(newScale, newScale, newScale);

      // 3. Smooth angle rotation on service selection
      if (isTransitioningRef.current) {
        const currentY = groupRef.current.rotation.y;
        const targetY = targetAngleRef.current;
        const diff = targetY - currentY;

        if (Math.abs(diff) > 0.005) {
          groupRef.current.rotation.y = THREE.MathUtils.lerp(currentY, targetY, 0.08);
        } else {
          groupRef.current.rotation.y = targetY;
          isTransitioningRef.current = false;

          // Resume slow auto rotation automatically after selection rotation finishes
          if (controlsRef.current) {
            controlsRef.current.autoRotate = true;
          }
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload("/base_basic_pbr.glb");

import { LoadingCircle } from "../ui/LoadingCircle";

function CanvasLoader() {
  return (
    <Html center>
      <LoadingCircle size="md" label="Loading 3D Model..." />
    </Html>
  );
}

export function PlantCanvas({ selectedIndex = 0 }) {
  const controlsRef = useRef();

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[580px] flex flex-col items-center justify-center group cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow={false} />
        <directionalLight position={[-4, -2, -2]} intensity={0.4} />

        <Suspense fallback={<CanvasLoader />}>
          <PlantModel selectedIndex={selectedIndex} controlsRef={controlsRef} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableRotate={true}
          enableZoom={true}
          minDistance={3.4}
          maxDistance={5.2}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
          autoRotate={true}
          autoRotateSpeed={1.2}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.95}
        />
      </Canvas>

      {/* Interaction Hint Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/80 border border-border/50 text-[11px] font-mono tracking-wider text-muted-foreground shadow-sm backdrop-blur-md pointer-events-none select-none">
        <Move3d className="h-3.5 w-3.5 text-primary" />
        <span>Drag to rotate • Select service to view angle</span>
      </div>
    </div>
  );
}
