<template>
  <div class="d-flex h-full w-full">
    <div class="flex-1 d-flex h-full w-full" v-if="!processFlag">
      <div class="flex-1 flex-column h-full">
        <div class="zc-header d-flex align-items-center justify-content-between box-shadow">
          <div class="d-flex flex-1 align-items-center justify-content-between">
            <div>
              <span class="m-r-8 fz14">{{ i18nM("material.label.name") }}</span>
              <el-input v-model="name" :placeholder="i18nM('material.placeholder.name')" class="w-200" @input="nameInputFunc">
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <span class="m-r-8 m-l-16 fz14">{{ i18nM("material.label.code") }}</span>
              <el-input v-model="code" :placeholder="i18nM('material.placeholder.inputCode')" class="w-200" @input="codeInputFunc">
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <span class="m-r-8 m-l-16 fz14">{{ i18nM("material.label.brand") }}</span>
              <el-input v-model="specification" :placeholder="i18nM('material.placeholder.inputBrand')" class="w-200" @input="brandInputFunc">
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <span class="m-r-8 m-l-16 fz14">{{ i18nM("material.label.specifications") }}</span>
              <el-input v-model="brand" :placeholder="i18nM('material.placeholder.inputSpecifications')" class="w-200" @input="specInputFunc">
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
            </div>
            <div>
              <el-button class="m-r-20" :type="'primary'" @click="confirmSave">
                <span>{{ i18nM("material.button.save") }}</span>
              </el-button>
            </div>
          </div>
        </div>
        <div class="flex-1 d-flex h-full w-full">
          <div class="left h-full box-shadow">
            <div class="flex1 flex-column h-full">
              <div class="flex-1" style="height: 50%">
                <tree
                  :data="treeData"
                  ref="treeRef"
                  :propsObj="defaultProps"
                  :expandedKeys="expandedKeys"
                  :currentNodeKey="currentNodeKey"
                  @changeNode="enterChange($event)"
                  :placeholder="i18nM('material.placeholder.inputClassificationName')"
                >
                </tree>
              </div>
            </div>
          </div>
          <div class="right flex-1 flex-column h-full box-shadow">
            <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
              <div class="flex-1 table-wrap">
                <baseTable
                  ref="tableRef"
                  @select="select"
                  @selectAll="selectAll"
                  :checkboxFlag="true"
                  :columns="columns"
                  :table-data="tableData"
                  :indexMethod="indexMethod(currentPage, pageSize)"
                >
                  <template #imageUrls="scope">
                    <el-image class="preview-img m-r-10" v-for="url in scope.scope.row.imageUrls" :src="url" :preview-src-list="[url]" />
                  </template>
                </baseTable>
              </div>
              <div class="zc-footer d-flex align-items-center justify-content-end" v-if="totalItems > 0">
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
  </div>
</template>
<script setup lang="ts">
import tree, { TreeNode } from "@static/elementUI/tree/tree.vue";
import { ref, computed, onMounted, nextTick } from "vue";
import { indexMethod } from "@static/js/common/utils";
import baseTable from "@static/table/baseTable/baseTable.vue";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { getPageSizeCount, getPageCount } from "@static/js/page/utils";
import { materialPage } from "@functions/serviceCenter/material-management/api/material";
import { findTree } from "@functions/serviceCenter/material-management/api/classCatalog";
import { Search } from "@element-plus/icons-vue";
const props = defineProps<{ materialIds: any[]; projectId: string | number }>();
const emits = defineEmits(["save"]);
const i18nM = window.$i18nM;
const tableRef = ref();
const name = ref("");
const code = ref("");
const specification = ref("");
const brand = ref("");
const processFlag = ref(0);
const tableData = ref([]);
const treeRef = ref();
const treeData = ref<TreeNode[]>([]);
const defaultProps = {
  children: "children",
  label: "name",
};

const expandedKeys = ref<Array<number | string>>([0]);
const currentNodeKey = ref<any>(0);
const findDeepestFirstChildOfFirstNode = (firstNode: any) => {
  let currentNode = firstNode.children?.[0] || firstNode;
  while (currentNode?.children?.length > 0) {
    currentNode = currentNode.children[0];
  }
  return currentNode;
};
const getTreeData = (cb: Function) => {
  findTree({ projectId: props.projectId as any as number }, (res: any) => {
    treeData.value = res.data;
    currentNodeKey.value = findDeepestFirstChildOfFirstNode(treeData.value?.[0])?.id;
    cb();
  });
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
    checkedIds.value = checkedIds.value.filter((id: any) => !allIds.includes(id));
  }
};

const enterChange = (data: any) => {
  currentNodeKey.value = data.id;
  changeRightTable();
};
const columns = computed(() => [
  { prop: "code", label: i18nM("material.table.code") },
  { prop: "simpleName", label: i18nM("material.table.abbreviation"), type: 2 },
  { prop: "tradeTypeName", label: i18nM("material.table.category"), type: 2 },
  { prop: "brand", label: i18nM("material.table.brand") },
  { prop: "modelNo", label: i18nM("material.table.model") },
  { prop: "specification", label: i18nM("material.table.specifications") },
  { prop: "safeCountLimit", label: i18nM("material.table.safetyQuantity") },
  { prop: "minCountLimit", label: i18nM("material.table.minimumStock") },
  { prop: "unitName", label: i18nM("material.table.unit") },
  { prop: "imageUrls", label: i18nM("material.table.picture") },
]);

//分页
const pageSize = ref(0);
const currentPage = ref(0);
const totalItems = ref(0);
const pageChange = (page: any) => {
  currentPage.value = page - 1;
  refreshTable();
};
const sizeChange = (i: number) => {
  currentPage.value = i;
  refreshTable();
};
const refreshTable = () => {
  const params: any = {
    projectId: props.projectId,
    page: currentPage.value,
    size: pageSize.value,
    tradeTypeId: currentNodeKey.value,
  };
  if (name.value) params.name = name.value;
  if (code.value) params.code = code.value;
  if (specification.value) params.specification = specification.value;
  if (brand.value) params.brand = brand.value;
  materialPage(params, (res: any) => {
    const { content, totalElements } = res.data;
    tableData.value = content;
    totalItems.value = totalElements;
    nextTick(() => {
      tableData.value.map((item: any) => {
        if (checkedIds.value.includes(item.id)) {
          tableRef.value.toggleRowSelection(item, true);
        }
      });
    });
  });
};

let nameTimer: any = null;
const nameInputFunc = () => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};
let codeTimer: any = null;
const codeInputFunc = () => {
  clearTimeout(codeTimer);
  codeTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};
let specTimer: any = null;
const specInputFunc = () => {
  clearTimeout(specTimer);
  specTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};
let brandTimer: any = null;
const brandInputFunc = () => {
  clearTimeout(brandTimer);
  brandTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};
const confirmSave = () => {
  emits("save", checkedIds.value);
};

//重新计算表格每页条数
const changeRightTable = () => {
  if (tableRef.value) {
    getPageSizeCount(
      tableRef.value,
      (count: number) => {
        pageSize.value = count;
        const pageCount = getPageCount(totalItems.value, pageSize.value);
        if (currentPage.value > pageCount) currentPage.value = pageCount;
        refreshTable();
      },
      { header: 62 }
    );
  }
};

onMounted(() => {
  getTreeData(() => {
    changeRightTable();
  });
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
.preview-img {
  width: zrem(30);
  height: zrem(30);
}
.box-shadow {
  box-shadow: var(--el-box-shadow-light);
}
</style>
