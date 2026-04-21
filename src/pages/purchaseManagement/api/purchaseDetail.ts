import { PurchaseDetail } from "../api";
import { Get, Delete, Put } from "@/http/axios";

export interface PurchaseDetail {
  id?: string | number;
  billId: string | number;
  materialId: string | number;
  count: number;
  perPrice: number;
  totalPrice: number;
  supplierId: string | number
}

export const savePurchaseDetail = (data: PurchaseDetail[]) =>
  Put(`${PurchaseDetail}/batchUpdate`, data);
export const getPurchaseDetailList = (params: { billId: string | number }) =>
  Get(`${PurchaseDetail}/list`, params);
export const deletePurchaseDetail = (billId: string) =>
  Delete(PurchaseDetail + `/${billId}`);

