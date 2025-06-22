"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const FIGURE8 = [
  [0.97000436, -0.24308753, 0],
  [-0.97000436, 0.24308753, 0],
  [0, 0, 0],
  [0.93240737, -0.86473146, 0],
  [-0.93240737, 0.86473146, 0],
  [0, 0, 0],
  [0.60710165, -1.14483486, 0],
  [-0.60710165, 1.14483486, 0],
  [0, 0, 0],
  [0.24308753, -0.97000436, 0],
  [-0.24308753, 0.97000436, 0],
  [0, 0, 0],
  [-0.24308753, -0.97000436, 0],
  [0.24308753, 0.97000436, 0],
  [0, 0, 0],
  [-0.60710165, -1.14483486, 0],
  [0.60710165, 1.14483486, 0],
  [0, 0, 0],
  [-0.93240737, -0.86473146, 0],
  [0.93240737, 0.86473146, 0],
  [0, 0, 0],
  [-0.97000436, -0.24308753, 0],
  [0.97000436, 0.24308753, 0],
  [0, 0, 0],
];
const STEPS = FIGURE8.length / 3;

export default function ThreeBodyProfileAnim() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = 220;
    const height = 120;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x0a1931, 0);

    const mount = mountRef.current;
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    const colors = [0xffb347, 0x4fc3f7, 0xff4f81];
    const spheres = colors.map((color) => {
      const geometry = new THREE.SphereGeometry(0.5, 24, 24);
      const material = new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.2,
        metalness: 0.2,
        roughness: 0.7,
        transparent: true,
        opacity: 0.7,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return mesh;
    });
    const trailMaterials = colors.map((c) => new THREE.LineBasicMaterial({ color: c, linewidth: 1, transparent: true, opacity: 0.3 }));
    const trailGeometries = colors.map(() => new THREE.BufferGeometry());
    const trailLines = trailGeometries.map((geo, idx) => new THREE.Line(geo, trailMaterials[idx]));
    trailLines.forEach((line) => scene.add(line));
    const trails: THREE.Vector3[][] = [[], [], []];

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.3, 40);
    pointLight.position.set(0, 0, 24);
    scene.add(pointLight);

    let t = 0;
    function animate() {
      const scale = 5.5;
      const center = new THREE.Vector3(0, 0, 0);
      for (let k = 0; k < 3; k++) {
        const idx = (t + k * STEPS) % FIGURE8.length;
        const pos = new THREE.Vector3(
          FIGURE8[idx][0] * scale,
          FIGURE8[idx][1] * scale,
          FIGURE8[idx][2] * scale
        ).add(center);
        spheres[k].position.copy(pos);
        trails[k].push(pos.clone());
        if (trails[k].length > 30) trails[k].shift();
        const positions = new Float32Array(trails[k].length * 3);
        trails[k].forEach((v, idx2) => {
          positions[idx2 * 3] = v.x;
          positions[idx2 * 3 + 1] = v.y;
          positions[idx2 * 3 + 2] = v.z;
        });
        trailGeometries[k].setAttribute("position", new THREE.BufferAttribute(positions, 3));
        trailGeometries[k].setDrawRange(0, trails[k].length);
      }
      t = (t + 1) % FIGURE8.length;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      if (mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 220,
        height: 120,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.7,
      }}
    />
  );
} 