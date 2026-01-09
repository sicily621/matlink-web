import { createRouter, createWebHistory } from 'vue-router';
import nprogress from 'nprogress';
import { RouteConfig, routersHandler } from './routes';

export interface mountRouteConfig {
  modules: any;  //各项目下views下的页面
  routesConfig: Array<RouteConfig | string>, //routes json模板
  progressFlag?: boolean; //是否开启进度条动画
}

export const mountRoute = (config: mountRouteConfig) => {
  const routes: any[] = [];
  routersHandler(config.modules, config.routesConfig, routes);
  const router = createRouter({
    history: createWebHistory(),
    routes
  })
  if (config.progressFlag) {
    nprogress.configure({
      // 动画方式
      easing: "ease",
      // 递增进度条的速度
      speed: 500,
      // 是否显示加载ico
      showSpinner: false,
      // 自动递增间隔
      trickleSpeed: 200,
      // 初始化时的最小百分比
      minimum: 0.3
    });
    
    router.beforeEach((_to, _from, next) => {
      nprogress.start();
      next()
    })
    
    router.afterEach(() => {
      nprogress.done();
    })
  }
  
  return router;
}