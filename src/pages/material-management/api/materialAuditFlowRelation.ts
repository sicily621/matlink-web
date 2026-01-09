import { post } from "@static/js/http/http";
import { materialAuditFlowRelationPrefix } from "../api";
interface postMaterialAuditFlowRelationPageParams {
    projectId: number | string
    subId: number | string
    page: number
    size: number
}

//分页查询审批流程记录
export const postMaterialAuditFlowRelationPage = (params: postMaterialAuditFlowRelationPageParams, cb: Function) => post(materialAuditFlowRelationPrefix + `/page`, params, cb);


