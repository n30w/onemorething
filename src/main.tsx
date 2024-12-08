import './app.css'

import { createRoot } from 'react-dom/client'
import React from 'react'
import Layout from './layout'

const reactRoot = createRoot(document.getElementById('app')!)
reactRoot.render(<Layout />)

// export const myp5 = new p5(
//   sketch,
//   document.querySelector<HTMLDivElement>('#app')!,
// )
