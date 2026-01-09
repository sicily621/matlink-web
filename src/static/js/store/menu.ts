import { defineStore } from 'pinia';
import { AllPermissions } from '../page/permission';


const useMenuStore = defineStore('menu', {
  state: () => ({
    menu: {},
    menus: [],
    firstFooter: [] as any[],
    historyMenu: {},//刷新时的历史块
    groupInfo: {},
    config: {
      footer: [],
      tool: [],
      topinfo: [],
      subtemplate: {}
    },
    userPermissions: window.$HyGlobal.getOperatePermissionIds(),
    tenantId: '',
    groupList: [] as any[],
    groupConfig: {
      footer: [],
      tool: [],
      topinfo: [],
      subtemplate: {}
    },
    largeGroupList: [] as any[],
    deviceId: ''
  }),
  getters: {
    getTenantId: (state) => state.tenantId,
    getMenu: (state) => state.menu,
    getMenus: (state) => state.menus,
    getHistoryMenu: (state) => state.historyMenu,
    getGroupInfo: (state) => state.groupInfo,
    getGroupList: (state) => state.groupList,
    getLargeGroupList: (state) => state.largeGroupList,
    getConfig: (state) => state.config,
    getGroupConfig: (state) => state.groupConfig,
    getUserPermissions: () => window.$HyGlobal.getOperatePermissionIds(),
    getComponentPermissions: (state) => {
      return (componentPermissions: number[] = AllPermissions) => {
        return window.$HyGlobal.getOperatePermissionIds().filter((value) => componentPermissions.includes(value));
      }
    },
    getFooter: (state) => {
      return state.config?.footer ?? []
    },
    getTool: (state) => {
      return state.config?.tool ?? []
    },
    getTopInfo: (state) => {
      return state.config?.topinfo ?? []
    },
    getDeviceId: (state) => state.deviceId,
    getFirstFooter: (state) => state.firstFooter,
  },
  actions: {
    setTenantId(tenantId: string) {
      this.tenantId = tenantId;
    },
    setMenu(menu: any) {
      this.menu = menu;
    },
    setMenus(menus: any) {
      this.menus = menus;
    },
    setHistoryMenu(historyMenu: any) {
      this.historyMenu = historyMenu;
    },
    setGroupInfo(groupInfo: any) {
      this.groupInfo = groupInfo;
      if (groupInfo.groupId || groupInfo.id) {
        window.$HyGlobal.setGroupId(groupInfo.groupId || groupInfo.id);
      }
    },
    setGroupList(groupList: any[]) {
      this.groupList = groupList || [];
    },
    setLargeGroupList(largeGroupList: any[]) {
      this.largeGroupList = largeGroupList || [];
    },
    setConfig(config: { footer: [], tool: [], topinfo: [], subtemplate: any }) {
      const newConfig = JSON.parse(JSON.stringify(config));
      newConfig.footer = (!Array.isArray(config.footer) || config.footer.length === 0) ? this.config.footer : config.footer;
      newConfig.tool = (!Array.isArray(config.tool) || config.tool.length === 0) ? this.config.tool : config.tool;
      newConfig.topinfo = (!Array.isArray(config.topinfo) || config.topinfo.length === 0) ? this.config.topinfo : config.topinfo;
      this.config = newConfig;
    },
    setGroupConfig(config: { footer: [], tool: [], topinfo: [], subtemplate: any }) {
      const newConfig = JSON.parse(JSON.stringify(config));
      newConfig.footer = (!Array.isArray(config.footer) || config.footer.length === 0) ? this.config.footer : config.footer;
      newConfig.tool = (!Array.isArray(config.tool) || config.tool.length === 0) ? this.config.tool : config.tool;
      newConfig.topinfo = (!Array.isArray(config.topinfo) || config.topinfo.length === 0) ? this.config.topinfo : config.topinfo;
      this.groupConfig = newConfig;
    },
    setUserPermissions(permissions: number[]) {
      window.$HyGlobal.setOperatePermissionIds(permissions)
    },
    setDeviceId(deviceId: string) {
      this.deviceId = deviceId;
    },
    setFirstFooter(footer: any[]) {
      this.firstFooter = footer;
    }
  }
});
export default useMenuStore;