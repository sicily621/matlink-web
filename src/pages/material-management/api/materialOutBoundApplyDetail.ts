import { xwfuGet, xwfuPost, post } from "@static/js/http/http";
import { materialOutBoundApplyDetailPrefix } from "../api";

export interface MaterialApplyDetail {
    id?: string | number;
    applyId: string | number;
    projectId: string | number;
    tradeId: string | number;
    applyCount: number
    actualCount: number
}
//通过ID获取物料领用申请明细表
export const getMaterialOutBoundApplyDetail = (params: { applyId: string | number }, cb: Function) => xwfuGet(materialOutBoundApplyDetailPrefix + `/findByApplyId`, params, cb);


//保存物料领用申请明细表
export const saveMaterialApplyDetail = (params: { list: MaterialApplyDetail[] }, cb: Function) => post(materialOutBoundApplyDetailPrefix + `/batchSaveByTradeId`, params, cb);
//通过ID获取物料领用申请明细表
export const getMaterialApplyDetail = (params: { applyId: string | number }, cb: Function) => xwfuGet(materialOutBoundApplyDetailPrefix + `/findByApplyId`, params, cb);
//删除物料领用申请明细表标签
export const deleteMaterialApplyDetail = (params: { id: string | number }, cb: Function) => xwfuPost(materialOutBoundApplyDetailPrefix + `/delete`, params, cb);
