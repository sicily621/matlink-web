export interface RouteConfig {
  title?: string;
  component?: string;
  children?: Array<RouteConfig | string>;
  name?: string;
  path?: string;
  meta?: {
    transition?: string;
    keepAlive?: boolean;
  }
}

/**
 * 处理路由模板
 * @param modules  views下的文件路径 
 * @param routesConfig  路由json模板
 * @param routes 存储vue路由的数组
 */
export const routersHandler = (modules: any, routesConfig: Array<RouteConfig | string>, routes: any[]) => {
  const handler = (routers: any[], arr: any[]) => {
    for (let item of routers) {
      if (typeof item === 'string') item = { component: item };
      let vueName: string = '';
      let component: any = null;
      if (item.component) {
        vueName = item.component.split('/').pop().split('.')[0];
        if (modules[item.component]) {
          try {
            component = (modules[item.component] as any).default;
          } catch(error) {
            console.log(item.component);
            console.log(modules[item.component]);
            console.log(error);
          }
        } else {
          console.error(`${item.component} is not defined`);
          return;
        }
      }
      const route: any = {
        name: item.name || vueName,
        path: item.path || `/${vueName}`,
        title: item.title,
        meta: item.meta
      }
      if (component) route.component = component;
      arr.push(route);
      if (Array.isArray(item.children) && item.children.length) {
        arr[arr.length -1].children = [];
        handler(item.children, arr[arr.length -1].children);
      }
    }
  }
  handler(routesConfig, routes);
}
export const getTabs = ()=>{
  const tabs = sessionStorage.getItem('tabs');
  return tabs ? JSON.parse(sessionStorage.getItem(tabs) as any) || [] : [];
}
export const setTabs = (tabs: any)=>{
  return sessionStorage.setItem('tabs',JSON.stringify(tabs));
}
export const getTabsMap = () => {
  const tabs = sessionStorage.getItem('tabsMap');
  return tabs ? JSON.parse(sessionStorage.getItem(tabs) as any) || {} : {};
}
export const setTabsMap = (tabsMap: any) => {
  return sessionStorage.setItem('tabsMap',JSON.stringify(tabsMap));
}
export const getCurrentGroupId = (query: any): string => {
  if (query.groupId) {
    if (Array.isArray(query.groupId) && query.groupId.length) {
      return query.groupId[query.groupId.length - 1];
    } else {
      return query.groupId;
    }
  } else {
    return '';
  }
}