interface User {
  name: string
  messages: Message[]
}

interface ProfileObject {
  // What type of object to be generated.
  type: ProfileObjectType

  // Object details.
  color: string
  posX: number
  posY: number
  posZ: number
}

enum ProfileObjectType {
  Cube = 1,
  Icosahedron,
  Rectangle,
}

interface Message {
  // Sender and receiver usernames.
  sender: string
  receiver: string
  subject: string
  body: string

  // Linked list of messages.
  prev: Message | null
  next: Message | null

  // User's custom profile object.
  profileObject: ProfileObject

  // Marks the beginning of a new message chain.
  isHead: boolean

  clickable: boolean
}
