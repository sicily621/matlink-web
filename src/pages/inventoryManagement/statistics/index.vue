<template>
  <div class="app-container flex flex-col h-full p-4">
    <el-card shadow="never" class="search-wrapper m-b-2">
      <div class="flex justify-between">
        <div class="zc-header-title">
          <div class="zc-header-icon"></div>
          <div class="zc-header-word">
            库存分析 -- <span class="font-bold">{{ currentMaterialName }}</span>
          </div>
        </div>
        <div class="flex items-center">
          <div class="m-r-3">物料库</div>
          <el-tree-select
            class="w-40 m-r-5"
            v-model="stockId"
            placeholder="请选择物料库"
            :data="stockOptions"
            check-strictly
            :render-after-expand="false"
            :props="selectProps"
            @change="refreshData"
          />
          <el-button type="primary" @click="addMaterial">选择物料</el-button>
        </div>
      </div>
    </el-card>
    <div class="flex-1 el-card p-4 m-b-2">
      <LineBar
        title="库存水位分析"
        :x-axis-data="xAxisData"
        :series-data="stockTrendData"
        yAxisLeftName="净变动量"
        yAxisRightName="结余库存量"
        :unit="unit"
        :animation="true"
        :show-area="true"
        @click="handleChartClick"
      />
    </div>
    <div class="flex-1 el-card p-4 m-b-2">
      <Line
        title="成本单价波动监控 "
        :x-axis-data="xAxisData"
        :series-data="costPriceTrend"
        :animation="true"
        :show-area="true"
        :unit="'元'"
        @click="handleChartClick"
      />
    </div>
    <div class="flex-1 el-card p-4">
      <Bar
        title="出入库流量对比分析"
        :x-axis-data="xAxisData"
        :series-data="stockFlowData"
        :animation="true"
        :is-stacked="true"
        :show-label="true"
        @click="handleChartClick"
        yAxisLeftName="库存资金占用"
        yAxisRightName="库存变动量"
        leftUnit="元"
        :rightUnit="unit"
      />
    </div>
    <zModel
      ref="materialRef"
      :style="{ width: '96%', height: '80%' }"
      custom-model-title="选择物料"
      :noConfirmBtnFlag="true"
      @confirm="() => {}"
    >
      <div class="flex-1 flex w-full h-full relative content-bg">
        <Material :materialIds="materialIds" @save="saveMaterial"></Material>
      </div>
    </zModel>
  </div>
</template>

<script setup lang="ts">
import zModel from "@static/components/zModel/zModel.vue";
import Material from "./material.vue";
import { dayjs } from "element-plus";
import Line from "@@/components/echarts/line.vue";
import Bar from "@@/components/echarts/bar.vue";
import LineBar from "@@/components/echarts/lineBar.vue";
import {
  findMaterialPage,
  getMaterial,
} from "@pages/baseManagement/api/material";
import { getUnit } from "@pages/baseManagement/api/unit";
import {
  getStockTrend,
  getMaterialCostPriceTrend,
  getStockFlowStatistics,
} from "@pages/inventoryManagement/api/stockRecord";
import { getStockList } from "@pages/baseManagement/api/stock";
const materialRef = ref<any>();
const materialIds = ref<string[]>([]);
const currentMaterialName = ref("");
const unit = ref("");
const stockId = ref("");
const stockOptions = ref<any[]>([{ name: "无", id: 0 }]);
const selectProps = { value: "id", label: "name" };
const queryStockOptions = async () => {
  const res = await getStockList();
  if ((res as any)?.data?.length) {
    stockOptions.value = buildTree((res as any)?.data || []);
    stockId.value = stockOptions.value[0]?.id;
  }
};
function buildTree(departments: any[]) {
  const map = new Map();

  // 第一步：创建所有部门的映射并初始化children
  departments.forEach((dept: any) => {
    map.set(dept.id, {
      ...dept,
      children: [],
    });
  });

  // 第二步：建立所有层级的父子关系
  departments.forEach((dept: any) => {
    const current = map.get(dept.id);
    if (dept.parentId !== 0) {
      const parent = map.get(dept.parentId);
      if (parent) {
        parent.children.push(current);
      }
    }
  });

  // 第三步：收集顶级部门
  return departments
    .filter((dept: any) => dept.parentId === 0)
    .map((dept: any) => map.get(dept.id));
}
const addMaterial = () => {
  materialRef.value.openCustomModel();
};
const saveMaterial = async (ids: any[]) => {
  materialIds.value = ids;
  materialRef.value.closeCustomModel();
  const res: any = await getMaterial(materialIds.value[0]);
  currentMaterialName.value = res.data.name;
  const unitRes: any = await getUnit(res.data?.unit);
  unit.value = unitRes.data.cnname;
  refreshData();
};

const xAxisData = ref<string[]>([]);
const stockFlowData = ref([
  {
    type: "bar",
    name: "入库量",
    data: [210, 224, 100, 99, 89, 70, 130, 101, 320, 100, 108, 201],
  },
  {
    type: "bar",
    name: "出库量",
    data: [55, 88, 129, 135, 100, 110, 200, 40, 50, 100, 121, 144],
  },
  {
    type: "line",
    name: "库存资金占用",
    data: [55, 88, 129, 135, 100, 110, 200, 40, 50, 100, 121, 144],
  },
]);
const stockTrendData = ref([
  {
    type: "bar",
    name: "结余库存量",
    data: [0],
  },
  {
    type: "line",
    name: "净变动量",
    data: [0],
  },
]);
const costPriceTrend = ref([
  {
    name: "成本单价",
    data: [
      55, 88, 129, 135, 100, 110, 200, 40, 50, 100, 121, 144, 100, 110, 200, 40,
    ],
  },
]);
const refreshData = async () => {
  stockTrendData.value[0].data = [];
  stockTrendData.value[1].data = [];
  const params = {
    stockId: stockId.value,
    materialId: materialIds.value[0],
    startTime: dayjs().subtract(15, "day").format("YYYY-MM-DD 00:00:00"),
    endTime: dayjs().format("YYYY-MM-DD 23:59:59"),
  };
  const stockTrendRes: any = await getStockTrend(params);

  xAxisData.value = [];
  stockTrendRes.data.map((item: any) => {
    xAxisData.value.push(dayjs(item.handleTime).format("MM月DD日"));
    stockTrendData.value[0].data.push(+item.balanceAfter);
    stockTrendData.value[1].data.push(+item.quantityChange);
  });
  const costPricedRes: any = await getMaterialCostPriceTrend(params);
  costPriceTrend.value[0].data = costPricedRes.data.map((item: any) =>
    Number(item.costPrice),
  );
  stockFlowData.value[0].data = [];
  stockFlowData.value[1].data = [];
  stockFlowData.value[2].data = [];
  const stockFlowRes: any = await getStockFlowStatistics(params);
  stockFlowRes.data.map((item: any, i: number) => {
    stockFlowData.value[0].data.push(+item.inStockCount);
    stockFlowData.value[1].data.push(Math.abs(item.outStockCount));
    stockFlowData.value[2].data.push(
      +costPriceTrend.value[0].data[i] * +stockTrendData.value[0].data[i],
    );
  });
};
onMounted(async () => {
  await queryStockOptions();
  const res: any = await findMaterialPage({
    currentPage: 1,
    size: 10,
  });
  if (res.data?.list[0]) {
    materialIds.value = [res.data?.list[0].id];
    currentMaterialName.value = res.data?.list[0].name;
    const unitRes: any = await getUnit(res.data?.list[0].unit);
    unit.value = unitRes.data.cnname;
    refreshData();
  }
});
const handleChartClick = (params: any) => {
  console.log("点击了图表:", params);
};
</script>
