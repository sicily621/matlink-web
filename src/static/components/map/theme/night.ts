import { MeshStandardMaterial, ShaderMaterial, Color, MeshPhysicalMaterial, MeshBasicMaterial, MeshPhongMaterial, Mesh, AdditiveBlending, CanvasTexture, RepeatWrapping } from "three";
import { type Theme, Type } from "./type";
import { reflectionSky, createGradientTextureImg, addAnimate } from "./utils";
import { Tween, Easing, Group } from "@tweenjs/tween.js";
const gtx = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
gtx.canvas.width = 128;
gtx.canvas.height = 128;
const gradient = gtx.createLinearGradient(0, 0, 0, 128);
gradient.addColorStop(0, "rgba(255, 141, 0,1)");
gradient.addColorStop(0.03, "rgba(255, 141, 0,0.3)");
gradient.addColorStop(1, "rgba(255, 141, 0,0)");
gtx.fillStyle = gradient;
gtx.fillRect(0, 0, 128, 128);
const tx_carLine = new CanvasTexture(gtx.canvas);
tx_carLine.wrapS = tx_carLine.wrapT = RepeatWrapping;

const gtxWall = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
gtxWall.canvas.width = 128;
gtxWall.canvas.height = 128;
const gradientWall = gtxWall.createLinearGradient(0, 0, 0, 128);
gradientWall.addColorStop(0, "rgba(10,33,105,1)");
gradientWall.addColorStop(0.5, "rgba(10,33,105,0.3)");
gradientWall.addColorStop(1, "rgba(14,11,147,1)");
gtxWall.fillStyle = gradientWall;
gtxWall.fillRect(0, 0, 128, 128);
const wallMap = new CanvasTexture(gtxWall.canvas);
wallMap.wrapS = wallMap.wrapT = RepeatWrapping;

export const nightMatLib: Theme = {
  glass: new MeshPhysicalMaterial({
    color: 0x248ec7,
    map: createGradientTextureImg("./wall.jpg"),
  }),
  wall: new ShaderMaterial({
    uniforms: {
      topColor: { value: new Color("#416ee3") }, // 顶部颜色
      bottomColor: { value: new Color("#57d7fd") }, // 底部颜色
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
    color: 0x0e5a9d,
    //map: createGradientTextureImg("./wall.jpg"),
    // envMap: reflectionSky,
    // envMapIntensity: 0.3,
    opacity: 0,
  }),
  metal: new MeshPhysicalMaterial({
    color: 0x0f90f9,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
  }),
  // new MeshBasicMaterial({
  //   color: 0x0e75c9,
  //   transparent: true,
  //   opacity: 0.5,
  // }),
  carLight: new MeshBasicMaterial({
    map: tx_carLine,
    transparent: true,
    depthTest: true,
    opacity: 0.6,
    blending: AdditiveBlending,
  }),
  buildingOutline: new MeshPhysicalMaterial({
    color: 0x0f90f9,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
  }),
  otherBuilding: new MeshPhysicalMaterial({
    color: 0x0a61a8,
    map: createGradientTextureImg("./wall.jpg"),
    envMap: reflectionSky,
    envMapIntensity: 1.5,
    transparent: true,
    opacity: 0.2,
  }),
  othersOutline: new MeshPhongMaterial({
    color: 0x0e75c9,
  }),
  glowLine: new MeshPhysicalMaterial({
    color: 0x0f90f9,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
  }),
  windowFrame: new MeshPhysicalMaterial({
    color: 0x63b5f7,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
  }),
  windowGlass: new MeshBasicMaterial({
    color: 0x0f90f9,
    transparent: true,
    depthTest: true,
    opacity: 0.5,
  }),
  wallFacade: new MeshPhysicalMaterial({
    color: 0x356fa4,
    metalness: 1.0,
    roughness: 0.5,
    transmission: 0.0, // 高透射率
    ior: 1.52,
    envMap: reflectionSky,
    envMapIntensity: 2.0,
    transparent: false,
  }),
  fence: new ShaderMaterial({
    uniforms: {
      topColor: { value: new Color("#416ee3") }, // 顶部颜色
      bottomColor: { value: new Color("#57d7fd") }, // 底部颜色
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
  ground: new MeshBasicMaterial({
    color: 0x0e5a9d,
  }),
};

const carLightAnimation = new Tween((nightMatLib[Type.CarLight] as any).map.offset).to({ y: -1 }, 2000).repeat(Infinity).start();
addAnimate(carLightAnimation);

export type GlowType = Extract<Type, Type.BuildingOutline | Type.GlowLine | Type.CarLight>;

const GLOW_TYPE_VALUES: GlowType[] = [Type.BuildingOutline, Type.GlowLine, Type.CarLight];

const isGlowType = (value: string): value is GlowType => GLOW_TYPE_VALUES.includes(value as GlowType);

export const rebuildForNightMode = (obj: Mesh) => {
  const type = obj.name;
  if (isGlowType(type) || type == "zi") obj.layers.enable(1);
};
