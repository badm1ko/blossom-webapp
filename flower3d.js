import * as THREE from "https://esm.sh/three@0.160.0";
import {OrbitControls} from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, .1, 1000);
camera.position.set(0, 1, 8);

const renderer = new THREE.WebGLRenderer({canvas: document.getElementById("scene"), alpha:true});
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);

/* ---------- частицы-лепестки -------------------------------- */
const loader = new THREE.TextureLoader();
const baseURL = import.meta.url.replace("flower3d.js", "");
const petal = loader.load(baseURL + "petal.png");

const COUNT = 450;
const geo = new THREE.BufferGeometry();
const positions = new Float32Array(COUNT*3);
const speeds = new Float32Array(COUNT);

for(let i=0;i<COUNT;i++){
  positions[i*3  ] = (Math.random()-0.5)*20;  // x
  positions[i*3+1] = Math.random()*10;        // y
  positions[i*3+2] = (Math.random()-0.5)*20;  // z
  speeds[i] = .02 + Math.random()*0.04;       // персональная скорость
}
geo.setAttribute("position", new THREE.BufferAttribute(positions,3));
geo.setAttribute("speed",     new THREE.BufferAttribute(speeds,1));

const mat = new THREE.PointsMaterial({
  size: .55, map: petal, transparent:true, depthWrite:false
});
const petals = new THREE.Points(geo, mat);
scene.add(petals);

/* ---------- свет + мягкий фон --------------------------- */
const hemi = new THREE.HemisphereLight(0xffffff,0x444444,1.2);
scene.add(hemi);
scene.background = null;

/* ---------- управление (в Telegram WebView вращение отключаем) */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false; controls.enablePan = false;
controls.enableRotate = false;

/* ---------- анимация ----------------------------------- */
function animate(){
  requestAnimationFrame(animate);
  const pos = geo.attributes.position.array;
  for(let i=0;i<COUNT;i++){
    pos[i*3+1] -= speeds[i];           // падаем по Y
    pos[i*3  ] += Math.sin(performance.now()/1000+ i)*0.003; // лёгкое колебание
    if(pos[i*3+1] < -1){              // если вышли за низ – респавн
      pos[i*3+1] = 9;
    }
  }
  geo.attributes.position.needsUpdate = true;
  renderer.render(scene,camera);
}
animate();

addEventListener("resize", ()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
