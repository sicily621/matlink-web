import { purchasePrefix } from "../api";
import { Post, Get, Put, Delete } from "@/http/axios";

export interface Purchase {
  id?: string | number;
  billNo: string;
  stockId: string | number;
  applyUserId: string | number;
  deptId: string | number;
  applyDate: any;
  auditStatus: AuditStatus;
  status: PurchaseStatus;
  createUserId: string | number;
  auditUserId: string | number;
  description: string;
  auditTime: any;
}

export enum AuditStatus {
  Pending = 0,
  Rejected = 1,
  Approved = 2,
  Auditing = 3,
}

export const AuditStatusList = [
  { id: 0, name: "待审批" },
  { id: 1, name: "审核不通过" },
  { id: 2, name: "审核通过" },
  { id: 3, name: "审核中" },
];

export enum PurchaseStatus {
  UnPurchased = 0,
  Purchased = 1,
  Abandoned = 2,
  Warehoused = 3,
}
export const PurchaseStatusList = [
  { id: 0, name: "未采购" },
  { id: 1, name: "已采购" },
  { id: 2, name: "已废弃" },
  { id: 3, name: "已入库" },
];
export interface queryPurchaseConditions {
  billNo: string;
  stockId: string | number;
  auditStatus: AuditStatus;
  status: PurchaseStatus;
  startTime: string;
  endTime: string;
}
export const createPurchase = (data: Purchase) => Post(purchasePrefix, data);
export const editPurchase = (data: Purchase) => Put(purchasePrefix, data);
export const deletePurchase = (id: string | number) =>
  Delete(purchasePrefix + `/${id}`);
export const getPurchase = (id: string | number) =>
  Get(purchasePrefix + `/${id}`, null);
export const findPurchasePage = (data: any) =>
  Get(purchasePrefix + "/page", data);
export const getPurchaseList = () => Get(`${purchasePrefix}/list`, null);
