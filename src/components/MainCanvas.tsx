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
  ProfileContext,
  ProfileContextValue,
  SelectedObjContext,
  SelectedObjContextValue,
  UsernameContext,
  UsernameContextValue,
} from '../lib/contexts'
import { setupScene2 } from '../lib/render/scene'
import { animationBuilderPixelation } from '../lib/render/animation'
import { stopGoEased } from '../lib/helpers'
import { ref, onValue } from 'firebase/database'
import { database } from '../data/firebase'
import { generateObjects, TextualObject } from '../lib/pieces/textualObject'

const MainCanvas: React.FC = () => {
  const { selectedObj, setSelectedObj } = useContext(
    SelectedObjContext,
  ) as SelectedObjContextValue
  const { objects, setObjects } = useContext(
    MessageObjContext,
  ) as MessageObjContextValue
  const { username } = useContext(UsernameContext) as UsernameContextValue
  const { setInboxScene } = useContext(
    InboxSceneContext,
  ) as InboxSceneContextValue
  const { profile, setProfile } = useContext(
    ProfileContext,
  ) as ProfileContextValue

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

    let newObjs: TextualObject[]

    const dbRef = ref(database, `users/${username}/messages`)
    onValue(dbRef, snapshot => {
      const data = snapshot.val()
      if (data) {
        // Convert Firebase data to objects array
        const loadedObjects = Object.keys(data).map(key => ({
          ...data[key],
          id: key, // Add unique key from Firebase
        }))
        newObjs = generateObjects([...loadedObjects])
        setObjects(newObjs)
        console.log(newObjs)
        scene.add(
          ...newObjs.map((o: { mesh: any }) => {
            return o.mesh
          }),
        )

        const lines: THREE.Line[] = []

        // Create a material for the lines
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          linewidth: 1,
        })

        const map = new Map()

        newObjs.map(val => {
          if (val.mesh.userData.prev !== '') {
            map.set(val.mesh.userData.prev, val.mesh.position)
            console.log(map)
          }
        })

        for (let i = 0; i < newObjs.length; i++) {
          const obj = newObjs[i]

          if (obj.mesh.userData.prev !== '') {
            // get pos of prev
            const prev = map.get(obj.mesh.userData.prev)

            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              prev,
              obj.position,
            ])

            const line = new THREE.Line(lineGeometry, lineMaterial)
            lines.push(line)
            scene.add(line)
          }
        }
      }
    })

    const dbRef2 = ref(database, `users/${username}/profile`)
    onValue(dbRef2, snapshot => {
      const data = snapshot.val()
      if (data) {
        const loadedObject = Object.keys(data).map(key => ({
          ...data[key],
          id: key, // Add unique key from Firebase
        }))
        setProfile(loadedObject)
      }
    })

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    let rotY = 0
    let prevRotY = 0

    // Scene Background
    scene.background = new THREE.Color(0x10121c)

    // 1. Reflective Spheres
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
    const reflectiveMaterial = new THREE.MeshPhongMaterial({
      color: 0x2266ff,
    })

    for (let i = 0; i < 10; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, reflectiveMaterial)
      sphere.position.set(
        Math.random() * 40 - 20,
        Math.random() * 40 + 10,
        Math.random() * 40 - 20,
      )
      sphere.castShadow = true
      sphere.receiveShadow = true
      // scene.add(sphere)
    }

    // 2. Glowing Cubes
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
    const glowingMaterial = new THREE.MeshPhongMaterial({
      color: 0xff8800,
      emissive: 0xff8800,
      emissiveIntensity: 1,
    })

    for (let i = 0; i < 5; i++) {
      const cube = new THREE.Mesh(cubeGeometry, glowingMaterial)
      cube.position.set(
        Math.random() * 30 - 15,
        Math.random() * 30 + 10,
        Math.random() * 30 - 15,
      )
      // scene.add(cube)
    }

    // 3. Dynamic Floor Grid with Wave Effect
    const gridSize = 100
    const gridDivisions = 50
    const gridHelper = new THREE.GridHelper(
      gridSize,
      gridDivisions,
      0x444444,
      0x222222,
    )
    gridHelper.position.y = -20
    scene.add(gridHelper)

    // Create an array to manipulate vertices
    const gridGeometry = gridHelper.geometry as THREE.BufferGeometry
    const gridVertices = gridGeometry.attributes.position

    // Store original vertex positions
    const originalVertices = new Float32Array(gridVertices.array)

    // 4. Rotating Torus
    const torusGeometry = new THREE.TorusGeometry(5, 1.5, 16, 100)
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0xff2233,
    })

    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    torus.position.set(0, 10, 0)
    torus.castShadow = true
    torus.receiveShadow = true
    // scene.add(torus)

    // 5. Light Pulsing Sphere
    const lightSphereGeometry = new THREE.SphereGeometry(3, 32, 32)
    const lightSphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x33ff66,
      emissive: 0x33ff66,
      emissiveIntensity: 2,
    })

    const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial)
    lightSphere.position.set(0, 20, 0)
    // scene.add(lightSphere)

    renderer.setAnimationLoop(
      animate(new Stats(), () => {
        const t = clock.getElapsedTime()

        // Add dynamic wave effect to the grid
        for (let i = 0; i < gridVertices.count; i++) {
          const x = originalVertices[i * 3] // X position of vertex
          const z = originalVertices[i * 3 + 2] // Z position of vertex

          // Create a sine wave based on time
          gridVertices.array[i * 3 + 1] =
            Math.sin(x * 0.2 + t) * Math.cos(z * 0.2 + t) * 4
        }
        gridVertices.needsUpdate = true

        // Rotate the torus
        torus.rotation.x = t * 0.5
        torus.rotation.y = t * 0.3

        // Pulse the light sphere
        lightSphere.material.emissiveIntensity = Math.sin(t * 5) * 0.5 + 1.5
        camera.updateMatrixWorld()

        // find intersections
        raycaster.setFromCamera(pointer, camera)

        camera.updateProjectionMatrix()

        if (INTERSECTED && INTERSECTED.userData.clickable === true) {
          INTERSECTED.material.emissiveIntensity = Math.sin(t * 3) * 0.5 + 0.5
          // INTERSECTED.position.y = 0.7 + Math.sin(t * 2) * 0.05
          INTERSECTED.rotation.y = stopGoEased(t + rotY, 2, 4) * 2 * Math.PI
          if (INTERSECTED.material.emissive) {
            INTERSECTED.material.emissive.setHex(0xff0000)
          }
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
