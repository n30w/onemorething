import * as THREE from 'three'
import Stats from 'stats.js'

// @ts-ignore
import { Text } from 'troika-three-text'
import React, { useContext, useEffect } from 'react'
import {
  InboxSceneContext,
  InboxSceneContextValue,
  MessageObjContext,
  MessageObjContextValue,
  SelectedObjContext,
  SelectedObjContextValue,
} from '../lib/Contexts'
import { setupScene2 } from '../lib/render/scene'
import { animationBuilderPixelation } from '../lib/render/animation'
import { stopGoEased } from '../lib/helpers'

const MainCanvas: React.FC = () => {
  const { selectedObj, setSelectedObj } = useContext(
    SelectedObjContext,
  ) as SelectedObjContextValue
  const { objects } = useContext(MessageObjContext) as MessageObjContextValue
  const { setInboxScene } = useContext(
    InboxSceneContext,
  ) as InboxSceneContextValue

  // Do this only when the component is mounted.
  useEffect(() => {
    let selObj = selectedObj.userData

    const { scene, camera, renderer, composer } = setupScene2()

    setInboxScene(scene)

    const div = document.getElementById('container-three')!
    div.appendChild(renderer.domElement)

    let INTERSECTED: any = selectedObj

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

    for (let i = 0; i < objects.length; i++) {
      scene.add(objects[i].mesh)
    }

    const raycaster = new THREE.Raycaster()

    const pointer = new THREE.Vector2()

    let rotY = 0
    let prevRotY = 0

    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 0,
      specular: 0x111111,
    })

    const lines: THREE.Line[] = []

    // Create a material for the lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })

    const listObjects = objects.map((obj: { mesh: any }) => obj.mesh)

    // Create a geometry for each line and link objects
    listObjects.forEach(
      (obj: { position: THREE.Vector3 | THREE.Vector2 }, index: number) => {
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
      },
    )

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

          setSelectedObj(selObj)
          // console.log(selectedObject)
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
            selObj = intersects[0].object
          }

          INTERSECTED = intersects[0].object
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()

          // Makes the intersected object red.
          if (INTERSECTED.userData.clickable) {
            INTERSECTED.material.emissive.setHex(0xff0000)

            selObj = intersects[0].object.userData
            // console.log(selectedObj.body)
          }
        }
      } else {
        if (INTERSECTED) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
        }

        INTERSECTED = null
        setSelectedObj(null)
      }
    }
  }, [])

  return (
    <div
      id='container-three'
      className='border-2 h-fit w-fit'
      style={{ borderRadius: '', overflow: 'hidden' }}
    ></div>
  )
}

export default MainCanvas
