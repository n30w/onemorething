import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

/**
 * Sets up a basic THREE.js scene with a perspective camera and a WebGL renderer.
 * Appends the renderer to a DOM element with the id "container-three".
 * @returns An object containing the scene, camera, and renderer.
 */
export function setupScene2() {
  // Dimensions for canvas.
  const dim: [number, number] = [720, 720]

  const scene: THREE.Scene = new THREE.Scene()

  const fov = 70
  const aspectRatio = dim[0] / dim[1]
  const near = 0.1
  const far = 1000

  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    near,
    far,
  )

  camera.position.z = 20

  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  // renderer.autoClear = false
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(...dim)

  const div = document.getElementById('container-three')!
  div.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 5
  controls.maxDistance = 1000
  controls.enablePan = false

  return {
    scene,
    camera,
    renderer,
  }
}

export function setupScene() {
  // Dimensions for canvas.
  const dim: [number, number] = [720, 720]

  const scene: THREE.Scene = new THREE.Scene()

  const fov = 33
  const aspectRatio = dim[0] / dim[1]
  const near = 0.1
  const far = 10000

  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    near,
    far,
  )

  camera.position.z = 20

  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  renderer.autoClear = false
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(...dim)

  const div = document.getElementById('container-three')!
  div.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 5
  controls.maxDistance = 1000
  controls.enablePan = false

  return {
    scene,
    camera,
    renderer,
  }
}

export function setupSubScene() {
  // Dimensions for canvas.
  const dim: [number, number] = [480, 480]

  const scene: THREE.Scene = new THREE.Scene()

  const fov = 30
  const aspectRatio = dim[0] / dim[1]
  const near = 0.1
  const far = 1000

  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    near,
    far,
  )

  camera.position.z = 110

  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  renderer.autoClear = false
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(...dim)

  const div = document.getElementById('container-sub-three')!
  div.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 5
  controls.maxDistance = 110
  controls.enablePan = false

  return {
    scene,
    camera,
    renderer,
  }
}
