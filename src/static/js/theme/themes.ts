import { themes, styleThemes, layout } from "./colors";
import { StyleThemeContent, StyleV, Theme, ThemesV, LayoutV, SideBarStatus, FontSizeV } from "./types";
import { setRemMode, getRemMode } from "./zrem";

const htmlID = document.getElementsByTagName("html")[0]?.id;
const appID = document.getElementsByTagName("div")[0]?.id;
console.log(appID);

/**
 * 挂载当前主题色
 */
export const mountTheme = (id?: string, cb?: Function, isScreen: boolean = false) => {
  const themeID = id || htmlID;
  const box: any = document.getElementById(themeID);
  const key = isScreen ? `${themeID}-screen-theme` : `${themeID}-theme`;
  const theme: string = localStorage.getItem(key) || box.getAttribute("data-theme");
  const styleMode: string = box.getAttribute("data-style");
  const colors = themes[theme];
  const styles = styleThemes[styleMode as StyleV][theme as ThemesV];
  box.setAttribute("data-theme", theme);
  box.setAttribute("data-style", styleMode);
  box.setAttribute("class", theme);
  weakModeHander(getWeakModeStatus(), themeID);
  greyModeHander(getGreyModeStatus(), id);
  const curFontSize: FontSizeV = (getRemMode(themeID) as FontSizeV) || FontSizeV.SelfAdaption;
  setRemMode(curFontSize);
  if (cb) {
    cb(colors, styles);
  }
};

/**
 * 获取当前主题色key
 */

export const getThemeKey = (id?: string): ThemesV => {
  const themeID: any = id || htmlID;
  const box: any = document.getElementById(themeID);
  const theme: string = box.getAttribute("data-theme");
  return theme as ThemesV;
};

/**
 * 获取当前风格key
 */
export const getStyleKey = (id?: string): StyleV => {
  const appID: any = id || htmlID;
  const box: any = document.getElementById(appID);
  const styleMode: string = box.getAttribute("data-style");
  return styleMode as StyleV;
};

/**
 * 获取当前主题色配置
 * @returns
 */
export const getTheme = (id?: string): Theme => themes[getThemeKey(id)];

/**
 * 更改当前主题色
 */
export const setTheme = (color: ThemesV, id?: string, cb?: Function, isScreen: boolean = false) => {
  const themeID: string = id || htmlID;
  const box: any = document.getElementById(themeID);
  box.setAttribute("data-theme", color);
  const key = isScreen ? `${themeID}-screen-theme` : `${themeID}-theme`;
  localStorage.setItem(key, color);
  mountTheme(themeID, cb, isScreen);
};

/**
 * 获取当前风格主题色
 */
export const getStyleTheme = (id?: string): StyleThemeContent => styleThemes[getStyleKey(id)][getThemeKey(id)];

/**
 * 更改当前风格
 */
export const setStyle = (style: StyleV, id?: string, cb?: Function) => {
  const appID: any = id || htmlID;
  const box: any = document.getElementById(appID);
  box.setAttribute("data-style", style);
  localStorage.setItem(`${appID}-style`, style);
  mountTheme(appID, cb);
};

/**
 * 开启或关闭色弱模式
 */
export const weakModeHander = (b: boolean, id?: string) => {
  const appID: string = id || htmlID;
  const box: any = document.getElementById(appID);
  const className = "html-weak";
  if (b) {
    if (box.className.indexOf(className) === -1) {
      box.className = box.className.length ? `${box.className} ${className}` : className;
    }
    localStorage.setItem(className, "1");
  } else {
    box.className = box.className.replace(className, "");
    localStorage.setItem(className, "");
  }
};
/**
 * 色弱模式是否开启
 */
export const getWeakModeStatus = (): boolean => localStorage.getItem("html-weak") === "1";

/**
 * 开启或关闭灰色模式
 */
export const greyModeHander = (b: boolean, id?: string) => {
  const appID: any = id || htmlID;
  const box: any = document.getElementById(appID);
  const className = "html-grey";
  if (b) {
    if (box.className.indexOf(className) === -1) {
      box.className = box.className.length ? `${box.className} ${className}` : className;
    }
    localStorage.setItem(className, "1");
  } else {
    box.className = box.className.replace(className, "");
    localStorage.setItem(className, "");
  }
};
/**
 * 灰色模式是否开启
 */
export const getGreyModeStatus = (): boolean => localStorage.getItem("html-grey") === "1";

/**
 * 获取当前布局
 */
export const getLayout = () => {
  return localStorage.getItem("layout") || layout.layout;
};
/**
 * 获取当前布局
 */
export const setLayout = (mode: LayoutV, cb?: Function) => {
  layout.layout = mode;
  localStorage.setItem(`layout`, mode);
  if (cb) cb(layout.layout);
};
/**
 * 获取左侧菜单的伸缩状态
 */
export const getSidebarStatus = () => {
  return localStorage.getItem("sidebarStatus") || layout.sidebarStatus;
};
/**
 * 设置左侧菜单的伸缩状态
 */
export const setSidebarStatus = (status: SideBarStatus, cb?: Function) => {
  layout.sidebarStatus = status;
  localStorage.setItem(`sidebarStatus`, status);
  if (cb) cb(layout.sidebarStatus);
};
