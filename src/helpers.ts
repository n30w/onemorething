import * as THREE from "three";

/**
 * Returns a function that will be passed to the renderer's setAnimationLoop method.
 * The returned function will be called each frame and will update the scene and
 * then render it.
 * @param renderer The renderer to render the scene with.
 * @param scene The scene to render.
 * @param camera The camera to render the scene with.
 * @param time The current time.
 * @returns A function that will be passed to the renderer's setAnimationLoop method.
 */
export const animationBuilder = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  time: any
) => {
  const animation = (stats: Stats, update: any): XRFrameRequestCallback => {
    return () => {
      stats.update();
      time = performance.now();

      update();

      renderer.render(scene, camera);
    };
  };

  return animation;
};
