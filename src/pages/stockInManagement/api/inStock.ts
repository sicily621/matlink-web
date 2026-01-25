import { inStockPrefix, inStockFilePrefix } from "../api";
import { Post, Get, Put, Delete, PostForm } from "@/http/axios";
export interface InStock {
  id?: string | number;
  originOrderId: string | number;
  stockId: string | number;
  inStockNo: string;
  auditStatus: AuditStatus;
  status: InStockStatus;
  supplyId: string | number;
  type: number;
  description: string;
  isDirect: number;
  inStockUserId: string | number;
  inStockTime: any;
  auditUserId?: string | number;
  auditTime?: number;
  createUserId: string | number;
  [key: string]: any;
}

export enum InStockStatus {
  UnStored = 0,
  Stored = 1,
  Invalid = 2,
}

export const InStockStatusList = [
  { id: 0, name: "未入库" },
  { id: 1, name: "已入库" },
  { id: 2, name: "已作废" },
];

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

export interface queryInStockConditions {
  auditStatus: AuditStatus | -1;
  status: InStockStatus | -1;
  startTime: string;
  endTime: string;
  stockId: string | number;
}
export interface InStockFile {
  id?: string | number;
  inStockId: string | number;
  filePath: string;
  fileName: string;
}
export const createInStock = (data: InStock) => Post(inStockPrefix, data);
export const editInStock = (data: InStock) => Put(inStockPrefix, data);
export const batchEditInStock = (data: Partial<InStock>[]) =>
  Put(`${inStockPrefix}/batchUpdate`, data);
export const deleteInStock = (id: string | number) =>
  Delete(inStockPrefix + `/${id}`);
export const findInStockPage = (data: any) =>
  Get(inStockPrefix + "/page", data);
export const getInStockList = (data: any) => Get(`${inStockPrefix}/list`, data);
export const findInStockListByIds = (ids: string) =>
  Get(inStockPrefix + `/getByIds/${ids}`, null);

export const uploadInStockFiles = (data: { files: File[] }) =>
  PostForm("/file/uploads", data);
export const batchSaveInStockFiles = (data: Partial<InStockFile>[]) =>
  Put(`${inStockFilePrefix}/batchUpdate`, data);
export const getInStockFileList = (data: any) =>
  Get(`${inStockFilePrefix}/list`, data);
export const deleteInStockFile = (id: string | number) =>
  Delete(inStockFilePrefix + `/${id}`);
