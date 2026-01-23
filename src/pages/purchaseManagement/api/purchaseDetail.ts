import { PurchaseDetail } from "../api";
import { Get, Delete, Put } from "@/http/axios";

export interface PurchaseDetail {
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

export const savePurchaseDetail = (data: PurchaseDetail[]) =>
  Put(`${PurchaseDetail}/batchUpdate`, data);
export const getPurchaseDetailList = (params: { billId: string | number }) =>
  Get(`${PurchaseDetail}/list`, params);
export const deletePurchaseDetail = (billId: string) =>
  Delete(PurchaseDetail + `/${billId}`);

