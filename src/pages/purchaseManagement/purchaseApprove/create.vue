<template>
  <div class="flex">
    <el-card class="width-200 h-full">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">采购单</div>
      </div>
      <el-divider class="m-t-3 m-b-3" />

      <div class="width-300">
        <div class="flex row align-items-center">
          <div>采购单号</div>
          <div>{{ form.billNo }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>物料库</div>
          <div>{{ findNameById(stockOptions, form.stockId) }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>采购日期</div>
          <div>
            {{ new Date(form.applyDate).toLocaleString().replace(/\//g, "-") }}
          </div>
        </div>
        <div class="flex row align-items-center">
          <div>申请部门</div>
          <div>{{ form.deptName }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>申请人</div>
          <div>{{ form.applyUserName }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>用途</div>
          <div>{{ form.description }}</div>
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
          <template #imageUrls="scope">
            <div class="icons-con">
              <div class="icon-con" v-for="url in scope.scope.row.imageUrls">
                <img :src="`/static${url}`" />
              </div>
            </div>
          </template>
          <template #supplierId="scope">
            {{ getName(supplierOptions, scope.scope.row.supplierId) }}
          </template>
          <template #inventoryCount="scope">
            <div class="w-25">
              <el-badge
                value="紧急缺货"
                v-if="
                  scope.scope.row.inventoryCount <=
                  scope.scope.row.minCountLimit
                "
              >
                <el-tag type="danger">
                  {{ scope.scope.row.inventoryCount }}
                </el-tag>
              </el-badge>
              <el-badge
                value="缺货"
                v-else-if="
                  scope.scope.row.inventoryCount >
                    scope.scope.row.minCountLimit &&
                  scope.scope.row.inventoryCount <
                    scope.scope.row.safeCountLimit
                "
              >
                <el-tag type="danger">
                  {{ scope.scope.row.inventoryCount }}
                </el-tag>
              </el-badge>
              <el-badge
                value="积压"
                v-else-if="
                  scope.scope.row.inventoryCount >
                    scope.scope.row.safeCountLimit &&
                  scope.scope.row.inventoryCount < scope.scope.row.maxCountLimit
                "
              >
                <el-tag type="danger">
                  {{ scope.scope.row.inventoryCount }}
                </el-tag>
              </el-badge>
              <el-badge
                value="严重积压"
                v-else-if="
                  scope.scope.row.inventoryCount >=
                  scope.scope.row.maxCountLimit
                "
              >
                <el-tag type="danger">
                  {{ scope.scope.row.inventoryCount }}
                </el-tag>
              </el-badge>
              <el-tag type="primary" v-else>
                {{ scope.scope.row.inventoryCount }}
              </el-tag>
            </div>
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
  Purchase,
  createPurchase,
  editPurchase,
  updateAuditStatus,
} from "../api/purchase";
import {
  getDepartmentList,
  getDepartment,
} from "@pages/employeeManagement/api/department";
import {
  getEmployeeList,
  getEmployee,
} from "@pages/employeeManagement/api/employee";
import { ElMessage } from "element-plus";
import { getStockList } from "@pages/baseManagement/api/stock";
import { More, Search, CircleClose } from "@element-plus/icons-vue";
import { findMaterialListByIds } from "@pages/baseManagement/api/material";
import { useUserStore } from "@/pinia/stores/user";
import { getCategoryListByIds } from "@pages/baseManagement/api/category";
import { getUnitListByIds } from "@pages/baseManagement/api/unit";
import { getPurchaseDetailList } from "@pages/purchaseManagement/api/purchaseDetail";
import { getSupplierList } from "@pages/baseManagement/api/supplier";
import {
  savePurchaseDetail,
  deletePurchaseDetail,
} from "../api/purchaseDetail";
import { getMaterialStockDetailList } from "@pages/inventoryManagement/api/stockDetail";
import baseTable from "@@/components/baseTable/baseTable.vue";
import { formatTimeToString } from "@@/utils/datetime";
import { ModuleCode } from "@/router/moduleCode";
import { getApproveDetail } from "@pages/baseManagement/api/auditFlowDetailRelation";
const props = defineProps<{
  data: Purchase | null;
  stockId: string;
  onlyView: boolean;
}>();
const errorShow = ref(false);
const formRef = ref();
const title = ref("");
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
const approvalForm = ref({
  auditStatus: 2,
  auditRemark: "",
});
const auditStatusOptions = computed(() => [
  { id: 2, name: "审批通过" },
  { id: 1, name: "审批不通过" },
]);
const activeName = ref(1);
const userStore = useUserStore();
//表单
const form = ref<Purchase>({
  stockId: props.stockId,
  billNo: `${ModuleCode.Purchase}${formatTimeToString()}`,
  auditStatus: 0,
  status: 0,
  description: "",
  applyUserId: "",
  applyDate: new Date(),
  deptId: "",
  createUserId: userStore.getInfo()?.id,
});
const getName = (list: any[], targetId: string | number) => {
  return list.find((item: any) => item.id === targetId)?.name ?? "";
};
const materialIds = ref<string[]>([]);
const tableProps = ref({
  highlightCurrentRow: false,
});
const editCountRow = ref<any>(null);
const editPriceRow = ref<any>(null);
const editSupplyRow = ref<any>(null);
const targetRowCol = (type: number, e: any) => {
  if (props.onlyView) return;
  if (type === 1) {
    editCountRow.value = e;
  } else if (type === 2) {
    editPriceRow.value = e;
  } else if (type === 3) {
    editSupplyRow.value = e;
  }
};
//合并props
if (props.data) {
  Object.assign(form.value, props.data);
}
const rules = reactive({
  auditStatus: [{ required: true, message: "不能为空" }],
  auditRemark: [{ required: true, message: "不能为空" }],
});
const columns = ref([
  { prop: "index", label: "序号", type: 1, width: "20" },
  { prop: "materialTypeId", label: "类别" },
  { prop: "code", label: "编码" },
  { prop: "simpleName", label: "物料" },
  { prop: "brand", label: "品牌" },
  { prop: "unit", label: "单位" },
  { prop: "count", label: "采购数量" },
  { prop: "perPrice", label: "单价" },
  { prop: "totalPrice", label: "总价" },
  { prop: "supplierId", label: "供应商" },
  { prop: "inventoryCount", label: "库存数量" },
  { prop: "safeCountLimit", label: "安全数量" },
  { prop: "minCountLimit", label: "最低库存" },
  { prop: "maxCountLimit", label: "最高库存" },
]);
const applyUserId = ref("");
const applyUserName = ref("");

const tableData = ref<any[]>([]);

const now = new Date();

const userTableData = ref<any[]>([]);
const tableRef = ref();
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
const supplierOptions = ref<any[]>([{ name: "无", id: 0 }]);
const querySupplierOptions = async () => {
  const res = await getSupplierList();
  if ((res as any)?.data?.length) {
    supplierOptions.value = (res as any)?.data || [];
    supplierOptions.value.unshift({ name: "无", id: 0 });
  }
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
    const row: any = { count: 0, perPrice: 0, totalPrice: 0, supplierId: 0 };
    const material = materialMap.value.get(item.id);
    const detail = detailMap.value.get(item.id);
    const lastData = hasAddMap.get(item.id);
    if (detail) {
      Object.assign(row, detail);
    }
    if (material) {
      row.inventoryCount = Number(material.count);
    } else {
      row.inventoryCount = 0;
    }
    const result = lastData ?? { ...item, ...row, materialId: item.id };
    return result;
  });
  detailMap.value.clear();
};

onMounted(async () => {
  await queryStockOptions();
  await querySupplierOptions();
  if (props?.data?.id) {
    const userRes: any = await getEmployee(String(props.data.applyUserId));
    form.value.applyUserName = userRes.data.realName;
    const deptRes: any = await getDepartment(String(props.data.deptId));
    form.value.deptName = deptRes.data.name;
    const detailRes: any = await getPurchaseDetailList({
      billId: props.data.id,
    });
    detailMap.value.clear();
    materialIds.value =
      detailRes.data?.map((item: any) => {
        const { materialId } = item;
        detailMap.value.set(materialId, item);
        return materialId;
      }) ?? [];
    refreshTable();
    queryRecord();
  }
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
