import "@babylonjs/loaders/glTF";

import { Engine } from "@babylonjs/core/Engines/engine"

import { GameScene } from "./GameScene"

const view = document.getElementById("view") as HTMLCanvasElement
const engine = new Engine(view, true)

const scene = new GameScene(engine)

engine.runRenderLoop(() => {
    scene.render();
})
