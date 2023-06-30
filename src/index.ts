import "@babylonjs/loaders/glTF";

import { Engine } from "@babylonjs/core/Engines/engine";

import { GameScene } from "./GameScene";

function startGame() {
  const view = document.getElementById("view") as HTMLCanvasElement;
  view.style.width = "100%";
  view.style.height = "100%";
  const engine = new Engine(view, true);

  const scene = new GameScene(engine);

  engine.runRenderLoop(() => {
    scene.render();
  });
}

let button = document.getElementById("start-game-button");

if (button) {
  button.addEventListener("click", () => {
    document.getElementById("game-start")?.remove();
    startGame();
  });
}
