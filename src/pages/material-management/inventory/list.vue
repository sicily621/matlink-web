<template>
  <div class="d-flex h-full w-full flex-column">
    <div class="flex-1 d-flex h-full w-full" v-if="!processFlag">
      <div class="flex-1 flex-column h-full">
        <div
          class="zc-header d-flex align-items-center justify-content-between"
        >
          <div class="d-flex flex-1 align-items-center justify-content-between">
            <div>
              <template v-if="Array.isArray(projects)">
                <span class="m-r-8">{{ i18nM("material.label.project") }}</span>
                <el-select
                  class="select-item"
                  v-model="projectId"
                  :placeholder="i18nM('material.placeholder.selectProject')"
                  @change="projectChange()"
                >
                  <el-option
                    v-for="item of projects"
                    :key="item.projectId"
                    :value="item.projectId"
                    :label="projectMap[item.projectId]"
                  ></el-option>
                </el-select>
              </template>
              <span class="m-r-8 m-l-16">{{
                i18nM("material.label.name")
              }}</span>
              <el-input
                v-model="title"
                :placeholder="i18nM('material.placeholder.name')"
                class="w-200"
                @input="nameInputFunc"
              >
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <span class="m-r-8 m-l-10">{{
                i18nM("material.label.code")
              }}</span>
              <el-input
                v-model="code"
                :placeholder="i18nM('material.placeholder.inputCode')"
                class="w-200"
                @input="codeInputFunc"
              >
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <span class="m-r-8 m-l-10">{{
                i18nM("material.label.brand")
              }}</span>
              <el-input
                v-model="brand"
                :placeholder="i18nM('material.placeholder.inputBrand')"
                class="w-200"
                @input="brandInputFunc"
              >
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <!-- <span class="m-r-8 m-l-10">{{
                i18nM("material.label.specifications")
              }}</span> -->
              <!-- <el-input
                v-model="specification"
                :placeholder="i18nM('material.placeholder.inputSpecifications')"
                class="w-200"
                @input="specificationInputFunc"
              >
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input> -->
              <!-- <span class="m-r-8 m-l-16">{{
                i18nM("material.label.inventory")
              }}</span>
              <el-select
                class="select-item"
                v-model="inventory"
                :placeholder="i18nM('material.placeholder.selectInventory')"
                @change="inventoryChange($event)"
              >
                <el-option
                  v-for="item of inventoryOptions"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select> -->
              <span class="m-r-8 m-l-16">{{
                i18nM("material.label.warningInventory")
              }}</span>
              <el-select
                class="select-item"
                v-model="warningInventory"
                :placeholder="
                  i18nM('material.placeholder.selectWarningInventory')
                "
                @change="inventoryChange($event)"
              >
                <el-option
                  v-for="item of warningInventoryOptions"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-option>
              </el-select>
            </div>
            <div></div>
          </div>
        </div>
        <div class="flex-1 d-flex content-wrap w-full">
          <div class="left h-full">
            <div class="flex1 flex-column h-full">
              <div class="flex-1" style="height: 50%">
                <tree
                  :data="enterTreeData"
                  ref="enterTreeRef"
                  :expandedKeys="materialStockExpandedKeys"
                  :currentNodeKey="materialStockCurrentNodeKey"
                  @changeNode="stockChange($event)"
                  @changeFilter="enterFilter($event)"
                  :placeholder="
                    i18nM('material.placeholder.inputClassificationName')
                  "
                >
                </tree>
              </div>
              <div class="flex-1" style="height: 50%">
                <tree
                  :data="materialsClassificationTreeData"
                  :expandedKeys="materialsClassificationmentExpandedKeys"
                  :currentNodeKey="materialsClassificationmentCurrentNodeKey"
                  ref="materialsClassificationTreeRef"
                  @changeNode="dpChange($event)"
                  m
                  @changeFilter="dpFilter($event)"
                  :placeholder="
                    i18nM('material.placeholder.inputClassificationName')
                  "
                >
                </tree>
              </div>
            </div>
          </div>
          <div class="right flex-1 flex-column h-full">
            <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
              <div ref="tableRef" class="flex-1 table-wrap">
                <baseTable
                  :columns="columns"
                  :table-data="tableData"
                  :indexMethod="indexMethod(currentPage, pageSize)"
                >
                  <template #stockTime="scope">
                    {{
                      scope.scope.row.stockTime
                        ? new Date(scope.scope.row.stockTime)
                            .toLocaleDateString()
                            .replace(/\//g, "-")
                        : "-"
                    }}
                  </template>
                  <template #operate="scope">
                    <el-icon
                      class="fz20 m-r-20 pointer"
                      @click="showDetail(scope.scope.row)"
                      v-if="hasPermission(PermissionType.Read, permissions)"
                    >
                      <View />
                    </el-icon>
                  </template>
                </baseTable>
              </div>
              <div
                class="zc-footer d-flex align-items-center justify-content-end"
                v-if="totalItems > 0"
              >
                <pagination
                  :page-size="pageSize"
                  :current-page="currentPage + 1"
                  :total="totalItems"
                  @pageChange="pageChange($event)"
                  @sizeChange="sizeChange($event)"
                  class="zc-page"
                ></pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex-1 flex-column h-full table-wrap"
      :class="{ 'fill-bg': processFlag != 2 }"
      v-if="processFlag"
    >
      <Detail
        ref="detailRef"
        :data="currentData"
        :projectId="projectId"
        v-if="processFlag === 2 && currentData?.id"
        @back="back"
      >
      </Detail>
    </div>
  </div>
</template>
<script setup lang="ts">
import AddIcon from "@static/images/add.png";
import useMenuStore from "@static/js/store/menu";
import tree, { TreeNode } from "@static/elementUI/tree/tree.vue";
import { ref, computed, onMounted } from "vue";
import { indexMethod } from "@static/js/common/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { ComponentPropsType } from "@static/js/page/props";
import baseTable from "@static/table/baseTable/baseTable.vue";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { getPageSizeCount, getPageCount } from "@static/js/page/utils";
import { PermissionType, hasPermission } from "@static/js/page/permission";
import { getNameMapByIds } from "@functions/serviceCenter/tenant-management/api/projects";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { findTree } from "@functions/serviceCenter/material-management/api/classCatalog";
import { materialStockDetailFindPage } from "@functions/serviceCenter/material-management/api/materialStockDetail";

import { Search } from "@element-plus/icons-vue";

import Detail from "@functions/serviceCenter/material-management/inventory/detail.vue";
const i18nM = window.$i18nM;
const tableRef = ref();
const detailRef = ref();
const title = ref("");
const code = ref("");
const brand = ref("");
const specification = ref("");
const inventory = ref(2);
const warningInventory = ref(0);

const createRef = ref();
const processFlag = ref(0);
const menuStore = useMenuStore();
const props = defineProps<ComponentPropsType>();
const permissions = computed(() =>
  menuStore.getComponentPermissions(props.configData?.operateTypes)
);

const enterTreeData = ref<any>([]);
/**
 * 物料分类左侧树形列表
 */
const materialsClassificationTreeData = ref<TreeNode[]>([]);
//物料库搜索
let materialStockSearch = "";
import { nameToLabel } from "@static/js/page/data";

//默认展开物料库
const materialStockExpandedKeys = ref<Array<number | string>>([0]);
//当前选中物料库
const materialStockCurrentNodeKey = ref<any>(0);
//默认展开物料分类
const materialsClassificationmentExpandedKeys = ref<Array<number | string>>([
  0,
]);
//当前选中物料分类
const materialsClassificationmentCurrentNodeKey = ref<any>(0);
//左侧物料分类搜索条件
let materialsClassificationmentLeftSearch = "";
const enterTreeRef = ref(); //左侧物料库树dom
const materialsClassificationTreeRef = ref(); //左侧物料分类树dom
import {
  getMaterialStockTreeByCurUserId,
  materialsClassificationmentsGetDeptTreeByCurUserId,
} from "@functions/serviceCenter/common-base/api/user";
const currentData = ref<any>(null);
const addDataFlag = ref(false);
const tableData = ref([]);
const treeRef = ref();
const treeData = ref<TreeNode[]>([]);
const defaultProps = {
  children: "children",
  label: "name",
};
const userNameMap = ref<{ [key: string]: string }>({});
let codeTimer: any = null;

let brandTimer: any = null;
let specificationTimer: any = null;
const inventoryOptions = computed(() => {
  return [
    { id: 2, name: i18nM("material.enumValue.all") },
    {
      id: 1,
      name: i18nM("material.enumValue.greaterThanZero"),
    },
    { id: 0, name: i18nM("material.enumValue.equalToZore") },
  ];
});
const warningInventoryOptions = computed(() => {
  return [
    { id: 3, name: i18nM("material.enumValue.higherThanMaximumInventory") },

    { id: 2, name: i18nM("material.enumValue.lowerThanSafetyInventory") },
    {
      id: 1,
      name: i18nM("material.enumValue.belowMinimumStock"),
    },
    { id: 0, name: i18nM("material.enumValue.all") },
  ];
});

const status = ref(-1);
const expandedKeys = ref<Array<number | string>>([0]);
const currentNodeKey = ref<any>(0);
const projects = ref(window.$HyGlobal.getCurrentProject()?.projects);
const projectId = ref(
  window.$HyGlobal.getCurrentProject()?.projects?.[0]?.projectId || 0
);
const projectMap = ref<any>({});
const stockIdId = ref();
const tradeTypeId = ref();
let nameTimer: any = null;

//分页
const pageSize = ref(10);
const currentPage = ref(0);
const totalItems = ref(0);
const inventoryChange = (e: any) => {
  inventory.value = e;
  refreshTable();
};
// 递归tree修改树结构
let changeTree = (arr: any) => {
  let brr = arr.map((item: any) => {
    return {
      ...item,
      value: item.id, // id
      label: item.name, // 展示的名称
      children: item.subList ? changeTree(item.subList) : [],
    };
  });
  return brr;
};
/**
 * 更改物料分类数据闭包事件
 * @param data
 */
let dpChangeFunc = (data: any) => {
  materialsClassificationTreeData.value = data;
};
/**
 * 点击物料库事件
 */
const stockChange = (materialStock: any) => {
  stockIdId.value = materialStock.id;
  stockChangeFunc = (data: any) => {
    if (data.length && data[0].parentId == materialStock.id) {
      materialStock.children = data;
    }
    // dpChangeFunc = (dpData: any) => {
    //   materialsClassificationTreeData.value = dpData;
    // };
  };
  materialStockCurrentNodeKey.value = materialStock.id;
  materialsClassificationmentCurrentNodeKey.value = 0;
  refreshTable();

  // getMaterialsClassificationLeftList();
};

/**
 * 点击左侧物料分类事件
 * @param dp
 */
const dpChange = (dp: any) => {
  dpChangeFunc = (data: any) => {
    if (data.length && data[0].parentId == dp.id) dp.children = data;
  };
  tradeTypeId.value = dp.id;

  // materialsClassificationmentCurrentNodeKey.value.id = dp.id;

  refreshTable();
};

/**
 * 获取物料库列表
 * @param rightListFlag
 */
const getMaterialStockList = (changeFlag: boolean) => {
  materialStockFindStockTree(
    {
      // userId: window.$HyGlobal.getUserInfo()?.userId,
      projectId: projectId.value,
    },
    (res: any) => {
      if (changeFlag)
        stockChangeFunc(nameToLabel(res.data, "name"), res.data?.[0]?.id);
      if (res.data[0]) {
        setTimeout(() => {
          //默认第一个子物料库
          //   materialStockCurrentNodeKey.value = res.data[0].children[0];
          materialStockCurrentNodeKey.value = res.data[0];
          enterTreeRef.value.setCurrentKey(
            materialStockCurrentNodeKey.value.id
          );
          stockIdId.value = materialStockCurrentNodeKey.value.id;
        });
      }

      setTimeout(() => {
        if (stockIdId.value) {
          getMaterialsClassificationLeftList();
        }
      }, 100);
      refreshTable();
    }
  );
};
/**
 * 获取左侧物料分类树形列表
 */
const getMaterialsClassificationLeftList = () => {
  findTree(
    {
      projectId: projectId.value,
    },
    (res: any) => {
      if (res.data.length) {
        dpChangeFunc(changeTree(res.data, "name"), res.data);
      } else {
        materialsClassificationTreeData.value = [];
      }
      if (Array.isArray(res.data) && res.data.length) {
        setTimeout(() => {
          // materialsClassificationmentCurrentNodeKey.value = res.data[0];
          materialsClassificationTreeRef.value.setCurrentKey(res.data[0]?.id);
          tradeTypeId.value = res.data[0]?.id;

          // materialsClassificationId.value = materialStockCurrentNodeKey.value.id;
          setTimeout(() => {
            refreshTable();
          }, 100);
        });
      }
    }
  );
};

/**
 * 更改物料库数据闭包事件
 * @param data
 * @param id
 */
let stockChangeFunc = (data: any, node: any) => {
  enterTreeData.value = data;
  // if (node) currentNode.value = node;
};

const findDeepestFirstChildOfFirstNode = (firstNode: any) => {
  let currentNode = firstNode.children?.[0] || firstNode;
  while (currentNode?.children?.length > 0) {
    currentNode = currentNode.children[0];
  }
  return currentNode;
};

function findNameById(tree: any[], targetId: string) {
  for (let node of tree) {
    const { id, name, children } = node;
    if (id === targetId) {
      return name;
    }
    if (children && children.length > 0) {
      const result: any = findNameById(children, targetId);
      if (result !== null) {
        return result;
      }
    }
  }
  return null;
}
// const stockChange = (data: any) => {
//   currentNodeKey.value = data.id;
//   changeRightTable();
// };
const columns = computed(() => [
  {
    prop: "index",
    label: i18nM("material.table.index"),
    type: 1,
    width: "100%",
  },
  { prop: "taskType", label: i18nM("material.table.code"), type: 2 },
  { prop: "name", label: i18nM("material.table.name") },
  { prop: "tradeTypeName", label: i18nM("material.table.category") },
  { prop: "brand", label: i18nM("material.table.brand") },

  { prop: "modelNo", label: i18nM("material.table.model") },
  { prop: "specification", label: i18nM("material.table.specifications") },
  { prop: "count", label: i18nM("material.table.inventoryCount") },

  { prop: "useCount", label: i18nM("material.table.availableQuantity") },
  { prop: "minCountLimit", label: i18nM("material.table.minimumStock") },
  { prop: "maxCountLimit", label: i18nM("material.table.safetyStock") },
  { prop: "maxCountLimit", label: i18nM("material.table.maximumStock") },
  { prop: "unit", label: i18nM("material.table.unit") },
  { prop: "costPrice", label: i18nM("material.table.referenceUnitPrice") },

  { prop: "stockTime", label: i18nM("material.table.updateTime"), type: 2 },

  // { prop: "createTime", label: i18nM("material.table.picture") },

  {
    prop: "operate",
    type: 2,
    label: i18nM("material.table.operate"),
    width: 100,
  },
]);

if (Array.isArray(projects.value) && projects.value.length > 0) {
  let ids = [];
  for (let item of projects.value) {
    ids.push(item.projectId);
  }
  getNameMapByIds(ids, (res: any) => {
    projectMap.value = res.data;
  });
}
const projectChange = () => {
  getMaterialStockList(true);
};

const pageChange = (page: any) => {
  currentPage.value = page - 1;
  refreshTable();
};
const sizeChange = (i: number) => {
  currentPage.value = i;
  refreshTable();
};
const refreshTable = () => {
  const params = {
    projectId: projectId.value,
    page: currentPage.value,
    size: pageSize.value,
    stockId: stockIdId.value,
    tradeTypeId: tradeTypeId.value,
    warningCount: warningInventory.value,
    countType: 2,
  };
  if (title.value) params.name = title.value;
  if (code.value) params.code = code.value;
  if (brand.value) params.brand = brand.value;
  if (specification.value) params.specification = specification.value;
  // if (inventory.value) params.countType = inventory.value;
  materialStockDetailFindPage(params, (res: any) => {
    tableData.value = res.data.content;
    totalItems.value = res.data.totalElements;
  });
};

const nameInputFunc = () => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};

const codeInputFunc = () => {
  clearTimeout(codeTimer);
  codeTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};

const brandInputFunc = () => {
  clearTimeout(brandTimer);
  brandTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};

const specificationInputFunc = () => {
  clearTimeout(specificationTimer);
  specificationTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};
//重新计算表格每页条数
const changeRightTable = () => {
  if (tableRef.value) {
    getPageSizeCount(
      tableRef.value,
      (count: number) => {
        pageSize.value = count;
        if (addDataFlag.value) {
          const pageCount = getPageCount(totalItems.value + 1, pageSize.value);
          currentPage.value = pageCount;
          addDataFlag.value = false;
        } else {
          const pageCount = getPageCount(totalItems.value, pageSize.value);
          if (currentPage.value > pageCount) currentPage.value = pageCount;
        }
        refreshTable();
      },
      { header: 62 }
    );
  }
};
const save = () => {
  if (processFlag.value == 1) {
    if (!currentData?.value?.id) {
      addDataFlag.value = true;
    }
    createRef.value.confirmSave(() => {
      back();
    });
  }
};

const showDetail = (row: any) => {
  currentData.value = row;
  processFlag.value = 2;
};

const back = () => {
  processFlag.value = 0;
  currentData.value = null;
  getMaterialStockList(true);
};

onMounted(() => {
  const children = enterTreeData.value || [];
  // getMaterialStockList(children && children.lenght > 0);
  getMaterialStockList(
    Array.isArray(children) && children.length ? false : true
  );
  // getTreeData(() => {
  //   changeRightTable();
  // });
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.titleIcon {
  margin-right: zrem(10);
  width: zrem(5);
  background-color: var(--el-color-primary);
}
.select-item {
  width: zrem(180);
}
.content-wrap {
  height: calc(100% - zrem(60));
}
</style>
