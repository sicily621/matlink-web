<template>
  <div class="flex-1 flex-column h-full">
    <div class="wrap">
      <div class="d-flex h-full">
        <div class="fill-bg radius p-16 m-r-8">
          <div class="zc-header-title">
            <div class="zc-header-icon"></div>
            <div class="zc-header-word">
              {{ i18nM("material.title.purchaseOrder") }}
            </div>
          </div>
          <div class="d-flex relative m-r-10 m-t-20">
            <div class="d-flex">
              <div class="m-r-30">
                <div class="d-flex row align-items-center">
                  <div>
                    {{ i18nM("material.label.purchaseOddNumbers") }}
                  </div>
                  <div>{{ form.billNo }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.title.materialWarehouse") }}</div>
                  <div>{{ findNameById(sourceOptions, form.stockId) }}</div>
                </div>

                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.applicationDate") }}</div>
                  <div>
                    {{ new Date(form.inStockTime).toLocaleString().replace(/\//g, "-") }}
                  </div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.applicationDepartment") }}</div>
                  <div>{{ form.applicationDeptName }}</div>
                </div>

                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.applicant") }}</div>
                  <div>{{ form.applicantName }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.use") }}</div>
                  <div>{{ form.description }}</div>
                </div>

                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.purchaseStatus") }}</div>
                  <div>
                    {{ getName(purchaseStatusOptions, form.purchaseStatus) }}
                  </div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.approveStatus") }}</div>
                  <div>
                    {{ getName(approveStatusOptions, form.approveStatus) }}
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
import { getDeptTreeByCurUserId, departmentsGetNameMapByIds } from "@functions/userCenter/api/departments";
import { updateAuditStatus } from "@functions/serviceCenter/material-management/api/purchasingRequisition";
import { purchasingRequisitionDetailsFindByBillId } from "@functions/serviceCenter/material-management/api/purchasingRequisitionDetails";

import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { materialPage } from "@functions/serviceCenter/material-management/api/material";
import { ElMessage } from "element-plus";
import { zrem } from "@static/js/theme/zrem";
import baseTable from "@static/table/baseTable/baseTable.vue";
import { usersGet } from "@functions/userCenter/api/users";
import { getApproveDetailBySubId } from "@functions/serviceCenter/material-management/api/materialAuditFlowDetailRelation";
const props = defineProps<{
  data: any;
  projectId: string | number;
  stockId: string | number;
  approve: boolean;
}>();

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

const applicantId = ref("");
const applicantName = ref("");
const applicationDeptId = ref("");
const applicationDeptName = ref("");
const approveStatus = ref();
const oddNumbers = ref();
const approveStatusOptions = computed(() => {
  return [
    { id: "", name: i18nM("material.enumValue.all") },
    { id: 0, name: i18nM("material.enumValue.pendingReview") },
    { id: 3, name: i18nM("material.enumValue.underReview") },
    { id: 2, name: i18nM("material.enumValue.approved") },
    { id: 1, name: i18nM("material.enumValue.rejected") },
  ];
});
const purchaseStatus = ref();
const purchaseStatusOptions = computed(() => {
  return [
    { id: "", name: i18nM("material.enumValue.all") },
    { id: 0, name: i18nM("material.enumValue.notPurchased") },
    { id: 1, name: i18nM("material.enumValue.purchased") },
    { id: 2, name: i18nM("material.enumValue.voided") },
    { id: 3, name: i18nM("material.enumValue.received") },
  ];
});
//表单
const form = ref<any>({
  projectId: props.projectId,
  resourceId: "1",
  stockId: props.stockId,
  billNo: "",
  status: 0,
  purchaseStatus: "",
  approveStatus: "",
  inStockStatus: 0,
  applicationDeptName: "",
  applicantName: "",
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

const auditStatusOptions = computed(() => {
  return [
    { id: "", name: i18nM("material.enumValue.all") },
    { id: 0, name: i18nM("material.enumValue.pendingReview") },
    { id: 3, name: i18nM("material.enumValue.underReview") },
    { id: 2, name: i18nM("material.enumValue.approved") },
    { id: 1, name: i18nM("material.enumValue.rejected") },
  ];
});
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
  {
    prop: "index",
    label: i18nM("material.table.index"),
    type: 1,
    width: "100%",
  },
  { prop: "tradeTypeName", label: i18nM("material.table.classify") },
  { prop: "code", label: i18nM("material.table.code") },

  { prop: "name", label: i18nM("material.table.material") },
  { prop: "brand", label: i18nM("material.table.brand") },
  {
    prop: "count",
    label: i18nM("material.table.purchaseNumber"),
    type: props.onlyView ? 0 : 8,
  },
  { prop: "unitName", label: i18nM("material.table.unit") },
]);
const recordColumns = computed(() => [
  {
    prop: "index",
    label: i18nM("material.table.index"),
    type: 1,
    width: "100%",
  },
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
      updateAuditStatus(params, (res: any) => {
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
const detailMap = ref<Map<String, any>>(new Map());

const refreshTable = () => {
  // debugger;
  // if (materialIds.value.length === 0) {
  //   tableData.value = [];
  //   return;
  // }
  const params: any = {
    billId: props.data.id,
  };
  purchasingRequisitionDetailsFindByBillId(params, (res: any) => {
    detailMap.value.clear();

    const flattenedArray = res.data.map((item) => Object.assign({}, item.material, { count: item.count }));
    // const materialsArray = res.data.map((item) => item.material);
    tableData.value = flattenedArray;
    materialIds.value = res.data
      .map((item: any) => (item.material ? item.material.id : null))
      .filter((id) => id !== null && id !== undefined)
      .filter((id, index, array) => array.indexOf(id) === index);
  });
};
onMounted(() => {
  materialStockFindStockTree({ projectId: props.projectId }, (res: any) => {
    sourceOptions.value = res.data;
  });
  if (props?.data?.id) {
    form.value.approveStatus = props.data.status;
    form.value.purchaseStatus = props.data.purStatus;

    applicantId.value = props.data.applyUserId;
    applicationDeptId.value = props.data.deptId;
    // getTableData();
    usersGet({ userId: String(props.data.applyUserId) }, (res: any) => {
      form.value.applicantName = res.data.name;
    });
    const deptIds: string[] = [];
    deptIds.push(props.data.deptId);
    departmentsGetNameMapByIds(deptIds, (res: any) => {
      form.value.applicationDeptName = Object.values(res.data)[0];
    });
    refreshTable();
  } else {
    purchasingRequisitionGenerateBillNo((res: any) => {
      form.value.billNo = res.data;
    });
  }

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
