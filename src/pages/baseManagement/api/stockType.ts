import { stockTypePrefix } from "../api";

import { Post, Get, Put, Delete } from "@/http/axios";

export interface StockType {
    id?: string | number;
    name: string;
    parentId: string | number;
    description: string
    createUserId: string | number;
}
//新增库存类型
export const createStockType = (data: StockType) => Post(stockTypePrefix, data);
//编辑库存类型
export const editStockType = (data: StockType) => Put(stockTypePrefix, data);
//删除库存类型
export const deleteStockType = (id: string | number) =>
    Delete(`${stockTypePrefix}/${id}`);
//查询库存类型列表
export const getStockTypeList = () => Get(`${stockTypePrefix}/list`, null);
//根据库存类型Ids查询库存类型列表
export const getStockTypeListByIds = (ids: string[] | number[]) =>
    Get(`${stockTypePrefix}/getByIds/${ids}`, null);
