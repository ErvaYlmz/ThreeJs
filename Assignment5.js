import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/OBJLoader.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 1;
camera.position.x = -3;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(new THREE.Color(0x87ceeb));

const groundTexture = new THREE.TextureLoader().load(
  "./texture-grass-field_1232-251.jpg"
);
scene.background = groundTexture;

const dogTexture = new THREE.TextureLoader().load("./dog-120.png");

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function init(geometry) {
  const material = new THREE.MeshMatcapMaterial({
    //map: dogTexture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
  const radius = 0.35;
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  sphere.position.set(15, 1, 0);
  const speed = 0.15;

  function animateSphere() {
    sphere.position.x -= speed;

    // If the sphere is out of the view, remove it
    if (sphere.position.x < -10) {
      scene.remove(sphere);
    }
    requestAnimationFrame(animateSphere);
  }
  animateSphere();
}

const loader = new OBJLoader();
loader.load("./dog.obj", (obj) => init(obj.children[0].geometry));

initMovingObject();

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
