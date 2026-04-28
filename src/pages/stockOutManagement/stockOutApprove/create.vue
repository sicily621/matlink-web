<template>
  <div class="flex">
    <el-card class="width-200 h-full">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">出库单</div>
      </div>
      <el-divider class="m-t-3 m-b-3" />
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        class="relative flex-1"
        label-width="90px"
        require-asterisk-position="right"
      >
        <div class="width-300">
          <div class="flex row align-items-center">
            <div>出库单号</div>
            <div>{{ form.outStockNo }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>物料库</div>
            <div>{{ findNameById(stockOptions, form.stockId) }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>出库类型</div>
            <div>{{ getName(typeOptions, form.type) }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>源单号</div>
            <div>{{ form.originOrderNo }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>出库时间</div>
            <div>
              {{
                new Date(form.outStockTime).toLocaleString().replace(/\//g, "-")
              }}
            </div>
          </div>
          <div class="flex row align-items-center">
            <div>出库人</div>
            <div>{{ form.outStockUserName }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>备注</div>
            <div>{{ form.description }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>直接出库</div>
            <div>{{ form.isDirect ? "是" : "否" }}</div>
          </div>
          <div
            class="flex row align-items-center file-wrap"
            label="附件"
            v-if="form?.files?.length"
          >
            <div class="h-18">附件</div>
            <div class="flex-1">
              <div class="files-wrap w-full">
                <el-scrollbar class="h-full w-full">
                  <div
                    class="flex justify-content-between align-items-center file-item w-full"
                    v-for="(file, index) in form.files"
                  >
                    <div class="flex-1 overflow-spot">
                      {{ file?.name || file.fileName }}
                    </div>
                    <div class="flex flex-center">
                      <el-icon
                        class="fz16 pointer m-l-8"
                        text
                        v-if="file.id"
                        @click="download(file)"
                      >
                        <Download />
                      </el-icon>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </div>
        <el-form
          v-if="!onlyView"
          ref="formRef"
          :model="approvalForm"
          :rules="rules"
          label-position="right"
          class="relative flex-1"
          label-width="90px"
          require-asterisk-position="right"
        >
          <el-form-item label="审批" prop="auditStatus">
            <el-select
              class="width-200"
              v-model="approvalForm.auditStatus"
              placeholder="请选择审批结果"
            >
              <el-option
                v-for="item of auditStatusOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="auditRemark">
            <el-input
              class="width-200"
              v-model="approvalForm.auditRemark"
              type="textarea"
              placeholder="请输入审批备注"
              maxlength="64"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-form>
    </el-card>
    <div class="p-4 el-card flex-1 h-full m-l-3 flex flex-column">
      <div class="flex align-items-center justify-content-between">
        <el-tabs v-model="activeName" class="flex-1">
          <el-tab-pane label="物料信息" :name="1"> </el-tab-pane>
          <el-tab-pane label="审批记录" :name="2"> </el-tab-pane>
        </el-tabs>
      </div>
      <el-divider class="m-t-3 m-b-3" />
      <div class="flex-1 table-wrap" ref="tableWrapRef">
        <baseTable
          :columns="columns"
          :table-data="tableData"
          :tableProps="tableProps"
          v-if="activeName === 1"
        >
          <template #materialTypeId="scope"
            >{{ categoryMap.get(scope.scope.row.materialTypeId)?.name }}
          </template>
          <template #unit="scope"
            >{{ unitMap.get(scope.scope.row.unit)?.cnname }}
          </template>
        </baseTable>
        <baseTable
          :columns="recordColumns"
          :table-data="recordData"
          v-if="activeName === 2"
          :tableProps="tableProps"
        >
          <template #auditStatus="scope">
            {{ getName(auditStatusOptions, scope.scope.row.auditStatus) }}
          </template>
          <template #auditTime="scope">
            {{
              new Date(scope.scope.row.auditTime)
                .toLocaleString()
                .replace(/\//g, "-")
            }}
          </template>
        </baseTable>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import {
  OutStock,
  updateAuditStatus,
  getOutStockFileList,
} from "../api/outStock";
import { getEmployee } from "@pages/employeeManagement/api/employee";
import { ElMessage } from "element-plus";
import { getStockList } from "@pages/baseManagement/api/stock";
import { findMaterialListByIds } from "@pages/baseManagement/api/material";
import { useUserStore } from "@/pinia/stores/user";
import { getCategoryListByIds } from "@pages/baseManagement/api/category";
import { getUnitListByIds } from "@pages/baseManagement/api/unit";
import { getOutBoundApply } from "@pages/outBoundApplyManagement/api/outBoundApply";
import { getInStockById } from "@pages/stockInManagement/api/inStock";
import { getOutStockDetailList } from "../api/outStockDetail";
import { getMaterialStockDetailList } from "@pages/inventoryManagement/api/stockDetail";
import baseTable from "@@/components/baseTable/baseTable.vue";
import { formatTimeToString } from "@@/utils/datetime";
import { ModuleCode } from "@/router/moduleCode";
import { getApproveDetail } from "@pages/baseManagement/api/auditFlowDetailRelation";
const props = defineProps<{
  data: OutStock | null;
  stockId: string;
  onlyView: boolean;
}>();
const formRef = ref();
const typeOptions = ref([
  { id: 1, name: "领用出库" },
  { id: 2, name: "退货出库" },
  { id: 3, name: "报废出库" },
  { id: 4, name: "其它出库" },
]);
const userStore = useUserStore();
//表单
const form = ref<OutStock>({
  originOrderId: "",
  originOrderNo: "",
  stockId: props.stockId,
  outStockNo: `${ModuleCode.OutStock}${formatTimeToString()}`,
  auditStatus: 0,
  status: 0,
  type: 1,
  description: "",
  isDirect: 1,
  outStockUserId: "",
  outStockTime: new Date(),
  deptId: "",
  files: [],
  createUserId: userStore.getInfo()?.id,
});
const approvalForm = ref({
  auditStatus: 2,
  auditRemark: "",
});
const auditStatusOptions = computed(() => [
  { id: 2, name: "审批通过" },
  { id: 1, name: "审批不通过" },
]);
const activeName = ref(1);
const materialIds = ref<string[]>([]);
const tableProps = ref({
  highlightCurrentRow: false,
});
//合并props
if (props.data) {
  Object.assign(form.value, props.data);
}
// 校验规则
let validatorOriginOrderId = (rule: any, value: string, callback: Function) => {
  if (form.value.type === 1 || form.value.type === 4) callback();
  if (value.length === 0) {
    return callback(new Error("不能为空"));
  }
  callback();
};
const rules = reactive({
  auditStatus: [{ required: true, message: "不能为空" }],
  auditRemark: [{ required: true, message: "不能为空" }],
});

const columns = ref([
  { prop: "index", label: "序号", type: 1, width: "20" },
  { prop: "materialTypeId", label: "类别" },
  { prop: "simpleName", label: "物料" },
  { prop: "brand", label: "品牌" },
  { prop: "specification", label: "规格" },
  { prop: "unit", label: "单位" },
  { prop: "count", label: "库存数量" },
  { prop: "expectedCount", label: "原单数量" },
  { prop: "actualCount", label: "出库数量" },
  { prop: "costPrice", label: "成本单价" },
  { prop: "totalCostPrice", label: "成本金额" },
  { prop: "perPrice", label: "出库单价" },
  { prop: "totalPrice", label: "总价" },
  { prop: "priceRatio", label: "税率" },
  { prop: "outStockPrice", label: "出库总价(不含税)" },
]);
const recordColumns = ref([
  { prop: "index", label: "序号", type: 1, width: "20" },
  { prop: "auditStatus", label: "审批结果" },
  { prop: "auditRemark", label: "备注" },
  { prop: "auditTime", label: "审批时间" },
  { prop: "userName", label: "审批人" },
]);
const recordData = ref<any[]>([]);
const queryRecord = async () => {
  const res: any = await getApproveDetail({
    orderId: String(props?.data?.id),
    auditStatusList: [1, 2],
  });
  recordData.value = res?.data ?? [];
};

const tableData = ref<any[]>([]);

function findNameById(tree: any[], targetId: string | number) {
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
const getName = (list: any[], targetId: string | number) => {
  return list.find((item: any) => item.id === targetId)?.name ?? "";
};
const stockOptions = ref<any[]>([{ name: "无", id: 0 }]);
const queryStockOptions = async () => {
  const res = await getStockList();
  if ((res as any)?.data?.length) {
    stockOptions.value = buildTree((res as any)?.data || []);
    if (!props.data) form.value.stockId = stockOptions.value[0]?.id;
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
// 左侧树列表

let errorTime: any;
const confirmSave = async (cb?: Function) => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const params: any = {
        orderId: props?.data?.id,
        ...approvalForm.value,
      };
      const res: any = await updateAuditStatus(params);
      if (res.code) {
        ElMessage({
          type: "success",
          message: "审批成功",
        });
        cb && cb(res.data);
      }
    }
  });
};

const download = (file: any) => {
  const a = document.createElement("a");
  a.download = file.fileName;
  const blobUrl = file.filePath;
  a.href = blobUrl;
  a.click();
};

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

const materialMap = ref<Map<string, any>>(new Map());
const queryMaterial = async () => {
  const params: any = {
    materialIds: materialIds.value,
    stockId: form.value.stockId,
  };
  const res: any = await getMaterialStockDetailList(params);
  materialMap.value.clear();
  res.data.map((item: any) => {
    materialMap.value.set(item.materialId, item);
  });
};
const hasAddMap = new Map();
const detailMap = ref<Map<String, any>>(new Map());
const refreshTable = async () => {
  if (materialIds.value.length === 0) {
    tableData.value = [];
    return;
  }
  await queryMaterial();
  const ids = materialIds.value.join(",");
  const res: any = await findMaterialListByIds(ids);
  hasAddMap.clear();
  tableData.value.map((item: any) => {
    const { materialId } = item;
    hasAddMap.set(materialId, item);
  });
  const categoryIds = res.data.map((item: any) => item.materialTypeId);
  if (categoryIds.length) await queryCategoryList(categoryIds);
  const unitIds = res.data.map((item: any) => item.unit);
  if (unitIds.length) await getUnitList(unitIds);
  tableData.value = res.data.map((item: any) => {
    const row = {
      count: 0,
      costPrice: 0,
      totalCostPrice: 0,
      expectedCount: "",
      actualCount: 0,
      perPrice: 0,
      totalPrice: 0,
      priceRatio: 0,
      outStockPrice: 0,
    };
    const material = materialMap.value.get(item.id);
    const detail = detailMap.value.get(item.id);
    const lastData = hasAddMap.get(item.id);
    if (detail) {
      Object.assign(row, detail);
    }
    if (material) {
      row.count = Number(material.count);
      row.costPrice = Number(material.costPrice);
      row.totalCostPrice = Number(material.totalCostPrice);
    }
    const result = lastData ?? { ...item, ...row, materialId: item.id };
    result.outStockPrice = Number(
      Number(
        result.totalPrice - result.totalPrice * +result.priceRatio,
      ).toFixed(2),
    );
    return result;
  });
  detailMap.value.clear();
};

onMounted(async () => {
  await queryStockOptions();
  if (props?.data?.id) {
    const userRes: any = await getEmployee(String(props.data.outStockUserId));
    form.value.outStockUserName = userRes.data.realName;
    if (form.value.type == 1) {
      const res: any = await getOutBoundApply(form.value.originOrderId);
      form.value.originOrderNo = res.data.applyNo;
    } else if (form.value.type == 2) {
      const res: any = await getInStockById(form.value.originOrderId);
      form.value.originOrderNo = res.data.inStockNo;
    }
    const detailRes: any = await getOutStockDetailList({
      outStockId: props.data.id,
    });
    detailMap.value.clear();
    materialIds.value =
      detailRes.data?.map((item: any) => {
        const { materialId } = item;
        detailMap.value.set(materialId, item);
        return materialId;
      }) ?? [];
    refreshTable();
    const fileRes = await getOutStockFileList({
      outStockId: props.data.id as any as string,
    });
    form.value.files = (fileRes as any).data.map((item: any) => {
      return {
        ...item,
        filePath: `/static` + item.filePath,
      };
    });
  }
  queryRecord();
});
defineExpose({ confirmSave });
</script>
<style lang="scss" scoped>
@use "@@/assets/styles/size.scss" as *;
.width-300 {
  width: zrem(300);
}

.table-wrap {
  height: calc(100% - zrem(45));
}
.files-wrap {
  border: zrem(1) solid var(--el-border-color);
  border-radius: zrem(8);
  padding: zrem(10);
  height: zrem(90);
  .file-item {
    line-height: zrem(30);
    height: zrem(30);
  }
}
.border {
  border: zrem(1) solid var(--el-border-color);
  border-radius: zrem(4);
}
.flex-wrap {
  flex-wrap: wrap;
}
.font-red {
  color: var(--el-color-danger);
}
.content-bg {
  background: var(--el-bg-color);
}
.box-shadow {
  box-shadow: var(--el-box-shadow-light);
}
.p-0 {
  padding: 0 !important;
}
.h-32 {
  height: zrem(32);
}
.wrap {
  width: 100%;
  height: calc(100% - zrem(8));
  margin-bottom: zrem(8);
}
.content-wrap {
  height: calc(100% - zrem(20));
}
.radius {
  border-radius: zrem(4);
  overflow: hidden;
}
.w-50 {
  width: zrem(50);
}
.dept {
  :deep {
    height: zrem(55);
    .el-form-item__content {
      height: 100% !important;
    }
  }
}
.row {
  height: zrem(32);
  margin-bottom: zrem(10);
  font-size: 14px;
  div {
    &:nth-child(1) {
      width: zrem(70);
      margin-right: zrem(16);
      text-align: right;
    }
  }
  &.file-wrap {
    height: zrem(100);
  }
}
.error {
  color: var(--el-color-danger);
}
.overflow-spot {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.person-wrap {
  height: zrem(550);
}
</style>
