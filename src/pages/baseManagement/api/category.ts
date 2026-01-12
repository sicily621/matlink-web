import { categoryPrefix } from "../api";

import { Post, Get, Put, Delete } from "@/http/axios";

export interface Category {
  id?: string | number;
  name: string;
  code: string;
  parentId: string | number;
}
//新增物料分类
export const createCategory = (data: Category) => Post(categoryPrefix, data);
//编辑物料分类
export const editCategory = (data: Category) => Put(categoryPrefix, data);
//删除物料分类
export const deleteCategory = (id: string | number) =>
  Delete(`${categoryPrefix}/${id}`);
//查询物料分类列表
export const getCategoryList = () => Get(`${categoryPrefix}/list`, null);
//根据物料分类Ids查询物料分类列表
export const getCategoryListByIds = (ids: string[] | number[]) =>
  Get(`${categoryPrefix}/getByIds/${ids}`, null);
