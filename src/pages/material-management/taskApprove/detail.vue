<template>
  <div class="d-flex h-full w-full">
    <div class="flex-1 d-flex h-full w-full" v-if="!processFlag">
      <div class="flex-1 flex-column h-full">
        <div class="zc-header d-flex align-items-center justify-content-between">
          <div class="d-flex flex-1 align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <div class="title d-flex w-150">
                <div class="titleIcon"></div>
                <span>{{ i18nM("material.title.taskDetail") }}</span>
              </div>
              <span class="m-r-8 fz14">{{ i18nM("material.label.status") }}</span>
              <el-select class="select-item" v-model="status" :placeholder="i18nM('material.placeholder.selectProject')" @change="refreshTable()">
                <el-option v-for="item of statusOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="flex-1 d-flex content-wrap w-full">
          <div class="flex-1 flex-column h-full">
            <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
              <div ref="tableRef" class="flex-1 table-wrap">
                <baseTable :columns="columns" :table-data="tableData">
                  <template #status="scope">
                    {{
                      scope.scope.row.status === 0
                        ? i18nM("material.enumValue.notYetAssessed")
                        : scope.scope.row.status === 1
                        ? i18nM("material.enumValue.stockChecked")
                        : i18nM("material.enumValue.audited")
                    }}
                  </template>
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
import { ref, computed, onMounted } from "vue";
import baseTable from "@static/table/baseTable/baseTable.vue";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { getPageSizeCount, getPageCount } from "@static/js/page/utils";
import { getTaskDetailPage, DetailStatus } from "@functions/serviceCenter/material-management/api/taskDetail";
import { materialPage } from "@functions/serviceCenter/material-management/api/material";
const props = defineProps<{ projectId: string | number; id: string | number }>();
const i18nM = window.$i18nM;
const tableRef = ref();
const processFlag = ref(0);
const tableData = ref([]);
const status = ref(-1);
const statusOptions = computed(() => {
  return [
    { id: -1, name: i18nM("material.enumValue.all") },
    { id: DetailStatus.NotYetAssessed, name: i18nM("material.enumValue.notYetAssessed") },
    { id: DetailStatus.inProgress, name: i18nM("material.enumValue.inProgress") },
    { id: DetailStatus.StockChecked, name: i18nM("material.enumValue.stockChecked") },
  ];
});

const columns = computed(() => [
  { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
  { prop: "code", label: i18nM("material.table.code") },
  { prop: "simpleName", label: i18nM("material.table.abbreviation"), type: 2 },
  { prop: "tradeTypeName", label: i18nM("material.table.category"), type: 2 },
  { prop: "brand", label: i18nM("material.table.brand") },
  { prop: "modelNo", label: i18nM("material.table.model") },
  { prop: "specification", label: i18nM("material.table.specifications") },
  { prop: "realCount", label: i18nM("material.table.inventoryCount") },
  { prop: "unitName", label: i18nM("material.table.unit") },
  { prop: "status", label: i18nM("material.table.status") },
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
    taskId: props.id,
  };
  if (status.value > -1) params.status = status.value;
  getTaskDetailPage(params, (res: any) => {
    const { content, totalElements } = res.data;

    const materialIds = content?.map((item: any) => item.tradeId) ?? [];
    if (materialIds.length === 0) {
      tableData.value = [];
      totalItems.value = 0;
      return;
    }
    const params: any = {
      projectId: props.projectId,
      page: currentPage.value,
      size: pageSize.value,
      ids: materialIds,
    };
    materialPage(params, (res: any) => {
      const materialMap = ref<Map<string, any>>(new Map());
      res.data.content.map((item: any) => {
        materialMap.value.set(item.id, item);
      });
      tableData.value = content.map((item: any, i: number) => {
        const material = materialMap.value.get(item.tradeId) ?? {};
        return { ...item, ...material, index: currentPage.value * pageSize.value + i + 1 };
      });
      totalItems.value = totalElements;
    });
  });
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
  changeRightTable();
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
.content-wrap {
  height: calc(100% - zrem(60));
}
</style>
