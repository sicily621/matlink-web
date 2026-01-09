import { post, xwfuPost, xwfuDelete } from "@static/js/http/http";
import { instockPrefix } from "../api";

export interface stockIn {
    id?: number;
    projectId: number | string;
    resourceId: number | string;
    stockId: number | string;
    inStockNo: number | string;
    status: number;
    inStockStatus: number;
    supplyId: number | string;
    type: number;
    description: string;
    isDirect: number;
    inStockUserId: number | string;
    inStockTime: any;
    approverUserId?: number | string;
    approverCreateTime?: number;
    source: string;
    files: any[];
    deptId: number | string;
    [key: string]: any
}
export interface queryStockInParams {
    page: number
    size: number
    projectId: number | string;
    stockId: number | string;
    resourceId?: number | string;
    status?: number
    inStockStatus?: number
    type?: number
    startTime: number
    endTime: number
    inStockNo?: string

}
export interface queryInStockApprovedListParams {
    page: number
    size: number
    projectId: number | string;
    stockId: number | string;
    status?: number
    inStockStatus?: number
    type?: number
    startTime: number
    endTime: number
}
//保存入库记录管理
export const saveInStock = (params: stockIn, cb: Function) => xwfuPost(instockPrefix + `/save`, params, cb);
//分页查询入库记录管理
export const getInStockPage = (params: queryStockInParams, cb: Function) => post(instockPrefix + `/page`, params, cb);
//生成入库单号入库记录管理
export const generateInStockNo = (cb: Function) => xwfuPost(instockPrefix + `/generateInStockNo`, null, cb);
//根据id删除入库记录文件管理
export const deleteInStockFile = (params: { id: string | number }, cb: Function) => xwfuDelete(instockPrefix + `/file/${params.id}`, params, cb);
//更新审批状态入库记录管理
export const updateInStockAuditStatus = (params: { subId: string | number, auditStatus: number; auditRemark: string }, cb: Function) => post(instockPrefix + `/updateAuditStatus`, params, cb);
//查询入库单审批列表
export const postInStockApprovedList = (params: queryInStockApprovedListParams, cb: Function) => post(instockPrefix + `/approvedList`, params, cb);
//通过ID获取入库记录管理
export const getInStockById = (params: { id: string | number }, cb: Function) => xwfuPost(instockPrefix + `/${params.id}`, params, cb);