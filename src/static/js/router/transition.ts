export enum RouteTransitionV {
  Bounce = 'bounce',
  Opacity = 'opacity',
  RightSwiper = 'rightSwiper',
  LeftSwiper = 'leftSwiper',
  TopSwiper = 'topSwiper',
  BottomSwiper = 'bottomSwiper',
  ScaleRight = 'scaleRight',
  ScaleLeft = 'scaleLeft',
  Default = 'default', //默认无动画
  Random = 'random' //默认元素和随机元素 始终要放在最后两位!!! 涉及到随机选择时 不选最后两位
}

export interface RouteTransition {
  [key: string]: RouteTransitionV
}

//localstore插槽 防止localstore key存储了 enum外的key
export const routeTransition: RouteTransition = {};
const routeTransitionHander = () => {
  const arr = Object.values(RouteTransitionV);
  for (let item of arr) {
    routeTransition[item] = item as RouteTransitionV;
  }
}
routeTransitionHander();

//不同动画的切换执行顺序不同
export const routeTransitionMode: any = {
  [RouteTransitionV.Default]: '',
  [RouteTransitionV.Random]: '',
  [RouteTransitionV.Bounce]: 'out-in',
  [RouteTransitionV.Opacity]: 'out-in',
  [RouteTransitionV.RightSwiper]: '',
  [RouteTransitionV.LeftSwiper]: '',
  [RouteTransitionV.TopSwiper]: '',
  [RouteTransitionV.BottomSwiper]: '',
  [RouteTransitionV.ScaleRight]: '',
  [RouteTransitionV.ScaleLeft]: ''
};

/**
 * 获取当前路由跳转动画
 * @returns 
 */
export const getRouteTransition = (storeKey: string) => {
  return routeTransition[localStorage.getItem(storeKey) || RouteTransitionV.Default] || RouteTransitionV.Default;
}

/**
 * 设置当前路由跳转动画
 * @param storeKey 不同项目存储不同名称的local store
 * @param routeTransitionV 值 
 * @returns 
 */
export const setRouteTransition = (storeKey: string, routeTransitionV: RouteTransitionV, cb: Function) => {
  localStorage.setItem(storeKey, routeTransitionV);
  cb();
}

/**
 * 获取随机路由跳转动画
 * @returns 
 */
export const getRandomRouteTransition = () => {
  const arr = Object.values(RouteTransitionV);
  const i = Math.floor(Math.random() * (arr.length - 2));
  return arr[i];
}
