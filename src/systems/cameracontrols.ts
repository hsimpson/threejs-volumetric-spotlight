import { Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { UpdateFunc } from './loop';

export function createCameraControls(camera: Camera, domElement: HTMLElement): UpdateFunc {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;

  return () => {
    // update the controls
    controls.update();
  };
}
