import Mock from 'mockjs';

export interface MockDep {
  depKey: string; //需要深层的key
  depLevel: number; //创建到第几层
  sameLevelFlag?: boolean; //数组内对象深度添加时 只添加第一个还是同级所有对象都深度添加
}

/**
 * 创建mock对象
 * @param obj 对象kv格式
 * @returns mock template
 */
const createMockObj = (obj: any) => {
  if (!obj) return;
  const mockObj: any = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    const item = obj[key];
    if (typeof item === 'string') {
      mockObj[item ? key : key + `|1-500`] = item;
    }
    if (typeof item === 'number') {
      mockObj[item ? key : key + `|1-1000000`] = item;
    }
    if (typeof item === 'object') {
      mockObj[key] = createMockObj(item);
    }
  }
  return mockObj;
}

/**
 * 创建深层对象
 * @param obj 对象kv格式
 * @param depKey 需要深层的key
 * @param depLevel 创建到第几层
 * @returns mock template
 */
const createDepMockObj = (obj: any, depKey: string, depLevel: number) => {
  let currentLevel: number = 0;
  let objTem = JSON.parse(JSON.stringify(obj));
  objTem[depKey] = null;
  const handlerDep = (obj: any, depKey: string) => {
    if (currentLevel >= depLevel) return null;
    if (Array.isArray(obj)) {
      if (!obj.length) obj.push({});
      if (!Array.isArray(obj[0][depKey]) || !obj[0][depKey].length) obj[0][depKey] = [JSON.parse(JSON.stringify(obj[0]))];
      currentLevel++;
      handlerDep(obj[0][depKey], depKey);
    } else {
      if (!obj[depKey]) {
        obj[depKey] = JSON.parse(JSON.stringify(objTem));
      }
      currentLevel++;
      handlerDep(obj[depKey], depKey);
    }
  }
  handlerDep(obj, depKey);
  return createMockObj(obj);
}

/**
 * 创建深层数组
 * @param arr 
 * @param {MockDep} depConfig 
 * @returns 
 */
const createDepMockArray = (arr: any, depConfig: MockDep) => {
  const { depKey, depLevel, sameLevelFlag } = depConfig;
  const handlerDepArr = (arr: any, currentLevel: number) => {
    if (currentLevel >= depLevel) return null;
    if (!Array.isArray(arr)) arr = [{}];
    if (!arr.length) arr = [{}];
    if (sameLevelFlag) {
      for (let i = 0; i < arr.length; i++) {
        if (!Array.isArray(arr[i][depKey])) arr[i][depKey] = JSON.parse(JSON.stringify(arr));
        if (!arr[i][depKey].length) arr[i][depKey] = JSON.parse(JSON.stringify(arr));
        handlerDepArr(arr[i][depKey], currentLevel + 1);
      }
    } else {
      if (!Array.isArray(arr[0][depKey])) arr[0][depKey] = JSON.parse(JSON.stringify(arr));
      if (!arr[0][depKey].length) arr[0][depKey] = JSON.parse(JSON.stringify(arr));
      handlerDepArr(arr[0][depKey], currentLevel + 1);
    }
  }
  handlerDepArr(arr, 0);
  return createMockObj(arr);
}
/**
 * mock数据处理
 * @param obj 要mock数据的对象或者数组
 * @param {MockDep} depConfig 
 * @returns mock好的数据
 */
export const mockHandler = <T>(obj: T, depConfig?: MockDep): T => {
  if (!obj) return {} as T;
  let mockObj: T = {} as T;
  if (depConfig) {
    if (Array.isArray(obj)) {
      mockObj = createDepMockArray(obj, depConfig);
    } else {
      mockObj = createDepMockObj(obj, depConfig.depKey, depConfig.depLevel);
    }
  } else {
    mockObj = createMockObj(obj);
  }
  const mockData = Mock.mock(mockObj);
  return mockData;
}

/**
 * @param obj 
 * @returns 
 */
export const createEnumMockData = <T>(obj: T, num: number): T => {
  const key = 'mock';
  const template: any = {
    [`${key}|${num}`]: obj
  };
  const data = Mock.mock(template);
  return data[key];
}

/**
 * 拦截http请求mock数据
 * @param route 路由地址
 * @param obj mock对象模板
 * @param {MockDep} depConfig
 */
export const interceptkHttpMockData = (route: string, obj: any, depConfig?: MockDep) => {
  Mock.mock(route, () => {
    const data: any = {code: 200, data: mockHandler(obj, depConfig), msg: ''}
    return data;
  })
}
/**
 * 请求或mock
 * @param mockData 手写的mock数据
 * @param httpFunc 正常请求的函数
 * @returns 
 */
export const httpAndMock = (mockData: any, httpFunc: Function, params?: any, cb?: any, err?: any) => {
  if (import.meta.env.MODE === 'mock') {
    if (mockData) {
      const data: any = Object.values(mockData)[0];
      cb({code: 200, data: data.default[httpFunc.name], msg: 'mock success'});
    }
  } else {
    httpFunc(params, cb, err);
  }
}
