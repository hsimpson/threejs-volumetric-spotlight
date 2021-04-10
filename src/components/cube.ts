import { Scene, BoxGeometry, MeshStandardMaterial, Mesh } from 'three';

export function createCube(scene: Scene): void {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({ color: '#007818', metalness: 0.0, roughness: 0.1 });

  const cube = new Mesh(geometry, material);
  cube.receiveShadow = true;
  cube.castShadow = true;
  cube.position.y = 0.5;

  scene.add(cube);
}
