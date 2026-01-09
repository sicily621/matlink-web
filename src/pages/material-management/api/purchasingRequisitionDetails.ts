import { delete_, post, put, xwfuDelete, xwfuGet, xwfuPost } from "@static/js/http/http";
import { purchasingRequisitionDetailsPrefix } from "../api";

interface purchasingRequisitionDetailsFindByBillIdParams {
    billId: string | number;

}
//通过申请单id获取采购物料详情表
export const purchasingRequisitionDetailsFindByBillId = (params: purchasingRequisitionDetailsFindByBillIdParams, cb: Function) => xwfuGet(purchasingRequisitionDetailsPrefix + `/findByBillId`, params, cb);


interface purchasingRequisitionDetailsDeleteParams {
    id: string | number;
}
//删除采购物料详情表标签
export const purchasingRequisitionDetailsDelete = (params: purchasingRequisitionDetailsDeleteParams, cb: Function) => xwfuPost(purchasingRequisitionDetailsPrefix + `/delete`, params, cb);

// 

interface purchasingRequisitionDeleteByBillIdAndTradeIdParams {
    tradeId: string | number;
    billId: string | number;

}
//删除采购物料详情表标签
export const purchasingRequisitionDeleteByBillIdAndTradeId = (params: purchasingRequisitionDeleteByBillIdAndTradeIdParams, cb: Function) => xwfuPost(purchasingRequisitionDetailsPrefix + `/deleteByBillIdAndTradeId`, params, cb);


//通过申请单id获取采购物料详情表
export const getPurchasingRequisitionDetail = (params: { billId: string | number }, cb: Function) => xwfuGet(purchasingRequisitionDetailsPrefix + `/findByBillId`, params, cb);