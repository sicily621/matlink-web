import { StyleThemeContent, Theme, LayoutV, SideBarStatus } from '../theme/types';
import { getLayout, setLayout, getSidebarStatus, setSidebarStatus } from '../theme/themes';
import { defineStore } from 'pinia';
const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: {},
    styleTheme: {},
    layout: getLayout(),
    sidebarStatus: getSidebarStatus()
  }),
  getters: {
    getTheme: (state) => state.theme,
    getStyleTheme: (state) => state.styleTheme,
    getLayout: (state) => state.layout,
    getSidebarStatus: (state) => state.sidebarStatus
  },
  actions: {
    setTheme(theme: Theme) {
      this.theme = theme;
    },
    setStyleTheme(styleThemeContent: StyleThemeContent) {
      this.styleTheme = styleThemeContent;
    },
    setLayout(layout: LayoutV) {
      this.layout = layout;
      setLayout(layout);
    },
    setSidebarStatus(status: SideBarStatus) {
      this.sidebarStatus = status;
      setSidebarStatus(status)
    }
  }
});
export default useThemeStore;