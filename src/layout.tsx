import React from 'react'
import MainCanvas from './components/MainCanvas'

export default function Layout() {
  return (
    <>
      <div className='flex flex-col overflow-y-clip justify-center items-center mx-4 my-4 sm:mx-10 sm:my-10'>
        <h1 className='text-3xl font-black mb-4'>@omt</h1>
        <div className='w-fit'></div>
        <MainCanvas />
      </div>
    </>
  )
}
