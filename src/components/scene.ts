import { AxesHelper, Color, Scene } from 'three';

export function createScene(): Scene {
  const scene = new Scene();
  scene.background = new Color('#222222');

  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  return scene;
}
