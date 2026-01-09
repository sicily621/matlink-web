<template>
  <div class="flex-column h-full">
    <div class="flex-1 flex-column h-full" v-if="!processFlag">
      <div class="zc-header d-flex align-items-center justify-content-between">
        <div class="d-flex flex-1 align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <div class="title d-flex w-150">
              <div class="titleIcon"></div>
              <span>{{ i18nM("material.title.inventoryFlow") }}</span>
            </div>
            <span>{{ i18nM("material.label.time") }}</span>
            <el-date-picker
              class="m-l-20"
              v-model="dateRange"
              value-format="YYYY-MM-DD"
              type="daterange"
              :range-separator="i18nM('inspection.label.to')"
              :start-placeholder="i18nM('inspection.placeholder.startTime')"
              :end-placeholder="i18nM('inspection.placeholder.endTime')"
              @change="timeChange"
            />
          </div>
          <div class="m-r-20">
            <el-button class="w-80" plain @click="back()">{{
              i18nM("material.button.back")
            }}</el-button>
          </div>
        </div>
      </div>

      <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
        <div ref="tableRef" class="flex-1 table-wrap">
          <baseTable :columns="columns" :table-data="tableData">
            <template #type="scope">
              <span v-if="scope.scope.row.type == 1">{{
                i18nM("material.enumValue.stockIn")
              }}</span>
              <span v-if="scope.scope.row.type == 2">{{
                i18nM("material.enumValue.stockOut")
              }}</span>
              <span v-if="scope.scope.row.type == 3">{{
                i18nM("material.enumValue.profitLossAdjustment")
              }}</span>
            </template>
            <template #inOrOutStockTime="scope">
              {{
                scope.scope.row.inOrOutStockTime
                  ? new Date(scope.scope.row.inOrOutStockTime)
                      .toLocaleDateString()
                      .replace(/\//g, "-")
                  : "-"
              }}
            </template>
            <template #createTime="scope">
              {{
                scope.scope.row.createTime
                  ? new Date(scope.scope.row.createTime)
                      .toLocaleDateString()
                      .replace(/\//g, "-")
                  : "-"
              }}
            </template>

            <template #createUserId="scope">
              {{ userNameMap[scope.scope.row.createUserId] }}
            </template>
          </baseTable>
        </div>
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
          class="zc-footer"
        ></pagination>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import baseTable from "@static/table/baseTable/baseTable.vue";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { getPageSizeCount, getPageCount } from "@static/js/page/utils";
import { stockRecordPage } from "@functions/serviceCenter/material-management/api/stockRecord";
import { formatFullDate } from "@static/js/common/date";
import { usersGetNameMapBylds } from "@functions/serviceCenter/common-base/api/users";
const emits = defineEmits(["back"]);

const props = defineProps<{
  projectId: string | number;
  data: string | number;
}>();

const i18nM = window.$i18nM;
const tableRef = ref();
const processFlag = ref(0);
const tableData = ref([]);
const userNameMap = ref<any>([]);
const columns = computed(() => [
  {
    prop: "index",
    label: i18nM("material.table.index"),
    type: 1,
    width: "100%",
  },
  { prop: "inOrOutStockTime", label: i18nM("material.table.transactionTime") },
  {
    prop: "inOrOutStockNo",
    label: i18nM("material.table.oddNumbers"),
    type: 2,
  },
  {
    prop: "type",
    label: i18nM("material.table.businessType"),
    type: 2,
  },
  { prop: "stockName", label: i18nM("material.table.storehouse") },
  { prop: "tradeCode", label: i18nM("material.table.code") },
  { prop: "tradeName", label: i18nM("material.table.name") },
  { prop: "tradeTypeName", label: i18nM("material.table.type") },
  { prop: "brand", label: i18nM("material.table.brand") },
  { prop: "modelNo", label: i18nM("material.table.model") },
  { prop: "specification", label: i18nM("material.table.specifications") },
  { prop: "quantityChange", label: i18nM("material.table.quantity") },
  { prop: "balanceAfter", label: i18nM("material.table.remainingQuantity") },
  { prop: "unit", label: i18nM("material.table.unit") },
  { prop: "costPrice", label: i18nM("material.table.costUnitPrice") },
  { prop: "totalCostPrice", label: i18nM("material.table.costAmount") },
  {
    prop: "createTime",
    label: i18nM("material.table.createOrderTime"),
    type: 2,
  },
  { prop: "createUserId", label: i18nM("material.table.createUser"), type: 2 },
]);

//分页
const pageSize = ref(0);
const currentPage = ref(0);
const totalItems = ref(0);
const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );
  const lastDayOfMonth = new Date(today.getTime());
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return [formatDate(firstDayOfMonth), formatDate(lastDayOfMonth)];
};
const [startStr, endStr] = getCurrentMonthRange();
const dateRange = ref<[string, string]>([startStr, endStr]);

const startDate = ref<string>(startStr);
// const startDate = ref<string>();
const endDate = ref<string>(endStr);
// const endDate = ref<string>();
const dateToNumber = (date: Date, type: number) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const timeEnd = type == 0 ? "00:00:00" : "23:59:59";
  const time = new Date(`${year}-${month}-${day} ${timeEnd}`).getTime();
  return time;
};
const pageChange = (page: any) => {
  currentPage.value = page - 1;
  refreshTable();
};
const sizeChange = (i: number) => {
  currentPage.value = i;
  refreshTable();
};
const timeChange = (val: any) => {
  refreshTable();
};
const tradeIds = ref<any>([]);
const refreshTable = () => {
  tradeIds.value.push(props.data.tradeId);
  const params: any = {
    projectId: props.projectId,
    page: currentPage.value,
    size: pageSize.value,
    tradeIds: tradeIds.value,
  };
  if (dateRange.value?.[0] && dateRange.value?.[1]) {
    params.startTime = dateToNumber(new Date(dateRange.value[0]), 0).toString();
    params.endTime = dateToNumber(new Date(dateRange.value[1]), 1).toString();
  }
  stockRecordPage(params, (res: any) => {
    const { content, totalElements } = res.data;
    totalItems.value = totalElements;

    const materialIds = content?.map((item: any) => item.tradeId) ?? [];
    tableData.value = content;
    if (Array.isArray(tableData.value) && tableData.value.length) {
      const usersId = [];

      for (let item of res.data.content) {
        usersId.push(item.createUserId);
      }
      usersGetNameMapBylds(usersId, (res: any) => {
        userNameMap.value = res.data;
      });
    }
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
const back = () => {
  setTimeout(() => emits("back"), 400);
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
</style>
