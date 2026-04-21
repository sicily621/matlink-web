import { FontSizeV } from "./types";

//默认字体大小
export const fontSize: number = 14;

//如果要加全局字体大小变化
// export const fontSizes: any = {
//   small: 14,
//   default: 16,
//   large: 20
// };

//获取自定义尺寸单位
export const zrem = (px: number) => (px / fontSize) + 'rem';

//rem转回px
export const remToPx = (remStr: string) => (Number(remStr.replace('rem', '')) * fontSize);

export const mountRemMode = (id?: string) => {
  const remMode = getRemMode(id);
  if (remMode && remMode != undefined && remMode != 'undefined')
    setRemMode(remMode as FontSizeV, id);
}

/**
 * 切换响应式布局
 */
export const setRemMode = (v: FontSizeV, id?: string) => {
  const themeID: any = id || document.getElementsByTagName('html')[0]?.id;
  const box: any = document.getElementById(themeID);
  box.setAttribute('data-font-size', v);
  localStorage.setItem(`${themeID}-font-size`, v);
}
/**
 * 获取当前响应式布局模式
 */
export const getRemMode = (id?: string) => localStorage.getItem(`${id || document.getElementsByTagName('html')[0]?.id}-font-size`);
