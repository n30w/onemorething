import React, { useContext } from 'react'
import { SelectedObjContext, SelectedObjContextValue } from '../lib/contexts'

const MessageBox: React.FC = () => {
  const { selectedObj } = useContext(
    SelectedObjContext,
  ) as SelectedObjContextValue
  return (
    <div className='h-96 w-96 border-1 p-4 overflow-scroll'>
      {selectedObj && <h1 className='font-bold'>{selectedObj.subject}</h1>}
      {selectedObj && <p>from: {selectedObj.sender}</p>}
      {selectedObj && <p>to: {selectedObj.receiver}</p>}
      {selectedObj ? (
        <p className='mt-4'>{selectedObj.body}</p>
      ) : (
        <p className='italic'>no message selected...</p>
      )}
    </div>
  )
}

export default MessageBox
