import { materialPrefix, materialImagePrefix } from "../api";
import { Post, Get, Put, Delete, PostForm } from "@/http/axios";
export interface Material {
  id?: string | number;
  materialTypeId: string | number;
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
  suggestedCostPrice: number;
  suggestedPurchasePrice: number;
  status: number;
  barcode: string;
  createUserId?: string | number;
}
export interface MaterialImage {
  id?: string | number;
  materialId: string | number;
  imagePath: string;
}

export interface queryMaterialConditions {
  code: string;
  name: string;
  brand: string;
  specification: string;
  materialTypeId: string | number;
}

export const createMaterial = (data: Material) => Post(materialPrefix, data);
export const editMaterial = (data: Material) => Put(materialPrefix, data);
export const batchEditMaterial = (data: Partial<Material>[]) =>
  Put(`${materialPrefix}/batchUpdate`, data);
export const deleteMaterial = (id: string | number) =>
  Delete(materialPrefix + `/${id}`);
export const findMaterialPage = (data: any) =>
  Get(materialPrefix + "/page", data);
export const getMaterialList = (data: any) =>
  Get(`${materialPrefix}/list`, data);
export const findMaterialListByIds = (ids: string) =>
  Get(materialPrefix + `/getByIds/${ids}`, null);
export const uploadMaterialImgs = (data: { files: File[] }) =>
  PostForm("/file/uploads", data);
export const batchSaveMaterialImages = (data: Partial<MaterialImage>[]) =>
  Put(`${materialImagePrefix}/batchUpdate`, data);
export const getMaterialImageList = (data: any) =>
  Get(`${materialImagePrefix}/list`, data);
