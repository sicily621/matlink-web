<template>
  <div class="flex-1 flex-column h-full">
    <div class="wrap">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">
          {{ i18nM("material.label.stocktakingInfo") }}
        </div>
      </div>
      <div class="d-flex flex-1 content-wrap">
        <el-form ref="formRef" :model="form" :rules="rules" label-position="right" class="d-flex relative m-r-90 m-t-20" :label-width="zrem(100)">
          <div class="d-flex">
            <div class="m-r-30">
              <el-form-item :label="i18nM('material.label.name')" prop="name">
                <el-input v-model="form.name" class="w-296" :placeholder="i18nM('material.placeholder.name')" maxlength="32" required> </el-input>
              </el-form-item>
              <el-form-item :label="i18nM('material.label.type')" prop="taskType">
                <el-select class="w-296" v-model="form.taskType" :disabled="!!props?.data?.id" :placeholder="i18nM('material.placeholder.select')">
                  <el-option v-for="item of typeOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="i18nM('material.title.materialWarehouse')" prop="stockId">
                <el-tree-select
                  v-model="form.stockId"
                  :placeholder="i18nM('material.placeholder.select')"
                  :data="sourceOptions"
                  check-strictly
                  :render-after-expand="true"
                  :props="selectProps"
                  :default-expand-all="true"
                  class="w-296"
                  :disabled="!!props?.data?.id"
                />
              </el-form-item>
              <el-form-item :label="i18nM('material.table.handleUserId')" prop="handleUserName"
                ><el-input class="w-296" disabled v-model="form.handleUserName" :placeholder="i18nM('material.placeholder.select')">
                  <template #append>
                    <el-button :icon="More" @click="openModal" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="i18nM('material.table.startTime')" prop="startTime">
                <el-date-picker
                  v-model="form.startTime"
                  type="date"
                  :disabled-date="disabledStartDate"
                  :placeholder="i18nM('material.placeholder.select')"
                  @change="changeTime"
                />
              </el-form-item>
              <el-form-item :label="i18nM('material.table.endTime')" prop="endTime">
                <el-date-picker
                  v-model="form.endTime"
                  type="date"
                  :disabled-date="disabledEndDate"
                  :placeholder="i18nM('material.placeholder.select')"
                />
              </el-form-item>
              <el-form-item :label="i18nM('material.table.stocktakingNone')" prop="stocktakingNone">
                <el-checkbox :true-value="1" :false-value="0" v-model="form.stocktakingNone" />
              </el-form-item>
              <el-form-item :label="i18nM('material.table.notes')" prop="description">
                <el-input
                  class="w-296"
                  v-model="form.description"
                  type="textarea"
                  :placeholder="i18nM('material.placeholder.inputDescription')"
                  maxlength="64"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="flex-1 h-full flex-column" v-if="form.taskType == 2">
          <div class="d-flex align-items-center justify-content-end">
            <el-button :type="'primary'" @click="addMaterial">
              <img :src="AddIcon" width="16" height="16" class="el-icon" />
              <span>{{ i18nM("material.button.addition") }}</span>
            </el-button>
          </div>
          <div class="flex-1 table-wrap" ref="tableWrapRef">
            <baseTable :columns="columns" :table-data="tableData">
              <template #operate="scope">
                <el-icon class="fz20 pointer" text @click="removeMaterial(scope.scope.row)">
                  <Delete />
                </el-icon>
              </template>
            </baseTable>
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
    <zModel
      ref="modelRef"
      :style="{ width: '80%', height: '80%' }"
      :custom-model-title="i18nM('material.title.selectPerson')"
      :noConfirmBtnFlag="true"
      @confirm="() => {}"
    >
      <div class="flex-1 d-flex w-full h-full relative content-bg">
        <div class="left h-full box-shadow">
          <div class="flex1 flex-column h-full">
            <div class="flex-1" style="height: 50%" v-if="enterTreeData.length > 0">
              <tree
                :data="enterTreeData"
                ref="enterTreeRef"
                :expandedKeys="enterpriseExpandedKeys"
                :currentNodeKey="enterpriseCurrentNodeKey"
                @changeNode="enterChange($event)"
                @changeFilter="enterFilter($event)"
                :placeholder="i18nM('material.placeholder.placeEnterAbbreviation')"
              >
              </tree>
            </div>
            <div class="flex-1" style="height: 50%">
              <tree
                :data="departTreeData"
                :expandedKeys="departmentExpandedKeys"
                :currentNodeKey="departmentCurrentNodeKey"
                ref="departTreeRef"
                @changeNode="dpChange($event)"
                :propsObj="defaultProps"
                :placeholder="i18nM('material.placeholder.placeDepName')"
                :searchFlag="true"
              >
              </tree>
            </div>
          </div>
        </div>
        <div class="right flex-1 flex-column h-full fill-bg box-shadow">
          <div class="d-flex align-items-center justify-content-between m-t-8 m-b-8">
            <div>
              <span class="m-r-8 m-l-16 fz14">{{ i18nM("material.label.name") }}</span>
              <el-input v-model="title" :placeholder="i18nM('material.placeholder.name')" class="w-200" @input="nameInputFunc">
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
            </div>
            <el-button :type="'primary'" class="m-r-10" @click="savePerson()">{{ i18nM("material.button.confirm") }}</el-button>
          </div>
          <div class="flex-1 table-wrap p-0">
            <baseTable ref="tableRef" :columns="userColumns" :table-data="userTableData" @currentChange="currentChange"> </baseTable>
          </div>
        </div>
      </div>
    </zModel>
    <zModel
      ref="materialRef"
      :style="{ width: '100%', height: '100%' }"
      :custom-model-title="i18nM('material.title.selectMaterial')"
      :noConfirmBtnFlag="true"
      @confirm="() => {}"
    >
      <div class="flex-1 d-flex w-full h-full relative content-bg">
        <Material :materialIds="materialIds" :projectId="projectId" @save="saveMaterial"></Material>
      </div>
    </zModel>
  </div>
</template>
<script setup lang="ts">
import AddIcon from "@static/images/add.png";
import { ref, reactive, onMounted, computed, nextTick } from "vue";
import { Task, saveTask, Status, TaskStatus } from "@functions/serviceCenter/material-management/api/task";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { deleteByTaskId, saveTaskDetail, getTaskDetail, DetailStatus } from "@functions/serviceCenter/material-management/api/taskDetail";
import { materialPage } from "@functions/serviceCenter/material-management/api/material";
import { ElMessage, ElMessageBox } from "element-plus";
import { More, Search } from "@element-plus/icons-vue";
import { zrem } from "@static/js/theme/zrem";
import zModel from "@static/components/zModel/zModel.vue";
import tree, { TreeNode } from "@static/elementUI/tree/tree.vue";
import baseTable from "@static/table/baseTable/baseTable.vue";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { getPageSizeCount, getPageCount } from "@static/js/page/utils";
import { enterprisesPage } from "@functions/userCenter/api/enterprises";
import { getDeptTreeByCurUserId } from "@functions/userCenter/api/departments";
import { usersGetByDeptId, usersGet } from "@functions/userCenter/api/users";
import { nameToLabel } from "@static/js/page/data";
import { formatDate } from "@static/js/common/date";
import Material from "@functions/serviceCenter/material-management/task/material.vue";
const props = defineProps<{ data: Task | null; projectId: string | number; stockId: string | number }>();
const i18nM = window.$i18nM;
const formRef = ref();
const title = ref("");
const tableRef = ref();
const tableWrapRef = ref();
const defaultCurrentDate = new Date();
defaultCurrentDate.setHours(0, 0, 0, 0);
const defaultEndDate = new Date(defaultCurrentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
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
  name: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  stockId: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  taskType: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  handleUserName: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
});
const typeOptions = computed(() => {
  return [
    { id: 1, name: i18nM("material.enumValue.allStocktaking2") },
    { id: 2, name: i18nM("material.enumValue.partial") },
  ];
});
const sourceOptions = ref<any[]>([]);
const selectProps = { value: "id", label: "name" };
const userColumns = computed(() => [
  { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
  { prop: "name", label: i18nM("material.label.name") },
  { prop: "userName", label: i18nM("material.label.username"), type: 2 },
  { prop: "userCode", label: i18nM("material.label.userCode"), type: 2 },
]);
const userTableData = ref<any[]>([]);
const tableData = ref<any[]>([]);
const columns = computed(() => [
  { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
  { prop: "code", label: i18nM("material.table.code") },
  { prop: "simpleName", label: i18nM("material.label.abbreviation") },
  { prop: "tradeTypeName", label: i18nM("material.table.taskType") },
  { prop: "brand", label: i18nM("material.table.brand") },
  { prop: "modelNo", label: i18nM("material.table.model") },
  { prop: "specification", label: i18nM("material.table.specifications") },
  { prop: "operate", type: 2, label: i18nM("material.table.operate"), width: 100 },
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
// // 禁用开始日期
const disabledStartDate = (time: Date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return time.getTime() < currentDate.getTime();
};
const disabledEndDate = (time: Date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return time.getTime() < new Date(form.value.startTime).getTime();
};
const changeTime = () => {
  const date = new Date(form.value.startTime);
  date.setHours(0, 0, 0, 0);
  form.value.endTime = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
};
const handleUserId = ref("");
const handleUserName = ref("");
const currentChange = (row: any) => {
  handleUserId.value = row.id;
  handleUserName.value = row.name;
};
const modelRef = ref<any>(null);
const openModal = () => {
  modelRef.value.openCustomModel();
  nextTick(() => {
    const targetRow = userTableData.value.find((row: any) => row.id === form.value.handleUserId);
    if (targetRow) tableRef.value.setCurrentRow(targetRow);
  });
};
const materialRef = ref<any>(null);
const addMaterial = () => {
  materialRef.value.openCustomModel();
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
      materialIds.value = materialIds.value.filter((id: any) => id !== row.id);
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
const saveMaterial = (ids: any[]) => {
  materialIds.value = ids;
  materialRef.value.closeCustomModel();
  changeRightTable();
};
const savePerson = () => {
  form.value.handleUserId = handleUserId.value;
  form.value.handleUserName = handleUserName.value;
  modelRef.value.closeCustomModel();
};
const enterTreeRef = ref();
const departTreeRef = ref();
const enterTreeData = ref<TreeNode[]>([]);
const departTreeData = ref<TreeNode[]>([]);
const defaultProps = {
  children: "children",
  label: "name",
};
//企业搜索
let enterpriseSearch = "";
//默认展开企业
const enterpriseExpandedKeys = ref<Array<number | string>>([0]);
//当前选中企业
const enterpriseCurrentNodeKey = ref<any>(0);
//默认展开部门
const departmentExpandedKeys = ref<Array<number | string>>([0]);
//当前选中部门
const departmentCurrentNodeKey = ref<any>(0);
//编辑时保存编辑前选中的部门
const oldDepartmentCurrentNodeKey = ref<any>(0);
//左侧部门搜索条件
let departmentLeftSearch = "";
//编辑时选中的对象
const info = ref<any>({});
/**
 * 更改企业数据闭包事件
 * @param data
 * @param id
 */
let enterChangeFunc = (data: any, id?: number) => {
  enterTreeData.value = data;
  if (id) enterpriseCurrentNodeKey.value = id;
};
/**
 * 更改部门数据闭包事件
 * @param data
 */
let dpChangeFunc = (data: any) => {
  departTreeData.value = data;
};
/**
 * 获取企业列表
 * @param rightListFlag
 */
const getEnterpriseList = (changeFlag: boolean) => {
  enterprisesPage(
    {
      parentId: enterpriseCurrentNodeKey.value,
      page: null,
      size: null,
      abbreviation: enterpriseSearch || null,
    },
    (res: any) => {
      if (changeFlag) enterChangeFunc(nameToLabel(res.data.content, "abbreviation"), res.data.content?.[0]?.id);
      getDepartmentLeftList(changeFlag);
    }
  );
};
const departmentMap = ref<Map<string, string>>(new Map());
const getDepartment = (id: string) => {
  return departmentMap.value.get(id);
};
/**
 * 获取左侧部门树形列表
 */
const getDepartmentLeftList = (changeFlag: boolean) => {
  getDeptTreeByCurUserId(
    {
      enterPriseId: enterpriseCurrentNodeKey.value,
    },
    (res: any) => {
      res.data.map((item: any, index: number) => {
        const { id, name } = item;
        departmentMap.value.set(id, name);
        if (index === 0) departmentCurrentNodeKey.value = id;
      });
      departTreeData.value = res.data;
      getUserList();
    }
  );
};

/**
 * 点击企业事件
 */
const enterChange = (enterprise: any) => {
  enterChangeFunc = (data: any) => {
    if (data.length && data[0].parentId == enterprise.id) {
      enterprise.children = data;
    }
    dpChangeFunc = (dpData: any) => {
      departTreeData.value = dpData;
    };
  };
  enterpriseCurrentNodeKey.value = enterprise.id;
  departmentCurrentNodeKey.value = 0;
  getEnterpriseList(true);
};
/**
 * 点击左侧部门事件
 * @param dp
 */
const dpChange = (dp: any) => {
  departmentCurrentNodeKey.value = dp.id;
  getUserList();
};
/**
 * 左侧企业搜索
 * @param val
 */
const enterFilter = (val: string) => {
  enterpriseSearch = val;
  if (!val) enterpriseCurrentNodeKey.value = 0;
  else enterpriseCurrentNodeKey.value = null;
  enterChangeFunc = (data: any, id?: number) => {
    enterTreeData.value = data;
    if (id) enterpriseCurrentNodeKey.value = id;
    dpChangeFunc = (dpData: any) => {
      departTreeData.value = dpData;
    };
  };
  getEnterpriseList(true);
};
const getUserList = () => {
  const params: any = {
    deptId: Number(departmentCurrentNodeKey.value),
    page: 0,
    size: 1000,
  };
  if (title.value.length) params.name = title.value;
  usersGetByDeptId(params, (res: any) => {
    userTableData.value = res.data.content;
  });
};
let nameTimer: any = null;
const nameInputFunc = () => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => {
    getUserList();
  }, 400);
};
const confirmSave = (cb: Function) => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const params: any = {
        ...form.value,
        startTime: new Date(`${formatDate(form.value.startTime)} 00:00:00`).getTime(),
        endTime: new Date(`${formatDate(form.value.endTime)} 23:59:59`).getTime(),
      };
      delete params["handleUserName"];
      saveTask(params, (res: any) => {
        if (res.code) {
          deleteByTaskId({ taskId: res.data.id }, (delRes: any) => {
            if (delRes.code) {
              const detailParams = materialIds.value.map((id: any) => ({
                projectId: props.projectId,
                taskId: res.data.id,
                tradeId: id,
                realCount: 0,
                status: DetailStatus.NotYetAssessed,
              }));
              if (form.value.taskType == 2) {
                saveTaskDetail(detailParams, (saveRes: any) => {
                  if (saveRes.code) {
                    ElMessage({
                      type: "success",
                      message: props.data ? i18nM("material.message.editSuccess") : i18nM("material.message.saveSuccess"),
                    });
                    cb && cb(res.data);
                  }
                });
              } else {
                ElMessage({
                  type: "success",
                  message: props.data ? i18nM("material.message.editSuccess") : i18nM("material.message.saveSuccess"),
                });
                cb && cb(res.data);
              }
            }
          });
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
  getEnterpriseList(true);
  materialStockFindStockTree({ projectId: props.projectId }, (res: any) => {
    sourceOptions.value = res.data;
  });
  if (props?.data?.id) {
    usersGet({ userId: String(props.data.handleUserId) }, (res: any) => {
      form.value.handleUserName = res.data.name;
    });
    getTaskDetail({ taskId: props.data.id }, (res: any) => {
      materialIds.value = res.data?.map((item: any) => item.tradeId) ?? [];
      changeRightTable();
    });
  }
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
  height: calc(100% - zrem(20));
}
</style>
