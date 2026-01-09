import { tenantMopaiPrefix } from '../api';
import { xwfuGet, xwfuPost } from "@static/js/http/http";

interface tenantMopaiSaveParams {
    id?: any;
    tenantId?: number;
    enterpriseId: number;
    isExpirationStop: number;
    expirationRunDay: number;
    enable: number;
    name?: string | number;
}

export const tenantMopaiSave = (params: tenantMopaiSaveParams, cb: Function) => xwfuPost(tenantMopaiPrefix + '/save', params, cb);

export const tenantMopaiGet = (params: { id: number }, cb: Function) => xwfuGet(tenantMopaiPrefix + `/${params.id}`, params, cb);

export const tenantMopiaFindByTenantId = (params: { tenantId: number }, cb: Function) => xwfuGet(tenantMopaiPrefix + `/findByTenantId`, params, cb);