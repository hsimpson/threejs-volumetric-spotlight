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

const spotLightProperties = {
  distance: 12,
  distanceStart: 1,
  distanceEnd: 12,
  color: '#ff0000',
  intensity: 1000, // lumen
  halfAngle: 10,
  target: new Vector3(0, 0, 0),
  blend: 0.5, // 0 = linear, 1 = quadratic
};

function createConeGeometry(halfAngle: number, distance): CylinderGeometry {
  const coneStartRadius = 0.1;
  const coneEndRadius = distance * Math.tan(halfAngle);
  const coneGeometry = new CylinderGeometry(coneStartRadius, coneEndRadius, distance, 32, 1, true);
  return coneGeometry;
}

export function createVolumetricSpotLight(scene: Scene): UpdateFunc {
  const withHelper = false;

  const spotLight = new SpotLight(spotLightProperties.color, spotLightProperties.intensity);

  const spotlightHalfAngle = MathUtils.degToRad(spotLightProperties.halfAngle);

  // spotLight.position.set(5, 5, 2);
  // spotLight.position.set(0, 5, -5);
  spotLight.position.set(0, 10, 0);
  spotLight.angle = spotlightHalfAngle;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = spotLightProperties.distance;

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
  const coneGeometry = createConeGeometry(spotlightHalfAngle, spotLightProperties.distance);
  const coneMaterial = new RawShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    side: FrontSide,
    uniforms: {
      color: { value: new Color(spotLightProperties.color) },
      distance: { value: spotLightProperties.distance },
      distanceStart: { value: spotLightProperties.distanceStart },
      distanceEnd: { value: spotLightProperties.distanceEnd },
      blend: { value: spotLightProperties.blend },
    },
  });
  const coneMesh = new Mesh(coneGeometry, coneMaterial);

  const moveCone = (): void => {
    const direction = new Vector3();
    direction.subVectors(spotLightProperties.target, spotLight.position).normalize();
    const coneOffset = direction.clone().setLength(spotLightProperties.distance / 2);
    coneOffset.x = 0;
    coneOffset.z = 0;
    coneMesh.position.set(0, 0, 0);
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

  // gui
  const gui = getGUI();
  const spotLightGui = gui.addFolder('SpotLight');
  spotLightGui.add(spotLightProperties, 'halfAngle', 0, 90).onChange((angle) => {
    angle = MathUtils.degToRad(angle);
    spotLight.angle = angle;
    coneMesh.geometry = createConeGeometry(angle, spotLightProperties.distance);
  });
  spotLightGui.add(spotLightProperties, 'distance', 0, 50, 1).onChange((distance) => {
    spotLight.distance = distance;
    coneMesh.geometry = createConeGeometry(spotLight.angle, distance);
    coneMaterial.uniforms.distance.value = distance;
    moveCone();
  });
  spotLightGui.add(spotLightProperties, 'intensity', 0, 10000).onChange((intensity) => {
    spotLight.intensity = intensity;
  });
  spotLightGui.addColor(spotLightProperties, 'color').onChange((color) => {
    spotLight.color.set(color);
    coneMaterial.uniforms.color.value.set(color);
  });
  spotLightGui.add(spotLightProperties, 'distanceStart', 0, 50, 1).onChange((distanceStart) => {
    coneMaterial.uniforms.distanceStart.value = distanceStart;
  });
  spotLightGui.add(spotLightProperties, 'distanceEnd', 0, 50, 1).onChange((distanceEnd) => {
    coneMaterial.uniforms.distanceEnd.value = distanceEnd;
  });
  spotLightGui.add(spotLightProperties, 'blend', 0, 1, 0.1).onChange((blend) => {
    coneMaterial.uniforms.blend.value = blend;
  });

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
    // moveCone();
  };
}
