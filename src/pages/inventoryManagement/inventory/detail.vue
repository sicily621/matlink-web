<template>
  <div class="flex h-full">
    <div class="w-full h-full flex-1 flex">
      <div class="flex-1 flex flex-col h-full">
        <div class="h-full w-full flex flex-col">
          <el-card v-loading="loading" shadow="never" class="search-wrapper">
            <div class="flex">
              <el-form
                ref="searchFormRef"
                class="flex-grow-1"
                :inline="true"
                :model="searchData"
              >
                <el-form-item label="时间范围">
                  <el-date-picker
                    v-model="time"
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
              <el-button @click="back" class="p-l-6 p-r-6">返回</el-button>
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
                  <el-tag type="primary">
                    ￥{{ scope.scope.row.costPrice }}
                  </el-tag>
                </template>
                <template #totalCostPrice="scope">
                  <el-tag type="primary">
                    ￥{{ scope.scope.row.totalCostPrice }}
                  </el-tag>
                </template>
                <template #handleUserId="scope">
                  {{ userNameMap?.[scope.scope.row.handleUserId] ?? "-" }}
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
import { getStockListByIds } from "@pages/baseManagement/api/stock";
import {
  findStockRecordPage,
  type queryMaterialStockRecordParams,
} from "@pages/inventoryManagement/api/stockRecord";
import { indexMethod } from "@@/utils/page";
import { getEmployeeListByIds } from "@/pages/employeeManagement/api/employee";
import { getCategoryListByIds } from "@pages/baseManagement/api/category";
import { getUnitListByIds } from "@pages/baseManagement/api/unit";
import { findMaterialListByIds } from "@pages/baseManagement/api/material";
import type { PaginatedRequest } from "@@/apis/tables/type";
const props = defineProps<{
  materialId: string;
  stockId: string;
  back: () => void;
}>();
const typeOptions = ref([
  { id: 1, name: "入库" },
  { id: 2, name: "出库" },
  { id: 4, name: "盘点" },
]);
const searchData = ref({});
const getName = (list: any[], targetId: string | number) => {
  return list.find((item: any) => item.id === targetId)?.name ?? "";
};
const isAfter = (date: Date) => {
  return date.getTime() - Date.now() >= 0;
};
const loading = ref<boolean>(false);
const columns = ref([
  { prop: "index", label: "序号", width: "100", type: 1 },
  { prop: "handleTime", label: "出入库时间" },
  { prop: "type", label: "业务类型" },
  { prop: "stockId", label: "仓库" },
  { prop: "code", label: "编码" },
  { prop: "name", label: "名称" },
  { prop: "materialTypeId", label: "类别" },
  { prop: "brand", label: "品牌" },
  { prop: "modelNo", label: "型号" },
  { prop: "specification", label: "规格" },
  { prop: "quantityChange", label: "变化数量" },
  { prop: "balanceAfter", label: "剩余数量" },
  { prop: "unit", label: "单位" },
  { prop: "costPrice", label: "成本单价" },
  { prop: "totalCostPrice", label: "库存价值（不含税）" },
  { prop: "handleUserId", label: "操作人" },
]);
//分页
const pageSize = ref(10);
const currentPage = ref(0);
const totalItems = ref(0);
const pageChange = (page: any) => {
  currentPage.value = page - 1;
  refreshTable();
};

const tableData = ref<any[]>([]);
function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}
function getRecentDaysRange(days: number = 15): [String, String] {
  // 1. 获取当前时间作为结束时间
  const end = new Date();

  // 2. 创建一个新的 Date 对象用于计算开始时间
  const start = new Date(end.getTime());

  // 3. 将开始时间向前推指定的天数
  start.setDate(start.getDate() - days);

  return [formatDate(start), formatDate(end)];
}
const time = ref<any>(getRecentDaysRange());

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
const userNameMap = ref<{ [key: string]: string }>({});
const stockMap = ref<Map<string, any>>(new Map());
function refreshTable() {
  loading.value = true;
  const params: PaginatedRequest<queryMaterialStockRecordParams> = {
    currentPage: currentPage.value + 1,
    size: pageSize.value,
  };
  if (props.stockId.length) params.stockId = props.stockId;
  if (props.materialId.length) params.materialId = props.materialId;
  if (time.value?.[0] && time.value?.[1]) {
    params.startTime = `${time.value?.[0]} 00:00:00`;
    params.endTime = `${time.value?.[1]} 23:59:59`;
  }
  findStockRecordPage(params)
    .then(async (res: any) => {
      const { total, list } = res.data;
      totalItems.value = total;
      const stockIds = list.map((item: any) => item.stockId);
      if (stockIds.length) {
        const stockRes: any = await getStockListByIds(stockIds);
        stockMap.value.clear();
        stockRes.data.map((item: any) => {
          stockMap.value.set(item.id, item);
        });
      }

      materialIds.value = list.map((item: any) => item.materialId);
      if (materialIds.value.length > 0) {
        const materialRes: any = await findMaterialListByIds(
          materialIds.value.join(",")
        );
        materialMap.value.clear();
        const categoryIds: string[] = [];
        materialRes.data.map((item: any) => {
          materialMap.value.set(item.id, item);
          categoryIds.push(item.materialTypeId);
        });
        if (categoryIds.length) await queryCategoryList(categoryIds);
        const unitIds = materialRes.data.map((item: any) => item.unit);
        if (unitIds.length) await getUnitList(unitIds);
        const userIds: string[] = list.map((item: any) => item.handleUserId);
        const newUserArr = Array.from(new Set(userIds));
        if (newUserArr.length) {
          const employeeRes: any = await getEmployeeListByIds(newUserArr);
          userNameMap.value = {};
          employeeRes.data.map((item: any) => {
            userNameMap.value[item.id] = item.realName;
          });
        }
        tableData.value = list.map((item: any) => {
          const material = materialMap.value.get(item.materialId);
          const result = { ...material, ...item };
          return result;
        });
      }
    })
    .catch(() => {
      tableData.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
}

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
