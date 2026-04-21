import { outStockDetailPrefix } from "../api";
import { Get, Delete, Put } from "@/http/axios";

export interface OutStockDetail {
  id?: string | number;
  outStockId: number | string
  materialId: number | string
  stockId: number | string
  perPrice: number
  totalPrice: number
  outStockPrice: number
  priceRatio: number
  actualCount: number
  expectedCount?: number | string
}

export const saveOutStockDetail = (data: OutStockDetail[]) =>
  Put(`${outStockDetailPrefix}/batchUpdate`, data);
export const getOutStockDetailList = (params: {
  outStockId: string | number;
}) => Get(`${outStockDetailPrefix}/list`, params);
export const deleteOutStockDetail = (outStockId: string) =>
  Delete(outStockDetailPrefix + `/${outStockId}`);
