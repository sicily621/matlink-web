import { delete_, post, formDataPost, xwfuDelete, xwfuGet, xwfuPost } from "@static/js/http/http";
import { materialPrefix } from "../api";


interface materialSaveParams {
    projectId: string | number;
    tradeTypeId: string | number;
    name: string | number;
    simpleName: string | number;
    code?: string | number;
    specification?: string | number;
    unit?: string | number;
    status: string | number;
    brand?: string | number;
    modelNo?: string | number;
    producingArea?: string | number;
    description?: string | number;
    minCountLimit?: string | number;
    maxCountLimit?: string | number;
    safeCountLimit?: string | number;
    suggestedCostPrice?: string | number;
    suggestedPurchasPrice?: string | number;
    barcode?: string | number;
    files: any;
}
//保存物料表
export const materialSave = (params:materialSaveParams,cb: Function) => xwfuPost(materialPrefix + `/save`,params,cb);

interface materialPageParams {
    projectId: string | number;
    page: string | number;
    size: string | number;
    name?: string | number;
    code?: string | number;
    specification?: string | number;
    brand?: string | number;
    tradeTypeId?: string | number;
    ids?: string[]
}
//分页查询物料表
export const materialPage = (params: materialPageParams, cb: Function) => post(materialPrefix + `/page`, params, cb);

interface materialDeleteParams {
    id: string | number;

}
//根据id删除物料表
export const materialDelete = (params: materialDeleteParams, cb: Function) => xwfuDelete(materialPrefix + `/${params.id}`, params, cb);
