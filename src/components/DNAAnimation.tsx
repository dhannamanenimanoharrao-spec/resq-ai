import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DNAAnimation() {
  const dnaRef = useRef<THREE.Group>(null);

  const { strand1, strand2, rungs } = useMemo(() => {
    const strand1Points: THREE.Vector3[] = [];
    const strand2Points: THREE.Vector3[] = [];

    const rungData: {
      start: THREE.Vector3;
      end: THREE.Vector3;
    }[] = [];

    const height = 4;
    const radius = 0.8;
    const turns = 2;
    const points = 100;

    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);

      const y = (t - 0.5) * height;
      const angle = t * Math.PI * 2 * turns;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      const p1 = new THREE.Vector3(x1, y, z1);
      const p2 = new THREE.Vector3(x2, y, z2);

      strand1Points.push(p1);
      strand2Points.push(p2);

      if (i % 6 === 0) {
        rungData.push({
          start: p1,
          end: p2,
        });
      }
    }

    const curve1 = new THREE.CatmullRomCurve3(strand1Points);
    const curve2 = new THREE.CatmullRomCurve3(strand2Points);

    return {
      strand1: curve1,
      strand2: curve2,
      rungs: rungData,
    };
  }, []);

  useFrame((state, delta) => {
    if (!dnaRef.current) return;

    // Continuous rotation
    dnaRef.current.rotation.y += delta * 0.4;

    // Gentle floating
    dnaRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
  });

  return (
    <group ref={dnaRef}>
      {/* Solid DNA strand 1 */}
      <mesh>
        <tubeGeometry
          args={[strand1, 128, 0.12, 16, false]}
        />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.25}
          metalness={0.4}
          emissive="#075985"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Solid DNA strand 2 */}
      <mesh>
        <tubeGeometry
          args={[strand2, 128, 0.12, 16, false]}
        />
        <meshStandardMaterial
          color="#67E8F9"
          roughness={0.25}
          metalness={0.4}
          emissive="#155E75"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Connecting rungs */}
      {rungs.map((rung, index) => {
        const midpoint = new THREE.Vector3()
          .addVectors(rung.start, rung.end)
          .multiplyScalar(0.5);

        const direction = new THREE.Vector3()
          .subVectors(rung.end, rung.start)
          .normalize();

        const length = rung.start.distanceTo(rung.end);

        const quaternion = new THREE.Quaternion()
          .setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction
          );

        return (
          <mesh
            key={index}
            position={midpoint}
            quaternion={quaternion}
          >
            <cylinderGeometry
              args={[0.06, 0.06, length, 12]}
            />

            <meshStandardMaterial
              color="#E0F2FE"
              roughness={0.3}
              metalness={0.5}
              emissive="#7DD3FC"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}