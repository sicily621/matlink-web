import { stockDetailPrefix } from "../api";
import { Post, Get, Put, Delete, PostForm } from "@/http/axios";
export interface stockDetail {
  orderId: string | number;
  type: number; //1入库 2出库 4盘点
}

export const warningInventoryList = [
  { id: 1, name: "低于最低库存" },
  { id: 2, name: "低于安全库存" },
  { id: 3, name: "高于最大库存" },
];
export interface queryMaterialStockDetailParams {
  stockId: string | number;
  materialTypeId: string | number;
  materialId: string | number;
  materialIds: string[] | number[];
}

export interface queryInventoryConditions {
  materialTypeId: string | number;
  stockId: string | number;
  name: string;
  brand: string;
  code: string;
}
export interface Inventory {
  stockId: string | number;
  materialTypeId: string | number;
  materialId: string | number;
  count: number;
  lockCount: number;
  useCount: number;
  stockTime: any;
  transitCount: number;
  costPrice: number;
  totalCostPrice: number;
}
export const materialStockDetailSave = (data: stockDetail) =>
  Post(stockDetailPrefix, data);
export const getMaterialStockDetailList = (
  data: queryMaterialStockDetailParams
) => Get(stockDetailPrefix + "/list", data);
export const findInventoryPage = (data: any) =>
  Get(stockDetailPrefix + "/page", data);
