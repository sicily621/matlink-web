import { delete_, post, put, xwfuDelete, xwfuGet, xwfuPost } from "@static/js/http/http";
import { materialAuditFlowDetailPrefix } from "../api";

export interface Step {
    id?: number;
    projectId: number | string;
    flowId: number | string;
    deptId: number | string;
    resourceType: number;
    level: number;
    roleId: number | string;
    roleName: string;
    userId?: number | string;
    userName?: string;
    [key: string]: any
}
export interface materialAuditFlowStepPageParams {
    projectId: number | string;
    flowId: number | string;
}
//保存审批流程步骤
export const saveFlowStep = (params: Step, cb: Function) => post(materialAuditFlowDetailPrefix + `/save`, params, cb);
//分页查询审批流程步骤
export const getStepsByFlowId = (params: materialAuditFlowStepPageParams, cb: Function) => post(materialAuditFlowDetailPrefix + `/list`, params, cb);
//删除审批流程步骤
export const deleteStepById = (params: { id: string }, cb: Function) => xwfuDelete(materialAuditFlowDetailPrefix + `/${params.id}`, params, cb);