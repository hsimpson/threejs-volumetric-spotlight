import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from 'three';

export function getEulerRotationFromVectors(start: Vector3, end: Vector3): Euler {
  const rot = new Quaternion();
  const euler = new Euler();

  rot.setFromUnitVectors(start.clone().normalize(), end.clone().normalize());
  euler.setFromQuaternion(rot);

  return euler;
}

// export function rotateAboutPoint(obj: Object3D, point: Vector3, matrix: Matrix4, pointIsWorld = false): void {
//   if (pointIsWorld) {
//     obj.parent.localToWorld(obj.position); // compensate for world coordinate
//   }

//   obj.position.sub(point); // remove the offset
//   // obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
//   // obj.position.rota
//   obj.position.add(point); // re-add the offset

//   if (pointIsWorld) {
//     obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
//   }

//   // obj.rotateOnAxis(axis, theta); // rotate the OBJECT
//   obj.setRotationFromMatrix(matrix);
// }
