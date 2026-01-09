<template>
  <div class="d-flex h-full w-full">
    <div class="flex-1 d-flex h-full w-full" v-if="!processFlag">
      <div class="flex-1 flex-column h-full">
        <div class="zc-header d-flex align-items-center justify-content-between box-shadow">
          <div class="d-flex flex-1 align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <span class="m-r-8 fz14">{{ i18nM("material.table.oddNumbers") }}</span>
              <el-input v-model="name" :placeholder="i18nM('material.placeholder.oddNumbers')" class="w-200" @input="nameInputFunc">
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <span class="m-r-8 m-l-16 fz14">{{ i18nM("material.label.time") }}</span>
              <el-date-picker
                v-model="timeValue"
                type="daterange"
                :start-placeholder="i18nM('material.placeholder.startTime')"
                :end-placeholder="i18nM('material.placeholder.endTime')"
                :default-time="defaultTime"
                @change="refreshTable()"
                :disabled-date="disabledDate"
              />
            </div>
            <div>
              <el-button class="m-r-20" :type="'primary'" @click="confirmSave">
                <span>{{ i18nM("material.button.save") }}</span>
              </el-button>
            </div>
          </div>
        </div>
        <div class="flex-1 d-flex h-full w-full">
          <div class="flex-1 flex-column h-full box-shadow">
            <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
              <div class="flex-1 table-wrap" ref="tableWrapRef">
                <baseTable
                  ref="tableRef"
                  @currentChange="currentChange"
                  :columns="columns"
                  :table-data="tableData"
                  :indexMethod="indexMethod(currentPage, pageSize)"
                >
                  <template #applyUserId="scope">
                    {{ userNameMap?.[scope.scope.row.applyUserId] ?? "-" }}
                  </template>
                  <template #createTime="scope">
                    {{ scope.scope.row.createTime ? new Date(scope.scope.row.createTime).toLocaleString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #applyDate="scope">
                    {{ formatDate(scope.scope.row.applyDate) }}
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
import { ref, computed, onMounted, nextTick } from "vue";
import { indexMethod } from "@static/js/common/utils";
import baseTable from "@static/table/baseTable/baseTable.vue";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { getPageSizeCount, getPageCount } from "@static/js/page/utils";
import { materialOutBoundApplyFindPage } from "@functions/serviceCenter/material-management/api/materialOutBoundApply";
import { Search } from "@element-plus/icons-vue";
import { usersGetNameMapByIds } from "@functions/userCenter/api/users";
import { postPurchasingRequisitionFindPage } from "@functions/serviceCenter/material-management/api/purchasingRequisition";
import { formatDate } from "@static/js/common/date";
const props = defineProps<{ id: string | number; projectId: string | number; type: number; stockId: string | number }>();
const emits = defineEmits(["save"]);
const i18nM = window.$i18nM;
const tableWrapRef = ref();
const tableRef = ref();
const name = ref("");
const processFlag = ref(0);
const tableData = ref([]);
const today = new Date().toLocaleString().split(" ")[0];
const firstDayOfMonth = new Date(`${today} 00:00:00`);
firstDayOfMonth.setDate(1);
const timeValue = ref<any>([firstDayOfMonth, new Date(`${today} 23:59:59`)]);
const defaultTime: [Date, Date] = [firstDayOfMonth, new Date()];
const resourceId = ref(props.id);
const resourceNo = ref("");
const currentChange = (row: any) => {
  resourceId.value = row.id;
  resourceNo.value = props.type === 3 ? row.applyNo : row.billNo;
};
// 禁用日期
const disabledDate = (time: Date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return time.getTime() > currentDate.getTime();
};

const columns = computed(() => {
  let result: any[] = [];
  if (props.type === 3) {
    result = [
      { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
      { prop: "applyNo", label: i18nM("material.table.applicationForm"), type: 2 },
      { prop: "applyTime", label: i18nM("material.table.applicationTime"), type: 2 },
      { prop: "applyUserId", label: i18nM("material.table.applicant") },
      { prop: "workorderId", label: i18nM("material.table.associatedWorkOrder") },
      { prop: "useage", label: i18nM("material.table.usage") },
    ];
  } else if (props.type === 2) {
    result = [
      { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
      { prop: "billNo", label: i18nM("material.label.purchase") },
      { prop: "applyUserId", label: i18nM("material.table.applicant") },
      { prop: "applyDate", label: i18nM("material.label.purchaseTime") },
      { prop: "description", label: i18nM("material.label.notes") },
    ];
  }
  return result;
});

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
const userNameMap = ref<{ [key: string]: string }>({});
const refreshTable = () => {
  let params: any;
  let api = props.type === 3 ? materialOutBoundApplyFindPage : postPurchasingRequisitionFindPage;
  const startTime = `${new Date(timeValue.value[0]).toLocaleString().split(" ")[0]} 00:00:00`;
  const endTime = `${new Date(timeValue.value[1]).toLocaleString().split(" ")[0]} 23:59:59`;
  if (props.type === 3) {
    params = {
      projectId: props.projectId,
      page: currentPage.value,
      size: pageSize.value,
      stockId: props.stockId,
      startTime: new Date(startTime).getTime(),
      endTime: new Date(endTime).getTime(),
      status: 2,
      applyStatus: 0,
    };
    if (name.value) params.applyNo = name.value;
  } else if (props.type === 2) {
    params = {
      projectId: props.projectId,
      page: currentPage.value,
      size: pageSize.value,
      stockId: props.stockId,
      startTime: new Date(startTime).getTime(),
      endTime: new Date(endTime).getTime(),
      purStatus: 1,
      status: 2,
    };
    if (name.value) params.billNo = name.value;
  }

  api(params, (res: any) => {
    const { content, totalElements } = res.data;
    const userIds: string[] = [];
    content?.forEach((row: any) => {
      userIds.push(row.applyUserId);
    });
    const newUserArr = Array.from(new Set(userIds));
    usersGetNameMapByIds(newUserArr, (res: any) => {
      userNameMap.value = res.data;
      tableData.value = content;
      totalItems.value = totalElements;
      nextTick(() => {
        const targetRow: any = tableData.value.find((row: any) => row.id === props.id);
        if (targetRow) {
          resourceNo.value = props.type === 3 ? targetRow.applyNo : targetRow.billNo;
          tableRef.value.setCurrentRow(targetRow);
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

const confirmSave = () => {
  emits("save", { resourceId, resourceNo });
};

//重新计算表格每页条数
const changeRightTable = () => {
  if (tableWrapRef.value) {
    getPageSizeCount(
      tableWrapRef.value,
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
.box-shadow {
  box-shadow: var(--el-box-shadow-light);
}
</style>
