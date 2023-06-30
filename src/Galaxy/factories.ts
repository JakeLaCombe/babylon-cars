import {
  Animation,
  Color3,
  Mesh,
  MeshBuilder,
  Scalar,
  Scene,
  StandardMaterial,
  Texture,
  TrailMesh,
} from "@babylonjs/core";

import DistortionMaterial from "../Textures/distortion.png";
import RockNormal from "../Textures/rockn.png";
import Rock from "../Textures/rock.png";

export const createStar = (scene: Scene) => {
  let starDiam = 16;
  let star = MeshBuilder.CreateSphere(
    "star",
    { diameter: starDiam, segments: 128 },
    scene
  );
  let mat = new StandardMaterial("starMat", scene);
  star.material = mat;
  mat.emissiveColor = new Color3(0.37, 0.333, 0.11);
  mat.diffuseTexture = new Texture(DistortionMaterial, scene);
  mat.diffuseTexture.level = 1.8;

  let orbitAnim = new Animation(
    "planetspin",
    "rotation.y",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  const keyFrames = [];

  keyFrames.push({
    frame: 0,
    value: 0,
  });

  keyFrames.push({
    frame: 60,
    value: Scalar.TwoPi,
  });

  orbitAnim.setKeys(keyFrames);

  star.animations.push(orbitAnim);

  return star;
};

export const populatePlanetarySystem = (scene: Scene) => {
  let planets = [];
  let hg = {
    name: "hg",
    posRadians: Scalar.RandomRange(0, 2 * Math.PI),
    posRadius: 14,
    scale: 2,
    color: new Color3(0.45, 0.33, 0.18),
    rocky: true,
  };
  let aphro = {
    name: "aphro",
    posRadians: Scalar.RandomRange(0, 2 * Math.PI),
    posRadius: 35,
    scale: 3.5,
    color: new Color3(0.91, 0.89, 0.72),
    rocky: true,
  };
  let tellus = {
    name: "tellus",
    posRadians: Scalar.RandomRange(0, 2 * Math.PI),
    posRadius: 65,
    scale: 3.75,
    color: new Color3(0.17, 0.63, 0.05),
    rocky: true,
  };
  let ares = {
    name: "ares",
    posRadians: Scalar.RandomRange(0, 2 * Math.PI),
    posRadius: 100,
    scale: 3,
    color: new Color3(0.55, 0, 0),
    rocky: true,
  };
  let zeus = {
    name: "zeus",
    posRadians: Scalar.RandomRange(0, 2 * Math.PI),
    posRadius: 140,
    scale: 6,
    color: new Color3(0, 0.3, 1),
    rocky: false,
  };
  planets.push(createPlanet(hg, scene));
  planets.push(createPlanet(aphro, scene));
  planets.push(createPlanet(tellus, scene));
  planets.push(createPlanet(ares, scene));
  planets.push(createPlanet(zeus, scene));
  return planets;
};

const createAndStartOrbitAnimation = (planet: Mesh, scene: Scene) => {
  const Gm = 6672.59 * 0.07;
  const opts = planet.metadata.orbitOptions;
  const rCubed = Math.pow(opts.posRadius, 3);
  const period = Scalar.TwoPi * Math.sqrt(rCubed / Gm);
  const v = Math.sqrt(Gm / opts.posRadius);
  const w = v / period;
  const circum = Scalar.TwoPi * opts.posRadius;
  let angPos = opts.posRadians;

  planet.computeWorldMatrix(true);

  let planetTrail = new TrailMesh(
    planet.name + "-trail",
    planet,
    scene,
    0.1,
    circum,
    true
  );
  let trailMat = new StandardMaterial(planetTrail.name + "-mat", scene);
  trailMat.emissiveColor =
    trailMat.specularColor =
    trailMat.diffuseColor =
      opts.color;
  planetTrail.material = trailMat;

  let preRenderObsv = scene.onBeforeRenderObservable.add((sc) => {
    planet.position.x = opts.posRadius * Math.sin(angPos);
    planet.position.z = opts.posRadius * Math.cos(angPos);
    angPos = Scalar.Repeat(angPos + w, Scalar.TwoPi);
  });

  return preRenderObsv;
};

const createPlanet = (opts, scene: Scene) => {
  let planet = MeshBuilder.CreateSphere(opts.name, { diameter: 1 }, scene);
  let mat = new StandardMaterial(planet.name + "-mat", scene);
  mat.diffuseColor = mat.specularColor = opts.color;
  mat.specularPower = 0;

  if (opts.rocky === true) {
    mat.bumpTexture = new Texture(RockNormal, scene);
    mat.diffuseTexture = new Texture(Rock, scene);
  } else {
    mat.diffuseTexture = new Texture(DistortionMaterial, scene);
  }

  planet.material = mat;
  planet.scaling.setAll(opts.scale);
  planet.position.x = opts.posRadius * Math.sin(opts.posRadians);
  planet.position.z = opts.posRadius * Math.cos(opts.posRadians);

  planet.metadata = { orbitOptions: opts };
  planet.metadata.orbitAnimationObserver = createAndStartOrbitAnimation(
    planet,
    scene
  );

  return planet;
};
