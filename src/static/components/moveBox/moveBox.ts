import { post, xwfuGet, http } from '@static/js/http/http';
import { setAllowRoutes } from "@static/js/http/custom";
import axios from 'axios';

interface floorsGetSpaceTreeParams {
    buildingIds?: string[];
    floorIds?: string[];
    parkIds?: string[];
    projectId: number;
}
// 获取空间树
export const floorsGetSpaceTree = (params: floorsGetSpaceTreeParams, cb: Function) => {
    const tenantId = window.$HyGlobal.getCurrentTenant()?.tenantId;
    if (tenantId) {
        const project = window.$HyGlobal.getPermission().getProject(tenantId, Number(params.projectId));
        if (project && project.parks && project.parks.length > 0) {
            const ids = project.parks.map((res: any) => res.parkId);
            let buildingIds = <any>[];
            let floorIds = <any>[];
            params.parkIds = ids;
            for (let parkId of ids) {
                const park = window.$HyGlobal.getPermission().getPark(tenantId, Number(params.projectId), parkId);
                if (park?.buildings?.length) {
                    const ids = park.buildings.map((res: any) => res.buildingId);
                    buildingIds = buildingIds.concat(ids);
                    for (let buildingId of ids) {
                        const building = window.$HyGlobal.getPermission().getBuilding(tenantId, Number(params.projectId), parkId, buildingId);
                        if (building?.floors?.length) {
                            floorIds = floorIds.concat(building.floors);
                        }
                    }
                }
            }
            params.buildingIds = buildingIds;
            params.floorIds = floorIds;
        }
    }

    return post(`/service/center/common/space/api/floors/getSpaceTree`, params, cb);
};

interface DevicePageParams {
    buildingId?: number;
    floorId?: number;
    page?: number;
    size?: number;
    projectId?: number;
    name?: string;
    parkId?: number;
    systemId?: number;
    deviceModelId?: number;
    subSystemId?: number;
    spaceFlag?: number;
    ids: number[];
}
/**
 * 分页查询设备列表
 * @param params
 * @param cb
 * @returns
 */
export const devicePage = (params: DevicePageParams, cb: Function) => post(`/service/center/common/device/management/api/device/page`, params, cb);

interface deviceGetParams {
    id: number;
}

export const deviceGet = (params: deviceGetParams, cb: Function) => xwfuGet(`/service/center/common/device/management/api/device`, {
    _repeatIdStrFlag: true,
    _repeatIds: [params.id]
}, cb);
setAllowRoutes(`/service/center/common/device/management/api/device`);

export const devicePageFiltering = (params: any, cb: Function) => post(`/service/center/common/device/management/api/device/pageFiltering`, params, cb);


export const deviceGetListByCondition = (params: any, cb: Function) => {
    const tenantId = window.$HyGlobal.getCurrentTenant()?.tenantId;
    if (tenantId) {
        const tenant = window.$HyGlobal.getPermission().getTenant(tenantId);
        if (tenant) {
            params.permissionData = tenant;
        }
    }
    return post(`/service/center/common/device/management/api/device/getListByCondition`, params, cb);
}

interface getPlayInfoParams {
    factory: string;
    username: string;
    password: string;
    ip: string;
    port: string | number;
    channel: string | number;
    selectedId: string | number;
    clientId: string | number;
    type: string | number;
}

export const startPlay = (params: getPlayInfoParams, cb: Function) => {
    axios.defaults.headers["Client-ID"] = params.clientId;
    axios.defaults.headers["Stream-ID"] = params.selectedId;
    http({
        type: 'POST',
        router: `/play`,
        apiPrefix: '/_video',
        params: params,
        cb: cb,
    });
}

interface stopPlayParams {
    clientId: string | number;
    selectedId: string | number;
}

export const stopPlay = (params: stopPlayParams, cb: Function) => {
    axios.defaults.headers["Client-ID"] = params.clientId;
    axios.defaults.headers["Stream-ID"] = params.selectedId;
    http({
        type: 'POST',
        router: `/stop`,
        apiPrefix: '/_video',
        params: params,
        cb: cb,
    });
}
