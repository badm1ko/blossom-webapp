/*  Реалистичные «лепестки» с InstancedMesh  */
(() => {
  const canvas = document.getElementById("flowerCanvas");

  /* ----- сцена ----- */
  const scene   = new THREE.Scene();
  const camera  = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ----- свет ----- */
  scene.add(new THREE.AmbientLight(0xffffff, 1.1));

  /* ----- загружаем текстуру лепестка ----- */
  const loader  = new THREE.TextureLoader();
  loader.load("petal.png", texture => {
    texture.flipY = false;

    /* геометрия — плоская плоскость 1×1, потом будем масштабировать */
    const geo = new THREE.PlaneGeometry(1, 1);
    /* материал с прозрачностью + двойная сторона */
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite:false,
      side: THREE.DoubleSide
    });

    /* InstancedMesh: один материал / геом., много копий на GPU */
    const COUNT = 450;
    const petals = new THREE.InstancedMesh(geo, mat, COUNT);
    scene.add(petals);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < COUNT; i++) {
      const radius = THREE.MathUtils.randFloat(2, 4.5);
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));

      dummy.position.setFromSphericalCoords(radius, theta, phi);
      dummy.rotation.set(
        THREE.MathUtils.randFloat(0, Math.PI),
        THREE.MathUtils.randFloat(0, Math.PI),
        THREE.MathUtils.randFloat(0, Math.PI)
      );
      const scale = THREE.MathUtils.randFloat(0.4, 0.9);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      petals.setMatrixAt(i, dummy.matrix);
    }
    petals.instanceMatrix.needsUpdate = true;

    /* анимация */
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      // лёгкое дыхание
      petals.rotation.y = t * 0.05;
      petals.rotation.x = Math.sin(t * 0.3) * 0.15;

      renderer.render(scene, camera);
    }
    animate();
  });

  /* ----- адаптив ----- */
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* OrbitControls (по желанию) */
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom  = false;
  controls.enablePan   = false;
  controls.autoRotate  = false;
})();
