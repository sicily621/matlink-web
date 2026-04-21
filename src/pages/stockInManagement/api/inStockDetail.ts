import { inStockDetailPrefix } from "../api";
import { Get, Delete, Put } from "@/http/axios";

export interface InStockDetail {
  id?: string | number;
  inStockId: number | string
  materialId: number | string
  stockId: number | string
  perPrice: number
  totalPrice: number
  inStockPrice: number
  priceRatio: number
  actualCount: number
  expectedCount?: number | string
}

export const saveInStockDetail = (data: InStockDetail[]) =>
  Put(`${inStockDetailPrefix}/batchUpdate`, data);
export const getInStockDetailList = (params: { inStockId: string | number }) =>
  Get(`${inStockDetailPrefix}/list`, params);
export const deleteInStockDetail = (inStockId: string) =>
  Delete(inStockDetailPrefix + `/${inStockId}`);

