import { auditFlowPrefix } from "../api";
import { Post, Get, Put, Delete } from "@/http/axios";
export interface AuditFlow {
  id?: string | number;
  title: string;
  stockId: string | number;
  type: number;
  deptId: string | number;
  remark: string;
  enable: number;
  createUserId?: string | number;
}

export interface queryAuditFlowConditions {
  title: string;
  deptId: string | number;
}

export const createAuditFlow = (data: AuditFlow) => Post(auditFlowPrefix, data);
export const editAuditFlow = (data: AuditFlow) => Put(auditFlowPrefix, data);
export const batchEditAuditFlow = (data: Partial<AuditFlow>[]) =>
  Put(`${auditFlowPrefix}/batchUpdate`, data);
export const deleteAuditFlow = (id: string | number) =>
  Delete(auditFlowPrefix + `/${id}`);
export const findAuditFlowPage = (data: any) =>
  Get(auditFlowPrefix + "/page", data);
export const getAuditFlowList = (data: any) =>
  Get(`${auditFlowPrefix}/list`, data);
export const findAuditFlowListByIds = (ids: string) =>
  Get(auditFlowPrefix + `/getByIds/${ids}`, null);
