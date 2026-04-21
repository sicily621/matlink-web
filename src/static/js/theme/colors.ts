import { StyleThemes, Themes, ThemesV, StyleV, Layout, LayoutV, SideBarStatus } from './types';

export const themes: Themes = {
  [ThemesV.Black]: {
    backgroundUrl: 'blue-bg.png',
    colorPrimaryRgb: '64, 158, 255',
    colorSuccessRgb: '120, 229, 78',
    colorWarningRgb: '243, 159, 59',
    colorDangerRgb: '251, 66, 66',
    colorErrorRgb: '255, 51, 51',
    colorInfoRgb: '230, 230, 230',
    colorPrimaryDark: '#045a96',
    colorSuccessDark: '#529b2e',
    colorWarningDark: '#b88230',
    colorDangerDark: '#c45656',
    colorErrorDark: 'c45656',
    colorInfoDark: '#73767a',
    bgColor: '#000000',
    bgColorPage: '#f2f3f5',
    bgColorOverlay: '8, 10, 17',
    textColorPrimary: '64, 158, 255',
    textColorRegular: '#fff',
    textColorSecondary: '#3EDCFF',
    textColorPlaceholder: '#B3B3B3',
    textColorDisabled: '#045A96',
    borderColor: '4, 96, 150',
    borderColorLight: '#2e5d90',
    borderColorLighter: '#66CCFF',
    borderColorExtraLight: '#3EDCFF',
    borderColorDark: '#003366',
    borderColorDarker: '#000',
    fillColor: '#006699',
    fillColorLight: 'rgba(64, 158, 255,0.2)',
    fillColorLighter: '#0E2940',
    fillColorExtraLight: '#fafcff',
    fillColorDark: '#ebedf0',
    fillColorDarker: '#e6e8eb',
    colors: [
      "#05A4FF", "#78E54E", "#f39f3b", "#FFF400", "#FB4242", "#45DDFF", "#615CE2",
      "#3399CC", "#68C749", "#D18B39", "#DBD407", "#D73C3F", "#37BFE0", "#5452C7"
    ]
  },
  [ThemesV.Blue]: {
    backgroundUrl: 'red-bg.png',
    colorPrimaryRgb: '64, 255, 255',
    colorSuccessRgb: '120, 229, 78',
    colorWarningRgb: '243, 159, 59',
    colorDangerRgb: '251, 66, 66',
    colorErrorRgb: '255, 51, 51',
    colorInfoRgb: '230, 230, 230',
    colorPrimaryDark: '#045a96',
    colorSuccessDark: '#529b2e',
    colorWarningDark: '#b88230',
    colorDangerDark: '#c45656',
    colorErrorDark: 'c45656',
    colorInfoDark: '#73767a',
    bgColor: '#0c1f3a',
    bgColorPage: '#f2f3f5',
    bgColorOverlay: '255, 255, 255',
    textColorPrimary: '0, 0, 0',
    textColorRegular: '#000',
    textColorSecondary: '#3EDCFF',
    textColorPlaceholder: '#B3B3B3',
    textColorDisabled: '#045A96',
    borderColor: '#006699',
    borderColorLight: '#3399CC',
    borderColorLighter: '#66CCFF',
    borderColorExtraLight: '#3EDCFF',
    borderColorDark: '#003366',
    borderColorDarker: '#000',
    fillColor: '#006699',
    fillColorLight: 'rgba(69,221,255,0.2)',
    fillColorLighter: '#0E2940',
    fillColorExtraLight: '#fafcff',
    fillColorDark: '#ebedf0',
    fillColorDarker: '#e6e8eb',
    colors: ["#e01f54", "#001852", "#f5e8c8", "#b8d2c7", "#c6b38e", "#a4d8c2", "#f3d999", "#d3758f", "#dcc392"]
  },
  [ThemesV.White]: {
    backgroundUrl: 'while-bg.png',
    colorPrimaryRgb: '64, 158, 255',
    colorSuccessRgb: '103, 194, 58',
    colorWarningRgb: '230, 162, 60',
    colorDangerRgb: '245, 108, 108',
    colorErrorRgb: '245, 108, 108',
    colorInfoRgb: '144, 147, 153',
    colorPrimaryDark: '#337ecc',
    colorSuccessDark: '#529b2e',
    colorWarningDark: '#b88230',
    colorDangerDark: '#c45656',
    colorErrorDark: 'c45656',
    colorInfoDark: '#73767a',
    bgColor: '#ffffff',
    bgColorPage: '#f2f3f5',
    bgColorOverlay: '255, 255, 255',
    textColorPrimary: '48,49,51',
    textColorRegular: '#606266',
    textColorSecondary: '#909399',
    textColorPlaceholder: '#a8abb2',
    textColorDisabled: '#c0c4cc',
    borderColor: '#dcdfe6',
    borderColorLight: '#e4e7ed',
    borderColorLighter: '#ebeef5',
    borderColorExtraLight: '#f2f6fc',
    borderColorDark: '#d4d7de',
    borderColorDarker: '#cdd0d6',
    fillColor: '#f0f2f5',
    fillColorLight: '#f5f7fa',
    fillColorLighter: '#fafafa',
    fillColorExtraLight: '#fafcff',
    fillColorDark: '#ebedf0',
    fillColorDarker: '#e6e8eb',
    colors: ["#516b91", "#59c4e6", "#edafda", "#93b7e3", "#a5e7f0", "#cbb0e3"]

  }
};

export const styleThemes: StyleThemes = {
  [StyleV.Default]: {
    [ThemesV.Black]: {
      mainButtonColor: '#032847'
    },
    [ThemesV.White]: {
      mainButtonColor: ''
    },
    [ThemesV.Blue]: {
      mainButtonColor: ''
    }
  },
  [StyleV.Test]: {
    [ThemesV.Black]: {
      mainButtonColor: '#45DDFF'
    },
    [ThemesV.White]: {
      mainButtonColor: ''
    },
    [ThemesV.Blue]: {
      mainButtonColor: ''
    }
  }
}



export const layout: Layout = {
  layout: LayoutV.Vertical,
  sidebarStatus: SideBarStatus.Opened
};
