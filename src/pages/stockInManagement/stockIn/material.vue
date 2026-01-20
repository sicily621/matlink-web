<template>
  <div class="w-full flex h-full">
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
                class="flex-1"
                :inline="true"
                :model="searchData"
              >
                <el-form-item prop="name" label="名称">
                  <el-input
                    v-model="searchData.name"
                    class="w-50"
                    placeholder="请输入名称"
                  >
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code" label="编码">
                  <el-input
                    v-model="searchData.code"
                    class="w-50"
                    placeholder="请输入编码"
                  >
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="brand" label="品牌">
                  <el-input
                    v-model="searchData.brand"
                    class="w-50"
                    placeholder="请输入品牌"
                  >
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="specification" label="规格">
                  <el-input
                    v-model="searchData.specification"
                    class="w-50"
                    placeholder="请输入规格"
                  >
                    <template #append> <el-button :icon="Search" /> </template
                  ></el-input>
                </el-form-item>
              </el-form>
              <el-button type="primary" @click="confirmSave">保存</el-button>
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
                @select="select"
                @selectAll="selectAll"
                :checkboxFlag="true"
                class="h-full"
              >
                <template #materialTypeId="scope"
                  >{{ categoryMap.get(scope.scope.row.materialTypeId)?.name }}
                </template>
                <template #unit="scope"
                  >{{ unitMap.get(scope.scope.row.unit)?.cnname }}
                </template>
                <template #imageUrls="scope">
                  <div class="icons-con">
                    <div
                      class="icon-con"
                      v-for="url in scope.scope.row.imageUrls"
                    >
                      <img :src="`/static${url}`" />
                    </div>
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
  Material,
} from "@pages/baseManagement/api/material";
import { getCategoryList, Category } from "@pages/baseManagement/api/category";
import { getUnitListByIds } from "@pages/baseManagement/api/unit";
import { indexMethod } from "@@/utils/page";
import { watchDebounced } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { ModuleCode } from "@/router/moduleCode";
import { usePermissionStore } from "@/pinia/stores/permission";
import { PermissionAction } from "@/pages/employeeManagement/api/permission";
import { Search } from "@element-plus/icons-vue";
const props = defineProps<{ materialIds: any[] }>();
const emits = defineEmits(["save"]);
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
  { prop: "materialTypeId", label: "类别" },
  { prop: "brand", label: "品牌" },
  { prop: "modelNo", label: "型号" },
  { prop: "specification", label: "规格" },
  { prop: "safeCountLimit", label: "安全数量" },
  { prop: "minCountLimit", label: "最低库存" },
  { prop: "unit", label: "单位" },
  { prop: "imageUrls", label: "图片" },
]);
//分页
const pageSize = ref(10);
const currentPage = ref(0);
const totalItems = ref(0);
const pageChange = (page: any) => {
  currentPage.value = page - 1;
  refreshTable();
};
const checkedIds = ref<any[]>([]);
if (props.materialIds && props.materialIds.length) {
  checkedIds.value = props.materialIds;
}

const select = (selection: any, row: any) => {
  const checked = selection.find((item: any) => {
    return item.id === row.id;
  });
  if (checked) {
    checkedIds.value = [...new Set([...checkedIds.value, row.id])];
  } else {
    checkedIds.value = checkedIds.value.filter((id: any) => id !== row.id);
  }
};

const selectAll = (selection: any) => {
  const allIds = tableData.value.map((item: any) => item.id);
  if (selection.length) {
    checkedIds.value = [...new Set([...checkedIds.value, ...allIds])];
  } else {
    checkedIds.value = checkedIds.value.filter(
      (id: any) => !allIds.includes(id)
    );
  }
};
const confirmSave = () => {
  emits("save", checkedIds.value);
};
const currentData = ref<Material | null>(null);

const tableData = ref<Material[]>([]);

const searchFormRef = ref("searchFormRef");

const searchData = reactive<queryMaterialConditions>({
  code: "",
  name: "",
  brand: "",
  specification: "",
  materialTypeId: currentNodeKey.value,
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
  if (currentNodeKey.value) params.materialTypeId = currentNodeKey.value;
  findMaterialPage(params)
    .then(async (res: any) => {
      const { total, list } = res.data;
      const unitIds = list.map((item: any) => item.unit);
      if (unitIds.length) await getUnitList(unitIds);
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

const unitMap = ref<Map<string, any>>(new Map());
const getUnitList = async (ids: string[]) => {
  unitMap.value.clear();
  const res = await getUnitListByIds(ids);
  (res as any).data.map((item: any) => {
    unitMap.value.set(item.id, item);
  });
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
