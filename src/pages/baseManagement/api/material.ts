import { materialPrefix } from "../api";
import { Post, Get, Put, Delete } from "@/http/axios";
export interface Material {
  id?: string | number;
  tradeTypeId: string | number;
  code: string;
  name: string;
  simpleName: string;
  brand: string;
  modelNo: string;
  producingArea: string;
  specification: string;
  description: string;
  unit: string | number;
  minCountLimit: number;
  maxCountLimit: number;
  safeCountLimit: number;
  suggestedCostPrice: number
  suggestedPurchasePrice: number
  status: number;
  barcode: string;
  createUserId?: string | number;
}

export interface queryMaterialConditions {
  code: string;
  name: string;
  brand: string;
  specification: string;
  tradeTypeId: string | number;
}

export const createMaterial = (data: Material) => Post(materialPrefix, data);
export const editMaterial = (data: Material) => Put(materialPrefix, data);
export const batchEditMaterial = (data: Partial<Material>[]) => Put(`${materialPrefix}/batchUpdate`, data);
export const deleteMaterial = (id: string | number) =>
  Delete(materialPrefix + `/${id}`);
export const findMaterialPage = (data: any) =>
  Get(materialPrefix + "/page", data);
export const getMaterialList = (data: any) => Get(`${materialPrefix}/list`, data);
export const findMaterialListByIds = (ids: string) =>
  Get(materialPrefix + `/getByIds/${ids}`, null);
