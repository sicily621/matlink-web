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
                <el-form-item prop="status" label="入库状态">
                  <el-select
                    v-model="searchData.status"
                    placeholder="请选择入库状态"
                    @change="refreshTable()"
                    class="w-40"
                  >
                    <el-option
                      v-for="item in inStockStatusListWithAll"
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
                    {{ getStatus(scope.scope.row.status, InStockStatusList) }}
                  </el-tag>
                </template>
                <template #auditStatus="scope">
                  <el-tag type="primary">
                    {{
                      getStatus(scope.scope.row.auditStatus, AuditStatusList)
                    }}
                  </el-tag>
                </template>
                <template #inStockUserId="scope">
                  {{ userNameMap?.[scope.scope.row.inStockUserId] ?? "-" }}
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
                <template #inStockTime="scope">
                  {{
                    scope.scope.row.inStockTime
                      ? new Date(scope.scope.row.inStockTime)
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
                    <el-icon
                      class="fz16 pointer m-r-5 cursor-pointer"
                      text
                      v-if="enableEdit"
                      @click="edit(scope.scope.row)"
                    >
                      <Edit />
                    </el-icon>
                    <el-icon
                      class="fz16 cursor-pointer"
                      text
                      v-if="enableDelete"
                      @click="remove(scope.scope.row.id)"
                    >
                      <Delete />
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
  queryInStockConditions,
  deleteInStock,
  findInStockPage,
  InStock,
  editInStock,
  InStockStatusList,
  AuditStatusList,
} from "@pages/stockInManagement/api/inStock";
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
import Create from "./create.vue";

const permissionStore = usePermissionStore();

const enableDelete = permissionStore.hasPermission(
  ModuleCode.InStock,
  PermissionAction.Delete
);
const enableCreate = permissionStore.hasPermission(
  ModuleCode.InStock,
  PermissionAction.Add
);
const enableEdit = permissionStore.hasPermission(
  ModuleCode.InStock,
  PermissionAction.Edit
);
const userNameMap = ref<{ [key: string]: string }>({});
const auditStatusListWithAll = [{ id: -1, name: "全部" }, ...AuditStatusList];
const inStockStatusListWithAll = [
  { id: -1, name: "全部" },
  ...InStockStatusList,
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
  { prop: "inStockNo", label: "入库单号" },
  { prop: "status", label: "业务状态" },
  { prop: "auditStatus", label: "审核状态" },
  { prop: "inStockAmount", label: "入库金额" },
  { prop: "inStockUserId", label: "入库人" },
  { prop: "auditUserId", label: "审核人" },
  { prop: "createUserId", label: "创建人" },
  { prop: "createTime", label: "创建时间" },
  { prop: "auditTime", label: "审核时间" },
  { prop: "inStockTime", label: "入库时间" },
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
const currentData = ref<InStock | null>(null);

const createRef = ref();
const tableData = ref<InStock[]>([]);

const searchFormRef = ref("searchFormRef");

const searchData = reactive<queryInStockConditions>({
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
  { debounce: 500, maxWait: 1000 }
);
function refreshTable() {
  loading.value = true;
  const params: PaginatedRequest<queryInStockConditions> = {
    currentPage: currentPage.value + 1,
    size: pageSize.value,
  };
  if (searchData.auditStatus > -1) params.auditStatus = searchData.auditStatus;
  if (searchData.status > -1) params.status = searchData.status;
  if (currentNodeKey.value) params.stockId = currentNodeKey.value;
  if (time.value?.[0] && time.value?.[1]) {
    params.startTime = `${time.value?.[0]} 00:00:00`;
    params.endTime = `${time.value?.[1]} 23:59:59`;
  }
  findInStockPage(params)
    .then(async (res: any) => {
      const { total, list } = res.data;
      const resourceIdIds = list.map((item: any) => item.resourceId);
      if (resourceIdIds.length) await getStockListByIds(resourceIdIds);
      totalItems.value = total;
      const userIds: string[] = [];
      list?.forEach((event: any) => {
        userIds.push(event.inStockUserId);
        userIds.push(event.auditUserId);
        userIds.push(event.createUserId);
      });
      const newUserArr = Array.from(new Set(userIds));
      if (newUserArr.length) {
        const employeeRes: any = await getEmployeeListByIds(newUserArr);
        userNameMap.value = employeeRes.data;
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
  await deleteInStock(id);
  ElMessage({
    type: "success",
    message: "删除成功",
  });
  refreshTable();
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
  refreshTable();
};
const edit = (row: any) => {
  onlyView.value = false;
  currentData.value = row;
  processFlag.value = 1;
};
const showDetail = (row: any) => {
  onlyView.value = true;
  currentData.value = row;
  processFlag.value = 1;
};

onMounted(async () => {
  await queryStock();
  refreshTable();
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
