// yapmamız gerekenler:
// 1. kameranın sabit kalmasını sağlamak (yapıldı)
// 2. köpeği sadece yukarı-aşağı hareket ettirmek (büyük ihtimalle dogUpdate fonksiyonun eventListener kısmında hata var)
// 3. köpek ve topun üst üste gelince topun yok olmasını sağlamak (initMovingObject fonksiyonunda if condition ekledim ama nedense olmuyo)
// 4. yakalanan top sayına göre puan eklemek (optional)
// 5. toplara png eklemek (optional) ve daha iyi bi arka plan fotoğrafı bulunabilir


// bu arada js in işleyişine pek hakim değilsen şundan haberdar edeyim:
// c deki printf("%d",dogPositionX); yerine console.log(dogPositionX); kullanabilirsin
// sonra web sayfasında f12 yapıp console a girip print edip etmediğine bakabilirsin

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/OBJLoader.js";

const w = window.innerWidth-5;
const h = window.innerHeight-5;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
var point=0;

const dog= new THREE.Mesh();
dog.position.x=0;
dog.position.y=0;
dog.position.z=0;
scene.add(dog);

//kameranın köpeğe ve toplara baktığı pozisyon
camera.position.z = 5;
camera.position.y = 1;
camera.position.x = -4;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

//ground Texture : arka plan fotoğrafı

const groundTexture = new THREE.TextureLoader().load(
  "./texture-grass-field_1232-251.jpg"
);
scene.background = groundTexture;

//dog texture : köpeğin arka planı
const dogTexture = new THREE.TextureLoader().load("./dog-120.png");

// const controls = new OrbitControls(dog, renderer.domElement); // camera idi
// controls.update();

let dogPositionY=0;
let dogPositionX=-5;
let dogPositionZ = 0;

function init(geometry) {
  const material = new THREE.MeshMatcapMaterial({
    //map: dogTexture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.x=dogPositionX;
  mesh.position.z=dogPositionZ;
  mesh.position.y = dogPositionY;

  const sunlight = new THREE.DirectionalLight(0xffffff);
  sunlight.position.y = 2;
  scene.add(sunlight);

  const filllight = new THREE.DirectionalLight(0x88ccff);
  filllight.position.x = 1;
  filllight.position.y = -2;
  scene.add(filllight);

  animate();
}

function initMovingObject() {
    // top büyüklüğü
  const radius = 0.2; 
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // color yerine texture için './top_arkaPlanı.png' koyabilirsin
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  sphere.position.set(15, Math.floor(Math.random() * 7)-2, 0);

  //top hızı
  const speed = 0.15;

  function animateSphere() {
    sphere.position.x -= speed;

    // top ekran dışındaysa sil
    if (sphere.position.x < -10) {
      scene.remove(sphere);
    }

    //silincek
    console.log(dogPositionX);
    console.log(dogPositionY);

    // top köpekle çakışıyorsa topu sil ve puan ekle
    if(sphere.position.x == dogPositionX && (sphere.position.y <= dogPositionY)){
        scene.remove(sphere);
        point++;
        console.log(point);
    }
    requestAnimationFrame(animateSphere);
  }
  animateSphere();
}

const loader = new OBJLoader();
loader.load("./dog.obj", (obj) => init(obj.children[0].geometry));

var i;

//art arda gelen toplar
initMovingObject();
for (i = 1; i < 16; i++) { // 15 tane top 1er saniye aralıklarla geliyor
  setTimeout(initMovingObject, i*1000);
}

function updateDog(){
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
          dogPositionY += 0.5;
        } 
        else if (event.key === "ArrowDown") {
          dogPositionY -= 0.5;
        }
      });
}
// nedense dog hareket etmiyo diye fonksiyonu her fırsatta çağırmaya çalıştım
updateDog();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
    updateDog();
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
animate();
