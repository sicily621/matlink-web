import { delete_, post, put, xwfuDelete, xwfuGet, xwfuPost } from "@static/js/http/http";
import { materialStockTypePrefix } from "../api";

interface materialStockTypeSaveParams {
    projectId:string | number ;
    name: string| number ;
    description: string| number ;
    id?:string| number ;
}
//保存 更新库存类型表
export const materialStockTypeSave = (params:materialStockTypeSaveParams,cb: Function) => xwfuPost(materialStockTypePrefix + `/save`,params,cb);


interface findStockTypeListParams {
    projectId:string | number ;
}
//获取库存类型表
export const findStockTypeList = (params:findStockTypeListParams,cb: Function) => xwfuGet(materialStockTypePrefix + `/findStockTypeList`,params,cb);


interface materialStockTypeDeleteParams {
    id:string | number ;
}
//删除库存类型
export const materialStockTypeDelete = (params:materialStockTypeDeleteParams,cb: Function) => xwfuPost(materialStockTypePrefix + `/delete`,params,cb);

