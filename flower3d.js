/* eslint-disable no-undef */
import * as THREE from "https://esm.sh/three@0.160.0";   // локальная копия three.js

const canvas   = document.getElementById('scene');
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* адаптивный размер */
function resize(){
  const w = canvas.parentElement.clientWidth;
  const h = canvas.parentElement.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

/* лепестки ------------------------------------------------------- */
const loader   = new THREE.TextureLoader();
const tex      = loader.load('./petal.png');
const mat      = new THREE.MeshLambertMaterial({map:tex, transparent:true, side:THREE.DoubleSide});
const geo      = new THREE.PlaneGeometry(0.35,0.55);
const petals   = new THREE.Group();
for(let i=0;i<180;i++){
  const p = new THREE.Mesh(geo, mat);
  p.position.set((Math.random()-0.5)*16, Math.random()*10, (Math.random()-0.5)*16);
  p.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
  petals.add(p);
}
scene.add(petals);

/* свет */
scene.add(new THREE.AmbientLight(0xffffff,1.3));

camera.position.z = 8;

/* анимация */
function tick(){
  requestAnimationFrame(tick);
  petals.rotation.y += 0.0009;
  petals.children.forEach(p=>{
    p.position.y -= 0.02;
    p.rotation.x += 0.005;
    if(p.position.y<-2) p.position.y = 10+Math.random()*2;
  });
  renderer.render(scene,camera);
}
tick();

