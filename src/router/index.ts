import type { RouteRecordRaw } from "vue-router";
import { createRouter } from "vue-router";
import { routerConfig } from "@/router/config";
import { registerNavigationGuard } from "@/router/guard";
import { flatMultiLevelRoutes } from "./helper";
import { ModuleCode } from "./moduleCode";

const Layouts = () => import("@/layouts/index.vue");

/**
 * @name 常驻路由
 * @description 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置唯一的 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/pages/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/403",
    component: () => import("@/pages/error/403.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/404",
    component: () => import("@/pages/error/404.vue"),
    meta: {
      hidden: true,
    },
    alias: "/:pathMatch(.*)*",
  },
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () => import("@/pages/home/index.vue"),
        name: "Home",
        meta: {
          title: "经营概览",
          elIcon: "DataAnalysis",
        },
      },
    ],
  },
];

/**
 * @name 动态路由
 * @description 用来放置有权限 (Roles 属性) 的路由
 * @description 必须带有唯一的 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/employeeManagement",
    component: Layouts,
    redirect: "/employeeManagement/employee",
    meta: {
      title: "组织权限",
      elIcon: "User",
      moduleCode: ModuleCode.EmployeeManagement,
    },
    children: [
      {
        path: "department",
        component: () =>
          import("@/pages/employeeManagement/department/list.vue"),
        name: "department",
        meta: {
          title: "部门管理",
          moduleCode: ModuleCode.Department,
        },
      },
      {
        path: "role",
        component: () => import("@/pages/employeeManagement/role/list.vue"),
        name: "role",
        meta: {
          title: "角色管理",
          moduleCode: ModuleCode.Role,
        },
      },
      {
        path: "employee",
        component: () => import("@/pages/employeeManagement/employee/list.vue"),
        name: "employee",
        meta: {
          title: "员工管理",
          moduleCode: ModuleCode.Employee,
        },
      },
      {
        path: "permission",
        component: () =>
          import("@/pages/employeeManagement/permission/list.vue"),
        name: "permission",
        meta: {
          title: "权限管理",
          moduleCode: ModuleCode.Permission,
        },
      },
    ],
  },
  {
    path: "/baseManagement",
    component: Layouts,
    redirect: "/baseManagement/category",
    meta: {
      title: "物料公共",
      elIcon: "Goods",
      moduleCode: ModuleCode.baseManagement,
    },
    children: [
      {
        path: "stock",
        component: () => import("@/pages/baseManagement/stock/list.vue"),
        name: "stock",
        meta: {
          title: "物料库",
          moduleCode: ModuleCode.Stock,
        },
      },
      {
        path: "material",
        component: () => import("@/pages/baseManagement/material/list.vue"),
        name: "material",
        meta: {
          title: "物料管理",
          moduleCode: ModuleCode.Material,
        },
      },
      {
        path: "auditFlow",
        component: () => import("@/pages/baseManagement/auditFlow/list.vue"),
        name: "auditFlow",
        meta: {
          title: "审批流程",
          moduleCode: ModuleCode.AuditFlow,
        },
      },
      {
        path: "category",
        component: () => import("@/pages/baseManagement/category/list.vue"),
        name: "category",
        meta: {
          title: "物料分类",
          moduleCode: ModuleCode.Category,
        },
      },
      {
        path: "unit",
        component: () => import("@/pages/baseManagement/unit/list.vue"),
        name: "unit",
        meta: {
          title: "物料单位",
          moduleCode: ModuleCode.Unit,
        },
      },
      {
        path: "supplier",
        component: () => import("@/pages/baseManagement/supplier/list.vue"),
        name: ModuleCode.Supplier,
        meta: {
          title: "供应商",
          moduleCode: ModuleCode.Supplier,
        },
      },
    ],
  },
  {
    path: "/stockIn",
    component: Layouts,
    redirect: "/stockInManagement/stockIn",
    meta: {
      title: "物料入库",
      elIcon: "Goods",
      moduleCode: ModuleCode.InStock,
    },
    children: [
      {
        path: "stockIn",
        component: () => import("@/pages/stockInManagement/stockIn/list.vue"),
        name: "stockIn",
        meta: {
          title: "入库登记",
          moduleCode: ModuleCode.InStock,
        },
      },
    ],
  }
];

/** 路由实例 */
export const router = createRouter({
  history: routerConfig.history,
  routes: routerConfig.thirdLevelRouteCache
    ? flatMultiLevelRoutes(constantRoutes)
    : constantRoutes,
});

/** 重置路由 */
export function resetRouter() {
  try {
    // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
    router.getRoutes().forEach((route) => {
      const { name, meta } = route;
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name);
      }
    });
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    location.reload();
  }
}

// 注册路由导航守卫
registerNavigationGuard(router);
