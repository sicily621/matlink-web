import { delete_, post, put, xwfuDelete, xwfuGet, xwfuPost } from "@static/js/http/http";
import { stockRecordPrefix } from "../api";

interface findPageParams {
    page:number;
    size:number;
    tradeIds?: any;
    startDate?: string;
    endDate?: string;
    projectId?: number;
}
//分页查询库存流水表
export const stockRecordPage = (params:findPageParams,cb: Function) => post(stockRecordPrefix + `/page`,params,cb);
