<template>
  <div class="flex">
    <el-card class="width-200 h-full">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">领用单</div>
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
        <div class="width-300" v-if="onlyView">
          <div class="flex row align-items-center">
            <div>申请单号</div>
            <div>{{ form.applyNo }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>物料库</div>
            <div>{{ findNameById(stockOptions, form.stockId) }}</div>
          </div>
          <div class="flex row align-items-center">
            <div>领用时间</div>
            <div>
              {{
                new Date(form.applyTime).toLocaleString().replace(/\//g, "-")
              }}
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
            <div>{{ form.purpose }}</div>
          </div>
        </div>
        <div class="width-300" v-else>
          <el-form-item label="申请单号" prop="applyNo">
            <el-input
              v-model="form.applyNo"
              class="flex-1"
              placeholder="请输入申请单号"
              maxlength="32"
              required
            >
            </el-input>
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
          <el-form-item label="申请时间" prop="applyTime">
            <el-date-picker
              :disabled="onlyView"
              v-model="form.applyTime"
              type="datetime"
              :disabled-date="disabledDate"
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes"
              placeholder="请选择申请时间"
            />
          </el-form-item>
          <el-form-item label="申请部门" prop="deptName">
            <el-input
              disabled
              v-model="form.deptName"
              placeholder="请选择申请部门"
            >
              <template #append>
                <el-button :icon="More" @click="openModal" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="申请人" prop="applyUserName">
            <el-input
              disabled
              v-model="form.applyUserName"
              placeholder="请选择申请人"
            >
              <template #append>
                <el-button :icon="More" @click="openModal" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="purpose">
            <el-input
              :disabled="onlyView"
              class="w-200"
              v-model="form.purpose"
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
        <div class="zc-header-title">
          <div class="zc-header-icon"></div>
          <div class="zc-header-word">物料信息</div>
        </div>
        <div>
          <span v-if="errorShow" class="error m-r-8">领用详情不能为空</span>
          <el-button :type="'primary'" @click="addMaterial" v-if="!onlyView">
            <span>添加</span>
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
          <template #applyCount="scope">
            <el-input-number
              v-if="editCountRow?.id == scope.scope.row.id"
              size="small"
              class="w-30"
              v-model="scope.scope.row.applyCount"
              :precision="0"
              :step="1"
              :min="0"
              :max="scope.scope.row.inventoryCount"
            />
            <div
              v-if="editCountRow?.id != scope.scope.row.id"
              @click="targetRowCol(1, scope.scope.row)"
              class="pointer"
            >
              {{ scope.scope.row.applyCount }}
            </div>
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
      title="选择人员"
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
                v-model="title"
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
  OutBoundApply,
  createOutBoundApply,
  editOutBoundApply,
  validateApplyNo,
} from "../api/outBoundApply";
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
import { getOutBoundApplyDetailList } from "@pages/outBoundApplyManagement/api/outBoundApplyDetail";
import {
  saveOutBoundApplyDetail,
  deleteOutBoundApplyDetail,
} from "../api/outBoundApplyDetail";
import { getMaterialStockDetailList } from "@pages/inventoryManagement/api/stockDetail";
import baseTable from "@@/components/baseTable/baseTable.vue";
import zModel from "@static/components/zModel/zModel.vue";
import tree from "@@/components/tree/tree.vue";
import Material from "./material.vue";
import { formatTimeToString } from "@@/utils/datetime";
import { ModuleCode } from "@/router/moduleCode";
import type { FormRules } from "element-plus";
const props = defineProps<{
  data: OutBoundApply | null;
  stockId: string;
  onlyView: boolean;
}>();
const errorShow = ref(false);
const formRef = ref();
const title = ref("");
const selectProps = { value: "id", label: "name" };
const userStore = useUserStore();
//表单
const form = ref<OutBoundApply>({
  stockId: props.stockId,
  applyNo: `${ModuleCode.OutBoundApply}${formatTimeToString()}`,
  auditStatus: 0,
  status: 0,
  purpose: "",
  applyUserId: "",
  applyTime: new Date(),
  deptId: "",
  deptName: "",
  createUserId: userStore.getInfo()?.id,
});
const materialIds = ref<string[]>([]);
const tableProps = ref({
  highlightCurrentRow: false,
});
const editCountRow = ref<any>(null);
const editPriceRow = ref<any>(null);
const editTaxRow = ref<any>(null);
const targetRowCol = (type: number, e: any) => {
  if (props.onlyView) return;
  if (type === 1) {
    editCountRow.value = e;
  } else if (type === 2) {
    editPriceRow.value = e;
  } else if (type === 3) {
    editTaxRow.value = e;
  }
};
//合并props
if (props.data) {
  Object.assign(form.value, props.data);
}
const validateApplyNoFn = async (rule: any, value: any, callback: any) => {
  if (value == "") return callback(new Error("不能为空"));
  const params: any = { applyNo: form.value.applyNo };
  if (form.value.id) params.id = form.value.id;
  const res: any = await validateApplyNo(params);
  if (!res.data) {
    callback(new Error("申请单号不能重复"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  applyNo: [{ validator: validateApplyNoFn as any, trigger: "blur" }],
  stockId: [{ required: true, message: "不能为空" }],
  applyTime: [{ required: true, message: "不能为空" }],
  applyUserName: [{ required: true, message: "不能为空" }],
  deptName: [{ required: true, message: "不能为空" }],
  purpose: [{ required: true, message: "不能为空" }],
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
    { prop: "applyCount", label: "申领数量", type: props.onlyView ? 0 : 8 },
    { prop: "inventoryCount", label: "库存数量" },
  ];
  if (!props.onlyView)
    result.push({
      prop: "operate",
      type: 2,
      label: "操作",
      width: 100,
    });
  return result;
});
const applyUserId = ref("");
const applyUserName = ref("");
const currentChange = (row: any) => {
  if (!row) return;
  applyUserId.value = row.id;
  applyUserName.value = row.realName;
};
const tableData = ref<any[]>([]);

const now = new Date();
//  禁用开始日期
const disabledDate = (time: Date) => {
  return time.getTime() < now.getTime();
};
const disabledHours = () => {
  if (!form.value.outBoundApplyTime) return [];

  const selectedDate = new Date(form.value.outBoundApplyTime);
  const isToday = selectedDate.toDateString() === now.toDateString();

  if (isToday) {
    const currentHour = now.getHours();
    return Array.from({ length: currentHour }, (_, i) => i);
  }
  return [];
};

const disabledMinutes = () => {
  if (!form.value.outBoundApplyTime) return [];

  const selectedDate = new Date(form.value.outBoundApplyTime);
  const isToday = selectedDate.toDateString() === now.toDateString();
  const isCurrentHour = selectedDate.getHours() === now.getHours();

  if (isToday && isCurrentHour) {
    const currentMinute = now.getMinutes();
    return Array.from({ length: currentMinute }, (_, i) => i);
  }
  return [];
};
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
    (row: any) => row.id === form.value.applyUserId,
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
  form.value.applyUserId = applyUserId.value;
  form.value.applyUserName = applyUserName.value;
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
    const hasZeroCount = tableData.value.some(
      (item: any) => item.applyCount == 0,
    );
    if (hasZeroCount) {
      ElMessage({
        type: "error",
        message: "领用数量不能为0",
      });
      return false;
    }
    const valid = await formRef.value.validate();
    if (valid) {
      if (tableData.value.length == 0) {
        return;
      }
      const params: any = {
        ...form.value,
        applyTime:
          typeof form.value.applyTime === "string"
            ? new Date(form.value.applyTime).getTime()
            : form.value.applyTime.getTime(),
      };
      delete params["applyUserName"];
      if (!params["approverCreateTime"]) delete params["approverCreateTime"];
      if (!params["approverUserId"]) delete params["approverUserId"];
      const api = params.id ? editOutBoundApply : createOutBoundApply;
      const res: any = await api(params);
      await deleteOutBoundApplyDetail(res.data.id);
      const details = tableData.value.map((item: any) => {
        const { materialId, applyCount } = item;
        const result: any = {
          applyId: res.data.id,
          materialId,
          stockId: form.value.stockId,
          applyCount,
        };
        return result;
      });
      await saveOutBoundApplyDetail(details);
      ElMessage({
        type: "success",
        message: props.data ? "编辑成功" : "新增成功",
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
    const departmentId = userStore.getInfo()?.departmentId;
    const rawData = buildTree((res as any)?.data || []);
    departmentOptions.value =
      departmentId != 0
        ? rawData.filter((item: any) => item.id == departmentId)
        : rawData;
    treeData.value =
      departmentId != 0
        ? rawData.filter((item: any) => item.id == departmentId)
        : rawData;
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
  if (title.value.length) params.realName = title.value;
  const res: any = await getEmployeeList(params);
  userTableData.value = res.data;
  const targetRow = userTableData.value.find(
    (row: any) => row.id === form.value.applyUserId,
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
    const row: any = { applyCount: 0 };
    const material = materialMap.value.get(item.id);
    const detail = detailMap.value.get(item.id);
    const lastData = hasAddMap.get(item.id);
    if (detail) {
      Object.assign(row, detail);
    }
    if (material) {
      row.inventoryCount = Number(material.count);
    }
    const result = lastData ?? { ...item, ...row, materialId: item.id };
    return result;
  });
  detailMap.value.clear();
};

onMounted(async () => {
  await queryDepartmentOptions();
  await queryStockOptions();
  if (props?.data?.id) {
    const userRes: any = await getEmployee(String(props.data.applyUserId));
    currentNodeKey.value = userRes.data.departmentId;
    form.value.applyUserName = userRes.data.realName;
    const deptRes: any = await getDepartment(String(props.data.deptId));
    form.value.deptName = deptRes.data.name;
    const detailRes: any = await getOutBoundApplyDetailList({
      applyId: props.data.id,
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
  getUserList();
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
