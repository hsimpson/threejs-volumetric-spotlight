import { Scene, PlaneGeometry, MeshStandardMaterial, Mesh, MathUtils } from 'three';

export function createFloor(scene: Scene): void {
  const geometry = new PlaneGeometry(20, 20);
  const material = new MeshStandardMaterial({ color: '#eeeeee' });

  const floor = new Mesh(geometry, material);

  floor.receiveShadow = true; //default

  // rotate 90° on x axis
  floor.rotateX(MathUtils.degToRad(-90));

  scene.add(floor);
}
