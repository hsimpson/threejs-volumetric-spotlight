import { Scene, SpotLight, SpotLightHelper, MathUtils, CameraHelper } from 'three';
import { UpdateFunc } from '../systems/loop';

export function createVolumetricSpotLight(scene: Scene): UpdateFunc {
  const spotLight = new SpotLight('#ffffff', 200);

  const withHelper = true;

  spotLight.position.set(5, 5, 2);
  spotLight.angle = MathUtils.degToRad(10);
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 10;

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 1000;
  spotLight.shadow.focus = 1;

  scene.add(spotLight);

  let spotLightHelper: SpotLightHelper;
  let shadowCameraHelper: CameraHelper;

  if (withHelper) {
    spotLightHelper = new SpotLightHelper(spotLight);
    shadowCameraHelper = new CameraHelper(spotLight.shadow.camera);
    scene.add(spotLightHelper);
    scene.add(shadowCameraHelper);
  }

  return () => {
    if (withHelper) {
      spotLightHelper.update();
      shadowCameraHelper.update();
    }
  };
}
