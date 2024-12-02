import * as THREE from "three";

/**
 * Sets up a basic THREE.js scene with a perspective camera and a WebGL renderer.
 * Appends the renderer to a DOM element with the id "container-three".
 * @returns An object containing the scene, camera, and renderer.
 */
export function setupScene() {
  let scene: THREE.Scene = new THREE.Scene();

  let camera: THREE.PerspectiveCamera;

  const fov = 75;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 10000;

  camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  camera.position.z = 800;

  let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  let container = document.getElementById("container-three")!;
  container.appendChild(renderer.domElement);

  return {
    scene,
    camera,
    renderer,
  };
}
