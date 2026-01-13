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
          placeholder="请输入名称"
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
                  <el-input v-model="searchData.name" placeholder="请输入名称">
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code" label="编码">
                  <el-input v-model="searchData.code" placeholder="请输入编码">
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="brand" label="品牌">
                  <el-input v-model="searchData.brand" placeholder="请输入品牌">
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="specification" label="规格">
                  <el-input
                    v-model="searchData.specification"
                    placeholder="请输入规格"
                  >
                    <template #append> <el-button :icon="Search" /> </template
                  ></el-input>
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
                <template #type="scope"> </template>
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
      <Create class="create-wrap" ref="createRef" :data="currentData"></Create>
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
import tree from "@@/components/tree/tree.vue";
import baseTable from "@@/components/baseTable/baseTable.vue";
import pagination from "@@/components/pagination/pagination.vue";
import type { PaginatedRequest } from "@@/apis/tables/type";
import {
  queryMaterialConditions,
  deleteMaterial,
  findMaterialPage,
  editMaterial,
  createMaterial,
  Material,
} from "../api/material";
import { getCategoryList, Category } from "../api/category";
import { indexMethod } from "@@/utils/page";
import { watchDebounced } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { ModuleCode } from "@/router/moduleCode";
import { usePermissionStore } from "@/pinia/stores/permission";
import { PermissionAction } from "@/pages/employeeManagement/api/permission";
import { Search } from "@element-plus/icons-vue";
import Create from "./create.vue";
const permissionStore = usePermissionStore();

const enableDelete = permissionStore.hasPermission(
  ModuleCode.Material,
  PermissionAction.Delete
);
const enableCreate = permissionStore.hasPermission(
  ModuleCode.Material,
  PermissionAction.Add
);
const enableEdit = permissionStore.hasPermission(
  ModuleCode.Material,
  PermissionAction.Edit
);
const treeRef = ref();

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
  { prop: "simpleName", label: "简称" },
  { prop: "code", label: "编码" },
  { prop: "tradeTypeName", label: "类别" },
  { prop: "brand", label: "品牌" },
  { prop: "modelNo", label: "型号" },
  { prop: "specification", label: "规格" },
  { prop: "safeCountLimit", label: "安全数量" },
  { prop: "minCountLimit", label: "最低库存" },
  { prop: "unitName", label: "单位名称" },
  { prop: "imageUrls", label: "图片" },
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
const currentData = ref<Material | null>(null);
const edit = (row: Material) => {
  currentData.value = row;
  processFlag.value = 1;
};
const createRef = ref();
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
const tableData = ref<Material[]>([]);

const searchFormRef = ref("searchFormRef");

const searchData = reactive<queryMaterialConditions>({
  code: "",
  name: "",
  brand: "",
  specification: "",
  tradeTypeId: currentNodeKey.value,
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
  const params: PaginatedRequest<queryMaterialConditions> = {
    currentPage: currentPage.value + 1,
    size: pageSize.value,
  };
  if (searchData.code) params.code = searchData.code;
  if (searchData.name) params.name = searchData.name;
  if (searchData.brand) params.brand = searchData.brand;
  if (searchData.specification) params.specification = searchData.specification;
  if (currentNodeKey.value) params.tradeTypeId = currentNodeKey.value;
  findMaterialPage(params)
    .then((res: any) => {
      const { total, list } = res.data;
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
  await deleteMaterial(id);
  ElMessage({
    type: "success",
    message: "删除成功",
  });
  refreshTable();
};
const categoryMap = new Map();
function buildCategoryTree(categorys: Category[], parentId: number = 0) {
  // 第一步：创建所有分类的映射并初始化children
  categorys.forEach((dept: Category) => {
    categoryMap.set(dept.id, {
      ...dept,
      children: [],
    });
  });

  // 第二步：建立所有层级的父子关系
  categorys.forEach((dept: Category) => {
    const current = categoryMap.get(dept.id);
    if (dept.parentId !== 0) {
      const parent = categoryMap.get(dept.parentId);
      if (parent) {
        parent.children.push(current);
      }
    }
  });

  // 第三步：收集顶级分类
  return categorys
    .filter((dept: Category) => dept.parentId === 0)
    .map((dept: Category) => categoryMap.get(dept.id));
}
const queryCategoryOptions = async () => {
  const res = await getCategoryList();
  if ((res as any)?.data?.length) {
    rawParkData.value = (res as any)?.data || [];
    treeData.value = buildCategoryTree((res as any)?.data || []);
  }
};

onMounted(async () => {
  await queryCategoryOptions();
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
</style>
