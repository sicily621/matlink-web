<template>
  <div class="flex">
    <el-card class="width-200 h-full">
      <div class="zc-header-name">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">盘点任务</div>
      </div>
      <el-divider class="m-t-3 m-b-3" />
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        class="flex relative flex-1"
        label-width="90px"
        require-asterisk-position="right"
      >
        <div class="width-300" v-if="onlyView || resultEntry">
          <div class="flex row align-items-center">
            <div>名称</div>
            <div>{{ form.name }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>类型</div>
            <div>{{ getName(typeOptions, form.type) }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>物料库</div>
            <div>{{ findNameById(stockOptions, form.stockId) }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>责任人</div>
            <div>{{ form.handleUserName }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>开始时间</div>
            <div>
              {{
                new Date(form.startTime).toLocaleString().replace(/\//g, "-")
              }}
            </div>
          </div>
          <div class="flex row align-items-center">
            <div>结束时间</div>
            <div>
              {{ new Date(form.endTime).toLocaleString().replace(/\//g, "-") }}
            </div>
          </div>
          <div class="flex row align-items-center">
            <div>零库存盘点</div>
            <div>{{ form.stocktakingNone ? "是" : "否" }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>备注</div>
            <div>{{ form.description }}</div>
          </div>
        </div>
        <div class="width-300" v-else>
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="form.name"
              class="flex-1"
              placeholder="请输入名称"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select
              class="flex-1"
              v-model="form.type"
              placeholder="请选择盘点类型"
              @change="changeType"
            >
              <el-option
                v-for="item of typeOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物料库" prop="stockId">
            <el-tree-select
              v-model="form.stockId"
              placeholder="请选择物料库"
              :data="stockOptions"
              check-strictly
              :render-after-expand="false"
              :props="selectProps"
            />
          </el-form-item>
          <el-form-item label="责任人" prop="handleUserName">
            <el-input
              disabled
              v-model="form.handleUserName"
              placeholder="请选择责任人"
            >
              <template #append>
                <el-button :icon="More" @click="openModal" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="date"
              :disabled-date="disabledStartDate"
              placeholder="请选择"
              @change="changeTime"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="date"
              :disabled-date="disabledEndDate"
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item label="零库存盘点" prop="stocktakingNone">
            <el-checkbox
              :disabled="onlyView"
              :true-value="1"
              :false-value="0"
              v-model="form.stocktakingNone"
            />
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input
              :disabled="onlyView"
              class="w-200"
              v-model="form.description"
              type="textarea"
              placeholder="请输入备注"
              maxlength="64"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <div class="p-4 el-card flex-1 h-full m-l-3 flex flex-column">
      <div class="flex align-items-center justify-content-between">
        <div class="zc-header-name">
          <div class="zc-header-icon"></div>
          <div class="zc-header-word">物料信息</div>
        </div>
        <div>
          <span v-if="errorShow" class="error m-r-8">盘点详情不能为空</span>
          <el-button
            :type="'primary'"
            @click="addMaterial"
            v-if="!onlyView && !resultEntry && form.type === 2"
          >
            <span>添加</span>
          </el-button>
          <el-button :type="'primary'" @click="exportMaterial" v-if="form.id">
            <span>导出</span>
          </el-button>
        </div>
      </div>
      <el-divider class="m-t-3 m-b-3" />
      <div class="flex-1 table-wrap" ref="tableWrapRef">
        <baseTable
          :columns="columns"
          :table-data="tableData"
          :tableProps="tableProps"
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
          <template #realCount="scope">
            <el-input-number
              v-if="editCountRow?.id == scope.scope.row.id"
              size="small"
              class="w-30"
              v-model="scope.scope.row.realCount"
              :precision="0"
              :step="1"
              :min="0"
              @change="inputChange(scope.scope.row)"
            />
            <div
              v-if="editCountRow?.id != scope.scope.row.id"
              @click="targetRowCol(1, scope.scope.row)"
              class="pointer"
            >
              {{ scope.scope.row.realCount }}
            </div>
          </template>
          <template #status="scope">
            {{ getName(TaskDetailStatusList, scope.scope.row.status) }}
          </template>
          <template #operate="scope">
            <el-icon
              class="fz16 pointer"
              text
              @click="removeMaterial(scope.scope.row)"
            >
              <Delete />
            </el-icon>
          </template>
        </baseTable>
      </div>
    </div>
    <el-dialog
      v-model="savePersonModal"
      name="选择人员"
      width="1200px"
      align-center
      @opened="openedModel"
    >
      <div class="flex-1 flex w-full relative content-bg person-wrap">
        <div class="left el-card">
          <tree
            :data="treeData"
            :expandedKeys="expandedKeys"
            :currentNodeKey="currentNodeKey"
            ref="deptTreeRef"
            @changeNode="changeNode($event)"
            placeholder="请输入部门名称"
            :propsObj="defaultProps"
            :searchFlag="true"
          >
          </tree>
        </div>
        <div class="flex-1 p-0 m-l-3 el-card">
          <div
            class="flex align-items-center justify-content-between m-t-2 m-b-2"
          >
            <div>
              <span class="m-r-2 m-l-2 fz12">名称</span>
              <el-input
                v-model="name"
                placeholder="请输入名称"
                class="w-50"
                @input="nameInputFunc"
              >
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
            </div>
            <el-button :type="'primary'" class="m-r-3" @click="savePerson()"
              >确定</el-button
            >
          </div>
          <el-divider class="m-t-1 m-b-1" />
          <div class="table-wrap">
            <baseTable
              ref="tableRef"
              :columns="userColumns"
              :table-data="userTableData"
              @currentChange="currentChange"
              class="h-full"
            >
            </baseTable>
          </div>
        </div>
      </div>
    </el-dialog>
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
<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import {
  Task,
  createTask,
  editTask,
  TaskStatus,
  TaskDetailStatus,
  TaskDetailStatusList,
} from "../api/task";
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
import {
  getTaskDetailList,
  exportTaskDetailList,
} from "@pages/taskManagement/api/taskDetail";
import { saveTaskDetail, deleteTaskDetail } from "../api/taskDetail";
import { getMaterialStockDetailList } from "@pages/inventoryManagement/api/stockDetail";
import baseTable from "@@/components/baseTable/baseTable.vue";
import zModel from "@static/components/zModel/zModel.vue";
import tree from "@@/components/tree/tree.vue";
import Material from "./material.vue";
import { findInventoryPage } from "@pages/inventoryManagement/api/stockDetail";
const props = defineProps<{
  data: Task | null;
  stockId: string;
  onlyView: boolean;
  resultEntry: boolean;
}>();
const errorShow = ref(false);
const formRef = ref();
const name = ref("");
const selectProps = { value: "id", label: "name" };
const userStore = useUserStore();
const typeOptions = ref([
  { id: 1, name: "全盘" },
  { id: 2, name: "部分" },
]);
const getName = (list: any[], targetId: string | number) => {
  return list.find((item: any) => item.id === targetId)?.name ?? "";
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
const editCountRow = ref<any>(null);
const targetRowCol = (type: number, e: any) => {
  if (!props.resultEntry) return;
  if (type === 1) {
    editCountRow.value = e;
  }
};
const exportMaterial = async () => {
  const res: any = await exportTaskDetailList({
    taskId: String(form.value.id),
  });
  const blobUrl = URL.createObjectURL(res);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = form.value.name;
  a.click();
  URL.revokeObjectURL(blobUrl);
  ElMessage({
    type: "success",
    message: "导出成功",
  });
};
const changeType = () => {
  tableData.value = [];
  materialIds.value = [];
  if (form.value.type == 1) {
    refreshTable();
  }
};
//表单
const form = ref<Task>({
  stockId: props.stockId,
  name: "",
  type: 2,
  auditStatus: 0,
  status: 0,
  stocktakingNone: 1,
  description: "",
  handleUserId: "",
  handleUserName: "",
  startTime: new Date(),
  endTime: new Date(),
  deptId: "",
  createUserId: userStore.getInfo()?.id,
});
const materialIds = ref<string[]>([]);
const tableProps = ref({
  highlightCurrentRow: false,
});
//合并props
if (props.data) {
  Object.assign(form.value, props.data);
}
const inputChange = (row: any) => {
  row.diffCount = +row.realCount - +row.bookCount;
  row.status = row.diffCount == 0 ? 0 : row.diffCount < 0 ? 2 : 1;
};
const rules = reactive({
  name: [{ required: true, message: "不能为空" }],
  stockId: [{ required: true, message: "不能为空" }],
  handleUserName: [{ required: true, message: "不能为空" }],
  type: [{ required: true, message: "不能为空" }],
});
const userColumns = computed(() => [
  { prop: "index", label: "序号", type: 1, width: "20" },
  { prop: "realName", label: "名称" },
  { prop: "username", label: "用户名" },
  { prop: "code", label: "用户编号" },
]);
const columns = computed(() => {
  const result: any[] = [
    { prop: "index", label: "序号", type: 1, width: "20" },
    { prop: "materialTypeId", label: "类别" },
    { prop: "code", label: "编码" },
    { prop: "simpleName", label: "物料" },
    { prop: "brand", label: "品牌" },
    { prop: "specification", label: "规格" },
    { prop: "unit", label: "单位" },
    { prop: "bookCount", label: "库存数量" },
  ];
  if (props.resultEntry) {
    result.push(
      {
        prop: "realCount",
        label: "实际数量",
        type: !props.resultEntry ? 0 : 8,
      },
      {
        prop: "diffCount",
        label: "差异数量",
      },
      {
        prop: "status",
        label: "状态",
      },
    );
  }
  if (!props.onlyView && !props.resultEntry) {
    result.push({
      prop: "operate",
      type: 2,
      label: "操作",
      width: 100,
    });
  }

  return result;
});
const handleUserId = ref("");
const handleUserName = ref("");
const currentChange = (row: any) => {
  if (!row) return;
  handleUserId.value = row.id;
  handleUserName.value = row.realName;
};
const tableData = ref<any[]>([]);

const userTableData = ref<any[]>([]);
const tableRef = ref();
const savePersonModal = ref(false);
const openModal = () => {
  savePersonModal.value = true;
};
const openedModel = async () => {
  await nextTick();
  deptTreeRef.value.setCurrentKey(currentNodeKey.value);
  const targetRow = userTableData.value.find(
    (row: any) => row.id === form.value.handleUserId,
  );
  if (targetRow) tableRef.value.setCurrentRow(targetRow);
};
const materialRef = ref<any>();
const addMaterial = () => {
  materialRef.value.openCustomModel();
};
const removeMaterial = (row: any) => {
  materialIds.value = materialIds.value.filter(
    (id: any) => id !== row.materialId,
  );
  ElMessage({
    type: "success",
    message: "删除成功",
  });
  refreshTable();
};
const saveMaterial = (ids: any[]) => {
  materialIds.value = ids;
  materialRef.value.closeCustomModel();
  errorShow.value = ids.length == 0;
  refreshTable();
};
const savePerson = () => {
  form.value.handleUserId = handleUserId.value;
  form.value.handleUserName = handleUserName.value;
  savePersonModal.value = false;
};
const defaultProps = {
  children: "children",
  label: "name",
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
const departmentOptions = ref<any[]>([{ name: "无", id: 0 }]);
// 左侧树列表
const virtualRootId = "root";
const treeData: any = ref<any[]>([]);
//树列表默认展开建筑
const expandedKeys = ref<Array<number | string>>([virtualRootId]);
//树列表当前选中建筑
const currentNodeKey = ref<number | string>("");
const deptTreeRef = ref();
//左侧树列表 选中节点变化触发
const changeNode = (data: any) => {
  currentNodeKey.value = data?.id;
  form.value.deptId = currentNodeKey.value;
  form.value.deptName = data.name;
  deptTreeRef.value.setCurrentKey(currentNodeKey.value);
  getUserList();
};
let errorTime: any;
const confirmSave = async (cb?: Function) => {
  try {
    if (tableData.value.length == 0) {
      errorShow.value = true;
      if (errorTime) clearTimeout(errorTime);
      errorTime = setTimeout(() => {
        errorShow.value = false;
      }, 5000);
    }
    const valid = await formRef.value.validate();
    if (valid) {
      if (tableData.value.length == 0) {
        return;
      }
      const params: any = {
        ...form.value,
        startTime: new Date(form.value.startTime).getTime(),
        endTime: new Date(form.value.endTime).getTime(),
      };
      //只要录入了结果，就进入盘点中状态
      if (props.resultEntry) {
        params.status = TaskStatus.Pending;
      }
      delete params["handleUserName"];
      if (!params["approverCreateTime"]) delete params["approverCreateTime"];
      if (!params["approverUserId"]) delete params["approverUserId"];
      const api = params.id ? editTask : createTask;
      const res: any = await api(params);
      if (!props.resultEntry) {
        await deleteTaskDetail(res.data.id);
      }
      const details = tableData.value.map((item: any) => {
        const { materialId, bookCount, realCount, diffCount, status } = item;
        const result: any = {
          taskId: res.data.id,
          bookCount,
          realCount,
          diffCount,
          materialId,
          status,
        };
        if (props.resultEntry && item.id) result.id = item.id;
        return result;
      });
      await saveTaskDetail(details);
      ElMessage({
        type: "success",
        message: props.data ? "保存成功" : "新增成功",
      });
      cb && cb(res.data);
    }
  } catch (error) {
    return false;
  }
};
const queryDepartmentOptions = async () => {
  const res = await getDepartmentList();
  if ((res as any)?.data?.length) {
    departmentOptions.value = buildTree((res as any)?.data || []);
    treeData.value = buildTree((res as any)?.data || []);
    if (!props.data) {
      form.value.deptId = departmentOptions.value[0]?.id;
      form.value.deptName = departmentOptions.value[0]?.name;
      currentNodeKey.value = departmentOptions.value[0]?.id;
    }
  }
};
const getUserList = async () => {
  const params: any = {
    departmentId: currentNodeKey.value,
  };
  if (name.value.length) params.realName = name.value;
  const res: any = await getEmployeeList(params);
  userTableData.value = res.data;
  const targetRow = userTableData.value.find(
    (row: any) => row.id === form.value.handleUserId,
  );
  if (targetRow) tableRef.value?.setCurrentRow(targetRow);
};
let nameTimer: any = null;
const nameInputFunc = () => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => {
    getUserList();
  }, 400);
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
    stockId: form.value.stockId,
  };
  if (form.value.type == 2) {
    params.materialIds = materialIds.value;
  } else {
    params.currentPage = 1;
    params.size = 1000;
  }
  const api =
    form.value.type === 1 ? findInventoryPage : getMaterialStockDetailList;
  const res: any = await api(params);
  materialMap.value.clear();
  const list = form.value.type === 1 ? res.data.list : res.data;
  list.map((item: any) => {
    materialMap.value.set(item.materialId, item);
  });
  if (form.value.type === 1) {
    materialIds.value = list.map((item: any) => item.materialId);
  }
};
const hasAddMap = new Map();
const detailMap = ref<Map<String, any>>(new Map());
const refreshTable = async () => {
  if (form.value.type == 2 && materialIds.value.length === 0) {
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
    const row: any = { ...item };
    const material = materialMap.value.get(item.id);
    const detail = detailMap.value.get(item.id);
    const lastData = hasAddMap.get(item.id);
    if (detail) {
      Object.assign(row, detail);
    }
    //只有创建默认账面数量用库存数量
    if (material && !props.data) {
      row.bookCount = Number(material.count);
      row.realCount = Number(material.count);
      row.status = TaskDetailStatus.Normal;
    }
    const result = lastData ?? {
      ...row,
      materialId: item.id,
    };
    result.diffCount = +result.realCount - +result.bookCount;
    return result;
  });
  detailMap.value.clear();
};

onMounted(async () => {
  await queryDepartmentOptions();
  await queryStockOptions();
  if (props?.data?.id) {
    const userRes: any = await getEmployee(String(props.data.handleUserId));
    currentNodeKey.value = userRes.data.departmentId;
    form.value.handleUserName = userRes.data.realName;
    const detailRes: any = await getTaskDetailList({
      taskId: props.data.id,
    });
    detailMap.value.clear();
    materialIds.value =
      detailRes.data?.map((item: any) => {
        const { materialId } = item;
        detailMap.value.set(materialId, item);
        return materialId;
      }) ?? [];
    refreshTable();
  }
  if (!props.resultEntry && !props.onlyView) getUserList();
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
