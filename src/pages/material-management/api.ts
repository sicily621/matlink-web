import './i18n';
import { serviceCenterPrefix } from "../api";

export const prefix = serviceCenterPrefix + `/material/api`;

//物料管理
export const classCatalogPrefix = prefix + `/classCatalog`;

//供应商
export const supplierInformationPrefix = prefix + `/supplierInformation`;

//物料库
export const materialStockPrefix = prefix + `/materialStock`;
//保存库存类型表
export const materialStockTypePrefix = prefix + `/materialStockType`;
//物料单位
export const materialUnitPrefix = prefix + `/materialUnit`;
//物料审批流程
export const materialAuditFlowPrefix = prefix + `/materialAuditFlow`;
//物料审批步骤
export const materialAuditFlowDetailPrefix = prefix + `/materialAuditFlowDetail`;
//物料
export const materialPrefix = prefix + `/material`;
//盘点任务
export const taskPrefix = prefix + `/material/task`;
//盘点明细
export const taskDetailPrefix = prefix + `/material/task/detail`;
// 物料库存详情表
export const materialStockDetailPrefix = prefix + `/materialStockDetail`;
//审批流程记录
export const materialAuditFlowRelationPrefix = prefix + `/materialAuditFlowRelation`;
// 库存流水
export const stockRecordPrefix = materialPrefix + `/stock/record`;
//入库记录
export const instockPrefix = materialPrefix + `/instock`;
//入库记录详情
export const instockDetailsPrefix = materialPrefix + `/instock/details`;
//审批流程记录步骤明细

export const materialAuditFlowDetailRelationPrefix = prefix + `/materialAuditFlowDetailRelationController`;
//采购申请表  
export const purchasingRequisitionPrefix = prefix + `/purchasingRequisition`;
// 采购物料详情表
export const purchasingRequisitionDetailsPrefix = prefix + `/purchasingRequisitionDetails`;
//出库记录
export const outstockPrefix = materialPrefix + `/outstock`;
//出库记录详情
export const outstockDetailsPrefix = materialPrefix + `/outstock/details`;
//物料领用申请表
export const materialOutBoundApplyPrefix = prefix + `/materialOutBoundApply`;
//物料领用申请明细表
export const materialOutBoundApplyDetailPrefix = prefix + `/materialOutBoundApplyDetail`;


