import { delete_, post, put, xwfuDelete, xwfuGet, xwfuPost } from "@static/js/http/http";
import { materialStockPrefix } from "../api";

interface materialStockSaveParams {

    name: string | number;
    projectId: string | number;
    description: string | number;
    typeId: string | number;
    id?:string | number;
    parentId?:string | number;

}
//保存库管理表
export const materialStockSave = (params:materialStockSaveParams,cb: Function) => xwfuPost(materialStockPrefix + `/save`,params,cb);


interface materialStockFindStockTreeParams {

    projectId: string | number;

}
//获取库存树
export const materialStockFindStockTree = (params:materialStockFindStockTreeParams,cb: Function) => xwfuGet(materialStockPrefix + `/findStockTree`,params,cb);


interface materialStockDeleteParams {

    id: string | number;
}
//删除库存树
export const materialStockDelete = (params:materialStockDeleteParams,cb: Function) => xwfuPost(materialStockPrefix + `/delete`,params,cb);


