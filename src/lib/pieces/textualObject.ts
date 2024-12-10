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
  public type: ProfileObjectType

  constructor(
    {
      position,
      rotation,
      scale,
    }: {
      position: THREE.Vector3
      rotation: THREE.Vector3
      scale: THREE.Vector3
    },
    type?: number,
  ) {
    this.type = type ? type : 1
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
      textName: '',
      sender: '',
      receiver: '',
      subject: '',
      body: this.text,
      clickable: true,
      posX: 0,
      posY: 0,
      posZ: 0,
      next: '',
      prev: '',
      objType: this.type,
    }
  }

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

// Generates objects in the scene.
export function generateObjects(loaded: any[]): TextualObject[] {
  const objs: TextualObject[] = []
  for (let i = 0; i < loaded.length; i++) {
    const attr = loaded[i]
    const object = new TextualObject(
      {
        position: new THREE.Vector3(attr.posX, attr.posY, attr.posZ),
        rotation: new THREE.Vector3(
          Math.random() * 2 * Math.PI,
          Math.random() * 2 * Math.PI,
          Math.random() * 2 * Math.PI,
        ),
        scale: new THREE.Vector3(5, 5, 5),
      },
      attr.objType,
    )

    switch (attr.objType) {
      case 1:
        object.mesh = new THREE.Mesh(
          new THREE.BoxGeometry(5, 5, 5),
          new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0x4f0e8f,
            shininess: 10,
            specular: 0xffffff,
          }),
        )
        break
      case 3:
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
        const reflectiveMaterial = new THREE.MeshPhongMaterial({
          color: 0x2266ff,
        })
        object.mesh = new THREE.Mesh(sphereGeometry, reflectiveMaterial)
        break
      default:
        break
    }

    object.mesh.position.x = attr.posX
    object.mesh.position.y = attr.posY
    object.mesh.position.z = attr.posZ

    object.mesh.userData.clickable = attr.clickable

    object.mesh.userData.id = attr.id
    object.mesh.userData.prev = attr.prev
    object.mesh.userData.next = attr.next
    object.setBody(attr.body)
    object.setReceiver(attr.receiver)
    object.setSender(attr.sender)
    object.setSubject(attr.subject)

    objs.push(object)
    console.log(object)
  }
  return objs
}

// Retrieve objects from the firestore database
export function generateTextualObjects(scene?: THREE.Scene): TextualObject[] {
  const objs: TextualObject[] = []
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

    objs.push(object)

    if (scene) {
      scene.add(object.mesh)
    }
  }

  objs[1].mesh = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5),
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x4f0e8f,
      shininess: 10,
      specular: 0xffffff,
    }),
  )

  objs[1].mesh.userData = {
    textName: '',
    sender: '',
    receiver: '',
    subject: '',
    clickable: true,
    next: '',
  }

  // Test Data
  objs[0].setBody(
    `Officials in the US State Department were caught totally off guard by President Yoon’s martial law announcement.

It's hard to overstate the strategic importance of the alliance between Washington and Seoul - the US has nearly 30,000 troops in the country which it vows to defend from its nuclear armed neighbour in the north through a wide ranging set of defence agreements.

So for Seoul’s leadership to take such a drastic step without even telling Washington - as the State Department contends - is extraordinary.

The US says it had no advance warning Yoon would declare martial law.

It is not entirely clear whether Secretary of State Antony Blinken - currently in Brussels - was able to speak to his counterpart during the height of this crisis.

Now Yoon has said he will reverse his order I think Washington is wondering what an earth has happened - and will be rapidly reassessing how reliable the leadership of an ally it considers a bedrock of democratic stability in the region actually is.`,
  )
  objs[0].setSender('kai')
  objs[0].setReceiver('neo')

  objs[1].setSubject('Concerns regarding your future')
  objs[1].setBody(
    `Dear Neo,

  What are you even thinking of doing with that degree. Like seriously?

  Yours truly,
  Yourself`,
  )
  objs[1].setSender('neo')
  objs[1].setReceiver('kai')

  objs[2].setSubject('New Job Opportunity')
  objs[2].setBody(
    `I hope this email finds you well! My name is Alex, and I work with a team that’s tackling some exciting challenges in the world of creative technologies. We’ve been following your work closely and are incredibly impressed with your projects, especially your unique approach to blending computational creativity with cutting-edge design.

We’re currently working on a new initiative that aligns perfectly with your expertise. It’s a collaborative effort focused on redefining how people interact with immersive digital environments. Given your background, we believe you’d be a perfect fit to bring fresh perspectives and innovative ideas to the table.

If you’re interested, I’d love to schedule a call to discuss this further. We’re flexible and can work around your availability. This could be a great opportunity for you to expand your creative horizons while contributing to a meaningful project.

Looking forward to your response!

Warm regards,
Alex Green
Creative Director
FutureSpace Studios
alex.green@futurespacestudios.com
(555) 123-4567f`,
  )
  objs[2].setSender('kai')
  objs[0].setReceiver('neo')

  return objs
}
