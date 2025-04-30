// ⚙️ эта строка → появится в консоли, означает «скрипт подгрузился»
console.log("⚙️ flower3d.js loaded");

const canvas = document.getElementById("flowerCanvas");
const scene   = new THREE.Scene();
const camera  = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, .1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas, alpha:true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);

// ­— свет
scene.add(new THREE.AmbientLight(0xffffff, 1.1));

// ­— один материал с текстурой лепестка
const texLoader = new THREE.TextureLoader();
const base     = import.meta.url.replace("flower3d.js", "");
const petalTex = loader.load(base + "petal.png"); {
    const geometry = new THREE.PlaneGeometry(.5,.7);
    const material = new THREE.MeshBasicMaterial({ map:texture, transparent:true, side:THREE.DoubleSide });

    const petals = [];
    for(let i=0;i<120;i++){
        const mesh = new THREE.Mesh(geometry, material);
        resetPetal(mesh, true);
        scene.add(mesh);
        petals.push(mesh);
    }

    // ­— анимация
    function animate(){
        requestAnimationFrame(animate);
        petals.forEach(p=>{
            p.rotation.z += 0.01;
            p.position.y -= 0.02 + p.userData.speed;
            p.position.x += Math.sin(Date.now()*0.001+p.userData.offset)*0.005;

            if(p.position.y < -4) resetPetal(p,false);
        });
        renderer.render(scene, camera);
    }
    animate();

    function resetPetal(mesh,init){
        mesh.position.set(
            THREE.MathUtils.randFloatSpread(8),
            init? THREE.MathUtils.randFloat(1,4) : THREE.MathUtils.randFloat(4,6),
            THREE.MathUtils.randFloatSpread(2)
        );
        mesh.rotation.set(
            0,
            0,
            THREE.MathUtils.degToRad(Math.random()*360)
        );
        mesh.userData.speed  = Math.random()*0.02;
        mesh.userData.offset = Math.random()*Math.PI*2;
    }
});

// ­— адаптив
addEventListener("resize",()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});
