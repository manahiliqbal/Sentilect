// components/Sparkles.js
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Sparkles = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create diamond-like sparkles
    const geometry = new THREE.OctahedronGeometry(5, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 1,
      roughness: 0,
      emissive: 0x8888ff
    });
    
    const sparkles = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const sparkle = new THREE.Mesh(geometry, material);
      sparkle.position.set(
        Math.random() * window.innerWidth - window.innerWidth / 2,
        Math.random() * window.innerHeight - window.innerHeight / 2,
        Math.random() * 100 - 50
      );
      sparkles.add(sparkle);
    }
    scene.add(sparkles);

    camera.position.z = 50;

    const animate = () => {
      requestAnimationFrame(animate);
      sparkles.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
      scene.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }} />;
};

export default Sparkles;
