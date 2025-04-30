/*  Simple “flying petals” scene  */
(() => {
  const canvas  = document.getElementById("flowerCanvas");
  const scene   = new THREE.Scene();
  const camera  = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ---------- свет ---------- */
  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  /* ---------- “букет” ---------- */
  const petals = new THREE.Group();
  scene.add(petals);

  const geo   = new THREE.SphereGeometry(0.12, 12, 12);  // маленький лепесток-шар
  const mat   = new THREE.MeshStandardMaterial({ color: 0xff6ba0 });

  for (let i = 0; i < 250; i++) {
    const m = new THREE.Mesh(geo, mat.clone());
    const radius = 2 + Math.random() * 3;
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.acos(THREE.MathUtils.randFloatSpread(2)); // равномерно по сфере
    m.position.setFromSphericalCoords(radius, theta, phi);
    m.material.color.offsetHSL(0, THREE.MathUtils.randFloat(-0.05, 0.05), THREE.MathUtils.randFloat(-0.1, 0.1));
    petals.add(m);
  }

  /* ---------- анимация ---------- */
  function animate() {
    requestAnimationFrame(animate);
    petals.rotation.y += 0.0008;
    petals.rotation.x += 0.0004;
    renderer.render(scene, camera);
  }
  animate();

  /* ---------- адаптив ---------- */
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* (необязательно) дать пользователю покрутить */
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan  = false;
  controls.autoRotate = false;
})();
