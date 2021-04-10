import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { createCamera } from './components/camera';
import { createCube } from './components/cube';
import { createFloor } from './components/floor';
import { createLights } from './components/lights';
import { createScene } from './components/scene';
import { createVolumetricSpotLight } from './components/volumetricspotlight';
import { createCameraControls } from './systems/cameracontrols';
import { Loop } from './systems/loop';
import { createRenderer } from './systems/renderer';

export class RenderEngine {
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _renderer: WebGLRenderer;
  private _loop: Loop;

  public constructor() {
    this._scene = createScene();
    this._camera = createCamera();
    this._renderer = createRenderer();

    document.body.appendChild(this._renderer.domElement);

    this._loop = new Loop(this._renderer, this._scene, this._camera);
    this._loop.addUpdateable(createCameraControls(this._camera, this._renderer.domElement));
    this._loop.addUpdateable(createLights(this._scene));

    createFloor(this._scene);
    createCube(this._scene);

    this._loop.addUpdateable(createVolumetricSpotLight(this._scene));
  }

  public start(): void {
    this._loop.start();
  }
}
