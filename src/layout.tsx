import React, { useState } from 'react'
import MainCanvas from './components/MainCanvas'
import {
  InboxSceneContext,
  MessageObjContext,
  SelectedObjContext,
} from './lib/Contexts'
import MessageBox from './components/MessageBox'
import { generateTextualObjects } from './lib/pieces/textualObject'
import SayBox from './components/SayBox'

export default function Layout() {
  const objs = generateTextualObjects()

  const [objects, setObjects] = useState(objs)
  const [selectedObj, setSelectedObj] = useState(objs[0].mesh)
  const [inboxScene, setInboxScene] = useState(null)

  return (
    <>
      <div className='flex flex-col overflow-y-clip justify-center items-center mx-4 my-4 sm:mx-10 sm:my-10'>
        <h1 className='text-3xl font-black mb-4'>@omt</h1>
        <div className='w-fit'></div>
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
      </div>
    </>
  )
}
