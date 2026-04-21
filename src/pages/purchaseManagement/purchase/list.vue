<template>
  <div class="app-container flex h-full">
    <div class="w-full h-full flex-1 flex" v-if="!processFlag">
      <div class="left el-card">
        <tree
          :data="treeData"
          :expandedKeys="expandedKeys"
          :currentNodeKey="currentNodeKey"
          ref="treeRef"
          @changeNode="changeNode($event)"
          placeholder="请输入物料库名称"
          :propsObj="defaultProps"
          :searchFlag="true"
        >
        </tree>
      </div>
      <div class="flex-1 flex flex-col h-full">
        <div class="h-full w-full flex flex-col" v-if="!processFlag">
          <el-card v-loading="loading" shadow="never" class="search-wrapper">
            <div class="flex">
              <el-form
                ref="searchFormRef"
                class="flex-grow-1"
                :inline="true"
                :model="searchData"
              >
                <el-form-item label="采购单号" prop="billNo">
                  <el-input
                    v-model="searchData.billNo"
                    class="w-40"
                    placeholder="请输入采购单号"
                    maxlength="32"
                    required
                  >
                  </el-input>
                </el-form-item>
                <el-form-item prop="auditStatus" label="审核状态">
                  <el-select
                    v-model="searchData.auditStatus"
                    placeholder="请选择审核状态"
                    @change="refreshTable()"
                    class="w-40"
                  >
                    <el-option
                      v-for="item in auditStatusListWithAll"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="status" label="采购状态">
                  <el-select
                    v-model="searchData.status"
                    placeholder="请选择采购状态"
                    @change="refreshTable()"
                    class="w-40"
                  >
                    <el-option
                      v-for="item in purchaseStatusListWithAll"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="时间范围">
                  <el-date-picker
                    v-model="time"
                    class="width-100"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    @change="refreshTable"
                    :disabled-date="isAfter"
                  />
                </el-form-item>
              </el-form>
              <el-button type="primary" v-if="enableCreate" @click="create"
                >新增</el-button
              >
            </div>
          </el-card>
          <div
            v-loading="loading"
            class="flex-grow-1 flex flex-col el-card table-card"
            shadow="never"
          >
            <div class="table-wrap">
              <baseTable
                :columns="columns"
                :table-data="tableData"
                :indexMethod="indexMethod(currentPage, pageSize)"
                class="h-full"
              >
                <template #stockId="scope"
                  >{{ stockMap.get(scope.scope.row.stockId)?.name }}
                </template>
                <template #status="scope">
                  <el-tag type="primary">
                    {{ getStatus(scope.scope.row.status, PurchaseStatusList) }}
                  </el-tag>
                </template>
                <template #auditStatus="scope">
                  <el-tag type="primary">
                    {{
                      getStatus(scope.scope.row.auditStatus, AuditStatusList)
                    }}
                  </el-tag>
                </template>
                <template #applyUserId="scope">
                  {{ userNameMap?.[scope.scope.row.applyUserId] ?? "-" }}
                </template>
                <template #auditUserId="scope">
                  {{ userNameMap?.[scope.scope.row.auditUserId] ?? "-" }}
                </template>
                <template #createUserId="scope">
                  {{ userNameMap?.[scope.scope.row.createUserId] ?? "-" }}
                </template>
                <template #createTime="scope">
                  {{
                    scope.scope.row.createTime
                      ? new Date(scope.scope.row.createTime)
                          .toLocaleString()
                          .replace(/\//g, "-")
                      : "-"
                  }}
                </template>
                <template #applyTime="scope">
                  {{
                    scope.scope.row.applyTime
                      ? new Date(scope.scope.row.applyTime)
                          .toLocaleString()
                          .replace(/\//g, "-")
                      : "-"
                  }}
                </template>
                <template #auditTime="scope">
                  {{
                    scope.scope.row.auditTime
                      ? new Date(scope.scope.row.auditTime)
                          .toLocaleString()
                          .replace(/\//g, "-")
                      : "-"
                  }}
                </template>
                <template #operate="scope">
                  <div class="flex">
                    <IconSvg
                      v-if="
                        enableEdit &&
                        scope.scope.row.auditStatus === 0 &&
                        scope.scope.row.status === 0
                      "
                      :src="Abandon"
                      :width="16"
                      class="fz16 m-r-5 cursor-pointer"
                      @click="abandon(scope.scope.row)"
                    ></IconSvg>
                    <IconSvg
                      v-if="
                        enableEdit &&
                        scope.scope.row.hasPurchaseAuth &&
                        scope.scope.row.auditStatus === 2 &&
                        scope.scope.row.status === 0
                      "
                      :src="Purchased"
                      :width="16"
                      class="fz16 m-r-5 cursor-pointer"
                      @click="toPurchased(scope.scope.row)"
                    ></IconSvg>
                    <el-icon
                      class="fz16 m-r-5 cursor-pointer"
                      v-if="enableRead"
                      @click="showDetail(scope.scope.row)"
                    >
                      <View />
                    </el-icon>
                    <el-icon
                      class="fz16 cursor-pointer m-r-5"
                      text
                      v-if="
                        enableEdit &&
                        scope.scope.row.auditStatus === 0 &&
                        scope.scope.row.status === 0
                      "
                      @click="edit(scope.scope.row)"
                    >
                      <Edit />
                    </el-icon>
                  </div>
                </template>
              </baseTable>
            </div>
            <div class="pager-wrapper h-12 p-r-4">
              <pagination
                :page-size="pageSize"
                :current-page="currentPage + 1"
                :total="totalItems"
                @pageChange="pageChange($event)"
                class="zc-page"
              ></pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-full w-full flex flex-col" v-if="processFlag">
      <Create
        class="create-wrap"
        ref="createRef"
        :data="currentData"
        :stockId="String(currentNodeKey)"
        :checkmaterialIds="materialIds"
        :onlyView="onlyView"
      ></Create>

      <el-card class="footer flex flex-justify-end flex-items-center">
        <el-button
          type="primary"
          v-if="processFlag === 1 && !onlyView"
          @click="save"
          class="p-l-6 p-r-6 m-r-3"
          >保存</el-button
        >
        <el-button @click="back" class="p-l-6 p-r-6">返回</el-button>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import tree from "@@/components/tree/tree.vue";
import baseTable from "@@/components/baseTable/baseTable.vue";
import pagination from "@@/components/pagination/pagination.vue";
import type { PaginatedRequest } from "@@/apis/tables/type";
import {
  queryPurchaseConditions,
  deletePurchase,
  findPurchasePage,
  Purchase,
  editPurchase,
  PurchaseStatusList,
  AuditStatusList,
} from "@pages/purchaseManagement/api/purchase";
import {
  getStockListByIds,
  getStockList,
  Stock,
} from "@pages/baseManagement/api/stock";
import { indexMethod } from "@@/utils/page";
import { watchDebounced } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { ModuleCode } from "@/router/moduleCode";
import { usePermissionStore } from "@/pinia/stores/permission";
import { PermissionAction } from "@/pages/employeeManagement/api/permission";
import { getEmployeeListByIds } from "@/pages/employeeManagement/api/employee";
import Abandon from "@pages/purchaseManagement/purchase/abandon.svg";
import IconSvg from "@static/components/iconSvg/iconSvg.vue";
import Purchased from "./purchased.svg";
import Create from "./create.vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const materialIds = ref<string>(
  route.query.checkedIds ? String(route.query.checkedIds) : "",
);
const permissionStore = usePermissionStore();
const enableCreate = permissionStore.hasPermission(
  ModuleCode.Purchase,
  PermissionAction.Add,
);
const enableEdit = permissionStore.hasPermission(
  ModuleCode.Purchase,
  PermissionAction.Edit,
);
const enableRead = permissionStore.hasPermission(
  ModuleCode.Purchase,
  PermissionAction.View,
);
const userNameMap = ref<{ [key: string]: string }>({});
const auditStatusListWithAll = [{ id: -1, name: "全部" }, ...AuditStatusList];
const purchaseStatusListWithAll = [
  { id: -1, name: "全部" },
  ...PurchaseStatusList,
];
const treeRef = ref();
const getStatus = (id: string, list: any[]) => {
  return list.find((item) => item.id === id)?.name ?? "无";
};
const onlyView = ref(false);

// 左侧树列表
const virtualRootId = "root";
const treeData: any = ref<any[]>([]);

//为过滤保留源数据
const rawParkData = ref<any[]>([]);

//左侧树列表props name当label
const defaultProps = {
  children: "children",
  label: "name",
};

//树列表默认展开建筑
const expandedKeys = ref<Array<number | string>>([virtualRootId]);
//树列表当前选中建筑
const currentNodeKey = ref<number | string>("");
//左侧树列表 选中节点变化触发
const changeNode = (data: any) => {
  if (data.id === virtualRootId) {
    if (data.children.length > 0) {
      currentNodeKey.value = data?.children[0]?.id;
      treeRef.value.setCurrentKey(currentNodeKey.value);
    } else {
      currentNodeKey.value = virtualRootId;
      return;
    }
  } else {
    currentNodeKey.value = data.id;
  }
  refreshTable();
};

const time = ref("");
const isAfter = (date: Date) => {
  return date.getTime() - Date.now() >= 0;
};
const loading = ref<boolean>(false);
const processFlag = ref(0); // 0列表 1新建 2编辑
const columns = ref([
  { prop: "index", label: "序号", width: "100", type: 1 },
  { prop: "stockId", label: "物料库" },
  { prop: "billNo", label: "采购单号" },
  { prop: "applyDate", label: "采购时间" },
  { prop: "applyUserId", label: "申请人" },
  { prop: "status", label: "业务状态" },
  { prop: "auditStatus", label: "审核状态" },
  { prop: "auditUserId", label: "审核人" },
  { prop: "createUserId", label: "创建人" },
  { prop: "createTime", label: "创建时间" },
  { prop: "auditTime", label: "审核时间" },
  { prop: "operate", label: "操作", width: 100 },
]);
//分页
const pageSize = ref(10);
const currentPage = ref(0);
const totalItems = ref(0);
const pageChange = (page: any) => {
  currentPage.value = page - 1;
  refreshTable();
};
const currentData = ref<Purchase | null>(null);

const createRef = ref();
const tableData = ref<Purchase[]>([]);

const searchFormRef = ref("searchFormRef");

const searchData = reactive<queryPurchaseConditions>({
  billNo: "",
  auditStatus: -1,
  status: -1,
  stockId: currentNodeKey.value,
  startTime: "",
  endTime: "",
});

watchDebounced(
  searchData,
  () => {
    refreshTable();
  },
  { debounce: 500, maxWait: 1000 },
);
function refreshTable() {
  loading.value = true;
  const params: PaginatedRequest<queryPurchaseConditions> = {
    currentPage: currentPage.value + 1,
    size: pageSize.value,
  };
  if (searchData.auditStatus > -1) params.auditStatus = searchData.auditStatus;
  if (searchData.status > -1) params.status = searchData.status;
  if (currentNodeKey.value) params.stockId = currentNodeKey.value;
  if (searchData.billNo.length > 0) params.billNo = searchData.billNo;
  if (time.value?.[0] && time.value?.[1]) {
    params.startTime = `${time.value?.[0]} 00:00:00`;
    params.endTime = `${time.value?.[1]} 23:59:59`;
  }
  findPurchasePage(params)
    .then(async (res: any) => {
      const { total, list } = res.data;
      const stockIds = list.map((item: any) => item.stockId);
      if (stockIds.length) await getStockListByIds(stockIds);
      totalItems.value = total;
      const userIds: string[] = [];
      list?.forEach((event: any) => {
        userIds.push(event.applyUserId);
        userIds.push(event.auditUserId);
        userIds.push(event.createUserId);
      });
      const newUserArr = Array.from(new Set(userIds));
      if (newUserArr.length) {
        const employeeRes: any = await getEmployeeListByIds(newUserArr);
        userNameMap.value = {};
        employeeRes.data.map((item: any) => {
          userNameMap.value[item.id] = item.realName;
        });
      }
      tableData.value = list;
    })
    .catch(() => {
      tableData.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
}
const create = () => {
  processFlag.value = 1;
};
const remove = async (id: string) => {
  await deletePurchase(id);
  ElMessage({
    type: "success",
    message: "删除成功",
  });
  refreshTable();
};
const showDetail = (row: any) => {
  onlyView.value = true;
  currentData.value = row;
  processFlag.value = 1;
};
const abandon = (row: any) => {
  ElMessageBox.confirm("确定要废弃吗？", "采购单", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const params: any = { ...row, status: 2 };
      delete params["files"];
      const res: any = await editPurchase(params);
      if (res.code) {
        ElMessage({
          type: "success",
          message: "废弃成功",
        });
        refreshTable();
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消废弃",
      });
    });
};
const toPurchased = (row: any) => {
  ElMessageBox.confirm("确定已采购了吗？", "采购单", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const params: any = { ...row, status: 1 };
      delete params["files"];
      const res: any = await editPurchase(params);
      if (res.code) {
        ElMessage({
          type: "success",
          message: "采购成功",
        });
        refreshTable();
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消采购",
      });
    });
};
const stockMap = new Map();
function buildStockTree(stocks: Stock[], parentId: number = 0) {
  // 第一步：创建所有分类的映射并初始化children
  stocks.forEach((dept: Stock) => {
    stockMap.set(dept.id, {
      ...dept,
      children: [],
    });
  });

  // 第二步：建立所有层级的父子关系
  stocks.forEach((dept: Stock) => {
    const current = stockMap.get(dept.id);
    if (dept.parentId !== 0) {
      const parent = stockMap.get(dept.parentId);
      if (parent) {
        parent.children.push(current);
      }
    }
  });

  // 第三步：收集顶级分类
  return stocks
    .filter((dept: Stock) => dept.parentId === 0)
    .map((dept: Stock) => stockMap.get(dept.id));
}
const queryStock = async () => {
  const res = await getStockList();
  if ((res as any)?.data?.length) {
    rawParkData.value = (res as any)?.data || [];
    treeData.value = buildStockTree((res as any)?.data || []);
    if (route.query.stockId) {
      currentNodeKey.value = String(route.query.stockId);
    } else {
      currentNodeKey.value = treeData.value[0].id;
    }
    treeRef.value.setCurrentKey(currentNodeKey.value);
  }
};

const save = () => {
  if (processFlag.value == 1) {
    createRef.value.confirmSave(() => {
      back();
    });
  }
};
const back = () => {
  processFlag.value = 0;
  currentData.value = null;
  onlyView.value = false;
  router.replace({ query: {} });
  materialIds.value = "";
  refreshTable();
};
const edit = (row: any) => {
  onlyView.value = false;
  currentData.value = row;
  processFlag.value = 1;
};
onMounted(async () => {
  await queryStock();
  if (route.query.stockId) {
    create();
  } else {
    refreshTable();
  }
});
</script>

<style lang="scss" scoped>
@use "@@/assets/styles/size.scss" as *;
.table-card {
  height: calc(100% - zrem(110));
}
.table-wrap {
  height: calc(100% - zrem(45));
}

.search-wrapper {
  height: zrem(60);
  margin-bottom: zrem(10);
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
.create-wrap {
  height: calc(100% - zrem(45));
}
.footer {
  height: zrem(45);
}
.left {
  width: zrem(220);
  margin-right: zrem(8);
  padding: zrem(16) zrem(10);
}
.icons-con {
  display: flex;
  height: zrem(20);
  .icon-con {
    width: zrem(20);
    height: zrem(20);
    margin: 0 zrem(5);
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
