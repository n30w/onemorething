import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/Addons.js'

/**
 * Returns a function that will be passed to the renderer's setAnimationLoop method.
 * The returned function will be called each frame and will update the scene and
 * then render it.
 * @param renderer The renderer to render the scene with.
 * @param scene The scene to render.
 * @param camera The camera to render the scene with.
 * @returns A function that will be passed to the renderer's setAnimationLoop method.
 */
export const animationBuilder = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) => {
  const animation = (stats: Stats, update: any): XRFrameRequestCallback => {
    // const render = composer ? composer.render() : renderer.render(scene, camera)
    return () => {
      stats.update()

      update()

      renderer.render(scene, camera)
    }
  }

  return animation
}

export const animationBuilderPixelation = (composer: EffectComposer) => {
  const animation = (stats: Stats, update: any): XRFrameRequestCallback => {
    return () => {
      stats.update()

      update()

      composer.render()
    }
  }

  return animation
}
