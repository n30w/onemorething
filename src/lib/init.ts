import { setupScene, setupScene2, setupSubScene } from './render/scene'
import dat from 'dat.gui'
import * as THREE from 'three'
import { makeCSG, makeLights, Satellite } from './elements'
import Stats from 'stats.js'
import {
  animationBuilder,
  animationBuilderPixelation,
} from './render/animation'
import { SUBTRACTION, Evaluator } from 'three-bvh-csg'

import p5 from 'p5'
import { Font } from 'three/addons/loaders/FontLoader.js'
import { generateTextualObjects } from './pieces/textualObject'
// @ts-ignore
import { Text } from 'troika-three-text'
import { stopGoEased } from './helpers'
import TWEEN from 'three/addons/libs/tween.module.js'

let font: Font

const textGeometryParams = (font: Font) => {
  return {
    font: font,
    size: 3,
    depth: 0.05,
    curveSegments: 2,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.1,
    bevelSegments: 3,
  }
}

const textMaterial = new THREE.MeshStandardMaterial({
  color: 'black',
  roughness: 0.1,
  wireframe: true,
})

const objs = generateTextualObjects()

export let selectedObj = objs[0].mesh.userData

export const { scene, camera, renderer, composer } = setupScene2()

export function initThree2() {
  const div = document.getElementById('container-three')!

  div.appendChild(renderer.domElement)

  let INTERSECTED: any

  INTERSECTED = objs[0].mesh

  const clock = new THREE.Clock()

  const animate = animationBuilderPixelation(composer)

  const directionalLight = new THREE.DirectionalLight(0xfffecd, 1.5)
  directionalLight.position.set(100, 100, 100)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(2048, 2048)

  scene.add(directionalLight)

  scene.add(new THREE.AmbientLight(0x757f8e, 3))

  // scene.background = new THREE.Color(0x151729)
  scene.background = new THREE.Color(0x000000)

  for (let i = 0; i < objs.length; i++) {
    scene.add(objs[i].mesh)
  }

  const raycaster = new THREE.Raycaster()

  const pointer = new THREE.Vector2()

  let rotY = 0
  let prevRotY = 0

  const planeGeometry = new THREE.PlaneGeometry(200, 200)
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 0,
    specular: 0x111111,
  })

  const ground = new THREE.Mesh(planeGeometry, planeMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -20
  ground.scale.multiplyScalar(3)
  ground.castShadow = true
  ground.receiveShadow = true
  // scene.add(ground)

  const lines: THREE.Line[] = []

  // Create a material for the lines
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })

  const objects = objs.map(obj => obj.mesh)

  // Create a geometry for each line and link objects
  objects.forEach((obj, index) => {
    if (index < objects.length - 1) {
      const nextObj = objects[index + 1]

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        obj.position,
        nextObj.position,
      ])

      const line = new THREE.Line(lineGeometry, planeMaterial)
      lines.push(line)
      scene.add(line)
    }
  })

  renderer.setAnimationLoop(
    animate(new Stats(), () => {
      camera.updateMatrixWorld()

      // find intersections
      raycaster.setFromCamera(pointer, camera)

      camera.updateProjectionMatrix()

      const t = clock.getElapsedTime()

      if (INTERSECTED && INTERSECTED.userData.clickable === true) {
        INTERSECTED.material.emissiveIntensity = Math.sin(t * 3) * 0.5 + 0.5
        // INTERSECTED.position.y = 0.7 + Math.sin(t * 2) * 0.05
        INTERSECTED.rotation.y = stopGoEased(t + rotY, 2, 4) * 2 * Math.PI
        INTERSECTED.material.emissive.setHex(0xff0000)
        prevRotY = INTERSECTED.rotation.y
      } else {
        rotY = prevRotY
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

  canvas.addEventListener('pointerdown', onPointerDown)

  function onPointerDown(event: { clientX: number; clientY: number }) {
    const rect = canvas.getBoundingClientRect() // Get canvas position and dimensions
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1 // Normalize to [-1, 1]
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1 // Normalize to [-1, 1]

    const intersects = raycaster.intersectObjects(scene.children, false)

    if (intersects.length > 0) {
      if (INTERSECTED != intersects[0].object) {
        if (INTERSECTED) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
          selectedObj = intersects[0].object
        }

        INTERSECTED = intersects[0].object
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()

        // Makes the intersected object red.
        if (INTERSECTED.userData.clickable) {
          INTERSECTED.material.emissive.setHex(0xff0000)

          selectedObj = intersects[0].object.userData
          // console.log(selectedObj.body)
        }
      }
    } else {
      if (INTERSECTED) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
      }

      INTERSECTED = null
    }
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
  const { scene, camera, renderer, controls, composer } = setupSubScene()
  // const { baseBrush, brush } = makeCSG()

  let result: any
  let frame = 0

  const stats: Stats = new Stats()

  const animate = animationBuilderPixelation(composer)

  // scene.background = new THREE.Color(0xfce4e0)
  scene.background = new THREE.Color(0x000000)

  // lights
  // const { ambiLight, dirLight } = makeSubLights()

  // scene.add(ambiLight)
  // scene.add(dirLight)

  const mailGroup = new THREE.Group()

  scene.add(mailGroup)

  const subjectText = new Text()
  const bodyText = new Text()
  const senderText = new Text()
  const receiverText = new Text()

  const textColor = 0xffffff

  // Set properties to configure:
  bodyText.text = selectedObj.body
  bodyText.fontSize = 0.1
  bodyText.color = textColor
  // myText.gpuAccelerateSDF = true
  // bodyText.position.y = -10
  bodyText.anchorX = 'center'
  bodyText.maxWidth = 3

  subjectText.text = selectedObj.subject
  subjectText.fontSize = 0.1
  subjectText.color = textColor
  subjectText.fontWeight = 'bold'
  subjectText.anchorX = 'center'
  subjectText.maxWidth = 3
  subjectText.position.y = 0.3

  senderText.text = selectedObj.sender
  senderText.fontSize = 4
  senderText.color = textColor
  senderText.anchorX = 'center'
  senderText.maxWidth = 80

  receiverText.text = selectedObj.receiver
  receiverText.fontSize = 4
  receiverText.color = textColor
  receiverText.anchorX = 'center'
  receiverText.maxWidth = 80

  // mailGroup.add(subjectText, bodyText, receiverText, senderText)
  mailGroup.add(subjectText, bodyText)

  mailGroup.position.y = 0
  mailGroup.position.x = 0
  mailGroup.position.z = -1
  mailGroup.rotation.x = -Math.PI * 0.5

  bodyText.sync()
  subjectText.sync()
  senderText.sync()
  receiverText.sync()

  const matFloor = new THREE.MeshPhongMaterial({ color: 0x808080 })
  const matBox = new THREE.MeshPhongMaterial({ color: 0xffffff })

  const geoFloor = new THREE.PlaneGeometry(100, 100)
  const geoBox = new THREE.BoxGeometry(0.3, 0.1, 0.2)

  const mshFloor = new THREE.Mesh(geoFloor, matFloor)
  mshFloor.rotation.x = -Math.PI * 0.5
  const mshBox = new THREE.Mesh(geoBox, matBox)

  const ambient = new THREE.AmbientLight(0x444444)

  const spotLight1 = createSpotlight(0xff7f00)
  const spotLight2 = createSpotlight(0x00ff7f)
  const spotLight3 = createSpotlight(0x7f00ff)

  let lightHelper1, lightHelper2, lightHelper3

  spotLight1.position.set(1.5, 20, 4.5)
  spotLight2.position.set(0, 20, 3.5)
  spotLight3.position.set(-1.5, 20, 4.5)

  lightHelper1 = new THREE.SpotLightHelper(spotLight1)
  lightHelper2 = new THREE.SpotLightHelper(spotLight2)
  lightHelper3 = new THREE.SpotLightHelper(spotLight3)

  mshFloor.receiveShadow = true
  mshFloor.position.set(0, -0.5, 0)

  mshBox.castShadow = true
  mshBox.receiveShadow = true
  mshBox.position.set(0, 0.5, 0)

  scene.add(mshFloor)
  // scene.add(mshBox)
  scene.add(ambient)
  scene.add(spotLight1, spotLight2, spotLight3)
  // scene.add(lightHelper1, lightHelper2, lightHelper3)

  // bodyText.material = matBox

  tween(spotLight1)
  tween(spotLight2)
  tween(spotLight3)

  renderer.setAnimationLoop(
    animate(stats, () => {
      renderer.clear()
      frame++

      if (selectedObj.clickable) {
        bodyText.text = selectedObj.body
        senderText.text = selectedObj.sender
        receiverText.text = selectedObj.receiver
        subjectText.text = selectedObj.subject
      }

      controls.update(0.03)
      TWEEN.update()
      if (lightHelper1) lightHelper1.update()
      if (lightHelper2) lightHelper2.update()
      if (lightHelper3) lightHelper3.update()
      if (frame % 5000 === 0) {
        tween(spotLight1)
        tween(spotLight2)
        tween(spotLight3)
      }
      // update the transforms
      // const t = window.performance.now() + 9000
    }),
  )
}

// Resizes the canvas
//   window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
//   })

function createSpotlight(color: THREE.ColorRepresentation | undefined) {
  const newObj = new THREE.SpotLight(color, 20)

  newObj.castShadow = true
  // newObj.angle = 0.3
  newObj.angle = 2
  newObj.penumbra = 0.5
  newObj.decay = 0.8
  newObj.distance = 10

  return newObj
}

function tween(light: THREE.SpotLight) {
  new TWEEN.Tween(light)
    .to(
      {
        angle: Math.random() * 0.7 + 0.1,
        penumbra: Math.random() + 1,
      },
      Math.random() * 3000 + 2000,
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()

  new TWEEN.Tween(light.position)
    .to(
      {
        x: Math.random() * 3 - 1.5,
        y: Math.random() * 10 + 1.5,
        z: Math.random() * 3 - 1.5,
      },
      Math.random() * 3000 + 2000,
    )
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
}
