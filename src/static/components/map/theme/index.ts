import { Material, Mesh, Object3D } from "three";
import { dayMatLib, rebuildForDayMode } from "./day";
import { nightMatLib, rebuildForNightMode } from "./night";
import { MapMode } from "../map";
import { type Theme, Type, isType, isNightType } from "./type";
import { mtlTweenGroup } from "./utils";

export type Themes = {
  [key in MapMode]: Theme;
};

export const Themes: Themes = {
  [MapMode.DAY]: dayMatLib,
  [MapMode.NIGHT]: nightMatLib,
};

export const setMaterial = (obj: Mesh, mode: MapMode) => {
  const materials = Themes[mode];
  const type = obj.name;
  if ((isType(type) || isNightType(type)) && materials[type]) {
    if (type === Type.GlowLine) {
      (obj.material as any).color = (materials[type] as any).color;
    } else {
      obj.material = materials[type];
    }
  }
};

export const reBuildModel = (obj: Mesh, mode: MapMode) => {
  if (mode === MapMode.DAY) {
    rebuildForDayMode(obj);
  } else {
    rebuildForNightMode(obj);
  }
};

export function cloneMaterial(material: Material | Material[]): Material | Material[] {
  if (Array.isArray(material)) {
    return material.map((mat) => cloneMaterial(mat) as Material);
  }
  if (!material) {
    return null as unknown as Material;
  }
  const cloned = material.clone();
  return cloned;
}

let rawMaterials: { [key: number | string]: Material | Material[] } = {};
export const traverseModel = (baseObject: Object3D, mode: MapMode) => {
  let materials: { [key: number | string]: Material } = {};
  baseObject.traverse((child: any) => {
    if (child.isMesh) {
      if (isNightType(child.name) && !rawMaterials[child.uuid]) {
        rawMaterials[child.uuid] = cloneMaterial(child.material);
      }
      if (rawMaterials[child.uuid]) {
        child.material = rawMaterials[child.uuid];
      }
      setMaterial(child, mode);
      reBuildModel(child, mode);
      materials[child.uuid] = child.material;
    }
  });
  return materials;
};

export { mtlTweenGroup };
