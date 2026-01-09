import { post, xwfuDelete, } from "@static/js/http/http";
import { taskPrefix } from "../api";

export interface Task {
    id?: number;
    projectId: number | string;
    name: string;
    taskType: number;
    stockId: number | string;
    approveTime?: number;
    approveDeptId?: string | number;
    handleUserId: number | string;
    startTime: any;
    endTime: any;
    stocktakingNone: number;
    description: string;
    status: Status;
    taskStatus: TaskStatus;
    [key: string]: any
}
export interface queryTaskPageParams {
    projectId: number | string;
    taskType?: number;
    stockId: number | string;
    status?: number;
    taskStatus?: number;
    name?: string;
    page: number;
    size: number;
}

export enum TaskStatus {
    NotYetAssessed,//未盘点
    StockChecked,//已盘点
    stockIn,//已入库
    Abandoned,//已废弃
    ProfitOrLoss,//盘盈或盘亏
}
export enum Status {
    Pending,//待审核
    Failed,//审核不通过
    Audited, //审核通过
    underReview//在审核
}
//保存盘点任务表
export const saveTask = (params: Task, cb: Function) => post(taskPrefix + `/save`, params, cb);
//分页查询盘点任务表
export const getTaskPage = (params: queryTaskPageParams, cb: Function) => post(taskPrefix + `/page`, params, cb);
//根据id删除盘点任务表
export const deleteTask = (params: { id: string }, cb: Function) => xwfuDelete(taskPrefix + `/${params.id}`, params, cb);
//查询盘点任务审批列表
export const getTaskApprovedList = (params: queryTaskPageParams, cb: Function) => post(taskPrefix + `/approvedList`, params, cb);
//更新审批状态盘点任务表
export const updateTaskAuditStatus = (params: { subId: string | number, auditStatus: number; auditRemark: string }, cb: Function) => post(taskPrefix + `/updateAuditStatus`, params, cb);