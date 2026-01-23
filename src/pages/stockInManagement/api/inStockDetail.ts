import { inStockDetailPrefix } from "../api";
import { Get, Delete, Put } from "@/http/axios";

export interface InStockDetail {
  id?: string | number;
  billId: string | number;
  materialTypeId: string | number;
  materialId: string | number;
  count: number;
  brand: string;
  modelNo: string;
  perPrice: number;
  totalPrice: number;
  supplierId: string | number
  deliveryDate: any
  description: string
  filePath: string
}

export const saveInStockDetail = (data: InStockDetail[]) =>
  Put(`${inStockDetailPrefix}/batchUpdate`, data);
export const getInStockDetailList = (params: { inStockId: string | number }) =>
  Get(`${inStockDetailPrefix}/list`, params);
export const deleteInStockDetail = (inStockId: string) =>
  Delete(inStockDetailPrefix + `/${inStockId}`);

