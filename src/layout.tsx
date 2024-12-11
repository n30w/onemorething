import React, { useState } from 'react'
import MainCanvas from './components/MainCanvas'
import {
  InboxSceneContext,
  MessageObjContext,
  ProfileContext,
  SelectedObjContext,
  UsernameContext,
} from './lib/contexts'
import MessageBox from './components/MessageBox'
import {
  generateTextualObjects,
  TextualObject,
} from './lib/pieces/textualObject'
import SayBox from './components/SayBox'

export default function Layout() {
  const [username, setUsername] = useState<string | null>(null)
  const [profile, setProfile] = useState(null)

  const objs = generateTextualObjects()

  const [objects, setObjects] = useState<TextualObject[]>([])
  const [selectedObj, setSelectedObj] = useState(objs[0].mesh)
  // const [selectedObj, setSelectedObj] = useState(null)
  const [inboxScene, setInboxScene] = useState(null)

  const [tempUsername, setTempUsername] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempUsername.trim()) {
      setUsername(tempUsername)
    }
  }

  if (!username) {
    // Render the login form if the username is not set
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <h1 className='text-2xl font-bold mb-4'>enter your username</h1>
        <form
          onSubmit={handleLogin}
          className='flex flex-col items-center space-y-2'
        >
          <input
            type='text'
            placeholder='Username'
            value={tempUsername}
            onChange={e => setTempUsername(e.target.value)}
            className='p-2 border  '
          />
          <button
            type='submit'
            className='text-black border px-4 py-2 hover:bg-blue-400'
          >
            Enter
          </button>
        </form>
      </div>
    )
  }

  return (
    <>
      <div className='flex flex-col overflow-y-clip justify-center items-center mx-4 my-4 sm:mx-10 sm:my-10'>
        <h1 className='text-3xl font-black mb-4'>{username}@omt</h1>
        <div className='w-fit'></div>
        <UsernameContext.Provider value={{ username, setUsername }}>
          <ProfileContext.Provider value={{ profile, setProfile }}>
            <InboxSceneContext.Provider value={{ inboxScene, setInboxScene }}>
              <MessageObjContext.Provider value={{ objects, setObjects }}>
                <SelectedObjContext.Provider
                  value={{ selectedObj, setSelectedObj }}
                >
                  <div className='flex flex-wrap space-x-2 space-y-2'>
                    <div className='flex flex-col space-y-2 items-center'>
                      <MainCanvas />
                      <SayBox />
                    </div>
                    {/* <div
              id='container-sub-three'
              style={{ borderRadius: '', overflow: 'hidden' }}
              className='h-fit w-fit'
            ></div> */}
                    <div className='flex flex-col space-y-2'>
                      <MessageBox />
                    </div>
                  </div>
                </SelectedObjContext.Provider>
              </MessageObjContext.Provider>
            </InboxSceneContext.Provider>
          </ProfileContext.Provider>
        </UsernameContext.Provider>
      </div>
    </>
  )
}
