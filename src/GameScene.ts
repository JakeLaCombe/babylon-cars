import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, SceneLoader, UniversalCamera, Vector3 } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { SampleMaterial } from "./Materials/SampleMaterial";
import StreetModel from "./Models/street.glb";

export class GameScene extends Scene {

    constructor(engine: Engine)
    {
        super(engine)

        const camera = new UniversalCamera("UniversalCamera", new Vector3(0, 0, -10), this);

        // Targets the camera to a particular position. In this case the scene origin
        camera.setTarget(Vector3.Zero());
        
        // Attach the camera to the canvas
        camera.attachControl(engine.getRenderingCanvas());
        
        const light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            this)

        SceneLoader.ImportMesh("", "", StreetModel, this, (scene) => {});
    }
}