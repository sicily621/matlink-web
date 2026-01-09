<template>
  <div class="flex-1 flex-column h-full">
    <div class="wrap">
      <div class="d-flex h-full">
        <div class="fill-bg radius p-16 m-r-8">
          <div class="zc-header-title">
            <div class="zc-header-icon"></div>
            <div class="zc-header-word">
              {{ i18nM("material.title.warehouseReceipt") }}
            </div>
          </div>
          <div class="d-flex relative m-r-10 m-t-20">
            <div class="d-flex">
              <div class="m-r-30">
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.warehouseReceiptNumber") }}</div>
                  <div>{{ form.inStockNo }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.title.materialWarehouse") }}</div>
                  <div>{{ findNameById(sourceOptions, form.stockId) }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.receiptType") }}</div>
                  <div>{{ getName(receiptTypeOptions, form.type) }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.sourceNumber") }}</div>
                  <div>{{ form.resourceNo }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.supplier") }}</div>
                  <div>{{ getName(supplierOptions, form.supplyId) }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.warehousingTime") }}</div>
                  <div>{{ new Date(form.inStockTime).toLocaleString().replace(/\//g, "-") }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.warehouser") }}</div>
                  <div>{{ form.inStockUserName }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.notes") }}</div>
                  <div>{{ form.description }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.direct") }}</div>
                  <div>{{ form.isDirect ? i18nM("material.enumValue.yes") : i18nM("material.enumValue.no") }}</div>
                </div>
                <div class="d-flex file-row">
                  <div class="m-t-10">{{ i18nM("material.label.attachment") }}</div>
                  <div class="d-flex w-200">
                    <div class="files-wrap w-full">
                      <el-scrollbar class="h-full">
                        <div class="d-flex justify-content-between align-items-center file-item" v-for="(file, index) in form.files">
                          <el-text default class="flex-1 overflow-spot">{{ file?.name || file.fileName }}</el-text>
                          <div class="d-flex flex-center">
                            <el-icon class="fz16 pointer m-l-8" text v-if="file.id" @click="download(file)">
                              <Download />
                            </el-icon>
                          </div>
                        </div>
                      </el-scrollbar>
                    </div>
                  </div>
                </div>
                <el-form
                  ref="formRef"
                  :model="approvalForm"
                  :rules="rules"
                  label-position="right"
                  class="relative m-r-40 m-t-20"
                  :label-width="zrem(120)"
                  v-if="approve"
                >
                  <el-form-item :label="i18nM('material.label.review')" prop="auditStatus">
                    <el-select class="w-200" v-model="approvalForm.auditStatus" :placeholder="i18nM('material.placeholder.select')">
                      <el-option v-for="item of auditStatusOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="i18nM('material.table.notes')" prop="auditRemark" class="dept">
                    <el-input
                      class="w-200"
                      v-model="approvalForm.auditRemark"
                      type="textarea"
                      :placeholder="i18nM('material.placeholder.inputDescription')"
                      maxlength="64"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </div>
        <div class="fill-bg radius flex-1 flex-column p-16">
          <div class="d-flex align-items-center justify-content-between h-32">
            <el-tabs v-model="activeName" class="flex-1">
              <el-tab-pane :label="i18nM('material.title.materialInformation')" :name="1"> </el-tab-pane>
              <el-tab-pane :label="i18nM('material.title.reviewRecord')" :name="2"> </el-tab-pane>
            </el-tabs>
          </div>
          <div class="flex-1 table-wrap" ref="tableWrapRef">
            <baseTable :columns="columns" :table-data="tableData" v-if="activeName === 1" :tableProps="tableProps"> </baseTable>
            <baseTable :columns="recordColumns" :table-data="recordData" v-if="activeName === 2" :tableProps="tableProps">
              <template #auditStatus="scope">
                {{ getName(auditStatusOptions, scope.scope.row.auditStatus) }}
              </template>
              <template #auditTime="scope">
                {{ new Date(scope.scope.row.auditTime).toLocaleString().replace(/\//g, "-") }}
              </template>
            </baseTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { stockIn, updateInStockAuditStatus } from "@functions/serviceCenter/material-management/api/instock";
import { getMaterialOutBoundApplyById } from "@functions/serviceCenter/material-management/api/materialOutBoundApply";
import { getPurchasingRequisitionById } from "@functions/serviceCenter/material-management/api/purchasingRequisition";
import { getInStockDetail } from "@functions/serviceCenter/material-management/api/instockDetail";
import { supplierInformationFindPage } from "@functions/serviceCenter/material-management/api/supplierInformation";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { ElMessage, ElMessageBox } from "element-plus";
import { materialPage } from "@functions/serviceCenter/material-management/api/material";
import { zrem } from "@static/js/theme/zrem";
import baseTable from "@static/table/baseTable/baseTable.vue";
import { usersGet } from "@functions/userCenter/api/users";
import { getApproveDetailBySubId } from "@functions/serviceCenter/material-management/api/materialAuditFlowDetailRelation";
const props = defineProps<{ data: stockIn; projectId: string | number; stockId: string | number; approve: boolean }>();
const onlyView = ref(true);
const i18nM = window.$i18nM;
const formRef = ref();
const tableWrapRef = ref();
const receiptTypeOptions = computed(() => {
  return [
    { id: 1, name: i18nM("material.enumValue.opening") },
    { id: 2, name: i18nM("material.enumValue.purchase") },
    { id: 3, name: i18nM("material.enumValue.return") },
    { id: 4, name: i18nM("material.enumValue.returnedGoods") },
    { id: 5, name: i18nM("material.enumValue.transfer") },
    { id: 6, name: i18nM("material.enumValue.others") },
  ];
});
const activeName = ref(1);
const tableProps = ref({
  highlightCurrentRow: false,
});
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
const supplierOptions = ref<any[]>([]);
const querySupplier = (cb?: Function) => {
  const params = {
    projectId: props.projectId as any as number,
    page: 0,
    size: 1000,
  };
  supplierInformationFindPage(params, (res: any) => {
    supplierOptions.value = res?.data?.content ?? [];
    if (!props.data?.id) {
      form.value.supplyId = supplierOptions.value?.[0].id;
    }
    cb && cb();
  });
};

//表单
const form = ref<stockIn>({
  projectId: props.projectId,
  resourceId: "",
  resourceNo: "",
  stockId: props.stockId,
  inStockNo: "",
  status: 0,
  inStockStatus: 0,
  supplyId: "",
  type: 1,
  description: "",
  isDirect: 1,
  inStockUserId: "",
  inStockTime: new Date(),
  source: "web",
  deptId: "",
  files: [],
});
const approvalForm = ref({
  auditStatus: 2,
  auditRemark: "",
});
const auditStatusOptions = computed(() => [
  { id: 2, name: i18nM("material.enumValue.approved") },
  { id: 1, name: i18nM("material.enumValue.rejected") },
]);
const materialIds = ref<string[]>([]);
if (props.data) {
  Object.assign(form.value, props.data);
}
const download = (file: any) => {
  const a = document.createElement("a");
  a.download = file.fileName;
  const blobUrl = file.filePath;
  a.href = blobUrl;
  a.click();
};
const rules = reactive({
  auditStatus: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  auditRemark: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
});
const sourceOptions = ref<any[]>([]);
const tableData = ref<any[]>([]);
const columns = computed(() => [
  { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
  { prop: "tradeTypeName", label: i18nM("material.table.category") },
  { prop: "simpleName", label: i18nM("material.table.material") },
  { prop: "brand", label: i18nM("material.table.brand") },
  { prop: "modelNo", label: i18nM("material.table.model") },
  { prop: "specification", label: i18nM("material.table.specifications") },
  { prop: "unitName", label: i18nM("material.table.unit") },
  { prop: "expectedCount", label: i18nM("material.table.sourceQuantity") },
  { prop: "actualCount", label: i18nM("material.table.actualQuantity") },
  { prop: "perPrice", label: i18nM("material.table.unitPrice") },
  { prop: "totalPrice", label: i18nM("material.table.totalPrice") },
  { prop: "priceRatio", label: i18nM("material.table.taxRate") },
  { prop: "inStockPrice", label: i18nM("material.table.warehousingPrice") },
]);
const recordColumns = computed(() => [
  { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
  { prop: "auditStatus", label: i18nM("material.table.operation") },
  { prop: "auditRemark", label: i18nM("material.table.notes") },
  { prop: "auditTime", label: i18nM("material.table.operateTime") },
  { prop: "userName", label: i18nM("material.table.operator") },
]);
const recordData = ref<any[]>([]);
const queryRecord = () => {
  getApproveDetailBySubId({ subId: String(props.data.id) }, (res: any) => {
    recordData.value = res?.data ?? [];
  });
};

const confirmSave = (cb: Function) => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const params: any = {
        subId: props.data.id,
        ...approvalForm.value,
      };
      updateInStockAuditStatus(params, (res: any) => {
        if (res.code) {
          ElMessage({
            type: "success",
            message: i18nM("material.message.reviewSuccess"),
          });
          cb && cb(res.data);
        }
      });
    }
  });
};
const refreshTable = () => {
  if (materialIds.value.length === 0) {
    tableData.value = [];
    return;
  }
  const params: any = {
    projectId: props.projectId,
    page: 0,
    size: 1000,
    ids: materialIds.value,
  };
  materialPage(params, (res: any) => {
    const { content } = res.data;
    tableData.value = content.map((item: any) => {
      const row = { expectedCount: "", actualCount: 0, perPrice: 0, totalPrice: 0, priceRatio: 0, inStockPrice: 0 };
      const detail = detailMap.value.get(item.id);
      if (detail) {
        Object.assign(row, detail);
      }
      return { ...item, ...row, tradeId: item.id };
    });
  });
};
const detailMap = ref<Map<String, any>>(new Map());
onMounted(() => {
  querySupplier();
  materialStockFindStockTree({ projectId: props.projectId }, (res: any) => {
    sourceOptions.value = res.data;
  });
  usersGet({ userId: String(props.data.inStockUserId) }, (res: any) => {
    form.value.inStockUserName = res.data.name;
  });
  if (form.value.type == 3) {
    getMaterialOutBoundApplyById({ id: form.value.resourceId }, (res: any) => {
      form.value.resourceNo = res.data.applyNo;
    });
  } else if (form.value.type == 2) {
    getPurchasingRequisitionById({ id: form.value.resourceId }, (res: any) => {
      form.value.resourceNo = res.data.billNo;
    });
  }
  getInStockDetail({ inStockId: String(props.data.id) }, (res: any) => {
    detailMap.value.clear();
    materialIds.value =
      res.data?.map((item: any) => {
        const { tradeId } = item;
        detailMap.value.set(tradeId, item);
        return tradeId;
      }) ?? [];
    refreshTable();
  });
  queryRecord();
});
defineExpose({
  confirmSave,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.files-wrap {
  border: zrem(1) solid var(--el-border-color);
  border-radius: zrem(8);
  padding: zrem(10);
  height: zrem(60);
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
  div {
    &:nth-child(1) {
      width: zrem(120);
      margin-right: zrem(16);
      text-align: right;
    }
  }
}
.file-row {
  margin-bottom: zrem(10);
  & > div {
    &:nth-child(1) {
      width: zrem(120);
      margin-right: zrem(16);
      text-align: right;
    }
  }
}
</style>
