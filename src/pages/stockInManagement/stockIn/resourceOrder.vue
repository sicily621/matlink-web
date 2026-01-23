<template>
  <div class="w-full flex h-full">
    <div class="w-full h-full flex-1 flex" v-if="!processFlag">
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
                <el-form-item prop="name" label="单号">
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
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="searchData.time"
                    class="width-100"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    @change="refreshTable"
                    :disabled-date="isAfter"
                  />
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
                @currentChange="currentChange"
                class="h-full"
              >
                <template #applyUserId="scope">
                  {{ userNameMap?.[scope.scope.row.applyUserId] ?? "-" }}
                </template>
                <template #createTime="scope">
                  {{
                    scope.scope.row.createTime
                      ? new Date(scope.scope.row.createTime)
                          .toLocaleString()
                          .replace(/\//g, "-")
                      : "-"
                  }}
                </template>
                <template #applyDate="scope">
                  {{ formatDate(scope.scope.row.applyDate) }}
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
import baseTable from "@@/components/baseTable/baseTable.vue";
import pagination from "@@/components/pagination/pagination.vue";
import { findOutBoundApplyPage } from "@pages/outBoundApplyManagement/api/outBoundApply";
import { findPurchasePage } from "@pages/purchaseManagement/api/purchase";
import { getEmployeeListByIds } from "@/pages/employeeManagement/api/employee";
import { indexMethod } from "@@/utils/page";
import { watchDebounced } from "@vueuse/core";
import { formatDate } from "@static/js/common/date";
import { Search } from "@element-plus/icons-vue";
const props = defineProps<{
  id: string | number;
  type: number;
  stockId: string | number;
}>();
const emits = defineEmits(["save"]);
const resourceId = ref(props.id);
const resourceNo = ref("");
const currentChange = (row: any) => {
  resourceId.value = row.id;
  resourceNo.value = props.type === 3 ? row.applyNo : row.billNo;
};
const isAfter = (time: Date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return time.getTime() > currentDate.getTime();
};
const loading = ref<boolean>(false);
const processFlag = ref(0); // 0列表 1新建 2编辑
const columns = computed(() => {
  let result: any[] = [];
  if (props.type === 3) {
    result = [
      { prop: "index", label: "序号", type: 1, width: "100%" },
      { prop: "applyNo", label: "申请单号", type: 2 },
      { prop: "applyTime", label: "申请时间", type: 2 },
      { prop: "applyUserId", label: "申请人" },
      { prop: "purpose", label: "用途" },
    ];
  } else if (props.type === 2) {
    result = [
      { prop: "index", label: "序号", type: 1, width: "100%" },
      { prop: "billNo", label: "采购" },
      { prop: "applyUserId", label: "申请人" },
      { prop: "applyDate", label: "采购时间" },
      { prop: "description", label: "备注" },
    ];
  }
  return result;
});
const userNameMap = ref<{ [key: string]: string }>({});
//分页
const pageSize = ref(10);
const currentPage = ref(0);
const totalItems = ref(0);
const pageChange = (page: any) => {
  currentPage.value = page - 1;
  refreshTable();
};
const confirmSave = () => {
  emits("save", { resourceId, resourceNo });
};
const tableData = ref<any[]>([]);

const today = new Date().toLocaleString().split(" ")[0];
const firstDayOfMonth = new Date(`${today} 00:00:00`);
firstDayOfMonth.setDate(1);
const searchData = reactive<any>({
  name: "",
  time: [formatDate(firstDayOfMonth), formatDate(new Date())],
});

watchDebounced(
  searchData,
  () => {
    refreshTable();
  },
  { debounce: 500, maxWait: 1000 }
);
const refreshTable = async () => {
  loading.value = true;
  let params: any;
  let api = props.type === 3 ? findOutBoundApplyPage : findPurchasePage;
  if (props.type === 3) {
    params = {
      currentPage: currentPage.value + 1,
      size: pageSize.value,
      stockId: props.stockId,
      auditStatus: 2,
      status: 0,
    };

    if (searchData.name) params.applyNo = searchData.name;
  } else if (props.type === 2) {
    params = {
      currentPage: currentPage.value + 1,
      size: pageSize.value,
      stockId: props.stockId,
      status: 1,
      auditStatus: 2,
    };
    if (searchData.name) params.billNo = searchData.name;
  }
  if (searchData.time?.[0] && searchData.time?.[1]) {
    params.startTime = `${searchData.time?.[0]} 00:00:00`;
    params.endTime = `${searchData.time?.[1]} 23:59:59`;
  }
  const res: any = await api(params);
  const { total, list } = res.data;
  totalItems.value = total;
  const userIds: string[] = [];
  list?.forEach((event: any) => {
    userIds.push(event.applyUserId);
  });
  const newUserArr = Array.from(new Set(userIds));
  if (newUserArr.length) {
    const employeeRes: any = await getEmployeeListByIds(newUserArr);
    userNameMap.value = {};
    employeeRes.data.map((item: any) => {
      userNameMap.value[item.id] = item.realName;
    });
  }
  tableData.value = list;
  loading.value = false;
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
