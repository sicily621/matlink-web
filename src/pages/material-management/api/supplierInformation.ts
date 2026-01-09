import { delete_, post, put, xwfuDelete, xwfuGet, xwfuPost } from "@static/js/http/http";
import { supplierInformationPrefix } from "../api";

interface findPageParams {
    projectId:number;
    page:number;
    size:number;
    name?:string;
    code?:string;
}
//分页查询供应商表
export const supplierInformationFindPage = (params:findPageParams,cb: Function) => xwfuPost(supplierInformationPrefix + `/findPage`,params,cb);

interface saveParams {
    id?: number;
    projectId: number;
    supplierNo: string;
    simpleNo?: string;
    name: string;
    address?: string;
    mainBusiness?: string;
    level: number;
    linkMan: string;
    phone: string;
    fax?: string;
    email: string;
    status: number;
    description: string;
}
// /保存供应商表
export const supplierInformationSave = (params:saveParams,cb: Function) => xwfuPost(supplierInformationPrefix + `/save`,params,cb);
//删除供应商表标签
export const supplierInformationDelete = (params:{id: number },cb: Function) => xwfuPost(supplierInformationPrefix + `/delete`,params,cb);