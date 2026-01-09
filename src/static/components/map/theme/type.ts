import { Material } from "three";

export enum Type {
  Glass = "glass",
  Wall = "wall",
  Facade = "facade",
  Metal = "metal",
  CarLight = "carLight",
  BuildingOutline = "buildingOutline",
  OtherBuilding = "otherBuilding",
  OthersOutline = "othersOutline",
  GlowLine = "glowLine",
  WindowFrame = "windowFrame",
  WindowGlass = "windowGlass",
}
export enum NightType {
  WallFacade = "wallFacade",
  Fence = "fence",
  Ground = "ground",
}

export type Theme = {
  [key in Type]: Material;
} & {
  [key in NightType]?: Material;
};

export const isType = (value: string): value is Type => Object.values(Type).includes(value as Type);
export const isNightType = (value: string): value is NightType => Object.values(NightType).includes(value as NightType);
