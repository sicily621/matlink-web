import { outStockPrefix, outStockFilePrefix } from "../api";
import { Post, Get, Put, Delete, PostForm } from "@/http/axios";
export interface OutStock {
  id?: string | number;
  originOrderId: string | number;
  stockId: string | number;
  outStockNo: string;
  auditStatus: AuditStatus;
  status: OutStockStatus;
  type: number;
  description: string;
  isDirect: number;
  outStockUserId: string | number;
  outStockTime: any;
  auditUserId?: string | number;
  auditTime?: number;
  createUserId: string | number;
  [key: string]: any;
}

export enum OutStockStatus {
  UnStored = 0,
  Stored = 1,
  Invalid = 2,
}

export const OutStockStatusList = [
  { id: 0, name: "未出库" },
  { id: 1, name: "已出库" },
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
  { id: 1, name: "审批不通过" },
  { id: 2, name: "审批通过" },
  { id: 3, name: "审批中" },
];

export interface queryOutStockConditions {
  auditStatus: AuditStatus | -1;
  status: OutStockStatus | -1;
  startTime: string;
  endTime: string;
  stockId: string | number;
}
export interface OutStockFile {
  id?: string | number;
  outStockId: string | number;
  filePath: string;
  fileName: string;
}
export const createOutStock = (data: OutStock) => Post(outStockPrefix, data);
export const editOutStock = (data: OutStock) => Put(outStockPrefix, data);
export const batchEditOutStock = (data: Partial<OutStock>[]) =>
  Put(`${outStockPrefix}/batchUpdate`, data);
export const deleteOutStock = (id: string | number) =>
  Delete(outStockPrefix + `/${id}`);
export const findOutStockPage = (data: any) =>
  Get(outStockPrefix + "/page", data);
export const getOutStockList = (data: any) =>
  Get(`${outStockPrefix}/list`, data);
export const findOutStockListByIds = (ids: string) =>
  Get(outStockPrefix + `/getByIds/${ids}`, null);

export const uploadOutStockFiles = (data: { files: File[] }) =>
  PostForm("/file/uploads", data);
export const batchSaveOutStockFiles = (data: Partial<OutStockFile>[]) =>
  Put(`${outStockFilePrefix}/batchUpdate`, data);
export const getOutStockFileList = (data: any) =>
  Get(`${outStockFilePrefix}/list`, data);
export const deleteOutStockFile = (id: string | number) =>
  Delete(outStockFilePrefix + `/${id}`);
export const updateAuditStatus = (data: {
  orderId: string | number;
  auditStatus: number;
  auditRemark?: string;
}) => Post(outStockPrefix + "/updateAuditStatus", data);
export const validateOutStockNo = (data: OutStock) => Post(outStockPrefix + "/validateOutStockNo", data);