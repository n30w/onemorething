import './app.css'

import p5 from 'p5'

import { createRoot } from 'react-dom/client'
import React from 'react'
import Layout from './layout'
import { sketch } from './lib/render/sketch'

const reactRoot = createRoot(document.getElementById('app')!)
reactRoot.render(<Layout />)

export const myp5 = new p5(
  sketch,
  document.querySelector<HTMLDivElement>('#app')!,
)
