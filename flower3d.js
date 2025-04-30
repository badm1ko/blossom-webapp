/* eslint-disable no-undef */
/* 3-d «летающие лепестки» */

import * as THREE from './three.module.min.js';   // локальная копия!

const canvas   = document.getElementById('flowerCanvas');
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
const loader   = new THREE.TextureLoader();

function resize() {
  const w = canvas.parentElement.clientWidth;
  const h = window.innerHeight * 0.6;          // высота hero-блока ≈ 60 %
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// ---------- материал «лепестка» ----------
const tex = loader.load('./petal.png');
const mat = new THREE.MeshLambertMaterial({
  map: tex,
  transparent: true,
  side: THREE.DoubleSide,
});

// ---------- создаём 200 лепестков ----------
const petalGeo = new THREE.PlaneGeometry(0.4, 0.6, 1, 1);
const group    = new THREE.Group();
for (let i = 0; i < 200; i++) {
  const mesh = new THREE.Mesh(petalGeo, mat);
  mesh.position.set(
    (Math.random() - 0.5) * 20,
    Math.random()        * 10,
    (Math.random() - 0.5) * 20
  );
  mesh.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  group.add(mesh);
}
scene.add(group);

// ---------- свет ----------
scene.add(new THREE.AmbientLight(0xffffff, 1.2));

// ---------- камера ----------
camera.position.z = 8;

// ---------- анимация ----------
function animate() {
  requestAnimationFrame(animate);
  group.rotation.y += 0.0008;
  group.children.forEach(p => {
    p.position.y -= 0.01;
    if (p.position.y < -2) p.position.y = 10;
  });
  renderer.render(scene, camera);
}
animate();
