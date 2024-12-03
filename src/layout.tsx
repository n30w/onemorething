import React from 'react'
import MainCanvas from './components/MainCanvas'

export default function Layout() {
  return (
    <>
      <div className=''>
        <div className='flex flex-col overflow-y-clip justify-center items-center mx-4 my-4 sm:mx-10 sm:my-10 '>
          <h1 className='text-3xl font-bold mb-4'>one more thing</h1>
          {/* <div className='w-full sm:max-w-2xl'>
            <p>aksjldkljasdlk</p>
          </div> */}
          <div className='mb-1'>
            <MainCanvas />
          </div>
        </div>
      </div>
    </>
  )
}
