<template>
  <div class="flex-1 flex-column h-full">
    <div class="wrap">
      <div class="d-flex h-full">
        <div class="fill-bg radius p-16 m-r-8">
          <div class="zc-header-title">
            <div class="zc-header-icon"></div>
            <div class="zc-header-word">
              {{ i18nM("material.title.materialApply") }}
            </div>
          </div>
          <div class="d-flex relative m-r-10 m-t-20">
            <div class="d-flex">
              <div class="m-r-30">
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.applicationForm") }}</div>
                  <div>{{ form.applyNo }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.title.materialWarehouse") }}</div>
                  <div>{{ findNameById(sourceOptions, form.stockId) }}</div>
                </div>

                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.applicationTime") }}</div>
                  <div>{{ new Date(form.applyTime).toLocaleString().replace(/\//g, "-") }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.applicationDepartment") }}</div>
                  <div>{{ form.deptName }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.applicant") }}</div>
                  <div>{{ form.applyUserName }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.usage") }}</div>
                  <div>{{ form.useage }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.notes") }}</div>
                  <div>{{ form.description }}</div>
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
            <baseTable :columns="columns" :table-data="tableData" v-if="activeName === 1" :tableProps="tableProps">
              <template #applyCount="scope">
                <el-input-number
                  v-if="editCountRow?.id == scope.scope.row.id"
                  size="small"
                  class="w-90"
                  v-model="scope.scope.row.applyCount"
                  :precision="0"
                  :step="1"
                  :min="0"
                  :max="scope.scope.row.inventoryCount"
                />
                <div v-if="editCountRow?.id != scope.scope.row.id" @click="targetRowCol(1, scope.scope.row)" class="pointer">
                  {{ scope.scope.row.applyCount }}
                </div>
              </template>
              <template #operate="scope">
                <el-icon class="fz20 pointer" text @click="removeMaterial(scope.scope.row)">
                  <Delete />
                </el-icon>
              </template>
            </baseTable>
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
import AddIcon from "@static/images/add.png";
import { ref, reactive, onMounted, computed } from "vue";
import { MaterialApply, updateAuditStatus } from "@functions/serviceCenter/material-management/api/materialOutBoundApply";
import { saveMaterialApplyDetail, getMaterialApplyDetail } from "@functions/serviceCenter/material-management/api/materialOutBoundApplyDetail";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { materialPage } from "@functions/serviceCenter/material-management/api/material";
import { postMaterialStockDetailList } from "@functions/serviceCenter/material-management/api/materialStockDetail";
import { ElMessage, ElMessageBox } from "element-plus";
import { zrem } from "@static/js/theme/zrem";
import baseTable from "@static/table/baseTable/baseTable.vue";
import { usersGet } from "@functions/userCenter/api/users";
import { postDepartmentsByIds } from "@functions/userCenter/api/departments";
import { getApproveDetailBySubId } from "@functions/serviceCenter/material-management/api/materialAuditFlowDetailRelation";
const props = defineProps<{ data: MaterialApply; projectId: string | number; stockId: string | number; approve: boolean }>();
const i18nM = window.$i18nM;
const formRef = ref();
const tableWrapRef = ref();
const tableProps = ref({
  highlightCurrentRow: false,
});
const activeName = ref(1);
const editCountRow = ref<any>(null);
const targetRowCol = (type: number, e: any) => {
  if (!props.approve) return;
  editCountRow.value = e;
};
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

//表单
const form = ref<MaterialApply>({
  projectId: props.projectId,
  stockId: props.stockId,
  applyNo: "",
  status: 0,
  applyStatus: 0,
  description: "",
  useage: "",
  applyUserId: "",
  applyTime: new Date(),
  deptId: "",
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

const rules = reactive({
  auditStatus: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  auditRemark: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
});
const sourceOptions = ref<any[]>([]);
const tableData = ref<any[]>([]);
const columns = computed(() => {
  const result: any[] = [
    { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
    { prop: "tradeTypeName", label: i18nM("material.table.category") },
    { prop: "code", label: i18nM("material.table.code") },
    { prop: "simpleName", label: i18nM("material.table.material") },
    { prop: "brand", label: i18nM("material.table.brand") },
    { prop: "specification", label: i18nM("material.table.specifications") },
    { prop: "unitName", label: i18nM("material.table.unit") },
    { prop: "applyCount", label: i18nM("material.table.applyCount"), type: props.approve ? 0 : 8 },
    { prop: "actualCount", label: i18nM("material.table.actualQuantity") },
    { prop: "inventoryCount", label: i18nM("material.table.inventoryCount") },
  ];
  if (props.approve) result.push({ prop: "operate", type: 2, label: i18nM("material.table.operate"), width: 100 });
  return result;
});
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
const removeMaterial = (row: any) => {
  ElMessageBox.confirm(i18nM("material.modal.confirmDeleteMaterial"), i18nM("material.title.deleteMaterial"), {
    confirmButtonText: i18nM("material.button.delete"),
    confirmButtonClass: "w-80",
    cancelButtonText: i18nM("material.button.cancel"),
    cancelButtonClass: "message-box-cancel-btn w-80",
    type: "warning",
  })
    .then(() => {
      materialIds.value = materialIds.value.filter((id: any) => id !== row.tradeId);
      ElMessage({
        type: "success",
        message: i18nM("material.message.deleteSuccess"),
      });
      refreshTable();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: i18nM("material.message.cancelDelete"),
      });
    });
};
const errorShow = ref(false);
let errorTime: any;
const confirmSave = (cb: Function) => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (tableData.value.length == 0) {
        errorShow.value = true;
        if (errorTime) clearTimeout(errorTime);
        errorTime = setTimeout(() => {
          errorShow.value = false;
        }, 5000);
        return;
      }
      const params: any = {
        subId: props.data.id,
        ...approvalForm.value,
      };
      updateAuditStatus(params, (res: any) => {
        if (res.code) {
          const params: any = tableData.value.map((item: any) => {
            const { tradeId, applyCount, actualCount } = item;
            const result = {
              projectId: props.projectId,
              applyId: res.data.id,
              tradeId,
              actualCount,
              applyCount,
            };
            return result;
          });
          saveMaterialApplyDetail(params, (saveRes: any) => {
            if (saveRes.code) {
              ElMessage({
                type: "success",
                message: i18nM("material.message.reviewSuccess"),
              });
              cb && cb(res.data);
            }
          });
        }
      });
    }
  });
};
const materialMap = ref<Map<string, any>>(new Map());
const queryMaterial = (cb: Function) => {
  const params: any = {
    projectId: props.projectId,
    tradeIds: materialIds.value,
    stockId: form.value.stockId,
  };
  postMaterialStockDetailList(params, (res: any) => {
    materialMap.value.clear();
    res.data.map((item: any) => {
      materialMap.value.set(item.tradeId, item);
    });
    cb();
  });
};
const hasAddMap = new Map();
const refreshTable = () => {
  if (materialIds.value.length === 0) {
    tableData.value = [];
    return;
  }
  queryMaterial(() => {
    const params: any = {
      projectId: props.projectId,
      page: 0,
      size: 1000,
      ids: materialIds.value,
    };
    materialPage(params, (res: any) => {
      const { content } = res.data;
      hasAddMap.clear();
      tableData.value.map((item: any) => {
        const { tradeId } = item;
        hasAddMap.set(tradeId, item);
      });
      tableData.value = content.map((item: any) => {
        const row: any = { applyCount: 0, actualCount: item.actualCount };
        const material = materialMap.value.get(item.id);
        const detail = detailMap.value.get(item.id);
        const lastData = hasAddMap.get(item.id);
        if (detail) {
          Object.assign(row, detail);
        }
        if (material) {
          row.inventoryCount = Number(material.count);
        }
        const result = lastData ?? { ...item, ...row, tradeId: item.id };
        return result;
      });
      detailMap.value.clear();
    });
  });
};
const getDepartmentName = () => {
  postDepartmentsByIds([String(form.value.deptId)], (res: any) => {
    form.value.deptName = res?.data?.[0]?.name ?? "";
  });
};
const detailMap = ref<Map<String, any>>(new Map());
onMounted(() => {
  getDepartmentName();
  materialStockFindStockTree({ projectId: props.projectId }, (res: any) => {
    sourceOptions.value = res.data;
  });
  if (props?.data?.id) {
    usersGet({ userId: String(props.data.applyUserId) }, (res: any) => {
      form.value.applyUserName = res.data.name;
    });
    getMaterialApplyDetail({ applyId: props.data.id }, (res: any) => {
      detailMap.value.clear();
      materialIds.value =
        res.data?.map((item: any) => {
          const { tradeId } = item;
          detailMap.value.set(tradeId, item);
          return tradeId;
        }) ?? [];
      refreshTable();
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
.error {
  color: var(--el-color-danger);
}
</style>
