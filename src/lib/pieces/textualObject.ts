import * as THREE from 'three'

export class TextualObject {
  public text: String[]
  public isSelected: boolean
  public position: THREE.Vector3
  public scale: THREE.Vector3
  public rotation: THREE.Vector3
  public geometry: any
  public mesh: THREE.Mesh<
    any,
    THREE.MeshLambertMaterial,
    THREE.Object3DEventMap
  >

  constructor({
    position,
    rotation,
    scale,
  }: {
    position: THREE.Vector3
    rotation: THREE.Vector3
    scale: THREE.Vector3
  }) {
    this.text = []
    this.isSelected = false
    this.position = position
    this.scale = scale
    this.rotation = rotation
    this.geometry = new THREE.BoxGeometry()
    this.mesh = new THREE.Mesh(
      this.geometry,
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }),
    )

    this.mesh.position.x = Math.random() * 40 - 20
    this.mesh.position.y = Math.random() * 40 - 20
    this.mesh.position.z = Math.random() * 40 - 20

    this.mesh.rotation.x = Math.random() * 2 * Math.PI
    this.mesh.rotation.y = Math.random() * 2 * Math.PI
    this.mesh.rotation.z = Math.random() * 2 * Math.PI

    this.mesh.scale.x = Math.random() + 10
    this.mesh.scale.y = Math.random() + 10
    this.mesh.scale.z = Math.random() + 10
  }

  render() {}
}

export function generateTextualObjects(scene: THREE.Scene) {
  for (let i = 0; i < 10; i++) {
    const object = new TextualObject({
      position: new THREE.Vector3(
        Math.random() * 40 - 20,
        Math.random() * 40 - 20,
        Math.random() * 40 - 20,
      ),
      rotation: new THREE.Vector3(
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
      ),
      scale: new THREE.Vector3(
        Math.random() + 10,
        Math.random() + 10,
        Math.random() + 10,
      ),
    })

    // object.position.x = Math.random() * 40 - 20
    // object.position.y = Math.random() * 40 - 20
    // object.position.z = Math.random() * 40 - 20

    // object.rotation.x = Math.random() * 2 * Math.PI
    // object.rotation.y = Math.random() * 2 * Math.PI
    // object.rotation.z = Math.random() * 2 * Math.PI

    // object.scale.x = Math.random() + 10
    // object.scale.y = Math.random() + 10
    // object.scale.z = Math.random() + 10

    scene.add(object.mesh)
  }
}
