<template>
  <div class="flex">
    <el-card class="width-200 h-full">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">入库单</div>
      </div>
      <el-divider class="m-t-3 m-b-3" />

      <div class="width-300">
        <div class="flex row align-items-center">
          <div>入库单号</div>
          <div>{{ form.inStockNo }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>物料库</div>
          <div>{{ findNameById(stockOptions, form.stockId) }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>入库类型</div>
          <div>{{ getName(typeOptions, form.type) }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>源单号</div>
          <div>{{ form.originOrderNo }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>供应商</div>
          <div>{{ getName(supplierOptions, form.supplyId) }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>入库时间</div>
          <div>
            {{
              new Date(form.inStockTime).toLocaleString().replace(/\//g, "-")
            }}
          </div>
        </div>
        <div class="flex row align-items-center">
          <div>入库人</div>
          <div>{{ form.inStockUserName }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>备注</div>
          <div>{{ form.description }}</div>
        </div>
        <div class="flex row align-items-center">
          <div>直接入库</div>
          <div>{{ form.isDirect ? "是" : "否" }}</div>
        </div>
        <div
          class="flex row align-items-center file-wrap"
          label="附件"
          v-if="form.files?.length"
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
import { InStock, getInStockFileList, updateAuditStatus } from "../api/inStock";
import { getEmployee } from "@pages/employeeManagement/api/employee";
import { ElMessage } from "element-plus";
import { getStockList } from "@pages/baseManagement/api/stock";
import { getSupplierList } from "@pages/baseManagement/api/supplier";
import { findMaterialListByIds } from "@pages/baseManagement/api/material";
import { useUserStore } from "@/pinia/stores/user";
import { getCategoryListByIds } from "@pages/baseManagement/api/category";
import { getUnitListByIds } from "@pages/baseManagement/api/unit";
import { getOutBoundApplyDetailList } from "@pages/outBoundApplyManagement/api/outBoundApplyDetail";
import { getPurchaseDetailList } from "@pages/purchaseManagement/api/purchaseDetail";
import { getOutBoundApply } from "@pages/outBoundApplyManagement/api/outBoundApply";
import { getPurchase } from "@pages/purchaseManagement/api/purchase";
import { getInStockDetailList } from "../api/inStockDetail";
import { getApproveDetail } from "@pages/baseManagement/api/auditFlowDetailRelation";
import baseTable from "@@/components/baseTable/baseTable.vue";
const props = defineProps<{
  data: InStock | null;
  stockId: string;
  onlyView: boolean;
}>();
const errorShow = ref(false);
const formRef = ref();
const title = ref("");
const selectProps = { value: "id", label: "name" };
const typeOptions = ref([
  { id: 1, name: "期初入库" },
  { id: 2, name: "采购入库" },
  { id: 3, name: "归还入库" },
  { id: 4, name: "其它入库" },
]);
const userStore = useUserStore();
//表单
const form = ref<InStock>({
  originOrderId: "",
  originOrderNo: "",
  stockId: props.stockId,
  inStockNo: "",
  auditStatus: 0,
  status: 0,
  supplyId: 0,
  type: 1,
  description: "",
  isDirect: 1,
  inStockUserId: "",
  inStockTime: new Date(),
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
const editCountRow = ref<any>(null);
const editPriceRow = ref<any>(null);
const editTaxRow = ref<any>(null);
//合并props
if (props.data) {
  Object.assign(form.value, props.data);
}
const rules = reactive({
  auditStatus: [{ required: true, message: "不能为空" }],
  auditRemark: [{ required: true, message: "不能为空" }],
});
const userColumns = computed(() => [
  { prop: "index", label: "序号", type: 1, width: "20" },
  { prop: "realName", label: "名称" },
  { prop: "username", label: "用户名" },
  { prop: "code", label: "用户编号" },
]);
const columns = computed(() => {
  return [
    { prop: "index", label: "序号", type: 1, width: "20" },
    { prop: "materialTypeId", label: "类别" },
    { prop: "simpleName", label: "物料" },
    { prop: "brand", label: "品牌" },
    { prop: "modelNo", label: "型号" },
    { prop: "specification", label: "规格" },
    { prop: "unit", label: "单位" },
    { prop: "expectedCount", label: "原单数量" },
    { prop: "actualCount", label: "实际数量" },
    { prop: "perPrice", label: "入库单价" },
    { prop: "totalPrice", label: "总价" },
    { prop: "priceRatio", label: "税率" },
    { prop: "inStockPrice", label: "入库总价(不含税)" },
  ];
});
const recordColumns = computed(() => [
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
const supplierOptions = ref<any[]>([{ name: "无", id: 0 }]);
const querySupplierOptions = async () => {
  const res = await getSupplierList();
  if ((res as any)?.data?.length) {
    supplierOptions.value = (res as any)?.data || [];
    supplierOptions.value.unshift({ name: "无", id: 0 });
    if (!props.data) form.value.supplyId = supplierOptions.value[0]?.id;
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
const departmentOptions = ref<any[]>([{ name: "无", id: 0 }]);
// 左侧树列表
const virtualRootId = "root";
const treeData: any = ref<any[]>([]);
//树列表默认展开建筑
const expandedKeys = ref<Array<number | string>>([virtualRootId]);
//树列表当前选中建筑
const currentNodeKey = ref<number | string>("");
const deptTreeRef = ref();

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
const hasAddMap = new Map();
const detailMap = ref<Map<String, any>>(new Map());
const refreshTable = async () => {
  if (materialIds.value.length === 0) {
    tableData.value = [];
    return;
  }
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
      expectedCount: "",
      actualCount: 0,
      perPrice: 0,
      totalPrice: 0,
      priceRatio: 0,
      inStockPrice: 0,
    };
    const detail = detailMap.value.get(item.id);
    const lastData = hasAddMap.get(item.id);
    if (detail) {
      Object.assign(row, detail);
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
    const userRes: any = await getEmployee(String(props.data.inStockUserId));
    form.value.inStockUserName = userRes.data.realName;
    if (form.value.type == 3) {
      const res: any = await getOutBoundApply(form.value.originOrderId);
      form.value.originOrderNo = res.data.applyNo;
    } else if (form.value.type == 2) {
      const res: any = await getPurchase(form.value.originOrderId);
      form.value.originOrderNo = res.data.billNo;
    }
    const detailRes: any = await getInStockDetailList({
      inStockId: props.data.id,
    });
    detailMap.value.clear();
    materialIds.value =
      detailRes.data?.map((item: any) => {
        const { materialId } = item;
        detailMap.value.set(materialId, item);
        return materialId;
      }) ?? [];
    refreshTable();
    const fileRes = await getInStockFileList({
      inStockId: props.data.id as any as string,
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
