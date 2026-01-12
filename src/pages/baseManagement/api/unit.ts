import { unitPrefix } from "../api";

import { Post, Get, Put, Delete } from "@/http/axios";

export interface Unit {
  id?: string | number;
  parentId: string | number;
  cnname: string;
  enname: string;
  unitSymbol: string;
  description: string;
}
//新增物料单位
export const createUnit = (data: Unit) => Post(unitPrefix, data);
//编辑物料单位
export const editUnit = (data: Unit) => Put(unitPrefix, data);
//删除物料单位
export const deleteUnit = (id: string | number) =>
  Delete(`${unitPrefix}/${id}`);
//查询物料单位列表
export const getUnitList = () => Get(`${unitPrefix}/list`, null);
//根据物料单位Ids查询物料单位列表
export const getUnitListByIds = (ids: string[] | number[]) =>
  Get(`${unitPrefix}/getByIds/${ids}`, null);
