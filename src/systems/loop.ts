import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { resizer } from './resizer';

export type UpdateFunc = (deltaTime: number) => void;

export class Loop {
  private _renderer: WebGLRenderer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _updateables: UpdateFunc[] = [];
  private _clock: Clock;

  public constructor(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) {
    this._renderer = renderer;
    this._scene = scene;
    this._camera = camera;
    this._clock = new Clock();
  }

  public start(): void {
    resizer(document.body, (width: number, height: number) => {
      this._renderer.setSize(width, height);
      this._camera.aspect = width / height;
      this._camera.updateProjectionMatrix();
    });
    this._renderer.setAnimationLoop(() => {
      this.animate();
      this._renderer.render(this._scene, this._camera);
    });
  }

  public stop(): void {
    //
  }

  public addUpdateable(updateable: UpdateFunc): void {
    this._updateables.push(updateable);
  }

  private animate(): void {
    // delta time in seconds per frame
    const delta = this._clock.getDelta();

    for (const updateFunc of this._updateables) {
      updateFunc(delta);
    }
  }
}
