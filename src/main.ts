import "./app.css";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
import dat from "dat.gui";
import * as THREE from "three";
import { BasicPlane, Satellite } from "./elements";
import { animationBuilder } from "./helpers";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import p5 from "p5";
import { setupScene } from "./scene";

console.log("three.js Version: " + THREE.REVISION);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div id="container-three"></div>
  <div id="container-p5"></div>
`;

/**
 * initThree sets up anything related to Three JS.
 * It is then used in the p5 sketch function.
 * @param p5 an instance of p5 in order to use p5 helper functions, like noise.
 */
function initThree(p5: p5) {
  const { scene, camera, renderer } = setupScene();

  let time;
  let frame = 0;

  // @ts-ignore
  let controls = new OrbitControls(camera, renderer.domElement);

  // @ts-ignore
  window.THREE = THREE;

  const gui = new dat.GUI();
  const stats: Stats = new Stats();
  stats.showPanel(0);

  const animate = animationBuilder(renderer, scene, camera, time);

  document.body.appendChild(stats.dom);

  let plane: BasicPlane = new BasicPlane();
  let sun: Satellite = new Satellite(0xaf0f0f, 100)
    .setOrbitCenter(0, 0, 0)
    .setOrbitRadius(700);
  let moon: Satellite = new Satellite()
    .setOrbitCenter(0, 0, 0)
    .setOrbitRadius(-700);

  scene.add(sun.mesh, moon.mesh, plane.mesh);

  scene.background = new THREE.Color(0x000);

  renderer.setAnimationLoop(
    animate(stats, () => {
      frame++;

      let posArray = plane.geometry.attributes.position.array;
      for (let i = 0; i < posArray.length; i += 3) {
        let x = posArray[i + 0];
        let y = posArray[i + 1];

        let xOffset = (x + 2) * 0.005 + frame * 0.002;
        let yOffset = (y + 19) * 0.005 + frame * 0.001;
        let amp = 8;

        let noiseValue = (p5.noise(xOffset, yOffset) * amp) ** 2.8;

        posArray[i + 2] = noiseValue; // update the z value.
      }
      // scene.background.Color.set(Math.sin(frames) * 2);

      plane.geometry.attributes.position.needsUpdate = true;

      sun.update();
      moon.update();
    })
  );

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

const sketch = (p5: p5) => {
  p5.setup = () => {
    const canvas = p5.createCanvas(640, 480);
    canvas.parent("container-p5");
    canvas.hide();

    initThree(p5);
  };

  p5.draw = () => {
    p5.background(100);
    p5.noLoop();
  };
};

export const myp5 = new p5(
  sketch,
  document.querySelector<HTMLDivElement>("#app")!
);
