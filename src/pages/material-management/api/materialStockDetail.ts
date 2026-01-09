import { post, xwfuPost } from "@static/js/http/http";
import { materialStockDetailPrefix } from "../api";

interface materialStockDetailFindPageParams {
    projectId: string | number;
    page: string | number;
    size: string | number;
    stockId: string | number;
    tradeTypeId: string | number;
    tradeNo?: string | number;
    specification?: string | number;
    name?: string | number;
    brand?: string | number;
    countType: string | number;
    warningCount: string | number;
}
export interface queryStockDetailListParams {
    projectId: string | number;
    stockId?: string | number;
    tradeTypeId?: string | number;
    tradeIds: string[] | number[];
    name?: string
    specification?: string
    brand?: string
}
//分页查询物料库存详情表
export const materialStockDetailFindPage = (params: materialStockDetailFindPageParams, cb: Function) => post(materialStockDetailPrefix + `/findPage`, params, cb);

//保存物料库存详情表
export const materialStockDetailSave = (params: { subId: number | string; type: number; projectId: number | string }, cb: Function) => xwfuPost(materialStockDetailPrefix + `/save`, params, cb);
//根据条件列表查询物料库存详情表
export const postMaterialStockDetailList = (params: materialStockDetailFindPageParams, cb: Function) => post(materialStockDetailPrefix + `/list`, params, cb);

//保存盘点任务
export const taskStockIn = (params: { id: string | number }, cb: Function) => post(materialStockDetailPrefix + `/handleInventory`, params, cb);
