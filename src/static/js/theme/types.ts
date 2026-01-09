
export enum ThemesV {
  Black = 'black',
  Blue = 'blue',
  White = 'white'
}

export interface Themes {
  [propname: string]: Theme
}

export interface Theme {
  backgroundUrl: string;
  colorPrimaryRgb: string;
  colorSuccessRgb: string;
  colorWarningRgb: string;
  colorDangerRgb: string;
  colorErrorRgb: string;
  colorInfoRgb: string;
  colorPrimaryDark: string;
  colorSuccessDark: string;
  colorWarningDark: string;
  colorDangerDark: string;
  colorErrorDark: string;
  colorInfoDark: string;
  bgColor: string;
  bgColorPage: string;
  bgColorOverlay: string;
  textColorPrimary: string;
  textColorRegular: string;
  textColorSecondary: string;
  textColorPlaceholder: string;
  textColorDisabled: string;
  borderColor: string;
  borderColorLight: string;
  borderColorLighter: string;
  borderColorExtraLight: string;
  borderColorDark: string;
  borderColorDarker: string;
  fillColor: string;
  fillColorLight: string;
  fillColorLighter: string;
  fillColorExtraLight: string;
  fillColorDark: string;
  fillColorDarker: string;
  colors: string[]
}


export enum StyleV {
  Default = 'default',
  Test = 'test'
}

export type StyleThemes = {
  [key in StyleV]: StyleTheme
}

export type StyleTheme = { [key in ThemesV]: StyleThemeContent };

export interface StyleThemeContent {
  mainButtonColor: string; //主要按钮字体颜色
}

export enum FontSizeV {
  Default = 'default',
  SelfAdaption = 'self-adaption'
}

export enum LayoutV {
  Vertical = 'vertical',
  Horizontal = 'horizontal'
}

export enum SideBarStatus {
  Opened = "opened",
  Closed = "closed"
}

export interface Layout {
  layout: LayoutV;
  sidebarStatus: SideBarStatus
}