import { auditFlowDetailPrefix } from "../api";
import { Post, Get, Put, Delete } from "@/http/axios";
export interface Step {
  id?: string | number;
  flowId: string | number;
  resourceType: number
  level: number
  deptId: string | number;
  roleId: string | number;
  roleName: string
  userId?: string | number;
  userName?: string
  [key: string]: any
}

export interface queryStepConditions {
  flowId: string | number;
}

export const createStep = (data: Step) => Post(auditFlowDetailPrefix, data);
export const editStep = (data: Step) => Put(auditFlowDetailPrefix, data);
export const batchEditStep = (data: Partial<Step>[]) => Put(`${auditFlowDetailPrefix}/batchUpdate`, data);
export const deleteStep = (id: string | number) =>
  Delete(auditFlowDetailPrefix + `/${id}`);
export const findStepPage = (data: any) =>
  Get(auditFlowDetailPrefix + "/page", data);
export const getStepList = (data: any) => Get(`${auditFlowDetailPrefix}/list`, data);
export const findStepListByIds = (ids: string) =>
  Get(auditFlowDetailPrefix + `/getByIds/${ids}`, null);
