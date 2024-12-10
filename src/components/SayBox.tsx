import React, { useContext } from 'react'
import * as THREE from 'three'
import { TextualObject } from '../lib/pieces/textualObject'
import {
  InboxSceneContext,
  InboxSceneContextValue,
  SelectedObjContext,
  SelectedObjContextValue,
  UsernameContext,
  UsernameContextValue,
} from '../lib/contexts'
import { ref, set, push } from 'firebase/database'
import { database } from '../data/firebase'

const SayBox: React.FC = () => {
  const { inboxScene } = useContext(InboxSceneContext) as InboxSceneContextValue
  const { username } = useContext(UsernameContext) as UsernameContextValue
  const { selectedObj } = useContext(
    SelectedObjContext,
  ) as SelectedObjContextValue

  function publish(formData: { get: (arg0: string) => any }) {
    // Get the current user's profile object type and
    // the details.

    const content = formData.get('content')
    const button = formData.get('button')
    const to = formData.get('to')
    const subject = formData.get('subject')
    const obj = new TextualObject({
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

    obj.mesh.userData.clickable = true
    obj.mesh.userData.body = content
    obj.mesh.userData.receiver = to
    obj.mesh.userData.subject = subject

    // stateful username
    obj.mesh.userData.sender = username

    // Depends on state of selected msg, if there is one.
    obj.mesh.userData.isHead = selectedObj ? false : true

    obj.mesh.userData.next = ''
    obj.mesh.userData.prev = selectedObj ? selectedObj.id : ''

    obj.mesh.userData.posX = obj.position.x
    obj.mesh.userData.posY = obj.position.y
    obj.mesh.userData.posZ = obj.position.z
    obj.mesh.userData.type = 1

    inboxScene.add(obj.mesh)

    // Then upload the object's data to the firestore
    // database.

    // Prepare data for Firebase upload
    const messageData = {
      sender: obj.mesh.userData.sender,
      receiver: obj.mesh.userData.receiver,
      subject: obj.mesh.userData.subject,
      body: obj.mesh.userData.body,
      isHead: obj.mesh.userData.isHead,
      next: obj.mesh.userData.next,
      prev: obj.mesh.userData.prev,
      clickable: obj.mesh.userData.clickable,
      posX: obj.mesh.userData.posX,
      posY: obj.mesh.userData.posY,
      posZ: obj.mesh.userData.posZ,
      objType: obj.mesh.userData.type,
      timestamp: new Date().toISOString(),
    }

    // Upload to "messages" collection
    const messagesRef = ref(database, 'messages')
    const newMessageRef = push(messagesRef)
    set(newMessageRef, messageData)
      .then(() => {
        console.log('Message added to "messages" collection')
      })
      .catch(error => {
        console.error('Error adding message to "messages":', error)
      })

    if (selectedObj) {
      // Get the reference to the `selectedObj` in the database
      const selectedObjRef = ref(
        database,
        `users/${username}/messages/${selectedObj.id}`,
      )

      // Update the 'next' field with the current message ID
      set(selectedObjRef, {
        ...selectedObj, // Keep existing fields
        next: newMessageRef.key, // Use the current message ID
      })
        .then(() => {
          console.log(
            `Updated selectedObj's 'next' with ID: ${newMessageRef.key}`,
          )
        })
        .catch(error => {
          console.error(`Error updating selectedObj's 'next':`, error)
        })
    }

    // Upload to the user's specific location
    const userMessagesRef = ref(database, `users/${username}/messages`)
    const newUserMessageRef = push(userMessagesRef)
    set(newUserMessageRef, messageData)
      .then(() => {
        console.log(`Message added under user "${username}"`)
      })
      .catch(error => {
        console.error(`Error adding message under user "${username}":`, error)
      })

    // Upload to the user's specific location
    const user2MessagesRef = ref(database, `users/${to}/messages`)
    const newUser2MessageRef = push(user2MessagesRef)
    set(newUser2MessageRef, messageData)
      .then(() => {
        console.log(`Message added under user "${to}"`)
      })
      .catch(error => {
        console.error(`Error adding message under user "${to}":`, error)
      })
  }

  return (
    <form
      action={publish}
      style={{ width: '100%' }}
      className='flex flex-col gap-y-2 justify-items-start'
    >
      <label htmlFor='to' className='font-bold'>
        to
      </label>
      <input id='to' name='to' className='border-1' type='text' />
      <label htmlFor='subject' className='font-bold'>
        subject
      </label>
      <input id='subject' name='subject' className='border-1' type='text' />
      <label htmlFor='content' className='font-bold'>
        body
      </label>
      <textarea
        name='content'
        rows={2}
        cols={30}
        className='border-1'
        style={{ resize: 'none' }} // Disable resize
      />
      <br />
      <button type='submit' name='button' value='submit' className='font-bold'>
        send
      </button>
    </form>
  )
}

export default SayBox
