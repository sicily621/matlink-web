import { xwfuDelete, xwfuGet, xwfuPost, xwfuPut } from "@static/js/http/http";
import { tenantsPrefix } from "../api";

interface TenantsParams {
    enterpriseId: number;
    name: string;
}
/**
 * 新增租户
 * @param params 
 * @param cb 
 * @returns 
 */
export const tenants = (params: TenantsParams, cb: Function) => xwfuPost(tenantsPrefix, params, cb);

interface TenantsPutParams extends TenantsParams {
    id: number;
}
/**
 * 更新查询租户
 * @param params 
 * @param cb 
 * @returns 
 */
export const tenantsPut = (params: TenantsPutParams, cb: Function) => xwfuPut(tenantsPrefix, params, cb);

interface TenantsListParams {
    id?: number;
    ids?: Array<string | number>;
    name?: string;
    queryDate?: string;
    status?: number;
}
/**
 * 查询租户列表
 * @param params 
 * @param cb 
 * @returns 
 */
export const tenantsList = (params: TenantsListParams, cb: Function) => xwfuGet(tenantsPrefix + `/list`, params, cb);

interface TenantsPageParams {
    name?: string;
    pageNumber: number;
    pageSize: number;
    status?: number;
    queryDate?: string;
    enterpriseId: number;
}
/**
 * 查询租户分页
 * @param params 
 * @param cb 
 * @returns 
 */
export const tenantsPage = (params: TenantsPageParams, cb: Function) => xwfuGet(tenantsPrefix + `/page`, params, cb);

interface TenantsGetParams {
    id: number;
}
/**
 * 根据id查询租户
 * @param params 
 * @param cb 
 * @returns 
 */
export const tenantsGet = (params: TenantsGetParams, cb: Function) => xwfuGet(tenantsPrefix + `/${params.id}`, null, cb);

interface TenantsDeleteParams {
    id: number;
}
/**
 * 根据ID删除租户
 * @param params 
 * @param cb 
 * @returns 
 */
export const tenantsDelete = (params: TenantsDeleteParams, cb: Function) => xwfuDelete(tenantsPrefix + `/${params.id}`, null, cb)


/**
 * 查询租户数量
 * @param params 
 * @param cb 
 * @returns 
 */
export const tenantsGetQuantity = (cb: Function) => xwfuGet(tenantsPrefix + `/getQuantity`, null, cb);


/**
 * 根据用户名查询租户列表
 * @param params 
 * @param cb 
 * @returns 
 */
export const tenantsGetByUsername = (params: { username: string }, cb: Function) => xwfuGet(tenantsPrefix + `/getByUsername`, params, cb);
