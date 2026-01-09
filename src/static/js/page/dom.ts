/**
 * resize事件方法名称
 */
export enum ResizeKey {
  Tag = 'tagIsOverflow',
  Table = 'getPageSizeCount',
  FullScreen = 'fullScreen'
}
/**
 * 存储resize事件方法
 */
export const reiszeManage: {[name: string] : Function | null} = {
  tagIsOverflow: null,
  getPageSizeCount: null,
  fullScreen: null
}
/**
 * 添加resize方法
 * @param key 
 * @param func 
 */
export const setMember = (key: ResizeKey, func: Function) => {
  reiszeManage[key] = func;
}
/**
 * 删除resize方法
 * @param key 
 */
export const removeMember = (key: ResizeKey) => {
  reiszeManage[key] = null;
}
/**
 * 启动resize方法
 * @returns 
 */
export const startResize = () => {
  if (window.onresize) return;
  let timer: any = null;
  window.onresize = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      let flag = 0;
      if (reiszeManage.tagIsOverflow) {
        flag++;
        reiszeManage.tagIsOverflow();
      }
      if (reiszeManage.getPageSizeCount) {
        flag++;
        reiszeManage.getPageSizeCount();
      }
      if (reiszeManage.fullScreen) {
        flag++;
        reiszeManage.fullScreen();
      }
      if (flag == 0) stopResize();
    }, 500);
  }
}
/**
 * 停止resize方法
 * @returns 
 */
export const stopResize = () => window.onresize = null;

