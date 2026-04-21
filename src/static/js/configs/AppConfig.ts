// 定义 AppConfig 接口
export interface AppConfig {
  FontSize: string;
  Theme: string;
  Style: string;
  Logo: string;
  BaseAPI: string;
  ID?: string;
  HTMLID?: string;
  Title?: string;
  ProductId?: number;
  ProductCode?: string;
  LockState?: boolean;
  Port?: number;
}

// 默认配置对象
const defaultConfig: AppConfig = {
  FontSize: "default",
  Theme: "white",
  Style: "default",
  Logo: "logo.png",
  BaseAPI: "/api",
};

// 工厂函数用于创建 AppConfig 实例并应用默认值
function createAppConfig(customConfig: Partial<AppConfig>): AppConfig {
  return {
    ...defaultConfig,
    ...customConfig,
  };
}

// 使用工厂函数创建 AdminAppConfig
export const AdminAppConfig = createAppConfig({
  ID: "HyAdminApp",
  HTMLID: "HyAdminApp-html",
  Title: "产品配置管理平台",
  ProductId: 1,
  ProductCode: "admin",
  LockState: false,
  Port: 9800,
});

export const MakeAppConfig = createAppConfig({
  ID: "HyMakeApp",
  HTMLID: "HyMakeApp-html",
  Title: "项目配置管理平台",
  ProductId: 2,
  ProductCode: "make",
  LockState: false,
  Port: 9801,
});

export const SmartAppConfig = createAppConfig({
  ID: "HySmartApp",
  HTMLID: "HySmartApp-html",
  Title: "建筑智能化运维管理",
  ProductId: 3,
  ProductCode: "smart",
  LockState: false,
  Port: 9802,
});

export const MasterAppConfig = createAppConfig({
  ID: "HyMasterApp",
  HTMLID: "HyMasterApp-html",
  Title: "集团建筑智能化运维管理平台",
  ProductId: 4,
  ProductCode: "master",
  LockState: true,
  Port: 9803,
});

export const MopaiAppConfig = createAppConfig({
  ID: "HyMopaiApp",
  HTMLID: "HyMopaiApp-html",
  Title: "移动运维管理平台",
  ProductId: 5,
  ProductCode: "mopai",
  LockState: false,
  Port: 9804,
});

export const IotAppConfig = createAppConfig({
  ID: "HyIotApp",
  HTMLID: "HyIotApp-html",
  Title: "IOT物联网平台",
  ProductId: 6,
  ProductCode: "iot",
  LockState: false,
  Port: 9805,
});

export const PortalAppConfig = createAppConfig({
  ID: "HyPotalApp",
  HTMLID: "HyPotalApp-html",
  Title: "中创慧谷官网",
  ProductId: 7,
  ProductCode: "potal",
  LockState: false,
  Port: 9806,
});

export const CheckAppConfig = createAppConfig({
  ID: "HyCheckApp",
  HTMLID: "HyCheckApp-html",
  Title: "完整性检查",
  ProductId: 7,
  ProductCode: "check",
  LockState: false,
  Port: 9807,
});
export const TestAppConfig = createAppConfig({
  ID: "HyTestApp",
  HTMLID: "HyTestApp-html",
  Title: "组件演示",
  ProductId: 8,
  ProductCode: "test",
  LockState: false,
  Port: 9808,
});
