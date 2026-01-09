import { formDataPost, xwfuGet, xwfuPost, post } from "@static/js/http/http";
import { propertyTypeCodePrefix } from "../api";

//获取物业类型编码
export const propertyTypeCodeFindAll = (cb:Function) => xwfuGet(propertyTypeCodePrefix + `/findAll`,null,cb);

interface findPageParams {
    page?: string | number;
    size?: string | number;
    pid?: string | number;
}
//分页查询物业类型编码
export const propertyTypeCodeFindPage = (params:findPageParams, cb:Function) => xwfuPost(propertyTypeCodePrefix + `/findPage`,params,cb);

