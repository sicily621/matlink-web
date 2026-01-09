<template>
  <div class="flex-1 flex-column h-full">
    <div class="content-wrap">
      <div class="d-flex flex-1 h-full">
        <div class="fill-bg h-full radius">
          <div class="zc-header-title m-t-16 m-l-20 m-b-16">
            <div class="zc-header-icon"></div>
            <div class="zc-header-word">
              {{ i18nM("material.label.stocktakingInfo") }}
            </div>
          </div>
          <div class="m-r-30">
            <div class="d-flex row align-items-center">
              <div>{{ i18nM("material.label.name") }}</div>
              <div>{{ form.name }}</div>
            </div>
            <div class="d-flex row align-items-center">
              <div>{{ i18nM("material.label.type") }}</div>
              <div>{{ findNameById(typeOptions, form.taskType) }}</div>
            </div>
            <div class="d-flex row align-items-center">
              <div>{{ i18nM("material.label.type") }}</div>
              <div>{{ findNameById(typeOptions, form.taskType) }}</div>
            </div>
            <div class="d-flex row align-items-center">
              <div>{{ i18nM("material.title.materialWarehouse") }}</div>
              <div>{{ findNameById(sourceOptions, form.stockId) }}</div>
            </div>
            <div class="d-flex row align-items-center">
              <div>{{ i18nM("material.table.handleUserId") }}</div>
              <div>{{ form.handleUserName }}</div>
            </div>
            <div class="d-flex row align-items-center">
              <div>{{ i18nM("material.table.startTime") }}</div>
              <div>{{ new Date(form.startTime).toLocaleDateString().replace(/\//g, "-") }}</div>
            </div>
            <div class="d-flex row align-items-center">
              <div>{{ i18nM("material.table.endTime") }}</div>
              <div>{{ new Date(form.endTime).toLocaleDateString().replace(/\//g, "-") }}</div>
            </div>
            <div class="d-flex row align-items-center">
              <div>{{ i18nM("material.table.stocktakingNone") }}</div>
              <div>{{ form.stocktakingNone ? i18nM("material.enumValue.yes") : i18nM("material.enumValue.no") }}</div>
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
        <div class="flex-1 h-full flex-column fill-bg m-l-10 radius p-l-10 p-r-10" v-if="form.taskType == 2">
          <div class="flex-1 table-wrap" ref="tableWrapRef">
            <baseTable :columns="columns" :table-data="tableData"> </baseTable>
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
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { Task, Status, TaskStatus, updateTaskAuditStatus } from "@functions/serviceCenter/material-management/api/task";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { getTaskDetail } from "@functions/serviceCenter/material-management/api/taskDetail";
import { materialPage } from "@functions/serviceCenter/material-management/api/material";
import { usersGet } from "@functions/userCenter/api/users";
import { ElMessage } from "element-plus";
import { zrem } from "@static/js/theme/zrem";
import baseTable from "@static/table/baseTable/baseTable.vue";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { getPageSizeCount, getPageCount } from "@static/js/page/utils";
const props = defineProps<{ data: Task; approve: boolean; projectId: string | number; stockId: string | number }>();
const i18nM = window.$i18nM;
const formRef = ref();
const tableWrapRef = ref();
const defaultCurrentDate = new Date();
defaultCurrentDate.setHours(0, 0, 0, 0);
const defaultEndDate = new Date(defaultCurrentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
const approvalForm = ref({
  auditStatus: 2,
  auditRemark: "",
});
const auditStatusOptions = computed(() => [
  { id: 2, name: i18nM("material.enumValue.approved") },
  { id: 1, name: i18nM("material.enumValue.rejected") },
]);
//表单
const form = ref<Task>({
  projectId: props.projectId,
  name: "",
  taskType: 1,
  stockId: props.stockId,
  handleUserId: "",
  handleUserName: "",
  startTime: defaultCurrentDate,
  endTime: defaultEndDate,
  stocktakingNone: 1,
  description: "",
  status: Status.Pending,
  taskStatus: TaskStatus.NotYetAssessed,
});
const materialIds = ref<string[]>([]);
if (props.data) {
  Object.assign(form.value, props.data);
}
const rules = reactive({
  auditStatus: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  auditRemark: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
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
const typeOptions = computed(() => {
  return [
    { id: 1, name: i18nM("material.enumValue.allStocktaking2") },
    { id: 2, name: i18nM("material.enumValue.partial") },
  ];
});
const sourceOptions = ref<any[]>([]);
const tableData = ref<any[]>([]);
const columns = computed(() => [
  { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
  { prop: "code", label: i18nM("material.table.code") },
  { prop: "simpleName", label: i18nM("material.label.abbreviation") },
  { prop: "tradeTypeName", label: i18nM("material.table.taskType") },
  { prop: "brand", label: i18nM("material.table.brand") },
  { prop: "modelNo", label: i18nM("material.table.model") },
  { prop: "specification", label: i18nM("material.table.specifications") },
]);
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
const confirmSave = (cb: Function) => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const params: any = {
        subId: props.data.id,
        ...approvalForm.value,
      };
      updateTaskAuditStatus(params, (res: any) => {
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
    totalItems.value = 0;
    return;
  }
  const params: any = {
    projectId: props.projectId,
    page: currentPage.value,
    size: pageSize.value,
    ids: materialIds.value,
  };
  materialPage(params, (res: any) => {
    const { content, totalElements } = res.data;
    tableData.value = content;
    totalItems.value = totalElements;
  });
};
const addDataFlag = ref(false);
//重新计算表格每页条数
const changeRightTable = () => {
  if (tableWrapRef.value) {
    getPageSizeCount(
      tableWrapRef.value,
      (count: number) => {
        pageSize.value = count;
        if (addDataFlag.value) {
          const pageCount = getPageCount(totalItems.value + 1, pageSize.value);
          currentPage.value = pageCount;
          addDataFlag.value = false;
        } else {
          const pageCount = getPageCount(totalItems.value, pageSize.value);
          if (currentPage.value > pageCount) currentPage.value = pageCount;
        }
        refreshTable();
      },
      { header: 62 }
    );
  }
};
onMounted(() => {
  materialStockFindStockTree({ projectId: props.projectId }, (res: any) => {
    sourceOptions.value = res.data;
  });
  usersGet({ userId: String(props.data.handleUserId) }, (res: any) => {
    form.value.handleUserName = res.data.name;
  });
  getTaskDetail({ taskId: String(props.data.id) }, (res: any) => {
    materialIds.value = res.data?.map((item: any) => item.tradeId) ?? [];
    changeRightTable();
  });
});
defineExpose({
  confirmSave,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
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
.wrap {
  width: calc(100% - zrem(32));
  height: calc(100% - zrem(20));
  margin: 0 zrem(16);
  padding-top: zrem(20);
}
.content-wrap {
  height: calc(100% - zrem(10));
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
.radius {
  border-radius: zrem(8);
}
.dept {
  :deep {
    height: zrem(55);
    .el-form-item__content {
      height: 100% !important;
    }
  }
}
</style>
