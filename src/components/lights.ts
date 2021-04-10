import { AmbientLight, DirectionalLight, DirectionalLightHelper, Object3D, Scene } from 'three';
import { UpdateFunc } from '../systems/loop';

export function createLights(scene: Scene): UpdateFunc {
  const ambientLight = new AmbientLight('#dedea9');

  // directional Light
  const directionalLight = new DirectionalLight('#ffffff', 0.1);
  directionalLight.position.set(-5, 5, 2);

  directionalLight.castShadow = true; // default false
  //Set up shadow properties for the light
  directionalLight.shadow.mapSize.width = 2048; // default
  directionalLight.shadow.mapSize.height = 2048; // default
  directionalLight.shadow.camera.near = 0.1; // default
  directionalLight.shadow.camera.far = 1000; // default

  const directionalLightTarget = new Object3D();
  directionalLightTarget.position.set(0, 0, 2);
  directionalLight.target = directionalLightTarget;

  const directionalLightHelper = new DirectionalLightHelper(directionalLight, 1);

  // add them to the scene
  scene.add(ambientLight);
  // scene.add(directionalLight);
  // scene.add(directionalLightHelper);
  // scene.add(directionalLightTarget);

  return () => {
    directionalLightHelper.update();
  };
}
