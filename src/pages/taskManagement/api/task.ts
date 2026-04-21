import { taskPrefix } from "../api";
import { Post, Get, Put, Delete, } from "@/http/axios";
export interface Task {
  id?: string | number;
  name: string;
  stockId: string | number;
  handleUserId: string | number;
  type: number;
  startTime?: any;
  endTime?: any;
  stocktakingNone: number;
  auditStatus: AuditStatus;
  status: TaskStatus;
  description: string;
  auditUserId?: string | number;
  auditTime?: number;
  createUserId: string | number;
  [key: string]: any;
}

export enum TaskStatus {
  NotStarted = 0,      // 未盘点
  Pending = 1,        // 盘点中  
  Finished = 2,       // 已盘点结束
  Voided = 3,         // 已废弃
}

export const TaskStatusList = [
  { id: 0, name: "未盘点" },
  { id: 1, name: "盘点中" },
  { id: 2, name: "盘点结束" },
  { id: 3, name: "已废弃" },
];
export enum TaskDetailStatus {
  Normal = 0,      // 正常
  Surplus = 1,    // 盘盈
  Loss = 2,      // 盘亏
}

export const TaskDetailStatusList = [
  { id: 0, name: "正常" },
  { id: 1, name: "盘盈" },
  { id: 2, name: "盘亏" },
];

export enum AuditStatus {
  Pending = 0,
  Rejected = 1,
  Approved = 2,
  Auditing = 3,
}

export const AuditStatusList = [
  { id: 0, name: "待审批" },
  { id: 1, name: "审批不通过" },
  { id: 2, name: "审批通过" },
  { id: 3, name: "审批中" },
];

export interface queryTaskConditions {
  auditStatus: AuditStatus | -1;
  status: TaskStatus | -1;
  stockId: string | number;
  name: string
}
export interface TaskFile {
  id?: string | number;
  taskId: string | number;
  filePath: string;
  fileName: string;
}
export const createTask = (data: Task) => Post(taskPrefix, data);
export const editTask = (data: Task) => Put(taskPrefix, data);
export const batchEditTask = (data: Partial<Task>[]) =>
  Put(`${taskPrefix}/batchUpdate`, data);
export const deleteTask = (id: string | number) =>
  Delete(taskPrefix + `/${id}`);
export const findTaskPage = (data: any) =>
  Get(taskPrefix + "/page", data);
export const getTaskList = (data: any) =>
  Get(`${taskPrefix}/list`, data);
export const findTaskListByIds = (ids: string) =>
  Get(taskPrefix + `/getByIds/${ids}`, null);

export const updateAuditStatus = (data: {
  orderId: string | number;
  auditStatus: number;
  auditRemark?: string;
}) => Post(taskPrefix + "/updateAuditStatus", data);
