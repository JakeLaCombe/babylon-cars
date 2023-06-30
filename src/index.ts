import "@babylonjs/loaders/glTF";

import { Engine } from "@babylonjs/core/Engines/engine";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { GameScene } from "./GameScene";

let button = document.getElementById("start-game-button");

if (button) {
  button.addEventListener("click", () => {
    document.getElementById("game-start")?.remove();
    new LoadingScreen();
  });
}

class LoadingScreen {
  private totalToLoad: number = 0;
  public loadingUIText: string = "Loading Space-Truckers: The Video Game...";
  public loadingUIBackgroundColor: string = "#f0f0f0";
  private currentAmountLoaded: number = 0.0;
  private progressAvailable: boolean = false;
  private active: boolean = false;
  private engine: Engine;
  private startScene: GameScene;
  private textContainer: AdvancedDynamicTexture;

  constructor() {
    const view = document.getElementById("view") as HTMLCanvasElement;
    view.style.width = "100%";
    view.style.height = "100%";
    this.engine = new Engine(view, true);
    this.engine.loadingScreen = this;
    this.engine.displayLoadingUI();

    this.startScene = new GameScene(this.engine);

    this.textContainer = AdvancedDynamicTexture.CreateFullscreenUI(
      "loadingUI",
      true,
      this.startScene
    );

    this.engine.runRenderLoop(() => {
      if (this.startScene && this.active === true) {
        this.startScene.render();
      }
    });
  }

  displayLoadingUI() {
    this.active = true;
  }
  hideLoadingUI() {
    this.active = false;
  }

  getProgressAvailable() {
    return this.progressAvailable;
  }

  getCurrentAmountLoaded() {
    return this.currentAmountLoaded;
  }

  getTotalToLoad() {
    return this.totalToLoad;
  }

  onProgressHandler(evt) {
    this.progressAvailable = evt.lengthComputable === true;
    this.currentAmountLoaded = evt.loaded || this.currentAmountLoaded;
    this.totalToLoad = evt.total || this.currentAmountLoaded;

    console.log(this.currentAmountLoaded / this.totalToLoad);
    if (this.progressAvailable) {
      this.loadingUIText =
        "Loading Space-Truckers: The Video Game... " +
        ((this.currentAmountLoaded / this.totalToLoad) * 100).toFixed(2);
    }
  }
}
