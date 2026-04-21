import { stockRecordPrefix } from "../api";
import { Get } from "@/http/axios";
export interface queryMaterialStockRecordParams {
  stockId?: string | number;
  materialId?: string | number;
  startTime?: string;
  endTime?: string;
}
export interface getStockTrendParams {
  stockId: string | number;
  materialId: string | number;
  startTime: string;
  endTime: string;
}
export const findStockRecordPage = (data: queryMaterialStockRecordParams) =>
  Get(stockRecordPrefix + "/page", data);
export const getStockRecordList = (data: any) =>
  Get(`${stockRecordPrefix}/list`, data);
//库存数量与金额双轴走势
export const getStockTrend = (data: getStockTrendParams) =>
  Get(`${stockRecordPrefix}/getStockTrend`, data);
//成本单价波动监控
export const getMaterialCostPriceTrend = (data: getStockTrendParams) =>
  Get(`${stockRecordPrefix}/getMaterialCostPriceTrend`, data);
//出入库流量分析
export const getStockFlowStatistics = (data: getStockTrendParams) =>
  Get(`${stockRecordPrefix}/getStockFlowStatistics`, data);
