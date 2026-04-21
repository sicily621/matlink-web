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
                <el-form-item label="名称" prop="name">
                  <el-input
                    v-model="searchData.name"
                    class="w-40"
                    placeholder="请输入名称"
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
                <el-form-item prop="status" label="盘点状态">
                  <el-select
                    v-model="searchData.status"
                    placeholder="请选择盘点状态"
                    @change="refreshTable()"
                    class="w-40"
                  >
                    <el-option
                      v-for="item in taskStatusListWithAll"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
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
                <template #type="scope">
                  <el-tag type="primary">
                    {{ getName(typeOptions, scope.scope.row.type) }}
                  </el-tag>
                </template>
                <template #status="scope">
                  <el-tag type="primary">
                    {{ getStatus(scope.scope.row.status, TaskStatusList) }}
                  </el-tag>
                </template>
                <template #auditStatus="scope">
                  <el-tag type="primary">
                    {{
                      getStatus(scope.scope.row.auditStatus, AuditStatusList)
                    }}
                  </el-tag>
                </template>
                <template #handleUserId="scope">
                  {{ userNameMap?.[scope.scope.row.handleUserId] ?? "-" }}
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
                <template #startTime="scope">
                  {{
                    scope.scope.row.startTime
                      ? new Date(scope.scope.row.startTime)
                          .toLocaleString()
                          .replace(/\//g, "-")
                      : "-"
                  }}
                </template>
                <template #endTime="scope">
                  {{
                    scope.scope.row.endTime
                      ? new Date(scope.scope.row.endTime)
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
                        enableApprove &&
                        scope.scope.row.hasAuditAuth &&
                        scope.scope.row.status == 2
                      "
                      :src="Approve"
                      :width="16"
                      class="fz16 m-r-5 cursor-pointer"
                      @click="toApprove(scope.scope.row)"
                    ></IconSvg>
                    <el-icon
                      class="fz16 m-r-5 cursor-pointer"
                      v-if="enableRead"
                      @click="showDetail(scope.scope.row)"
                    >
                      <View />
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
  queryTaskConditions,
  deleteTask,
  findTaskPage,
  Task,
  editTask,
  TaskStatusList,
  AuditStatusList,
  TaskStatus,
} from "@pages/taskManagement/api/task";
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
import Approve from "@pages/taskManagement/taskApprove/approve.svg";
import IconSvg from "@static/components/iconSvg/iconSvg.vue";
import Create from "./create.vue";

const permissionStore = usePermissionStore();
const enableCreate = permissionStore.hasPermission(
  ModuleCode.TaskApprove,
  PermissionAction.Add,
);
const enableEdit = permissionStore.hasPermission(
  ModuleCode.TaskApprove,
  PermissionAction.Edit,
);
const enableRead = permissionStore.hasPermission(
  ModuleCode.TaskApprove,
  PermissionAction.View,
);
const enableApprove = permissionStore.hasPermission(
  ModuleCode.TaskApprove,
  PermissionAction.Approve,
);
const userNameMap = ref<{ [key: string]: string }>({});
const auditStatusListWithAll = [{ id: -1, name: "全部" }, ...AuditStatusList];
const taskStatusListWithAll = [{ id: -1, name: "全部" }, ...TaskStatusList];
const typeOptions = ref([
  { id: 1, name: "全盘" },
  { id: 2, name: "部分" },
]);
const getName = (list: any[], targetId: string | number) => {
  return list.find((item: any) => item.id === targetId)?.name ?? "";
};
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

const loading = ref<boolean>(false);
const processFlag = ref(0); // 0列表 1新建 2编辑
const columns = ref([
  { prop: "index", label: "序号", width: "100", type: 1 },
  { prop: "name", label: "名称" },
  { prop: "type", label: "类别" },
  { prop: "stockId", label: "物料库" },
  { prop: "handleUserId", label: "责任人" },
  { prop: "status", label: "业务状态" },
  { prop: "auditStatus", label: "审核状态" },
  { prop: "startTime", label: "开始时间" },
  { prop: "endTime", label: "结束时间" },
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
const currentData = ref<Task | null>(null);

const createRef = ref();
const tableData = ref<Task[]>([]);

const searchFormRef = ref("searchFormRef");

const searchData = reactive<queryTaskConditions>({
  name: "",
  auditStatus: -1,
  status: -1,
  stockId: currentNodeKey.value,
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
  const params: PaginatedRequest<queryTaskConditions> = {
    currentPage: currentPage.value + 1,
    size: pageSize.value,
  };
  if (searchData.auditStatus > -1) params.auditStatus = searchData.auditStatus;
  if (searchData.status > -1) params.status = searchData.status;
  if (currentNodeKey.value) params.stockId = currentNodeKey.value;
  if (searchData.name.length > 0) params.name = searchData.name;
  findTaskPage(params)
    .then(async (res: any) => {
      const { total, list } = res.data;
      const stockIds = list.map((item: any) => item.stockId);
      if (stockIds.length) await getStockListByIds(stockIds);
      totalItems.value = total;
      const userIds: string[] = [];
      list?.forEach((event: any) => {
        userIds.push(event.handleUserId);
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
  await deleteTask(id);
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
  ElMessageBox.confirm("确定要废弃吗？", "盘点任务", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const params: any = { ...row, status: 2 };
      delete params["files"];
      const res: any = await editTask(params);
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
    currentNodeKey.value = treeData.value[0].id;
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
  refreshTable();
};
const toApprove = (row: any) => {
  onlyView.value = false;
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
