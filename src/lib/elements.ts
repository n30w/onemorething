import * as THREE from 'three'
import { Brush } from 'three-bvh-csg'

export class BasicPlane {
  public texture: THREE.Texture
  public geometry = new THREE.SphereGeometry(
    500,
    500,
    200,
    Math.PI * 2,
    Math.PI * 2,
    4,
    Math.PI * 4,
  )

  public material: THREE.MeshBasicMaterial

  public mesh: THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >

  constructor() {
    this.texture = this.setTexture()

    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#106'),
      wireframe: true,
      fog: false,
      // map: this.texture,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material).rotateOnAxis(
      new THREE.Vector3(1, 0, 0),
      -Math.PI / 2,
    )
  }

  public setTexture(): THREE.Texture {
    const t: THREE.Texture = new THREE.TextureLoader().load(
      './assets/sea_dark.jpg',
    )
    t.offset.set(0, 0)
    t.repeat.set(2, 2)
    t.wrapS = t.wrapT = THREE.RepeatWrapping

    return t
  }

  public update() {}
}

export class Satellite {
  pos: any
  orbitCenter: any
  orbitRadius: number
  angle: number
  color: number | undefined
  radius: number
  vel: any
  acc: any
  scl: any
  mass: number
  rot: any
  rotVel: any
  rotAcc: any
  geometry: THREE.SphereGeometry
  material: THREE.MeshBasicMaterial
  mesh: THREE.Mesh<any, any, THREE.Object3DEventMap>

  constructor(color?: number | undefined, radius = 50) {
    this.pos = new THREE.Vector3() // Current position of the Sun
    this.orbitCenter = new THREE.Vector3(0, 0, 0) // Center point to orbit around
    this.orbitRadius = 500 // Distance from the orbit center
    this.angle = 0 // Initial angle for orbiting

    // this.color = 0xaf0f0f;
    this.color = color
    this.radius = radius
    this.vel = new THREE.Vector3()
    this.acc = new THREE.Vector3()
    this.scl = new THREE.Vector3(1, 1, 1)
    this.mass = 1
    this.rot = new THREE.Vector3()
    this.rotVel = new THREE.Vector3()
    this.rotAcc = new THREE.Vector3()

    this.geometry = new THREE.SphereGeometry(this.radius, this.radius, 16)

    this.material = new THREE.MeshBasicMaterial({
      wireframe: false,
      fog: false,
      side: THREE.DoubleSide,
      color: this.color,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }

  setOrbitCenter(
    x: number | undefined,
    y: number | undefined,
    z: number | undefined,
  ) {
    this.orbitCenter = new THREE.Vector3(x, y, z)
    return this
  }

  setOrbitRadius(radius: number) {
    this.orbitRadius = radius
    return this
  }

  orbit(speed = 0.001) {
    this.angle += speed // Increment the angle to simulate orbit
    this.pos.x = this.orbitCenter.x + this.orbitRadius * Math.cos(this.angle)
    this.pos.y = this.orbitCenter.y + this.orbitRadius * Math.sin(this.angle)
  }

  move() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.mult(0)
  }

  rotate() {
    this.rotVel.add(this.rotAcc)
    this.rot.add(this.rotVel)
    this.rotAcc.mult(0)
  }

  public update() {
    // Update position based on orbiting
    this.orbit() // Call the orbit method here to change position
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z)
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z)
    this.mesh.scale.set(this.scl.x, this.scl.y, this.scl.z)
  }
}

export function makeCSG() {
  const baseBrush = new Brush(
    new THREE.IcosahedronGeometry(2, 1),
    new THREE.MeshStandardMaterial({
      flatShading: true,
      polygonOffset: true,
      polygonOffsetUnits: 1,
      polygonOffsetFactor: 1,
    }),
  )

  const brush = new Brush(
    new THREE.CylinderGeometry(1, 1, 3, 45),
    new THREE.MeshStandardMaterial({
      color: 0x80cbc4,
      polygonOffset: true,
      polygonOffsetUnits: 1,
      polygonOffsetFactor: 1,
    }),
  )

  const core = new Brush(
    new THREE.IcosahedronGeometry(0.15, 1),
    new THREE.MeshStandardMaterial({
      flatShading: true,
      color: 0xff9800,
      emissive: 0xff9800,
      emissiveIntensity: 0.35,
      polygonOffset: true,
      polygonOffsetUnits: 1,
      polygonOffsetFactor: 1,
    }),
  )

  core.castShadow = true

  return {
    baseBrush,
    brush,
    core,
  }
}

export function makeLights() {
  const ambiLight = new THREE.HemisphereLight(0xffffff, 0xbfd4d2, 3)
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.3)
  dirLight.position.set(1, 4, 3).multiplyScalar(3)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.setScalar(2048)
  dirLight.shadow.bias = -1e-4
  dirLight.shadow.normalBias = 1e-4

  return { ambiLight, dirLight }
}

export function makeSubLights() {
  const ambiLight = new THREE.HemisphereLight(0xffffff, 0xbfd4d2, 4)
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.3)
  dirLight.position.set(1, 4, 3).multiplyScalar(3)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.setScalar(2048)
  dirLight.shadow.bias = -1e-4
  dirLight.shadow.normalBias = 1e-4

  return { ambiLight, dirLight }
}
