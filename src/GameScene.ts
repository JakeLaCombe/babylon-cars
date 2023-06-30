import "@babylonjs/loaders/glTF";
import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  PointLight,
  Scalar,
  SceneLoader,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { StarfieldProceduralTexture } from "@babylonjs/procedural-textures";

import StreetModel from "./Models/street.glb";
import { createStar, populatePlanetarySystem } from "./Galaxy";

export class GameScene extends Scene {
  constructor(engine: Engine) {
    super(engine);
    this.setup();
    let star = createStar(this);
    star.position.y += 50.0;

    populatePlanetarySystem(this);

    let camAlpha = 0,
      camBeta = -Math.PI / 4,
      camDist = 350,
      camTarget = new Vector3(0, 0, 0);

    const camera = new ArcRotateCamera(
      "Camera",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      this
    );

    // Targets the camera to a particular position. In this case the scene origin
    camera.setTarget(Vector3.Zero());

    // Attach the camera to the canvas
    camera.attachControl(engine.getRenderingCanvas());

    new HemisphericLight("light", new Vector3(0, 1, 0), this);

    this.beginAnimation(star, 0, 60, true, Scalar.RandomRange(0.1, 3));

    SceneLoader.ImportMesh("", "", StreetModel, this, (scene) => {});
  }

  setup() {
    let starfieldPT = new StarfieldProceduralTexture("starfieldPT", 512, this);
    starfieldPT.coordinatesMode = Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE;
    starfieldPT.darkmatter = 1.5;
    starfieldPT.distfading = 0.75;
    let envOptions = {
      skyboxSize: 512,
      createGround: false,
      skyboxTexture: starfieldPT,
      environmentTexture: starfieldPT,
    };
    let light = new PointLight("starLight", Vector3.Zero(), this);
    light.intensity = 2;
    light.diffuse = new Color3(0.98, 0.9, 1);
    light.specular = new Color3(1, 0.9, 0.5);
    this.createDefaultEnvironment(envOptions);
  }
}
