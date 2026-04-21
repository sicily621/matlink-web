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
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="编码" prop="code">
                  <el-input
                    v-model="searchData.code"
                    class="w-40"
                    placeholder="请输入编码"
                    maxlength="32"
                    required
                  >
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                  <el-input
                    v-model="searchData.brand"
                    class="w-40"
                    placeholder="请输入品牌"
                    maxlength="32"
                    required
                  >
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
                  </el-input>
                </el-form-item>
                <!-- <el-form-item prop="warningInventory" label="预警库存">
                  <el-select
                    v-model="searchData.warningInventory"
                    placeholder="请选择预警库存"
                    @change="refreshTable()"
                    class="w-40"
                  >
                    <el-option
                      v-for="item in warningInventoryOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item> -->
              </el-form>
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
                <template #materialTypeId="scope"
                  >{{ categoryMap.get(scope.scope.row.materialTypeId)?.name }}
                </template>
                <template #unit="scope"
                  >{{ unitMap.get(scope.scope.row.unit)?.cnname }}
                </template>
                <template #type="scope">
                  <el-tag type="primary">
                    {{ getName(typeOptions, scope.scope.row.type) }}
                  </el-tag>
                </template>
                <template #costPrice="scope">
                  <el-tag>￥{{ scope.scope.row.costPrice }}</el-tag>
                </template>
                <template #totalCostPrice="scope">
                  <el-tag>￥{{ scope.scope.row.totalCostPrice }}</el-tag>
                </template>
                <template #count="scope">
                  <div class="w-25">
                    <el-badge
                      value="紧急缺货"
                      v-if="
                        scope.scope.row.count <= scope.scope.row.minCountLimit
                      "
                    >
                      <el-tag type="danger">
                        {{ scope.scope.row.count }}
                      </el-tag>
                    </el-badge>
                    <el-badge
                      value="缺货"
                      v-else-if="
                        scope.scope.row.count > scope.scope.row.minCountLimit &&
                        scope.scope.row.count < scope.scope.row.safeCountLimit
                      "
                    >
                      <el-tag type="danger">
                        {{ scope.scope.row.count }}
                      </el-tag>
                    </el-badge>
                    <el-badge
                      value="积压"
                      v-else-if="
                        scope.scope.row.count >
                          scope.scope.row.safeCountLimit &&
                        scope.scope.row.count < scope.scope.row.maxCountLimit
                      "
                    >
                      <el-tag type="danger">
                        {{ scope.scope.row.count }}
                      </el-tag>
                    </el-badge>
                    <el-badge
                      value="严重积压"
                      v-else-if="
                        scope.scope.row.count >= scope.scope.row.maxCountLimit
                      "
                    >
                      <el-tag type="danger">
                        {{ scope.scope.row.count }}
                      </el-tag>
                    </el-badge>
                    <el-tag type="primary" v-else>
                      {{ scope.scope.row.count }}
                    </el-tag>
                  </div>
                </template>
                <template #operate="scope">
                  <!--  v-if="enableRead" -->
                  <div class="flex">
                    <el-icon
                      class="fz16 m-r-5 cursor-pointer"
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
      <Detail
        ref="createRef"
        :stockId="String(currentNodeKey)"
        :materialId="String(currentData?.materialId)"
        :back="back"
      ></Detail>
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
  getStockListByIds,
  Stock,
  getStockList,
} from "@pages/baseManagement/api/stock";
import {
  queryInventoryConditions,
  findInventoryPage,
  warningInventoryList,
  Inventory,
} from "@pages/inventoryManagement/api/stockDetail";
import { indexMethod } from "@@/utils/page";
import { watchDebounced } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { ModuleCode } from "@/router/moduleCode";
import { usePermissionStore } from "@/pinia/stores/permission";
import { PermissionAction } from "@/pages/employeeManagement/api/permission";
import { getEmployeeListByIds } from "@/pages/employeeManagement/api/employee";
import { getCategoryListByIds } from "@pages/baseManagement/api/category";
import { getUnitListByIds } from "@pages/baseManagement/api/unit";
import Detail from "./detail.vue";
import { Search } from "@element-plus/icons-vue";
import { findMaterialListByIds } from "@pages/baseManagement/api/material";

const permissionStore = usePermissionStore();
const enableEdit = permissionStore.hasPermission(
  ModuleCode.Inventory,
  PermissionAction.Edit,
);
const enableRead = permissionStore.hasPermission(
  ModuleCode.Inventory,
  PermissionAction.View,
);
const userNameMap = ref<{ [key: string]: string }>({});
const warningInventoryOptions = [
  { id: 0, name: "全部" },
  ...warningInventoryList,
];
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
  { prop: "code", label: "编码" },
  { prop: "name", label: "名称" },
  { prop: "materialTypeId", label: "类别" },
  { prop: "brand", label: "品牌" },
  { prop: "modelNo", label: "型号" },
  { prop: "specification", label: "规格" },
  { prop: "count", label: "库存数量" },
  // { prop: "useCount", label: "可用数量" },
  { prop: "minCountLimit", label: "最低库存" },
  { prop: "safeCountLimit", label: "安全库存" },
  { prop: "maxCountLimit", label: "最高库存" },
  { prop: "unit", label: "单位" },
  { prop: "costPrice", label: "成本单价" },
  { prop: "totalCostPrice", label: "成本总价" },
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
const currentData = ref<Inventory | null>(null);

const createRef = ref();
const tableData = ref<Inventory[]>([]);

const searchFormRef = ref("searchFormRef");

const searchData = reactive<queryInventoryConditions>({
  name: "",
  code: "",
  brand: "",
  stockId: currentNodeKey.value,
  materialTypeId: "",
});

watchDebounced(
  searchData,
  () => {
    refreshTable();
  },
  { debounce: 500, maxWait: 1000 },
);
const materialIds = ref<string[]>([]);
const materialMap = ref<Map<string, any>>(new Map());
const queryCategoryList = async (ids: string[]) => {
  const res = await getCategoryListByIds(ids);
  (res as any).data.map((item: any) => {
    categoryMap.value.set(item.id, item);
  });
};
const categoryMap = ref<Map<string, any>>(new Map());
const unitMap = ref<Map<string, any>>(new Map());
const getUnitList = async (ids: string[]) => {
  unitMap.value.clear();
  const res = await getUnitListByIds(ids);
  (res as any).data.map((item: any) => {
    unitMap.value.set(item.id, item);
  });
};
function refreshTable() {
  loading.value = true;
  const params: PaginatedRequest<queryInventoryConditions> = {
    currentPage: currentPage.value + 1,
    size: pageSize.value,
  };
  if (searchData.code.length) params.code = searchData.code;
  if (searchData.brand.length) params.brand = searchData.brand;
  if (searchData.name.length) params.name = searchData.name;
  if (currentNodeKey.value) params.stockId = currentNodeKey.value;
  findInventoryPage(params)
    .then(async (res: any) => {
      const { total, list } = res.data;
      const stockIds = list.map((item: any) => item.stockId);
      if (stockIds.length) await getStockListByIds(stockIds);
      totalItems.value = total;
      materialIds.value = list.map((item: any) => item.materialId);
      if (materialIds.value.length > 0) {
        const materialRes: any = await findMaterialListByIds(
          materialIds.value.join(","),
        );
        materialMap.value.clear();
        materialRes.data.map((item: any) => {
          materialMap.value.set(item.id, item);
        });
        const categoryIds = list.map((item: any) => item.materialTypeId);
        if (categoryIds.length) await queryCategoryList(categoryIds);
        const unitIds = materialRes.data.map((item: any) => item.unit);
        if (unitIds.length) await getUnitList(unitIds);
      }
      tableData.value = list
        .map((item: any) => {
          const material = materialMap.value.get(item.materialId);
          const result = { ...material, ...item };
          return result;
        })
        .filter((item: any) => {
          const result = [true, true, true];
          if (searchData.code.length)
            result[0] = String(item.code).includes(searchData.code);
          if (searchData.brand.length)
            result[1] = String(item.brand).includes(searchData.brand);
          if (searchData.name.length)
            result[2] = String(item.name).includes(searchData.name);
          return result[0] && result[1] && result[2];
        });
    })
    .catch(() => {
      tableData.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
}
const showDetail = (row: any) => {
  onlyView.value = true;
  currentData.value = row;
  processFlag.value = 1;
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
  refreshTable();
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
