<template>
  <div class="app-container flex flex-col h-full">
    <div class="h-full w-full flex flex-col" v-if="!processFlag">
      <el-card v-loading="loading" shadow="never" class="search-wrapper">
        <div class="flex justify-between">
          <div class="zc-header-title">
            <div class="zc-header-icon"></div>
            <div class="zc-header-word">物料库</div>
          </div>
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
          <el-table
            :data="tableData"
            row-key="id"
            default-expand-all
            highlight-current-row
            stripe
            class="text-align-center"
          >
            <el-table-column width="80" type="index" label="序号" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="typeId" label="类型">
              <template #default="scope">
                <span>{{
                  stockTypeMap.get(scope.row.typeId) || "未设置类型"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="operate" label="操作" width="150">
              <template #default="scope">
                <div class="flex">
                  <el-icon
                    class="fz16 pointer m-r-5 cursor-pointer"
                    text
                    @click="edit(scope.row)"
                    v-if="enableEdit"
                  >
                    <Edit />
                  </el-icon>
                  <el-icon
                    class="fz16 pointer m-r-5 cursor-pointer"
                    text
                    v-if="enableCreate"
                    @click="addSubStock(scope.row)"
                  >
                    <Plus />
                  </el-icon>
                  <el-icon
                    class="fz16 cursor-pointer"
                    text
                    @click="remove(scope.row.id)"
                    v-if="!hasChildren(scope.row) && enableDelete"
                  >
                    <Delete />
                  </el-icon>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="h-full w-full flex flex-col" v-if="processFlag">
      <Create
        class="create-wrap"
        :parent-id="parentId"
        ref="createRef"
        :data="currentData"
      ></Create>
      <el-card class="footer flex flex-justify-end flex-items-center">
        <el-button type="primary" @click="save" class="p-l-6 p-r-6 m-r-3"
          >保存</el-button
        >
        <el-button @click="back" class="p-l-6 p-r-6">返回</el-button>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import {
  Stock,
  getStockList,
  deleteStock,
  createStock,
  editStock,
} from "../api/stock";
import { getStockTypeListByIds } from "../api/stockType";
import { ElMessage } from "element-plus";
import { ModuleCode } from "@/router/moduleCode";
import { usePermissionStore } from "@/pinia/stores/permission";
import { PermissionAction } from "@/pages/employeeManagement/api/permission";
import Create from "./create.vue";
const permissionStore = usePermissionStore();

const enableDelete = permissionStore.hasPermission(
  ModuleCode.Stock,
  PermissionAction.Delete
);
const enableCreate = permissionStore.hasPermission(
  ModuleCode.Stock,
  PermissionAction.Add
);
const enableEdit = permissionStore.hasPermission(
  ModuleCode.Stock,
  PermissionAction.Edit
);
const dialogFormVisible = ref(false);
const form = reactive({
  name: "",
});
const createRef = ref();
const processFlag = ref(0); // 0列表 1新建 2编辑
const loading = ref<boolean>(false);
const formRef = ref();
const currentData = ref<Stock | null>(null);
const parentId = ref("0");
const isEdit = ref(false);
const tableData = ref<Stock[]>([]);
const stockTypeMap = ref<Map<string, string>>(new Map());
const getStockTypeList = async (ids: number[]) => {
  const res = await getStockTypeListByIds(ids);
  (res as any)?.data?.forEach((item: any) => {
    stockTypeMap.value.set(item.id, item.name);
  });
};
function refreshTable() {
  loading.value = true;
  getStockList()
    .then(async (res: any) => {
      const { data } = res;
      const typeIds: number[] = Array.from(
        new Set(
          data.map((item: Stock) => item.typeId).filter((id: number) => id)
        )
      );
      if (typeIds.length > 0) await getStockTypeList(typeIds);
      if (data.length > 0) tableData.value = buildStockTree(data);
    })
    .catch(() => {
      tableData.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
}
const create = () => {
  parentId.value = "0";
  processFlag.value = 1;
};
const save = () => {
  currentData.value = null;
  createRef.value.confirmSave(() => {
    back();
  });
};
const back = () => {
  processFlag.value = 0;
  currentData.value = null;
  refreshTable();
};

const remove = async (id: string) => {
  await deleteStock(id);
  ElMessage({
    type: "success",
    message: "删除成功",
  });
  refreshTable();
};
const stockMap = new Map();
const hasChildren = (row: Stock) => {
  return stockMap.get(row?.id)?.children.length > 0;
};
function buildStockTree(stocks: Stock[]) {
  // 第一步：创建所有分类的映射并初始化children
  stocks.forEach((dept: Stock, i: number) => {
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

const addSubStock = (row: Stock) => {
  parentId.value = String(row.id);
  processFlag.value = 1;
};
const edit = (row: Stock) => {
  isEdit.value = true;
  currentData.value = { ...row };
  processFlag.value = 1;
};
onMounted(async () => {
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
</style>
