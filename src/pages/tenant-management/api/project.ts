import { formDataPost, formDataPut, xwfuDelete, xwfuGet, xwfuPost, xwfuPut, post } from "@static/js/http/http";
import { projectPrefix } from "../api";
import { setAllowRoutes } from "@static/js/http/custom";

interface ProjectIntroduceVideoesParams {
    projectId: number;
    content: string;
    status: number;
    video_file: File;
}
/**
 * 新增项目简介
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectIntroduceVideoes = (params: ProjectIntroduceVideoesParams, cb: Function) => formDataPost(projectPrefix + `/projectIntroduceVideoes`, params, cb);

interface ProjectIntroduceVideoesPutParams extends ProjectIntroduceVideoesParams {
    id: number;
}
/**
 * 更新项目简介
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectIntroduceVideoesPut = (params: ProjectIntroduceVideoesPutParams, cb: Function) => formDataPut(projectPrefix + `/projectIntroduceVideoes`, params, cb);

interface ProjectIntroduceVideoesGetByProjectIdParams {
    projectId: number;
}
/**
 * 根据项目id查询项目简介详情
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectIntroduceVideoesGetByProjectId = (params: ProjectIntroduceVideoesGetByProjectIdParams, cb: Function) => xwfuGet(projectPrefix + `/projectIntroduceVideoes/getByProjectId`, params, cb);

interface ProjectIntroduceVideoesGetParams {
    id: number;
}
/**
 * 根据id查询项目简介详情
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectIntroduceVideoesGet = (params: ProjectIntroduceVideoesGetParams, cb: Function) => xwfuGet(projectPrefix + `/projectIntroduceVideoes/${params.id}`, null, cb);

interface ProjectIntroduceVideoesDeleteParams {
    id: number;
}
/**
 * 根据ID删除项目简介
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectIntroduceVideoesDelete = (params: ProjectIntroduceVideoesDeleteParams, cb: Function) => xwfuDelete(projectPrefix + `/projectIntroduceVideoes/${params.id}`, null, cb);

interface PropertyTypeCodeFindPageParams {
    page: number;
    pid: number | null;
    size: number;
}
/**
 * 分页查询物业类型编码
 * @param params 
 * @param cb 
 * @returns 
 */
const PropertyTypeCodeFindPage = projectPrefix + `/propertyTypeCode/findPage`;
setAllowRoutes(PropertyTypeCodeFindPage);
export const propertyTypeCodeFindPage = (params: PropertyTypeCodeFindPageParams, cb: Function) => xwfuPost(PropertyTypeCodeFindPage, params, cb);

interface PropertyTypeCodeFindByIdParams {
    id: number;
}
/**
 * 通过ID获取物业类型编码
 * @param params 
 * @param cb 
 * @returns 
 */
export const propertyTypeCodeFindById = (params: PropertyTypeCodeFindByIdParams, cb: Function) => xwfuGet(projectPrefix + `/propertyTypeCode/findById`, params, cb);

/**
 * 根据ids查询物业类型名map
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectPropertyTypeCodeGetNameMapByIds = (params: string[], cb: Function) => post(projectPrefix + `/propertyTypeCode/getNameMapByIds`, params, cb);


interface ProjectProjectExtendsParams {
    projectId: number;
    buildingArea: number;
    carparkArea: number;
    floorArea: number;
    month: number;
    operatingArea: number;
    peopleNumber: number;
    projectLevel: number;
    propertyRentalRate: number;
    rentArea: number;
    selfArea: number;
    undergroundArea: number;
    year: number;
}
/**
 * 新增项目扩展信息
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectProjectExtends = (params: ProjectProjectExtendsParams, cb: Function) => xwfuPost(projectPrefix + `/projectExtends`, params, cb);

interface ProjectProjectExtendsPutParams extends ProjectProjectExtendsParams {
    id: number;
}
/**
 * 更新项目扩展信息
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectProjectExtendsPut = (params: ProjectProjectExtendsPutParams, cb: Function) => xwfuPut(projectPrefix + `/projectExtends`, params, cb);

interface projectProjectExtendsListParams {
    month?: number;
    projectId: number;
    year?: string;
}
/**
 * 根据条件查询项目列表
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectProjectExtendsList = (params: projectProjectExtendsListParams, cb: Function) => xwfuGet(projectPrefix + `/projectExtends/list`, params, cb);

/**
 * 根据ID删除项目扩展信息
 * @param params 
 * @param cb 
 * @returns 
 */
export const projectProjectExtendsDelete = (params: { id: string }, cb: Function) => xwfuDelete(projectPrefix + `/projectExtends/${params.id}`, null, cb);


/**
 * 根据项目id查询最新的项目扩展信息
 * @param params 
 * @param cb 
 * @returns 
 */
interface projectProjectExtendsGetLatestByProjectIdParams {
    projectId: number
}
export const projectProjectExtendsGetLatestByProjectId = (params: projectProjectExtendsGetLatestByProjectIdParams, cb: Function) => xwfuGet(projectPrefix + `/projectExtends/getLatestByProjectId`, params, cb);




/**
 * 保存项目自定义信息
 * @param params 
 * @param cb 
 * @returns 
 */
interface projectDefineInformationSaveParams {
    id?: number;
    projectId: number;
    name: string;
    content: string;
    type: number;
    description: string;
}
export const projectDefineInformationSave = (params: projectDefineInformationSaveParams, cb: Function) => xwfuPost(projectPrefix + `/DefineInformation/save`, params, cb);


/**
 * 分页查询项目自定义信息
 * @param params 
 * @param cb 
 * @returns 
 */
interface projectDefineInformationFindPageParams {
    projectId: number | string;
    page: number;
    size: number;
    type?: number;

}
export const projectDefineInformationFindPage = (params: projectDefineInformationFindPageParams, cb: Function) => xwfuPost(projectPrefix + `/DefineInformation/findPage`, params, cb);




/**
 * 删除项目自定义信息
 * @param params 
 * @param cb 
 * @returns 
 */
interface projectDefineInformationDeleteParams {
    id: number;
}
export const projectDefineInformationDelete = (params: projectDefineInformationDeleteParams, cb: Function) => xwfuPost(projectPrefix + `/DefineInformation/delete`, params, cb);



/**
 * 获取项目自定义信息
 * @param params 
 * @param cb 
 * @returns 
 */

export const projectDefineInformationFindAll = (params: null, cb: Function) => xwfuGet(projectPrefix + `/DefineInformation/findAll`, params, cb);
