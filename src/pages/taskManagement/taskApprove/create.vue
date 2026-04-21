<template>
  <div class="flex">
    <el-card class="width-200 h-full">
      <div class="zc-header-name">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">盘点任务</div>
      </div>
      <el-divider class="m-t-3 m-b-3" />

      <div class="width-300">
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
            {{ new Date(form.startTime).toLocaleString().replace(/\//g, "-") }}
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
          <template #status="scope">
            {{ getName(TaskDetailStatusList, scope.scope.row.status) }}
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
  Task,
  TaskDetailStatus,
  TaskDetailStatusList,
  updateAuditStatus,
} from "../api/task";
import { getDepartmentList } from "@pages/employeeManagement/api/department";
import {
  getEmployeeList,
  getEmployee,
} from "@pages/employeeManagement/api/employee";
import { ElMessage } from "element-plus";
import { getStockList } from "@pages/baseManagement/api/stock";
import { findMaterialListByIds } from "@pages/baseManagement/api/material";
import { useUserStore } from "@/pinia/stores/user";
import { getCategoryListByIds } from "@pages/baseManagement/api/category";
import { getUnitListByIds } from "@pages/baseManagement/api/unit";
import { getTaskDetailList } from "@pages/taskManagement/api/taskDetail";
import { getMaterialStockDetailList } from "@pages/inventoryManagement/api/stockDetail";
import baseTable from "@@/components/baseTable/baseTable.vue";
import { getApproveDetail } from "@pages/baseManagement/api/auditFlowDetailRelation";
const props = defineProps<{
  data: Task | null;
  stockId: string;
  onlyView: boolean;
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
//表单
const form = ref<Task>({
  stockId: props.stockId,
  name: "",
  type: 1,
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

const rules = reactive({
  auditStatus: [{ required: true, message: "不能为空" }],
  auditRemark: [{ required: true, message: "不能为空" }],
});
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
    { prop: "realCount", label: "实际数量" },
    { prop: "diffCount", label: "差异数量" },
    { prop: "status", label: "状态" },
  ];
  return result;
});
const handleUserId = ref("");
const handleUserName = ref("");

const tableData = ref<any[]>([]);

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
const departmentOptions = ref<any[]>([{ name: "无", id: 0 }]);
// 左侧树列表
const virtualRootId = "root";
const treeData: any = ref<any[]>([]);
//树列表默认展开建筑
const expandedKeys = ref<Array<number | string>>([virtualRootId]);
//树列表当前选中建筑
const currentNodeKey = ref<number | string>("");
const deptTreeRef = ref();
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
