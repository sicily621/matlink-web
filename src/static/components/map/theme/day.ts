import { MeshStandardMaterial, ShaderMaterial, Color, MeshPhysicalMaterial, MeshBasicMaterial, Mesh, CanvasTexture, RepeatWrapping, AdditiveBlending } from "three";
import { type Theme, Type } from "./type";
import { reflectionSky, createGradientTextureImg, addAnimate } from "./utils";
import { Tween, Easing, Group } from "@tweenjs/tween.js";

const gtx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
gtx.canvas.width = 128;
gtx.canvas.height = 128;
const gradient = gtx.createLinearGradient(0, 0, 0, 128);
gradient.addColorStop(0, "rgba(255, 255, 255,1)");
gradient.addColorStop(0.03, "rgba(255, 255, 255,0.3)");
gradient.addColorStop(1, "rgba(255, 255, 255,0)");
gtx.fillStyle = gradient;
gtx.fillRect(0, 0, 128, 128);
const tx_carLine = new CanvasTexture(gtx.canvas);
tx_carLine.wrapS = tx_carLine.wrapT = RepeatWrapping;
const tileMap = createGradientTextureImg("./tile.png");
tileMap.wrapS = tileMap.wrapT = RepeatWrapping;
export const dayMatLib: Theme = {
  glass: new MeshPhysicalMaterial({
    color: 0x356fa4,
    metalness: 1.0,
    roughness: 0.1,
    transmission: 0.0, // 高透射率
    ior: 1.52,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
    transparent: true,
    opacity: 0.95,
  }),
  wall: new ShaderMaterial({
    uniforms: {
      topColor: { value: new Color("#dfdfdf") }, // 顶部颜色
      bottomColor: { value: new Color("#ffffff") }, // 底部颜色
    },
    vertexShader: `  
      varying vec2 vUv;  
      void main() {  
        vUv = uv; // 传递 UV 到片元着色器  
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
      }  
    `,
    fragmentShader: `  
      varying vec2 vUv;  
      uniform vec3 topColor;  
      uniform vec3 bottomColor;  
      void main() {  
        // 用 vUv.y 控制从上到下的渐变（假设 vUv.y 0 是顶部，1 是底部）  
        float t = vUv.y;  
        vec3 color = mix(topColor, bottomColor, t);  
        gl_FragColor = vec4(color, 1.0);  
      }  
    `,
  }),
  facade: new MeshPhysicalMaterial({
    color: 0x3e73a5,
    metalness: 1.0,
    roughness: 0.1,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
  }),
  metal: new MeshPhysicalMaterial({
    color: 0xf3f3f3,
    metalness: 1.0,
    roughness: 0.1,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
  }),
  // ground: Material;
  carLight: new MeshBasicMaterial({
    map: tx_carLine,
    transparent: true,
    depthTest: true,
    opacity: 0.6,
    blending: AdditiveBlending,
  }),
  buildingOutline: new MeshBasicMaterial({
    color: 0x356fa4,
    transparent: true,
    opacity: 0.2,
  }),
  otherBuilding: new MeshPhysicalMaterial({
    color: 0xffffff,
    map: createGradientTextureImg("./wall.jpg"),
    envMap: reflectionSky,
    envMapIntensity: 1.5,
    transparent: true,
    opacity: 0.2,
  }),
  othersOutline: new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
  }),
  glowLine: new MeshPhysicalMaterial({
    color: 0xffffff,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
  }),
  windowFrame: new MeshPhysicalMaterial({
    color: 0x434d63,
    metalness: 1.0,
    roughness: 0.1,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
    transparent: true,
    opacity: 0.95,
  }),
  windowGlass: new MeshPhysicalMaterial({
    color: 0x356fa4,
    metalness: 1.0,
    roughness: 0.1,
    transmission: 0.0, // 高透射率
    ior: 1.52,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
    transparent: true,
    opacity: 0.85,
  }),
};
const carLightAnimation = new Tween((dayMatLib[Type.CarLight] as any).map.offset).to({ y: -1 }, 2000).repeat(Infinity).start();
addAnimate(carLightAnimation);

export enum ReceiveShadowType {
  Ground = "ground",
}
const isReceiveShadowType = (value: string): value is ReceiveShadowType => Object.values(ReceiveShadowType).includes(value as ReceiveShadowType);

export const rebuildForDayMode = (obj: Mesh) => {
  const type = obj.name;
  if (isReceiveShadowType(type)) {
    obj.receiveShadow = true;
  } else {
    obj.castShadow = true;
  }
};
