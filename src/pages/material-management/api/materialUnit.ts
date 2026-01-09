import { delete_, post, put, xwfuDelete, xwfuGet, xwfuPost } from "@static/js/http/http";
import { materialUnitPrefix } from "../api";

interface findPageParams {
    page:number;
    size:number;
    parentId?:number;
    cnname?:string;
    enname?:string;
    unitSymbol?:string;
    projectId?:number;
}
//分页查询物料单位表
export const materialUnitFindPage = (params:findPageParams,cb:Function) => xwfuPost(materialUnitPrefix + `/findPage`,params,cb);

interface saveParams {
    id?: number;
    projectId?: number;
    parentId?: number;
    cnname?: string;
    enname?: string;
    unitSymbol?: string;
    description?: string;
}
//保存物料单位表
export const materialUnitSave = (params:saveParams,cb:Function) => xwfuPost(materialUnitPrefix + `/save`,params,cb);

//通过ID获取物料单位表
export const materialUnitGetById = (params:{id: number},cb:Function) => xwfuGet(materialUnitPrefix + `/getById`,params,cb);

//删除物料单位表标签
export const materialUnitDelete = (params:{id: number},cb:Function) => xwfuPost(materialUnitPrefix + `/delete`,params,cb);

