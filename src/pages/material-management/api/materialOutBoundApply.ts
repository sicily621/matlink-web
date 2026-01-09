import { post, xwfuGet, xwfuPost } from "@static/js/http/http";
import { materialOutBoundApplyPrefix } from "../api";
export interface MaterialApply {
    id?: string | number;
    workorderId?: string | number;
    projectId: string | number;
    stockId: string | number;
    applyNo: string
    applyTime: any;
    deptId: string | number;
    applyUserId: string | number;
    status: number;
    applyStatus: number;
    approveUserId?: string | number;
    approveTime?: number;
    useage: string;
    description: string
    [key: string]: any
}
interface findPageParams {
    projectId: string | number;
    page: string | number;
    size: string | number;
    workorderId?: string | number;
    deptId?: string | number;
    status: number
    applyStatus: number
    stockId: string | number;
    startTime: number
    endTime: number
    applyNo?: string | number
}
export interface queryApplyApprovedListParams {
    page: number
    size: number
    projectId: number | string;
    stockId: number | string;
    applyNo?: string;
    status?: number
    applyStatus?: number
    startTime: number
    endTime: number
}
//保存入库记录管理
export const saveMaterialApply = (params: MaterialApply, cb: Function) => post(materialOutBoundApplyPrefix + `/save`, params, cb);
//分页查询物料领用申请表
export const materialOutBoundApplyFindPage = (params: findPageParams, cb: Function) => post(materialOutBoundApplyPrefix + `/findPage`, params, cb);

//通过ID获取物料领用申请表
export const getMaterialOutBoundApplyById = (params: { id: string | number }, cb: Function) => xwfuGet(materialOutBoundApplyPrefix + `/getById`, params, cb);

//通过工单id获取物料领用申请表
export const getByWorkorderId = (params: { workorderId: number; }, cb: Function) => xwfuGet(materialOutBoundApplyPrefix + `/getByWorkorderId`, params, cb);

//查询领料单审批列表
export const postApplyApprovedList = (params: queryApplyApprovedListParams, cb: Function) => post(materialOutBoundApplyPrefix + `/approvedList`, params, cb);
//更新领料状态物料领用申请表
export const updateApplyStatus = (params: { applyId: string | number; applyStatus: number }, cb: Function) => xwfuPost(materialOutBoundApplyPrefix + `/updateApplyStatus`, params, cb);
//生成领用单号
export const generateApplyNo = (cb: Function) => xwfuGet(materialOutBoundApplyPrefix + `/generateApplyNo`, null, cb);
//更新审批状态物料领用申请表
export const updateAuditStatus = (params: { subId: string | number, auditStatus: number; auditRemark: string }, cb: Function) => post(materialOutBoundApplyPrefix + `/updateAuditStatus`, params, cb);
