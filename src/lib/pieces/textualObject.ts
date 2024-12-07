import * as THREE from 'three'

export class TextualObject {
  public text: string
  public isSelected: boolean
  public position: THREE.Vector3
  public scale: THREE.Vector3
  public rotation: THREE.Vector3
  public geometry: any
  public mesh:
    | THREE.Mesh<any, THREE.MeshLambertMaterial, THREE.Object3DEventMap>
    | THREE.Mesh<any, THREE.MeshPhongMaterial, THREE.Object3DEventMap>

  constructor({
    position,
    rotation,
    scale,
  }: {
    position: THREE.Vector3
    rotation: THREE.Vector3
    scale: THREE.Vector3
  }) {
    this.text = ''
    this.isSelected = false
    this.position = position
    this.scale = scale
    this.rotation = rotation
    this.geometry = new THREE.IcosahedronGeometry(0.75)
    // this.mesh = new THREE.Mesh(
    //   this.geometry,
    //   new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }),
    // )
    this.mesh = new THREE.Mesh(
      this.geometry,
      new THREE.MeshPhongMaterial({
        color: 0x68b7e9,
        emissive: 0x4f7e8b,
        shininess: 10,
        specular: 0xffffff,
      }),
    )

    this.mesh.receiveShadow = true

    this.mesh.position.x = position.x
    this.mesh.position.y = position.y
    this.mesh.position.z = position.z

    this.mesh.rotation.x = rotation.x
    this.mesh.rotation.y = rotation.y
    this.mesh.rotation.z = rotation.z

    this.mesh.scale.x = scale.x
    this.mesh.scale.y = scale.y
    this.mesh.scale.z = scale.z

    this.mesh.userData = {
      sender: '',
      receiver: '',
      subject: '',
      body: this.text,
      clickable: true,
    }
  }

  render() {}

  public getBody() {
    return this.mesh.userData.body
  }

  public setBody(body: string) {
    this.mesh.userData.body = body
    this.text = body
  }

  public setSender(sender: string) {
    this.mesh.userData.sender = sender
  }

  public setReceiver(receiver: string) {
    this.mesh.userData.receiver = receiver
  }

  public setSubject(subject: string) {
    this.mesh.userData.subject = subject
  }
}

export function generateTextualObjects(scene?: THREE.Scene): TextualObject[] {
  const objects: TextualObject[] = []
  for (let i = 0; i < 3; i++) {
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

    objects.push(object)

    if (scene) {
      scene.add(object.mesh)
    }
  }

  return objects
}
