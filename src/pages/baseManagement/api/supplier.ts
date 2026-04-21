import { supplierPrefix } from "../api";
import { Post, Get, Put, Delete } from "@/http/axios";

export interface Supplier {
  id?: string | number;
  supplierNo: string;
  simpleNo: string;
  name: string;
  address: string;
  mainBusiness: string;
  level: number;
  linkMan: string;
  phone: string;
  fax: string;
  email: string;
  status: number;
  description: string;
}
export interface querySupplierConditions {
  name: string;
  supplierNo: string;
}

export const createSupplier = (data: Supplier) => Post(supplierPrefix, data);
export const editSupplier = (data: Supplier) => Put(supplierPrefix, data);
export const deleteSupplier = (id: string | number) =>
  Delete(supplierPrefix + `/${id}`);
export const findSupplierPage = (data: any) =>
  Get(supplierPrefix + "/page", data);
export const getSupplierList = () => Get(`${supplierPrefix}/list`, null);
