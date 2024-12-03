import p5 from 'p5'
import { initSubThree, initThree2 } from '../init'

export const sketch = (p5: p5) => {
  p5.setup = () => {
    const canvas = p5.createCanvas(640, 480)
    canvas.parent('container-p5')
    canvas.hide()

    // initThree(p5)
    initThree2(p5)
    initSubThree(p5)
  }

  p5.draw = () => {
    p5.background(100)
    p5.noLoop()
  }
}
