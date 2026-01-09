import { CubeTextureLoader, TextureLoader } from "three";
import { Tween, Easing, Group } from "@tweenjs/tween.js";

export const loadCubeTexture = (nameArr: string[]) => {
  let urls = [];
  for (let i = 0; i < 6; i++) {
    let fileName = nameArr.length === 1 ? nameArr[0] : nameArr[i];
    urls.push("./" + fileName);
  }
  return new CubeTextureLoader().setPath("/").load(urls);
};

export const reflectionSky = loadCubeTexture([`reflectSky.jpg`]);

export const createGradientTextureImg = (imageUrl: string) => {
  const textureLoader = new TextureLoader();
  const texture = textureLoader.setPath("/").load(imageUrl);
  return texture;
};

export const mtlTweenGroup = new Group();

export const addAnimate = (clip1: any) => {
  mtlTweenGroup.add(clip1);
};
