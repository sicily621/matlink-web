import { post, delete_, xwfuGet, xwfuDelete } from "@static/js/http/http";
import { taskDetailPrefix } from "../api";

export interface TaskDetail {
    id?: number;
    projectId: number | string;
    taskId: number | string;
    tradeId: number | string;
    realCount: number;
    status: DetailStatus;
}

export enum DetailStatus {
    NotYetAssessed,//未盘点
    inProgress,//盘点中
    StockChecked,//已盘点
}
//分页查询盘点明细表
export const getTaskDetailPage = (params: { taskId: string | number; page: number; size: number }, cb: Function) => post(taskDetailPrefix + `/page`, params, cb);
//批量保存保存盘点明细表
export const saveTaskDetail = (params: TaskDetail[], cb: Function) => post(taskDetailPrefix + `/batchSave`, params, cb);
//根据盘点任务id查询盘点明细
export const getTaskDetail = (params: { taskId: string | number }, cb: Function) => xwfuGet(taskDetailPrefix + `/getByTaskId`, params, cb);
//根据id删除盘点任务表
export const deleteTask = (params: string[] | number[], cb: Function) => delete_(taskDetailPrefix + `/batchDelete`, params, cb);
//根据盘点任务ID删除盘点明细表
export const deleteByTaskId = (params: { taskId: string | number }, cb: Function) => xwfuDelete(taskDetailPrefix + `/deleteByTaskId`, params, cb);
