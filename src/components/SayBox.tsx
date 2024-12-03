import React from 'react'

const SayBox: React.FC = () => {
  function publish(formData: { get: (arg0: string) => any }) {
    const content = formData.get('content')
    const button = formData.get('button')
    alert(`'${content}' was published with the '${button}' button`)
  }

  return (
    <form action={publish}>
      <textarea name='content' rows={4} cols={40} className='bg-slate-100' />
      <br />
      <button type='submit' name='button' value='submit' className='bg-red-300'>
        Publish
      </button>
    </form>
  )
}

export default SayBox
