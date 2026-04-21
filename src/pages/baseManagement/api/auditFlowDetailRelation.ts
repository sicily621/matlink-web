import { auditFlowDetailRelationPrefix } from "../api";
import { Post, Get, Put, Delete } from "@/http/axios";
export const getApproveDetail = (data: { orderId: string | number; auditStatusList: number[] }) =>
    Get(auditFlowDetailRelationPrefix + "/list", data);