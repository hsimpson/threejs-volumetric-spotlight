import {
  AxesHelper,
  CameraHelper,
  Color,
  CylinderGeometry,
  MathUtils,
  Mesh,
  Object3D,
  RawShaderMaterial,
  Scene,
  SpotLight,
  SpotLightHelper,
  Vector3,
  DoubleSide,
  BackSide,
  FrontSide,
} from 'three';
import fragmentShader from '../shaders/volumetricspotlight.fs';
import vertexShader from '../shaders/volumetricspotlight.vs';
import { getGUI } from '../systems/gui';
import { UpdateFunc } from '../systems/loop';

export function createVolumetricSpotLight(scene: Scene): UpdateFunc {
  const spotLightColor = new Color('#ff0000');
  const spotLight = new SpotLight(spotLightColor, 1000);

  const withHelper = false;
  const spotlightHalfAngle = MathUtils.degToRad(10);

  // spotLight.position.set(5, 5, 2);
  // spotLight.position.set(0, 5, -5);
  spotLight.position.set(0, 10, 0);
  spotLight.angle = spotlightHalfAngle;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 12;

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 1000;
  spotLight.shadow.focus = 1;

  // spotLight target
  const spotLightTarget = new Object3D();
  spotLight.target = spotLightTarget;
  let left = true;

  scene.add(spotLight);
  scene.add(spotLightTarget);

  let spotLightHelper: SpotLightHelper;
  let shadowCameraHelper: CameraHelper;

  // spotlight cone
  const coneStartRadius = 0.1;
  const coneEndRadius = spotLight.distance * Math.tan(spotlightHalfAngle);
  const coneGeometry = new CylinderGeometry(coneStartRadius, coneEndRadius, spotLight.distance, 32, 1, true);
  const coneMaterial = new RawShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    side: FrontSide,
    uniforms: {
      color: { value: spotLightColor },
      distance: { value: spotLight.distance },
      distanceStart: { value: 1 },
      distanceEnd: { value: spotLight.distance },
      lerpLinearQuad: { value: 0.5 }, // 0 = linear, 1 = quadratic
    },
  });
  const coneMesh = new Mesh(coneGeometry, coneMaterial);

  const moveCone = (): void => {
    const direction = new Vector3();
    direction.subVectors(spotLightTarget.position, spotLight.position).normalize();
    const coneOffset = direction.clone().setLength(spotLight.distance / 2);
    coneMesh.position.addVectors(coneMesh.position, coneOffset);
  };

  const conePivot = new Object3D();
  conePivot.add(coneMesh);
  conePivot.position.set(spotLight.position.x, spotLight.position.y, spotLight.position.z);
  scene.add(conePivot);

  moveCone();

  if (withHelper) {
    spotLightHelper = new SpotLightHelper(spotLight);
    shadowCameraHelper = new CameraHelper(spotLight.shadow.camera);
    const pivotHelper = new AxesHelper(1);
    conePivot.add(pivotHelper);
    scene.add(spotLightHelper);
    scene.add(shadowCameraHelper);
  }

  const rotateCone = (): void => {
    conePivot.lookAt(spotLightTarget.position);
    conePivot.rotateX(MathUtils.degToRad(-90));
  };

  const gui = getGUI();
  const spotLightGui = gui.addFolder('SpotLight');
  spotLightGui.add(spotLight, 'angle', 0, Math.PI / 2).onChange((angel) => {
    const coneStartRadius = 0.1;
    const coneEndRadius = spotLight.distance * Math.tan(angel);
    const newConeGeom = new CylinderGeometry(coneStartRadius, coneEndRadius, spotLight.distance, 32, 1, true);
    coneMesh.geometry = newConeGeom;
  });
  // spotLightGui.add(spotLight, 'distance', 0, 100);

  return (deltaTime: number) => {
    if (withHelper) {
      spotLightHelper.update();
      shadowCameraHelper.update();
    }

    if (left) {
      spotLightTarget.position.x -= 4 * deltaTime;
      if (spotLightTarget.position.x <= -10) {
        left = !left;
      }
    } else {
      spotLightTarget.position.x += 4 * deltaTime;
      if (spotLightTarget.position.x >= 10) {
        left = !left;
      }
    }
    rotateCone();
  };
}
