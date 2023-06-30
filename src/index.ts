import "@babylonjs/loaders/glTF";

import { Engine } from "@babylonjs/core/Engines/engine"

import { GameScene } from "./GameScene"

const view = document.getElementById("view") as HTMLCanvasElement
view.style.width = "100%";
view.style.height = "100%";
const engine = new Engine(view, true)

const scene = new GameScene(engine)

engine.runRenderLoop(() => {
    scene.render();
})
