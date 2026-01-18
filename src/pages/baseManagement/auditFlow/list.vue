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
          placeholder="请输入部门名称"
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
                <el-form-item prop="name" label="名称">
                  <el-input v-model="searchData.title" placeholder="请输入名称">
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
                  </el-input>
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
                <template #deptId="scope"
                  >{{ departmentMap.get(scope.scope.row.deptId)?.name }}
                </template>
                <template #stockId="scope"
                  >{{ stockMap.get(scope.scope.row.stockId)?.name }}
                </template>
                <template #type="scope"
                  >{{ getTypeById(scope.scope.row.type)?.name }}
                </template>
                <template #enable="scope">
                  <el-switch
                    v-model="scope.scope.row.enable"
                    :inactive-value="0"
                    :active-value="1"
                    @change="changeStatus(scope.scope.row)"
                  />
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
        :deptId="String(currentNodeKey)"
        v-if="processFlag === 1"
      ></Create>
      <Step
        class="create-wrap"
        ref="stepRef"
        :data="currentData"
        :deptId="String(currentNodeKey)"
        v-if="currentData && processFlag === 2"
      ></Step>
      <el-card class="footer flex flex-justify-end flex-items-center">
        <el-button
          type="primary"
          @click="next"
          v-if="processFlag === 1"
          class="p-l-6 p-r-6 m-r-3"
          >下一步</el-button
        >
        <el-button
          type="primary"
          v-if="processFlag === 2"
          @click="prev"
          class="p-l-6 p-r-6 m-r-3"
          >上一步</el-button
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
  queryAuditFlowConditions,
  deleteAuditFlow,
  findAuditFlowPage,
  AuditFlow,
  editAuditFlow,
} from "../api/auditFlow";
import {
  getDepartmentList,
  Department,
} from "@pages/employeeManagement/api/department";
import { getStockListByIds } from "../api/stock";
import { indexMethod } from "@@/utils/page";
import { watchDebounced } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { ModuleCode } from "@/router/moduleCode";
import { usePermissionStore } from "@/pinia/stores/permission";
import { PermissionAction } from "@/pages/employeeManagement/api/permission";
import { Search } from "@element-plus/icons-vue";
import Create from "./create.vue";
import Step from "./step.vue";
const permissionStore = usePermissionStore();

const enableDelete = permissionStore.hasPermission(
  ModuleCode.AuditFlow,
  PermissionAction.Delete
);
const enableCreate = permissionStore.hasPermission(
  ModuleCode.AuditFlow,
  PermissionAction.Add
);
const enableEdit = permissionStore.hasPermission(
  ModuleCode.AuditFlow,
  PermissionAction.Edit
);
const treeRef = ref();
const typeOptions = ref([
  { id: 1, name: "入库" },
  { id: 2, name: "出库" },
  { id: 3, name: "领料" },
  { id: 4, name: "盘点" },
  { id: 5, name: "采购" },
]);
const getTypeById = (id: number) => {
  return typeOptions.value.find((item: any) => item.id === id);
};
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
  { prop: "title", label: "名称" },
  { prop: "stockId", label: "物料库" },
  { prop: "deptId", label: "部门" },
  { prop: "type", label: "类别" },
  { prop: "remark", label: "备注" },
  { prop: "enable", label: "启动" },
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
const currentData = ref<AuditFlow | null>(null);
const edit = (row: AuditFlow) => {
  currentData.value = row;
  processFlag.value = 1;
};
const createRef = ref();
const stepRef = ref();
const prev = () => {
  processFlag.value = 1;
};
const next = () => {
  currentData.value = null;
  createRef.value.confirmSave((data: AuditFlow) => {
    currentData.value = data;
    processFlag.value = 2;
  });
};
const back = () => {
  processFlag.value = 0;
  currentData.value = null;
  refreshTable();
};
const tableData = ref<AuditFlow[]>([]);

const searchFormRef = ref("searchFormRef");

const searchData = reactive<queryAuditFlowConditions>({
  title: "",
  deptId: currentNodeKey.value,
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
  const params: PaginatedRequest<queryAuditFlowConditions> = {
    currentPage: currentPage.value + 1,
    size: pageSize.value,
  };
  if (searchData.title) params.title = searchData.title;
  if (currentNodeKey.value) params.deptId = currentNodeKey.value;
  findAuditFlowPage(params)
    .then(async (res: any) => {
      const { total, list } = res.data;
      const stockIdIds = list.map((item: any) => item.stockId);
      if (stockIdIds.length) await getStockList(stockIdIds);
      totalItems.value = total;
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
  await deleteAuditFlow(id);
  ElMessage({
    type: "success",
    message: "删除成功",
  });
  refreshTable();
};
const departmentMap = new Map();
function buildDepartmentTree(departments: Department[]) {
  // 第一步：创建所有分类的映射并初始化children
  departments.forEach((dept: Department) => {
    departmentMap.set(dept.id, {
      ...dept,
      children: [],
    });
  });

  // 第二步：建立所有层级的父子关系
  departments.forEach((dept: Department) => {
    const current = departmentMap.get(dept.id);
    if (dept.parentId !== 0) {
      const parent = departmentMap.get(dept.parentId);
      if (parent) {
        parent.children.push(current);
      }
    }
  });

  // 第三步：收集顶级分类
  return departments
    .filter((dept: Department) => dept.parentId === 0)
    .map((dept: Department) => departmentMap.get(dept.id));
}
const queryDepartmentOptions = async () => {
  const res = await getDepartmentList();
  if ((res as any)?.data?.length) {
    rawParkData.value = (res as any)?.data || [];
    treeData.value = buildDepartmentTree((res as any)?.data || []);
  }
};

const stockMap = ref<Map<string, any>>(new Map());
const getStockList = async (ids: string[]) => {
  stockMap.value.clear();
  const res = await getStockListByIds(ids);
  (res as any).data.map((item: any) => {
    stockMap.value.set(item.id, item);
  });
};
const changeStatus = async (row: any) => {
  if (row.id) {
    await editAuditFlow(row);
    ElMessage({
      type: "success",
      message: "保存成功",
    });
    refreshTable();
  }
};
onMounted(async () => {
  await queryDepartmentOptions();
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
