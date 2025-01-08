import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from "./img/stars.jpg";
import sunTexture from "./img/sun.jpg";
import mercuryTexture from "./img/mercury.jpg";
import venusTexture from "./img/venus.jpg";
import earthTexture from "./img/earth.jpg";
import marsTexture from "./img/mars.jpg";
import jupiterTexture from "./img/jupiter.jpg";
import saturnTexture from "./img/saturn.jpg";
import uranusTexture from "./img/uranus.jpg";
import neptuneTexture from "./img/neptune.jpg";
import saturnRingTexture from "./img/saturn ring.png";
import uranusRingTexture from "./img/uranus ring.png";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-90, 140, 140);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture, starsTexture, starsTexture,
  starsTexture, starsTexture, starsTexture
]);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(12, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ map: textureLoader.load(sunTexture) });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const pointLight = new THREE.PointLight(0xffffff, 3, 300, 0.1); // Single point light to illuminate everything
pointLight.position.set(0, 0, 0); // Place it at the Sun's position initially
scene.add(pointLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 5); 
sunLight.position.set(0, 0, 0); 
sunLight.castShadow = true; 
scene.add(sunLight);

function createPlanet(size, texture, position, ring) {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
    metalness: 0.3,
    roughness: 0.7
  });

  const planet = new THREE.Mesh(geometry, material);
  planet.castShadow = true; 
  planet.receiveShadow = true; 
  const planetObj = new THREE.Object3D();
  planetObj.add(planet);
  scene.add(planetObj);
  planet.position.x = position;

  if (ring) {
    const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
      transparent: true
    });

    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.receiveShadow = true; 
    planetObj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  return { planet, planetObj };
}

const Mercury = createPlanet(5, mercuryTexture, 20);
const Venus = createPlanet(12, venusTexture, 40);
const Earth = createPlanet(13, earthTexture, 60);
const Mars = createPlanet(7, marsTexture, 80);
const Jupiter = createPlanet(35, jupiterTexture, 120);
const Saturn = createPlanet(30, saturnTexture, 160, { innerRadius: 32, outerRadius: 50, texture: saturnRingTexture });
const Uranus = createPlanet(20, uranusTexture, 200, { innerRadius: 22, outerRadius: 35, texture: uranusRingTexture });
const Neptune = createPlanet(18, neptuneTexture, 240);

function animate() {
  requestAnimationFrame(animate);

  sun.rotateY(0.002);
  pointLight.position.set(sun.position.x, sun.position.y, sun.position.z); // Move point light with the Sun

  Mercury.planet.rotateY(0.01);
  Mercury.planetObj.rotateY(0.01);

  Venus.planet.rotateY(0.005);
  Venus.planetObj.rotateY(0.005);

  Earth.planet.rotateY(0.02);
  Earth.planetObj.rotateY(0.02);

  Mars.planet.rotateY(0.015);
  Mars.planetObj.rotateY(0.015);

  Jupiter.planet.rotateY(0.03);
  Jupiter.planetObj.rotateY(0.005);

  Saturn.planet.rotateY(0.02);
  Saturn.planetObj.rotateY(0.004);

  Uranus.planet.rotateY(0.025);
  Uranus.planetObj.rotateY(0.0025);

  Neptune.planet.rotateY(0.028);
  Neptune.planetObj.rotateY(0.002);

  orbit.update();
  renderer.render(scene, camera);
}

animate();
