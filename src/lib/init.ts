import { setupScene, setupScene2, setupSubScene } from './render/scene'
import dat from 'dat.gui'
import * as THREE from 'three'
import {
  BasicPlane,
  makeCSG,
  makeLights,
  makeSubLights,
  Satellite,
} from './elements'
import Stats from 'stats.js'
import { animationBuilder } from './render/animation'
import { SUBTRACTION, Evaluator } from 'three-bvh-csg'

import p5 from 'p5'
import { Font, FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { generateTextualObjects } from './pieces/textualObject'

export function initThree2(p5: p5) {
  const { scene, camera, renderer } = setupScene2()
  const animate = animationBuilder(renderer, scene, camera)

  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(1, 1, 1).normalize()
  scene.add(light)

  let INTERSECTED: any

  scene.background = new THREE.Color(0xffffff)

  generateTextualObjects(scene)

  const raycaster = new THREE.Raycaster()

  const pointer = new THREE.Vector2()

  renderer.setAnimationLoop(
    animate(new Stats(), () => {
      camera.lookAt(scene.position)

      camera.updateMatrixWorld()

      // find intersections

      raycaster.setFromCamera(pointer, camera)

      const intersects = raycaster.intersectObjects(scene.children, false)
      if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
          if (INTERSECTED)
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

          INTERSECTED = intersects[0].object
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
          INTERSECTED.material.emissive.setHex(0xff0000)
        }
      } else {
        if (INTERSECTED)
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)

        INTERSECTED = null
      }
    }),
  )

  const canvas = document.getElementById('container-three')!

  canvas.addEventListener('mousemove', onPointerMove)
  function onPointerMove(event: { clientX: number; clientY: number }) {
    const rect = canvas.getBoundingClientRect() // Get canvas position and dimensions
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1 // Normalize to [-1, 1]
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1 // Normalize to [-1, 1]
  }
}

/**
 * initThree sets up anything related to Three JS.
 * It is then used in the p5 sketch function.
 * @param p5 an instance of p5 in order to use p5 helper functions, like noise.
 */
export function initThree(p5: p5) {
  const { scene, camera, renderer } = setupScene()
  const { baseBrush, brush, core } = makeCSG()

  let result: any

  let frame = 0

  //   const gui = new dat.GUI()

  const stats: Stats = new Stats()
  stats.showPanel(0)

  const animate = animationBuilder(renderer, scene, camera)

  document.body.appendChild(stats.dom)

  //   let plane: BasicPlane = new BasicPlane()
  let sun: Satellite = new Satellite(0xaf0f0f, 100)
    .setOrbitCenter(0, 0, 0)
    .setOrbitRadius(700)
  let moon: Satellite = new Satellite()
    .setOrbitCenter(0, 0, 0)
    .setOrbitRadius(-700)

  //   scene.add(sun.mesh, moon.mesh)

  scene.background = new THREE.Color(0xfce4ec)

  // lights
  const { ambiLight, dirLight } = makeLights()

  scene.add(ambiLight)
  scene.add(dirLight)

  // add shadow plane
  const plane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.ShadowMaterial({
      color: 0xd81b60,
      transparent: true,
      opacity: 0.075,
      side: THREE.DoubleSide,
    }),
  )
  plane2.position.y = -3
  plane2.rotation.x = -Math.PI / 2
  plane2.scale.setScalar(10)
  plane2.receiveShadow = true
  scene.add(plane2)

  // create brushes
  const evaluator = new Evaluator()

  scene.add(core)

  // create wireframe
  const wireframe = new THREE.Mesh(
    undefined,
    new THREE.MeshBasicMaterial({ color: 0x009688, wireframe: true }),
  )
  scene.add(wireframe)

  const startTime = window.performance.now() // Record start time for animation
  const animationDuration = 2000

  renderer.setAnimationLoop(
    animate(stats, () => {
      frame++

      //   let posArray = plane.geometry.attributes.position.array
      //   for (let i = 0; i < posArray.length; i += 3) {
      //     let x = posArray[i + 0]
      //     let y = posArray[i + 1]

      //     let xOffset = (x + 2) * 0.005 + frame * 0.002
      //     let yOffset = (y + 19) * 0.005 + frame * 0.001
      //     let amp = 8

      //     let noiseValue = (p5.noise(xOffset, yOffset) * amp) ** 2.8

      //     posArray[i + 2] = noiseValue // update the z value.
      //   }

      //   plane.geometry.attributes.position.needsUpdate = true

      // update the transforms
      const t = window.performance.now() + 9000

      brush.rotation.x = t * -0.0002
      brush.rotation.y = t * -0.0005
      brush.rotation.z = t * -0.001

      //   const s = 0.5 + 0.5 * (1 + Math.sin(t * 0.001))
      //   brush.scale.set(s, 1, s)
      //   brush.updateMatrixWorld()

      const elapsedTime = window.performance.now() - startTime

      // Animate the brush for a specific duration
      if (elapsedTime <= animationDuration) {
        const t = elapsedTime / animationDuration // Normalized time (0 to 1)
        const scaleValue = 1 + t * 2 // Smooth animation curve
        brush.scale.set(scaleValue, scaleValue, scaleValue)
        brush.updateMatrixWorld()
      }

      evaluator.useGroups = true
      result = evaluator.evaluate(baseBrush, brush, SUBTRACTION, result)

      result.castShadow = true
      result.receiveShadow = true

      scene.add(result)

      wireframe.geometry = result.geometry
      wireframe.visible = true

      sun.update()
      moon.update()
    }),
  )
}

export function initSubThree(p5: p5) {
  const { scene, camera, renderer } = setupSubScene()
  // const { baseBrush, brush } = makeCSG()

  let result: any
  let frame = 0

  const stats: Stats = new Stats()

  const animate = animationBuilder(renderer, scene, camera)

  // scene.background = new THREE.Color(0xfce4e0)
  scene.background = new THREE.Color(0xffffff)

  // lights
  const { ambiLight, dirLight } = makeSubLights()

  scene.add(ambiLight)
  scene.add(dirLight)

  // create brushes
  const evaluator = new Evaluator()

  const group = new THREE.Group()
  group.position.y = 0

  const fontLoader = new FontLoader()

  const textGeometryParams = (font: Font) => {
    return {
      font: font,
      size: 3,
      height: 0.05,
      curveSegments: 2,
      bevelEnabled: true,
      bevelThickness: 0.5,
      bevelSize: 0.1,
      bevelSegments: 3,
    }
  }

  // Create a standard material with red color and 50% gloss
  const textMaterial = new THREE.MeshStandardMaterial({
    color: 'black',
    roughness: 0.1,
    wireframe: true,
  })

  const myText = `Meek Mill and Drake and Neo`
  const texts = [
    `Meek Mill and Drake and Neo`,
    `Meek Mill and Drake and Neo`,
    `Meek Mill and Drake and Neo`,
    `Meek Mill and Drake and Neo`,
    `Meek Mill and Drake and Neo`,
    `Meek Mill and Drake and Neo`,
    `Meek Mill and Drake and Neo`,
    `Meek Mill and Drake and Neo`,
    `Meek Mill and Drake and Neo`,
    `Meek Mill and Drake and Neo`,
    `Create an album together`,
    `and then what?`,
    `who knows then what`,
  ]

  fontLoader.load(
    'https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json',
    font => {
      for (let i = 0; i < texts.length; i++) {
        const textGeometry = new TextGeometry(
          texts[i],
          textGeometryParams(font),
        )

        const textMesh = new THREE.Mesh(textGeometry, textMaterial)

        textMesh.position.set(-myText.length, -1 - i * 4, 0)
        group.position.y += i / 3.3
        group.add(textMesh)
      }
    },
  )

  scene.add(group)

  // create wireframe
  const wireframe = new THREE.Mesh(
    undefined,
    new THREE.MeshBasicMaterial({ color: 0x009688, wireframe: true }),
  )
  scene.add(wireframe)

  const startTime = window.performance.now() // Record start time for animation
  const animationDuration = 4000

  renderer.setAnimationLoop(
    animate(stats, () => {
      frame++

      // update the transforms
      // const t = window.performance.now() + 9000

      // brush.rotation.x = t * -0.0002
      // brush.rotation.y = t * -0.0005
      // brush.rotation.z = t * -0.001

      // const elapsedTime = window.performance.now() - startTime

      // // Animate the brush for a specific duration
      // if (elapsedTime <= animationDuration) {
      //   const t = elapsedTime / animationDuration // Normalized time (0 to 1)
      //   const scaleValue = 1 + t * 2 // Smooth animation curve
      //   brush.scale.set(scaleValue, scaleValue, scaleValue)
      //   brush.updateMatrixWorld()
      // }

      // evaluator.useGroups = true
      // result = evaluator.evaluate(baseBrush, brush, SUBTRACTION, result)

      // result.castShadow = true
      // result.receiveShadow = true

      // scene.add(result)

      // wireframe.geometry = result.geometry
      // wireframe.visible = true
    }),
  )
}

// Resizes the canvas
//   window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//   })
