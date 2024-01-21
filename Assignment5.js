// yapmamız gerekenler:
// 1. kameranın sabit kalmasını sağlamak (yapıldı)
// 2. köpeği sadece yukarı-aşağı hareket ettirmek (yapıldı ????)
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

document.getElementById('container').innerHTML="Points: "+point;

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
  "./marble.jpg"
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
  mesh.position.x=-5;
  mesh.position.z=0;
  mesh.position.y = 0;
  updateDog(mesh);

  const sunlight = new THREE.DirectionalLight(0xffffff);
  sunlight.position.y = 2;
  scene.add(sunlight);

  const filllight = new THREE.DirectionalLight(0x88ccff);
  filllight.position.x = 1;
  filllight.position.y = -2;
  scene.add(filllight);

  animate();
}
let intervalId = null;


function initMovingObject() {
  // top büyüklüğü
  const radius = 0.2; 
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('./bubble.png') });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  sphere.position.set(15, Math.floor(Math.random() * 7)-2, 0);

  //top hızı
  const speed = 0.15;

  function animateSphere() {
    sphere.position.x -= speed;

    // top ekran dışındaysa sil
    if (sphere.position.x < -15) {
      scene.remove(sphere);
    }

    // top köpekle çakışıyorsa topu sil ve puan ekle
    if(Math.abs(sphere.position.x - dogPositionX) < 0.7 && Math.abs(sphere.position.y - dogPositionY) < 0.7){
        point++;
        document.getElementById('container').innerHTML="Points: "+point;
        scene.remove(sphere);
        console.log("Points:"+point);
    }

    // toplam puan 150'yi geçince top üretimi durdur ve ekrana "Good Job!" yaz
    if(point > 150){
        clearInterval(intervalId);
        document.getElementById('container').innerHTML="Good Job!";
    }

    requestAnimationFrame(animateSphere);
  }
  animateSphere();
}

// Her 3 saniyede bir top üret
intervalId = setInterval(initMovingObject, 3000);

// Top üretmeyi durdurmak için bu satırı kullanabilirsiniz:
// clearInterval(intervalId);




const loader = new OBJLoader();
loader.load("./dog.obj", (obj) => init(obj.children[0].geometry));

var i;

//art arda gelen toplar
initMovingObject();
for (i = 1; i < 16; i++) { // 15 tane top 1er saniye aralıklarla geliyor
  setTimeout(initMovingObject, i*1000);
}

function updateDog(mesh) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        mesh.position.y+=0.5;
        dogPositionY += 0.5;
      } else if (e.key === 'ArrowDown') {
        mesh.position.y-=0.5;
        dogPositionY -= 0.5;
      }
    });
  }

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
animate();
