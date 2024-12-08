import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {
  EffectComposer,
  OutputPass,
  RenderPass,
  UnrealBloomPass,
} from 'three/examples/jsm/Addons.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js'

/**
 * Sets up a basic THREE.js scene with a perspective camera and a WebGL renderer.
 * Appends the renderer to a DOM element with the id "container-three".
 * @returns An object containing the scene, camera, and renderer.
 */
export function setupScene2() {
  // Dimensions for canvas.
  const dim: [number, number] = [480, 480]

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
  camera.position.z = 60
  camera.lookAt(scene.position)

  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
  })
  renderer.autoClear = false
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(...dim)
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.shadowMap.enabled = true

  const renderScene = new RenderPass(scene, camera)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(dim[0], dim[1]),
    1.5,
    0.4,
    0.85,
  )
  bloomPass.threshold = 0
  bloomPass.strength = 0.4
  bloomPass.radius = 0.5

  const bloomComposer = new EffectComposer(renderer)
  bloomComposer.renderToScreen = false
  bloomComposer.addPass(renderScene)
  bloomComposer.addPass(bloomPass)

  const outputPass = new OutputPass()

  const composer = new EffectComposer(renderer)
  const renderPixelatedPass = new RenderPixelatedPass(5, scene, camera)

  composer.addPass(renderScene)
  composer.addPass(renderPixelatedPass)
  composer.addPass(bloomPass)
  composer.addPass(outputPass)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.listenToKeyEvents(window)
  // controls.maxPolarAngle = Math.PI * 0.5
  controls.minDistance = 5
  controls.maxDistance = 1000
  controls.enablePan = false

  return {
    scene,
    camera,
    renderer,
    controls,
    composer,
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
  const dim: [number, number] = [720, 720]

  const scene: THREE.Scene = new THREE.Scene()

  const fov = 35
  const aspectRatio = dim[0] / dim[1]
  const near = 0.1
  const far = 1000

  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    near,
    far,
  )

  camera.position.z = 5

  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
  })
  renderer.autoClear = false
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(...dim)
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.shadowMap.enabled = true

  const renderScene = new RenderPass(scene, camera)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(dim[0], dim[1]),
    1.5,
    0.4,
    0.85,
  )
  bloomPass.threshold = 0
  bloomPass.strength = 0.4
  bloomPass.radius = 0.5

  const bloomComposer = new EffectComposer(renderer)
  bloomComposer.renderToScreen = false
  bloomComposer.addPass(renderScene)
  bloomComposer.addPass(bloomPass)

  const outputPass = new OutputPass()

  const composer = new EffectComposer(renderer)
  const renderPixelatedPass = new RenderPixelatedPass(1, scene, camera)

  composer.addPass(renderScene)
  composer.addPass(renderPixelatedPass)
  composer.addPass(bloomPass)
  composer.addPass(outputPass)

  const div = document.getElementById('container-sub-three')!
  div.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 1
  controls.maxDistance = 12
  controls.enablePan = false
  controls.maxPolarAngle = Math.PI * 0.5

  camera.position.set(0, 8, 5)

  // const controls = new FlyControls(camera, renderer.domElement)
  // controls.movementSpeed = 100
  // controls.rollSpeed = Math.PI / 24
  // controls.autoForward = false
  // controls.dragToLook = true

  return {
    scene,
    camera,
    renderer,
    controls,
    composer,
  }
}
