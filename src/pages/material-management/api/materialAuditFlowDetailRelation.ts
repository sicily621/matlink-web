import { xwfuGet } from "@static/js/http/http";
import { materialAuditFlowDetailRelationPrefix } from "../api";
//根据subId查询审批流程记录步骤明细
export const getApproveDetailBySubId = (params: { subId: number | string }, cb: Function) => xwfuGet(materialAuditFlowDetailRelationPrefix + `/getApprovedBySubId`, params, cb);


