"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Figure-8 yörüngesi için önceden hesaplanmış veri (örnek)
const FIGURE8 = [
  // x, y, z (z hep 0)
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

export default function ThreeBodyBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x0a1931, 0);

    const mount = mountRef.current;
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    // Küre renkleri
    const colors = [0xffb347, 0x4fc3f7, 0xff4f81];
    // Küre meshleri
    const spheres = colors.map((color) => {
      const geometry = new THREE.SphereGeometry(1.1, 32, 32);
      const material = new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        metalness: 0.3,
        roughness: 0.5,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return mesh;
    });

    // Trail (iz) için
    const trailMaterials = colors.map((c) => new THREE.LineBasicMaterial({ color: c, linewidth: 1, transparent: true, opacity: 0.5 }));
    const trailGeometries = colors.map(() => new THREE.BufferGeometry());
    const trailLines = trailGeometries.map((geo, idx) => new THREE.Line(geo, trailMaterials[idx]));
    trailLines.forEach((line) => scene.add(line));
    const trails: THREE.Vector3[][] = [[], [], []];

    // Işıklar
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight.position.set(0, 0, 40);
    scene.add(pointLight);

    // Animasyon
    let t = 0;
    function animate() {
      // Figure-8 yörüngesini ekrana ortala ve ölçekle
      const scale = 12;
      const center = new THREE.Vector3(0, 0, 0);
      for (let k = 0; k < 3; k++) {
        const idx = (t + k * STEPS) % FIGURE8.length;
        const pos = new THREE.Vector3(
          FIGURE8[idx][0] * scale,
          FIGURE8[idx][1] * scale,
          FIGURE8[idx][2] * scale
        ).add(center);
        spheres[k].position.copy(pos);
        // Trail güncelle
        trails[k].push(pos.clone());
        if (trails[k].length > 40) trails[k].shift();
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

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// Bu dosyadaki animasyon artık kullanılmıyor. Profil kartı için ThreeBodyProfileAnim kullanılacak. 