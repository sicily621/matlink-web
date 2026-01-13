import { stockPrefix } from "../api";

import { Post, Get, Put, Delete } from "@/http/axios";

export interface Stock {
    id?: string | number;
    name: string;
    parentId: string | number;
    typeId: string | number;
    description: string;
    createUserId: string | number;
}
//新增物料库
export const createStock = (data: Stock) => Post(stockPrefix, data);
//编辑物料库
export const editStock = (data: Stock) => Put(stockPrefix, data);
//删除物料库
export const deleteStock = (id: string | number) =>
    Delete(`${stockPrefix}/${id}`);
//查询物料库列表
export const getStockList = () => Get(`${stockPrefix}/list`, null);
//根据物料库Ids查询物料库列表
export const getStockListByIds = (ids: string[] | number[]) =>
    Get(`${stockPrefix}/getByIds/${ids}`, null);
