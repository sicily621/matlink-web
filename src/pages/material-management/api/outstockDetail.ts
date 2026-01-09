import { post, xwfuPost, xwfuDelete, xwfuGet } from "@static/js/http/http";
import { outstockDetailsPrefix } from "../api";

export interface stockOutDetail {
    id?: number;
    projectId: number | string
    outStockId: number | string
    tradeId: number | string
    stockId: number | string
    perPrice: number
    totalPrice: number
    outStockPrice: number
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
    outStockId: number | string;

}
//保存出库详情
export const saveOutStockDetail = (params: { list: stockOutDetail[] }, cb: Function) => xwfuPost(outstockDetailsPrefix + `/save`, params, cb);
//分页查询出库详情
export const getOutStockDetailPage = (params: queryStockInDetailParams, cb: Function) => post(outstockDetailsPrefix + `/page`, params, cb);
//删除出库记录详情管理
export const deleteByOutStockId = (params: { outStockId: string | number }, cb: Function) => xwfuDelete(outstockDetailsPrefix + `/deleteByOutStockId`, params, cb);
//通过出库ID获取出库记录详情管理
export const getOutStockDetail = (params: { outStockId: string | number }, cb: Function) => xwfuGet(outstockDetailsPrefix + `/${params.outStockId}`, params, cb);