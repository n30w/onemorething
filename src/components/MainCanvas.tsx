import React from 'react'
import SayBox from './SayBox'

const MainCanvas: React.FC = () => {
  return (
    <>
      <div id='container-p5'></div>
      <div className='flex flex-wrap space-x-2 space-y-2'>
        <div
          id='container-three'
          className='border-2  h-fit'
          style={{ borderRadius: '4px', overflow: 'hidden' }}
        ></div>
        <div
          id='container-sub-three'
          style={{ borderRadius: '4px', overflow: 'hidden' }}
          className='border-2 h-fit'
        ></div>
        {/* <SayBox /> */}
      </div>
    </>
  )
}

export default MainCanvas
