<template>
  <div class="flex flex-col">
    <el-card class="w-full h-full">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">处置流程</div>
      </div>
      <el-divider />
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="flex relative flex-1"
        label-width="120px"
        require-asterisk-position="right"
      >
        <div class="width-300 d-flex">
          <el-form-item label="名称" prop="title">
            <el-input
              v-model="form.title"
              class="flex-1"
              placeholder="请输入名称"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input
              v-model="form.remark"
              class="flex-1"
              placeholder="请输入描述"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="流程类型" prop="resourceType">
            <el-select
              class="flex-1 m-r-16"
              v-model="form.resourceType"
              placeholder="请选择流程类型"
            >
              <el-option
                v-for="item of typeOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
            <el-checkbox
              :true-value="1"
              :false-value="0"
              v-model="form.enable"
              label="启用"
            />
          </el-form-item>
          <el-form-item label="物料库" prop="resourceId">
            <el-tree-select
              v-model="form.resourceId"
              placeholder="请选择物料库"
              :data="stockOptions"
              check-strictly
              :render-after-expand="false"
              :props="selectProps"
            />
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { AuditFlow, createAuditFlow, editAuditFlow } from "../api/auditFlow";
import { getDepartmentList } from "@pages/employeeManagement/api/department";
import { ElMessage } from "element-plus";
import { Stock, getStockList } from "../api/stock";
import { formatTimeToString } from "@@/utils/datetime";
import { ModuleCode } from "@/router/moduleCode";
import { useUserStore } from "@/pinia/stores/user";
import { getUnitList } from "../api/unit";
import Upload from "@static/elementUI/upload/upload.vue";
import { UploadType } from "@static/js/common/enum";
const props = defineProps<{ data: AuditFlow | null; deptId: string }>();
const formRef = ref();
const selectProps = { value: "id", label: "name" };
const selectUnitProps = { value: "id", label: "cnname" };
const userStore = useUserStore();
//表单
const form = ref<AuditFlow>({
  title: "",
  resourceId: "",
  resourceType: 1,
  deptId: props.deptId,
  remark: "",
  enable: 1,
});
const typeOptions = ref([
  { id: 1, name: "入库" },
  { id: 2, name: "出库" },
  { id: 3, name: "领料" },
  { id: 4, name: "盘点" },
  { id: 5, name: "采购" },
]);
//合并props
if (props.data) {
  Object.assign(form.value, props.data);
}

const rules = reactive({
  title: [{ required: true, message: "不能为空" }],
  remark: [{ required: true, message: "不能为空" }],
  resourceType: [{ required: true, message: "不能为空" }],
  resourceId: [{ required: true, message: "不能为空" }],
});
const stockOptions = ref<any[]>([{ name: "无", id: 0 }]);
const queryStockOptions = async () => {
  const res = await getStockList();
  if ((res as any)?.data?.length) {
    stockOptions.value = buildTree((res as any)?.data || []);
    if (!props.data) form.value.resourceId = stockOptions.value[0]?.id;
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

const confirmSave = async (cb?: Function) => {
  try {
    const valid = await formRef.value.validate();
    if (valid) {
      const params = { ...form.value };
      const api = params.id ? editAuditFlow : createAuditFlow;
      const res: any = await api(params);
      ElMessage({
        type: "success",
        message: "保存成功",
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
    if (!props.data) form.value.deptId = departmentOptions.value[0]?.id;
  }
};
onMounted(async () => {
  await queryDepartmentOptions();
  await queryStockOptions();
});
defineExpose({ confirmSave });
</script>
<style lang="scss" scoped>
@use "@@/assets/styles/size.scss" as *;
.width-300 {
  width: zrem(300);
}
.avatar-upload {
  font-size: zrem(20);
  border: zrem(1) solid var(--el-border-color-darker);
  border-radius: 50%;
  &,
  & img {
    width: zrem(60);
    height: zrem(60);
  }
}
</style>
