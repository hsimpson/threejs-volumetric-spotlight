import { PerspectiveCamera } from 'three';

export function createCamera(): PerspectiveCamera {
  // create a perspective camera with 45° vertical fov
  const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // move the camera 2 units up and 7 units back
  camera.position.y = 2;
  camera.position.z = 13;

  return camera;
}
