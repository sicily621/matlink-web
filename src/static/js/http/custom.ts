
//允许重复请求的路由系列
export const allowRoutes: string[] = [];

//不需要token验证的路由系列
export const authReleaseRoutes: string[] = [];

//切换租户库后header不需要tenantId的路由系列
export const tenantIdReleaseRoutes: string[] = [];


//获取配置允许重复请求的路由系列
export const getAllowRoutes = () =>  allowRoutes;
export const setAllowRoutes = (value: string) => allowRoutes.push(value);


//获取配置不需要token验证的路由系列
export const getAuthReleaseRoutes = () => authReleaseRoutes;
export const setAuthReleaseRoutes = (value: string) => authReleaseRoutes.push(value);

//获取配置切换租户库后header不需要tenantId的路由系列
export const getTenantIdReleaseRoutes = () => tenantIdReleaseRoutes;
export const setTenantIdReleaseRoutes = (value: string) => tenantIdReleaseRoutes.push(value);

export const getApiPrefix = () => '/api';