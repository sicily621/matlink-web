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
    meta: {
      title: "库存管理",
      svgIcon: "inventory",
    },
    children: [
      {
        path: "home",
        component: () =>
          import("@/pages/inventoryManagement/inventory/list.vue"),
        name: "Home",
        meta: {
          title: "库存记录",
          svgIcon: "inventoryRecord",
        },
      },
      {
        path: "statistics",
        component: () =>
          import("@/pages/inventoryManagement/statistics/index.vue"),
        name: "Statistics",
        meta: {
          title: "库存分析",
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
          svgIcon: "department",
          title: "部门管理",
          moduleCode: ModuleCode.Department,
        },
      },
      {
        path: "role",
        component: () => import("@/pages/employeeManagement/role/list.vue"),
        name: "role",
        meta: {
          svgIcon: "role",
          title: "角色管理",
          moduleCode: ModuleCode.Role,
        },
      },
      {
        path: "employee",
        component: () => import("@/pages/employeeManagement/employee/list.vue"),
        name: "employee",
        meta: {
          svgIcon: "employee",
          title: "用户管理",
          moduleCode: ModuleCode.Employee,
        },
      },
      {
        path: "permission",
        component: () =>
          import("@/pages/employeeManagement/permission/list.vue"),
        name: "permission",
        meta: {
          svgIcon: "permission",
          title: "权限管理",
          moduleCode: ModuleCode.Permission,
        },
      },
    ],
  },
  {
    path: "/auditFlowManagement",
    component: Layouts,
    redirect: "/auditFlow",
    children: [
      {
        path: "auditFlow",
        component: () => import("@/pages/baseManagement/auditFlow/list.vue"),
        name: "auditFlow",
        meta: {
          title: "审批流程",
          svgIcon: "auditFlow",
          moduleCode: ModuleCode.AuditFlow,
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
          svgIcon: "stock",
          title: "物料库",
          moduleCode: ModuleCode.Stock,
        },
      },
      {
        path: "material",
        component: () => import("@/pages/baseManagement/material/list.vue"),
        name: "material",
        meta: {
          svgIcon: "material",
          title: "物料管理",
          moduleCode: ModuleCode.Material,
        },
      },
      {
        path: "category",
        component: () => import("@/pages/baseManagement/category/list.vue"),
        name: "category",
        meta: {
          svgIcon: "category",
          title: "物料分类",
          moduleCode: ModuleCode.Category,
        },
      },
      {
        path: "unit",
        component: () => import("@/pages/baseManagement/unit/list.vue"),
        name: "unit",
        meta: {
          svgIcon: "unit",
          title: "物料单位",
          moduleCode: ModuleCode.Unit,
        },
      },
      {
        path: "supplier",
        component: () => import("@/pages/baseManagement/supplier/list.vue"),
        name: ModuleCode.Supplier,
        meta: {
          svgIcon: "supplier",
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
      title: "入库管理",
      svgIcon: "stockIn",
      moduleCode: ModuleCode.InStockManagement,
    },
    children: [
      {
        path: "stockIn",
        component: () => import("@/pages/stockInManagement/stockIn/list.vue"),
        name: "stockIn",
        meta: {
          title: "入库登记",
          svgIcon: "stockInMenu",
          moduleCode: ModuleCode.InStock,
        },
      },
      {
        path: "stockInApprove",
        component: () =>
          import("@/pages/stockInManagement/stockInApprove/list.vue"),
        name: "stockInApprove",
        meta: {
          svgIcon: "stockInApprove",
          title: "入库审批",
          moduleCode: ModuleCode.InStockApprove,
        },
      },
    ],
  },
  {
    path: "/stockOut",
    component: Layouts,
    redirect: "/stockOutManagement/stockOut",
    meta: {
      title: "出库管理",
      svgIcon: "stockOut",
      moduleCode: ModuleCode.OutStockManagement,
    },
    children: [
      {
        path: "stockOut",
        component: () => import("@/pages/stockOutManagement/stockOut/list.vue"),
        name: "stockOut",
        meta: {
          title: "出库登记",
          svgIcon: "stockOutMenu",
          moduleCode: ModuleCode.OutStock,
        },
      },
      {
        path: "stockOutApprove",
        component: () =>
          import("@/pages/stockOutManagement/stockOutApprove/list.vue"),
        name: "stockOutApprove",
        meta: {
          svgIcon: "stockOutApprove",
          title: "出库审批",
          moduleCode: ModuleCode.OutStockApprove,
        },
      },
    ],
  },
  {
    path: "/outBoundApply",
    component: Layouts,
    redirect: "/outBoundApplyManagement/outBoundApply",
    meta: {
      title: "物料领用",
      svgIcon: "outBoundApply",
      moduleCode: ModuleCode.OutBoundApplyManagement,
    },
    children: [
      {
        path: "outBoundApply",
        component: () =>
          import("@/pages/outBoundApplyManagement/outBoundApply/list.vue"),
        name: "outBoundApply",
        meta: {
          svgIcon: "outBoundApplyMenu",
          title: "物料申领",
          moduleCode: ModuleCode.OutBoundApply,
        },
      },
      {
        path: "outBoundApplyApprove",
        component: () =>
          import("@/pages/outBoundApplyManagement/outBoundApplyApprove/list.vue"),
        name: "outBoundApplyApprove",
        meta: {
          svgIcon: "outBoundApplyApprove",
          title: "申领审批",
          moduleCode: ModuleCode.OutBoundApplyApprove,
        },
      },
    ],
  },
  {
    path: "/purchase",
    component: Layouts,
    redirect: "/purchaseManagement/purchase",
    meta: {
      title: "采购管理",
      svgIcon: "purchase",
      moduleCode: ModuleCode.PurchaseManagement,
    },
    children: [
      {
        path: "scarceMaterial",
        component: () =>
          import("@/pages/purchaseManagement/scarceMaterial/material.vue"),
        name: "scarceMaterial",
        meta: {
          svgIcon: "scarceMaterial",
          title: "缺货物料",
          moduleCode: ModuleCode.ScarceMaterial,
        },
      },
      {
        path: "purchase",
        component: () => import("@/pages/purchaseManagement/purchase/list.vue"),
        name: "purchase",
        meta: {
          svgIcon: "purchaseMenu",
          title: "采购申请",
          moduleCode: ModuleCode.Purchase,
        },
      },
      {
        path: "purchaseApprove",
        component: () =>
          import("@/pages/purchaseManagement/purchaseApprove/list.vue"),
        name: "purchaseApprove",
        meta: {
          title: "采购审批",
          svgIcon: "purchaseApprove",
          moduleCode: ModuleCode.PurchaseApprove,
        },
      },
    ],
  },
  {
    path: "/task",
    component: Layouts,
    redirect: "/taskManagement/task",
    meta: {
      title: "盘点管理",
      svgIcon: "task",
      moduleCode: ModuleCode.TaskManagement,
    },
    children: [
      {
        path: "task",
        component: () => import("@/pages/taskManagement/task/list.vue"),
        name: "task",
        meta: {
          svgIcon: "taskMenu",
          title: "盘点任务",
          moduleCode: ModuleCode.Task,
        },
      },
      {
        path: "taskApprove",
        component: () => import("@/pages/taskManagement/taskApprove/list.vue"),
        name: "taskApprove",
        meta: {
          svgIcon: "taskApprove",
          title: "盘点审批",
          moduleCode: ModuleCode.TaskApprove,
        },
      },
    ],
  },
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
