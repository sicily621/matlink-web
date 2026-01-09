import { formDataPost, formDataPut, xwfuDelete, xwfuGet, post } from "@static/js/http/http";
import { projectsPrefix } from "../api";
import { setAllowRoutes } from "@static/js/http/custom";

interface ProjectsParams {
    name: string;
    type: number;
    city: string;
    country: string;
    county: string;
    description: string;
    latitude: string;
    logo_file: File;
    longitude: string;
    projectPicture_file: File;
    province: string;
    street: string;
    userCode: string;
}
/**
 * 新增项目
 * @param params 
 * @param cb 
 * @returns 
 */
export const projects = (params: ProjectsParams, cb: Function) => formDataPost(projectsPrefix, params, cb);

interface ProjectsPutParams extends ProjectsParams {
    id: number;
}
/**
 * 更新项目
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectsPut = (params: ProjectsPutParams, cb: Function) => formDataPut(projectsPrefix, params, cb);

interface ProjectDeleteParams {
    id: number;
}
/**
 * 删除项目
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectsDelete = (params: ProjectDeleteParams, cb: Function) => xwfuDelete(projectsPrefix + `/${params.id}`, null, cb);

interface ProjectsPageParams {
    id?: number;
    name?: string;
    page: number;
    size: number;
    status?: number;
    tenantId: number;
}
/**
 * 根据条件查询项目分页
 * @param params
 * @param cb 
 * @returns 
 */
export const projectsPage = (params: ProjectsPageParams, cb: Function) => xwfuGet(projectsPrefix + `/page`, params, cb);

/**
 * 查询项目数量
 * @param params
 * @param cb 
 * @returns 
 */
export const projectsGetQuantity = (cb: Function) => xwfuGet(projectsPrefix + `/getQuantity`, null, cb);

/**
 * 根据id查询项目详情
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectGet = (params: { id: number }, cb: Function) => xwfuGet(projectsPrefix, {
    _repeatIdStrFlag: true,
    _repeatIds: [params.id]
}, cb);
setAllowRoutes(projectsPrefix)

export const projectsGetFirstProject = (cb: Function) => xwfuGet(projectsPrefix + `/getFirstProject`, null, cb);
/**
 * 查询项目数量
 * @param params
 * @param cb 
 * @returns 
 */
interface projectsGetProjectTypeParams {
    projectId: number
}
export const projectsGetProjectType = (params: projectsGetProjectTypeParams, cb: Function) => xwfuGet(projectsPrefix + `/getProjectType`, params, cb);

//根据projectIds获取项目名称
export const getNameMapByIds = (params: number[], cb: Function) => post(projectsPrefix + `/getNameMapByIds`, params, cb);

export const projectsList = (params: any, cb: Function) => {
    const tenantId = window.$HyGlobal.getCurrentTenant()?.tenantId;
    if (tenantId) {
        const tenant = window.$HyGlobal.getPermission().getTenant(tenantId);
        console.log('查看tenant:', tenant);
        if (!params.ids) params.ids = [];
        if (tenant && Array.isArray(tenant.projects)) {
            for (let item of tenant.projects) {
                params.ids.push(item.projectId);
            }
        }
    }
    return xwfuGet(projectsPrefix + `/list`, params, cb);
}

export const getListByProjectIds = (params: string[], cb: Function) => post(projectsPrefix + "/getListByProjectIds", params, cb);