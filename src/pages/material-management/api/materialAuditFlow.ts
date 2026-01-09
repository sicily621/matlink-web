import { delete_, post, put, xwfuDelete, xwfuPut, xwfuPost } from "@static/js/http/http";
import { materialAuditFlowPrefix } from "../api";

export interface Flow {
    id?: number;
    projectId: number | string;
    title: string;
    resourceId: number | string;
    resourceType: number;
    deptId: number | string;
    remark: string;
    enable: number;
}
export interface queryFlowPageParams {
    projectId: number | string;
    deptId: number | string;
    title?: string;
    page: number;
    size: number;
}
//保存审批流程
export const saveFlow = (params: Flow, cb: Function) => post(materialAuditFlowPrefix + `/save`, params, cb);
//分页查询审批流程
export const getFlowPage = (params: queryFlowPageParams, cb: Function) => post(materialAuditFlowPrefix + `/page`, params, cb);
//删除审批流程
export const deleteFlow = (params: { id: string }, cb: Function) => xwfuDelete(materialAuditFlowPrefix + `/${params.id}`, params, cb);
//根据id更新审批流程的开启标志
export const editFlowEnable = (data: { id: number; enable: number }, cb: Function) => xwfuPut(materialAuditFlowPrefix + `/enable/${data.id}`, data, cb);