import { outBoundApplyDetailPrefix } from "../api";
import { Get, Delete, Put } from "@/http/axios";

export interface OutBoundApplyDetail {
  id?: string | number;
  applyId: string | number;
  materialId: string | number;
  applyCount: number;
  actualCount: number;
}

export const saveOutBoundApplyDetail = (data: OutBoundApplyDetail[]) =>
  Put(`${outBoundApplyDetailPrefix}/batchUpdate`, data);
export const getOutBoundApplyDetailList = (params: { applyId: string | number }) =>
  Get(`${outBoundApplyDetailPrefix}/list`, params);
export const deleteOutBoundApplyDetail = (applyId: string) =>
  Delete(outBoundApplyDetailPrefix + `/${applyId}`);
