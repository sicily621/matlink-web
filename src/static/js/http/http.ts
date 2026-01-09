import axios from 'axios';
import { interceptkHttpMockData } from "../mock/mock";
import { getAllowRoutes, getApiPrefix, getAuthReleaseRoutes, getTenantIdReleaseRoutes, setAuthReleaseRoutes } from './custom';
import { ElMessage } from "element-plus";
import { LoginLocalStorage } from '../localStorage/key';
import { objToQuery, getItem, exportExcel } from '../common/utils';
import { TestAppConfig } from "@static/js/configs/AppConfig";
/**
 * 允许未完成就可以重复请求的路由
 */
const preventRepeat: {
  [propname: string]: boolean
} = {};
/**
 * 设定未完成不允许重复请求的路由
 */
const notAllowRepeat: {
  [propname: string]: number
} = {};
export const setNotAllowRepeat = (route: string) => {
  notAllowRepeat[route] = 1; //1第一次请求 2重复请求
}
/**
 * 验证数据是否改变
 */
const validateChangeData: {
  [propname: string]: any
} = {};
/**
 *
 * @param route 传保存接口的路由
 * @param data 传最后要保存的数据
 * @returns
 */
/**
 * 不需要Authorization的路由
 */
const authReleaseRoute: string[] = getAuthReleaseRoutes();
/**
 * 切换租户库后header不需要tenantId的路由
 */
const tenantIdReleaseRoute: string[] = getTenantIdReleaseRoutes();
//判断条件根据后端数据来进行更改
export enum HttpResCode {
  Normal = 200, //请求数据正常
  TokenExpire = 401, //token过期
}
const NormalCode: (number | string)[] = [200, '200', 5000, 5001, 5005] // 请求数据正常

//请求格式类型
export enum HttpContentType {
  Xwfu = `application/x-www-form-urlencoded`,
  Json = `application/json`,
  FormData = `multipart/form-data`
};
//返回格式类型
export enum HttpResponseType {
  Stream = 'application/octet-stream',
  Blob = 'blob'
}
//请求方法参数
// 当params出现此字段时 证明要拼接路由请求 并且允许重复请求
// params: {
//   _repeatIdStrFlag: true,
//   _repeatIds: []
// }
export interface CreateHttp {
  type: string; //请求类型
  router: string; //路由地址
  apiPrefix?: string; //路由前缀
  params?: any; //请求采纳数
  cb?: Function; //成功回调
  err?: Function; //失败回调
  final?: Function; // 通用回调
  cbFlag?: boolean; //是否返回链式调用方法
  mockConfig?: any; //是否mock数据
  mockReadyConfig?: boolean; //返回准备好的数据
  allowRoutes?: string[]; //定义允许单时间点重复请求的路由
  contentType?: string; //请求类型
  noErrPrompt?: boolean; //是否不显示错误提示
  noValidCode?: boolean; //是否不验证返回的code
  responseType?: HttpResponseType
}
/**
 * 设置请求头数据
 * @param router //根据路由白名单 设置是否需要加token
 * @param loginToken //登录token
 * @returns
 */
export const setAxiosHeader = (router: string, loginToken?: string) => {
  const token = authReleaseRoute.includes(router) ? '' : (loginToken || window.$HyGlobal.getToken() || '');
  if (!authReleaseRoute.includes(router) && !token) return false;
  axios.defaults.headers.common['Authorization'] = token;
  if (token) {
    buildHeartbeat()
  } else {
    deleteHeartbeat()
  }
  let tenantId = getItem(LoginLocalStorage.currentTenant, false)
    || (getItem(LoginLocalStorage.tenantInfo, false) ? getItem(LoginLocalStorage.tenantInfo, false).id : null);
  if (!tenantId && window.$HyGlobal.getProjectInfo()) {
    tenantId = window.$HyGlobal.getProjectInfo().tenantId;
  }
  if (!tenantIdReleaseRoute.includes(router)) {
    if (tenantId && tenantId != 'undefined') axios.defaults.headers.tenantId = tenantId;
    else axios.defaults.headers.tenantId = null;
  }
  const userInfo = window.$HyGlobal.getUserInfo();
  if (userInfo && userInfo.userId) {
    axios.defaults.headers.userId = userInfo.userId;
    axios.defaults.headers.username = encodeURIComponent(userInfo.userName);
  }

  return true;
}


//心跳定时器 用于决定每隔多长时间心跳一次
let heartbeatTimer: any = 0;

const getrefreshTokenUrl = (): string => {
  let RefreshToken: string = '';
  if (window.$HyGlobal) {
    //当前运行产品的id
    const appID = window.$HyGlobal.getProduct();
    //不同产品的 刷新token和心跳路由不一样
    if (appID === 'admin') {
      RefreshToken = `/admin/main/api/admin/refreshToken`;
    } else if (appID === 'make') {
      RefreshToken = `/make/main/api/oauth/refreshToken`;
    } else if (appID === 'smart') {
      RefreshToken = `/smart/main/api/oauth/refreshToken`;
    } else if (appID === 'iot') {
      RefreshToken = `/iot/main/api/oauth/refreshToken`;
    } else if (appID === 'mopai') {
      RefreshToken = `/mopai/main/api/oauth/refreshToken`;
    } else if (appID === 'master') {
      RefreshToken = `/master/main/api/oauth/refreshToken`;
    }
  }
  return RefreshToken;
}

const getHeartbeatUrl = (): string => {
  let heartbeatUrl = '';
  if (window.$HyGlobal) {
    //当前运行产品的id
    const appID = window.$HyGlobal.getProduct();
    //不同产品的 刷新token和心跳路由不一样
    if (appID === 'Admin') {
      heartbeatUrl = `/admin/main/api/admin/heartbeat`
    } else if (appID === 'Make') {
      heartbeatUrl = `/make/main/api/oauth/heartbeat`
    } else if (appID === 'Smart') {
      heartbeatUrl = `/smart/main/api/oauth/heartbeat`
    } else if (appID === 'Iot') {
      heartbeatUrl = `/iot/main/api/oauth/heartbeat`;
    } else if (appID === 'Mopai') {
      heartbeatUrl = `/mopai/main/api/oauth/heartbeat`
    } else if (appID === 'Master') {
      heartbeatUrl = `/master/main/api/oauth/heartbeat`
    }
  }
  return heartbeatUrl;
}


//http请求总方法
export const http = (obj: CreateHttp) => {
  obj.allowRoutes = getAllowRoutes();
  if (!obj.apiPrefix) obj.apiPrefix = getApiPrefix();
  if (notAllowRepeat[obj.router] == 2) return;
  if (notAllowRepeat[obj.router]) notAllowRepeat[obj.router] = 2;
  const setFlag = setAxiosHeader(obj.router);
  if (!setFlag) {
    refreshError();
    return;
  }
  axios.defaults.headers['Content-Type'] = obj.contentType || HttpContentType.Json;
  let url = obj.apiPrefix + obj.router;
  if (obj.params && obj.params._repeatIdStrFlag) {
    url += `/${obj.params._repeatIds.join('/')}`;
    delete obj.params._repeatIds;
    delete obj.params._repeatIdStrFlag;
  }
  if (obj.mockConfig) interceptkHttpMockData(url, obj.mockConfig.data, obj.mockConfig.dep);
  let http: any = null;
  const config: any = obj.responseType ? { responseType: obj.responseType } : null
  if (obj.type === 'POST') http = axios.post(url, obj.params, config);
  if (obj.type === 'GET') http = axios.get(url + (obj.params ? `?${objToQuery(obj.params)}` : ''));
  if (obj.type === 'DELETE') http = axios.delete(url, { data: obj.params });
  if (obj.type === 'PUT') http = axios.put(url, obj.params);
  if (!http) return;
  if (obj.cbFlag) return http;
  try {
    http.then((res: any) => {
      if (notAllowRepeat[obj.router]) notAllowRepeat[obj.router] = 1;
      if (!obj.noValidCode) {
        if (NormalCode.includes(res.data.code)) {
          if (obj.cb) {
            obj.cb(res.data);
          } else {
            return res.data;
          }
        } else if (res.data.code === HttpResCode.TokenExpire) {
          if (obj.router != getrefreshTokenUrl()) expireHandler(obj);
          else refreshError();
        } else {
          if (!obj.noErrPrompt) {
            console.error(obj);
            ElMessage.error(res.data.msg || 'http.serverError');
          }
          if (obj.err) obj.err(res.data);
        }
      } else {
        const isStream = res.headers['content-type'].includes(HttpResponseType.Stream)
        if (isStream) {
          const regex = /filename=([^;]+)/;
          const match = res.headers['content-disposition'].match(regex);
          if (match && match.length > 1) {
            const filename = match[1];
            exportExcel(res.data, filename)
          }
        }
        if (obj.cb) {
          obj.cb(res.data);
        } else {
          return res.data;
        }
      }
    }).catch((error: any) => {
      preventRepeat[obj.router] = false;
      if (obj.err) obj.err(error);
      if (error.response && error.response.status === HttpResCode.TokenExpire) {
        if (obj.router != getrefreshTokenUrl()) expireHandler(obj);
        else refreshError();
      } else if (error.response && error.response.status != HttpResCode.Normal) {
        if (!obj.noErrPrompt) {
          console.error(error);
          console.error(obj);
          ElMessage.error('http.serverError');
        }
      } else {
        console.error(error);
        console.error(obj);
        ElMessage.error('http.clientError');
      }
    }).finally(() => {
      if (obj.final) obj.final();
    })
  } catch (error) {
    preventRepeat[obj.router] = false;
    if (obj.err) obj.err(error);
  }
};

/**
 * post请求封装
 */
export const post = (router: string, params?: any, cb?: Function, err?: Function, final?: Function, noValidCode?: boolean, responseType?: HttpResponseType) => http({ type: 'POST', router, params, cb, err, final, noValidCode, responseType });
/**
 * get请求封装
 */
export const get = (router: string, params?: any, cb?: Function | undefined, err?: Function | undefined, final?: Function | undefined, noValidCode?: boolean, responseType?: HttpResponseType) => http({ type: 'GET', params, router, cb, err, final, noValidCode, responseType });
/**
 * delete请求封装
 */
export const delete_ = (router: string, params?: any, cb?: Function, err?: Function, final?: Function) => http({ type: 'DELETE', router, params, cb, err, final });
/**
 * put请求封装
 */
export const put = (router: string, params?: any, cb?: Function, err?: Function, final?: Function) => http({ type: 'PUT', router, params, cb, err, final });
/**
 * content type为form-data的 put请求封装
 */
export const formDataPut = (router: string, params?: any, cb?: Function, err?: Function, final?: Function) => http({ type: 'PUT', contentType: HttpContentType.FormData, router, params, cb, err, final });
/**
 * content type为form-data的 post
 */
export const formDataPost = (router: string, params?: any, cb?: Function, err?: Function, final?: Function, noValidCode?: boolean, responseType?: HttpResponseType) => http({ type: 'POST', contentType: HttpContentType.FormData, router, params, cb, err, final, noValidCode, responseType });
/**
 * content type为x-www-form-u...的 post
 */
export const xwfuPost = (router: string, params?: any, cb?: Function, err?: Function, final?: Function, noValidCode?: boolean, responseType?: HttpResponseType) => http({ type: 'POST', contentType: HttpContentType.Xwfu, router, params, cb, err, final, noValidCode, responseType });
/**
 * content type为x-www-form-u...的put请求封装
 */
export const xwfuPut = (router: string, params?: any, cb?: Function, err?: Function, final?: Function) => http({ type: 'PUT', contentType: HttpContentType.Xwfu, router, params, cb, err, final });
/**
 * content type为x-www-form-u...的get请求封装
 */
export const xwfuGet = (router: string, params?: any, cb?: Function | undefined, err?: Function | undefined, final?: Function | undefined, noValidCode?: boolean, responseType?: HttpResponseType) => http({ type: 'GET', params, contentType: HttpContentType.Xwfu, router, cb, err, final, noValidCode, responseType });
/**
 * content type为x-www-form-u...的delete请求封装
 */
export const xwfuDelete = (router: string, params?: any, cb?: Function, err?: Function, final?: Function) => http({ type: 'DELETE', contentType: HttpContentType.Xwfu, router, params, cb, err, final });
/**
 * 处理token过期请求
 */
let expireCount: number = 0;
export const expireHandler = (obj: CreateHttp) => {
  const loginInfo = getItem(LoginLocalStorage.loginInfo, false) || false;
  const loginToken = window.$HyGlobal.getToken();
  if (!loginInfo || !loginInfo.refreshToken || !loginToken) return location.href = '/login';
  let refreshUrl = getrefreshTokenUrl();
  setAuthReleaseRoutes(refreshUrl);
  post(refreshUrl, {
    refreshToken: loginInfo.refreshToken
  }, (res: any) => {
    loginInfo.refreshToken = res.data.refreshToken;
    if (window.$HyGlobal) {
      window.$HyGlobal.setLoginInfo(loginInfo);
      const token: string = `Bearer ${res.data.accessToken}`;
      window.$HyGlobal.setToken(token)
    }
    http(obj);
  }, () => {
    refreshError();
  });
}
/**
 * 重置token失败回调
 */
const refreshError = () => {
  if (window.$HyGlobal) {
    window.$HyGlobal.setLoginInfo(null)
    window.$HyGlobal.setCurrentTenant(null)
    window.$HyGlobal.setCurrentProject(null)
    window.$HyGlobal.setSelectedProject(null);
    window.$HyGlobal.clearGroupId()
  }
  const productId = window.$HyGlobal.getProductId(); //获取产品ID
  if (productId != TestAppConfig.ProductId) {
    location.href = "/login";
  }
  deleteHeartbeat()
}

/**
 * 每个一段时间调用心跳接口
 * @param seconds 心跳接口调用时间间隔
 * @returns
 */
const buildHeartbeat = (seconds: number = 20) => {
  if (heartbeatTimer) return;
  heartbeatTimer = setInterval(() => {
    const token = window.$HyGlobal.getToken();
    let heartbeatUrl = getHeartbeatUrl();
    if (token && heartbeatUrl) {
      xwfuPost(heartbeatUrl, {});
    } else {
      deleteHeartbeat()
    }
  }, seconds * 5000)
}

/**
 * 删除心跳
 */
const deleteHeartbeat = () => {
  if (heartbeatTimer)
    clearInterval(heartbeatTimer)
  heartbeatTimer = 0;
}
