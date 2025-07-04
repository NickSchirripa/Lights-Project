import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug and Debug Folders
const gui = new GUI();

const ambientTweaks = gui.addFolder("Ambient Light");
const directionalTweaks = gui.addFolder("Directional Light");
const hemiSphereTweaks = gui.addFolder("Hemisphere Light");
const pointLightTweaks = gui.addFolder("Point Light");

ambientTweaks.close();
directionalTweaks.close();
hemiSphereTweaks.close();
pointLightTweaks.close();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

//Ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

ambientTweaks.add(ambientLight, "intensity").min(0).max(3).step(0.01);
ambientTweaks
  .addColor(ambientLight, "color")
  .name("Color Picker")
  .onChange(() => {
    ambientLight.color.set(ambientLight.color);
  });

//Directional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

directionalTweaks.add(directionalLight, "intensity").min(0).max(3).step(0.01);
directionalTweaks
  .addColor(directionalLight, "color")
  .name("Color Picker")
  .onChange(() => {
    directionalLight.color.set(directionalLight.color);
  });

const directionalLightMove = directionalTweaks.addFolder("Move");

directionalLightMove
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.01);

directionalLightMove
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.01);

directionalLightMove
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.01);

//hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
scene.add(hemisphereLight);
hemisphereLight.intensity = 1;
hemisphereLight.color = new THREE.Color(0xff0000);
hemisphereLight.groundColor = new THREE.Color(0x0000ff);

hemiSphereTweaks.add(hemisphereLight, "intensity").min(0).max(3).step(0.01);
hemiSphereTweaks
  .addColor(hemisphereLight, "color")
  .name("Sky Color")
  .onChange(() => {
    hemisphereLight.color.set(hemisphereLight.color);
  });

hemiSphereTweaks
  .addColor(hemisphereLight, "groundColor")
  .name("Ground Color")
  .onChange(() => {
    hemisphereLight.color.set(hemisphereLight.color);
  });

//point light
const pointLight = new THREE.PointLight(0xff900, 1.5);
scene.add(pointLight);

pointLightTweaks.add(pointLight, "intensity").min(0).max(3).step(0.01);
pointLightTweaks
  .addColor(pointLight, "color")
  .name("Color Picker")
  .onChange(() => {
    pointLight.color.set(pointLight.color);
  });

const pointLightMove = pointLightTweaks.addFolder("Move");

pointLightMove.add(pointLight.position, "x").min(-5).max(5).step(0.01);

pointLightMove.add(pointLight.position, "y").min(-5).max(5).step(0.01);

pointLightMove.add(pointLight.position, "z").min(-5).max(5).step(0.01);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
