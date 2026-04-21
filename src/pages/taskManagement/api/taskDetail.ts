import { taskDetailPrefix } from "../api";
import { Get, Delete, Put,GetExcel } from "@/http/axios";

export interface TaskDetail {
  id?: string | number;
  taskId: string | number;
  materialId: string | number;
  realCount: number;
  bookCount: number;
  diffCount: number;
  status: number;
}

export const saveTaskDetail = (data: TaskDetail[]) =>
  Put(`${taskDetailPrefix}/batchUpdate`, data);
export const getTaskDetailList = (params: {
  taskId: string | number;
}) => Get(`${taskDetailPrefix}/list`, params);
export const deleteTaskDetail = (taskId: string) =>
  Delete(taskDetailPrefix + `/${taskId}`);
export const exportTaskDetailList = (params: {
  taskId: string | number;
}) => GetExcel(`${taskDetailPrefix}/export`, params);
