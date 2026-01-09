import { post, xwfuPost, xwfuDelete } from "@static/js/http/http";
import { outstockPrefix } from "../api";

export interface stockOut {
    id?: number;
    projectId: number | string;
    resourceId: number | string;
    stockId: number | string;
    outStockNo: number | string;
    status: number;//0-待审核,1-审核不通过，2-审核通过，3-审核中
    outStockStatus: number;//0-未出库,1-已出库，2-已作废
    type: number;//1-领料出库，2-退货出库，3-报废出库，4-其它出库
    description: string;
    isDirect: number;
    outStockUserId: number | string;
    outStockTime: any;
    approverUserId?: number | string;
    approverCreateTime?: number;
    source: string;
    files: any[];
    deptId: number | string;
    [key: string]: any
}
export interface queryStockOutParams {
    page: number
    size: number
    projectId: number | string;
    stockId: number | string;
    resourceId?: number | string;
    status?: number
    outStockStatus?: number
    type?: number
    startTime: number
    endTime: number

}
export interface queryOutStockApprovedListParams {
    page: number
    size: number
    projectId: number | string;
    stockId: number | string;
    status?: number
    outStockStatus?: number
    type?: number
    startTime: number
    endTime: number
}
//保存出库记录管理
export const saveOutStock = (params: stockOut, cb: Function) => xwfuPost(outstockPrefix + `/save`, params, cb);
//分页查询出库记录管理
export const getOutStockPage = (params: queryStockOutParams, cb: Function) => post(outstockPrefix + `/page`, params, cb);
//生成出库单号出库记录管理
export const generateOutStockNo = (cb: Function) => xwfuPost(outstockPrefix + `/generateOutStockNo`, null, cb);
//根据id删除出库记录文件管理
export const deleteOutStockFile = (params: { id: string | number }, cb: Function) => xwfuDelete(outstockPrefix + `/file/${params.id}`, params, cb);
//更新审批状态出库记录管理
export const updateOutStockAuditStatus = (params: { subId: string | number, auditStatus: number; auditRemark: string }, cb: Function) => post(outstockPrefix + `/updateAuditStatus`, params, cb);
//查询出库单审批列表
export const postOutStockApprovedList = (params: queryOutStockApprovedListParams, cb: Function) => post(outstockPrefix + `/approvedList`, params, cb);