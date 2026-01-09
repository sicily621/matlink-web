import { post, xwfuPost, xwfuDelete, xwfuGet } from "@static/js/http/http";
import { instockDetailsPrefix } from "../api";

export interface stockInDetail {
    id?: number;
    projectId: number | string
    inStockId: number | string
    tradeId: number | string
    stockId: number | string
    perPrice: number
    totalPrice: number
    inStockPrice: number
    priceRatio: number
    actualCount: number
    expectedCount?: number | string
    description?: string
    [key: string]: any
}
export interface queryStockInDetailParams {
    page: number
    size: number
    projectId: number | string;
    inStockId: number | string;

}
//保存入库详情
export const saveInStockDetail = (params: { list: stockInDetail[] }, cb: Function) => xwfuPost(instockDetailsPrefix + `/save`, params, cb);
//分页查询入库详情
export const getInStockDetailPage = (params: queryStockInDetailParams, cb: Function) => post(instockDetailsPrefix + `/page`, params, cb);
//删除入库记录详情管理
export const deleteByInStockId = (params: { inStockId: string | number }, cb: Function) => xwfuDelete(instockDetailsPrefix + `/deleteByInStockId`, params, cb);
//通过入库ID获取入库记录详情管理
export const getInStockDetail = (params: { inStockId: string | number }, cb: Function) => xwfuGet(instockDetailsPrefix + `/${params.inStockId}`, params, cb);