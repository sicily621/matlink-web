import { delete_, post, put, xwfuDelete, xwfuGet, xwfuPost } from "@static/js/http/http";
import { classCatalogPrefix } from "../api";

interface findPageParams {
    page:number;
    size:number;
    parentId?: number;
    name?: string;
    code?: string;
    projectId?: number;
    flag?: number;
}
//分页查询物料分类表
export const findPage = (params:findPageParams,cb: Function) => xwfuPost(classCatalogPrefix + `/findPage`,params,cb);

interface findListParams {
    projectId?: number;
    name?:string;
}
//获取物料类型树
export const findTree = (params:findListParams,cb: Function) => xwfuGet(classCatalogPrefix + `/findTree`,params,cb);

interface saveClassCatalogParams {
    id?:number;
    projectId?:number;
    parentId?:number;
    name?: string;
    code?: string;
    userCode?: string;
}
//保存物料分类表
export const saveClassCatalog = (params:saveClassCatalogParams,cb: Function) => post(classCatalogPrefix + `/save`,params,cb);

//通过ID获取物料分类表
export const classCatalogGetById = (params:{ id: number},cb: Function) => xwfuGet(classCatalogPrefix + `/getById`,params,cb);

//删除物料分类表标签
export const classCatalogDelete = (params:{ id: number},cb: Function) => xwfuPost(classCatalogPrefix + `/delete`,params,cb);



interface findTreeByConditionParams {
    name: string;
    projectId: number;
}
//分页查询物料分类表
export const findTreeByCondition = (params:findTreeByConditionParams,cb: Function) => xwfuPost(classCatalogPrefix + `/findTreeByCondition`,params,cb);
