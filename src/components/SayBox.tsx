import React, { useContext } from 'react'
import * as THREE from 'three'
import { TextualObject } from '../lib/pieces/textualObject'
import { InboxSceneContext, InboxSceneContextValue } from '../lib/Contexts'

const SayBox: React.FC = () => {
  const { inboxScene } = useContext(InboxSceneContext) as InboxSceneContextValue

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
    obj.mesh.userData.sender = 'get Username'

    // Depends on state of selected msg, if there is one.
    obj.mesh.userData.isHead = false

    // Depends on state
    obj.mesh.userData.next = 'get id of currently selected msg'

    inboxScene.add(obj.mesh)

    // Then upload the object's data to the firestore
    // database.
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
