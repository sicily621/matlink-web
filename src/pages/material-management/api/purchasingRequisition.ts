import { delete_, post, put, xwfuDelete, xwfuGet, xwfuPost } from "@static/js/http/http";
import { purchasingRequisitionPrefix } from "../api";


//生成采购申请单号
export const purchasingRequisitionGenerateBillNo = (cb: Function) => xwfuPost(purchasingRequisitionPrefix + `/generateBillNo`, null, cb);


interface purchasingRequisitionSaveParams {
    billNo: string | number;
    stockId: string | number;
    applyUserId: string | number;
    applyDate: number;
    deptId: number;
    description: string | number;
    projectId: number;
    list: any;
}
//保存采购申请
export const purchasingRequisitionSave = (params: purchasingRequisitionSaveParams, cb: Function) => post(purchasingRequisitionPrefix + `/save`, params, cb);

// purchasingRequisition  

interface purchasingRequisitionApprovedListParams {
    page: string | number;
    size: string | number;
    billNo?: string | number;
    status?: number;
    stockId: number;
    startTime?: string | number;
    projectId: number;
    endTime?: any;
    purStatus?: string | number;

}
//查询采购审批列表
export const purchasingRequisitionApprovedList = (params: purchasingRequisitionApprovedListParams, cb: Function) => post(purchasingRequisitionPrefix + `/approvedList`, params, cb);


interface purchasingRequisitionDeleteParams {
    id: string | number;
}
//删除采购申请标签
export const purchasingRequisitionDelete = (params: purchasingRequisitionDeleteParams, cb: Function) => xwfuPost(purchasingRequisitionPrefix + `/delete`, params, cb);


interface queryPurchasingParams {
    page: number;
    size: number;
    projectId: string | number;
    billNo?: string | number;
    status: number;
    stockId: number;
    startTime: number;
    endTime: number
}
//分页查询采购申请
export const postPurchasingRequisitionFindPage = (params: queryPurchasingParams, cb: Function) => xwfuPost(purchasingRequisitionPrefix + `/findPage`, params, cb);

//通过ID获取采购申请
export const getPurchasingRequisitionById = (params: { id: string | number }, cb: Function) => xwfuGet(purchasingRequisitionPrefix + `/getById`, params, cb);

interface updatePurStatusParams {
    id: number;
    purStatus: number
}
//更新采购申请采购状态
export const updatePurStatus = (params: updatePurStatusParams, cb: Function) => post(purchasingRequisitionPrefix + `/updatePurStatus`, params, cb);


interface updateAuditStatusParams {
    subId: number;
    auditStatus: number;
    auditRemark:string | number;
}
//更新采购申请采购状态
export const updateAuditStatus = (params: updateAuditStatusParams, cb: Function) => post(purchasingRequisitionPrefix + `/updateAuditStatus`, params, cb);
