import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
let gui;

export function createGUI(): void {
  gui = new GUI();
}

export function getGUI(): GUI {
  return gui;
}
