import { outBoundApplyPrefix } from "../api";
import { Post, Get, Put, Delete } from "@/http/axios";

export interface OutBoundApply {
  id?: string | number;
  applyNo: string;
  stockId: string | number;
  applyTime: any;
  deptId: string | number;
  applyUserId: string | number;
  auditStatus: AuditStatus;
  status: OutBoundApplyStatus;
  createUserId: string | number;
  auditUserId: string | number;
  purpose: string;
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

export enum OutBoundApplyStatus {
  UnApply = 0,
  Applied = 1,
  Abandoned = 2
}
export const OutBoundApplyStatusList = [
  { id: 0, name: "未领料" },
  { id: 1, name: "已领料" },
  { id: 2, name: "已废弃" }
];
export interface queryOutBoundApplyConditions {
  applyNo: string;
  stockId: string | number;
  auditStatus: AuditStatus;
  status: OutBoundApplyStatus;
  startTime: string;
  endTime: string;
}
export const createOutBoundApply = (data: OutBoundApply) => Post(outBoundApplyPrefix, data);
export const editOutBoundApply = (data: OutBoundApply) => Put(outBoundApplyPrefix, data);
export const deleteOutBoundApply = (id: string | number) =>
  Delete(outBoundApplyPrefix + `/${id}`);
export const findOutBoundApplyPage = (data: any) => Get(outBoundApplyPrefix + "/page", data);
export const getOutBoundApplyList = () => Get(`${outBoundApplyPrefix}/list`, null);
