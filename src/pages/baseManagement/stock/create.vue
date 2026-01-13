<template>
  <div class="flex flex-col">
    <el-card class="w-full h-full">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">物料库信息</div>
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
          <el-form-item label="类型" prop="typeId">
            <div class="flex w-full">
              <el-tree-select
                v-model="form.typeId"
                placeholder="请选择部门"
                :data="stockTypeOptions"
                check-strictly
                :render-after-expand="false"
                :props="selectProps"
                class="flex-1"
              />
              <el-button
                type="primary"
                @click="addType"
                class="p-l-6 p-r-6 m-l-3"
                >新增</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input
              v-model="form.description"
              class="flex-1"
              placeholder="请输入备注"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-dialog
      v-model="dialogFormVisible"
      :title="'添加分类'"
      width="600"
      @close="closeModal()"
    >
      <el-form
        :model="typeForm"
        label-position="left"
        ref="typeFormRef"
        :rules="typeRules"
        class="flex"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="typeForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" prop="description" class="m-l-3">
          <el-input v-model="typeForm.description" autocomplete="off" />
        </el-form-item>
        <el-button type="primary" class="m-l-3" @click="saveType"
          >保存</el-button
        >
      </el-form>
      <div class="table-wrap">
        <el-table
          :data="tableData"
          row-key="id"
          default-expand-all
          highlight-current-row
          stripe
          class="text-align-center h-full"
        >
          <el-table-column prop="index" label="序号" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="operate" label="操作">
            <template #default="scope">
              <div class="flex">
                <el-icon
                  class="fz16 pointer m-r-5 cursor-pointer"
                  text
                  @click="edit(scope.row)"
                  v-if="enableEdit"
                >
                  <Edit />
                </el-icon>
                <el-icon
                  class="fz16 cursor-pointer"
                  text
                  @click="remove(scope.row.id)"
                  v-if="enableDelete"
                >
                  <Delete />
                </el-icon>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeModal()">返回</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { Stock, createStock, editStock } from "../api/stock";
import {
  StockType,
  createStockType,
  editStockType,
  getStockTypeList,
  deleteStockType,
} from "../api/stockType";
import { ElMessage } from "element-plus";
import { ModuleCode } from "@/router/moduleCode";
import { usePermissionStore } from "@/pinia/stores/permission";
import { PermissionAction } from "@/pages/employeeManagement/api/permission";
import { useUserStore } from "@/pinia/stores/user";

const permissionStore = usePermissionStore();
const props = defineProps<{ data: Stock | null; parentId: string }>();
const formRef = ref();
const typeFormRef = ref();
const selectProps = { value: "id", label: "name" };
const enableDelete = permissionStore.hasPermission(
  ModuleCode.Stock,
  PermissionAction.Delete
);
const enableCreate = permissionStore.hasPermission(
  ModuleCode.Stock,
  PermissionAction.Add
);
const enableEdit = permissionStore.hasPermission(
  ModuleCode.Stock,
  PermissionAction.Edit
);

const userStore = useUserStore();
//表单
const form = ref<Stock>({
  name: "",
  parentId: props.parentId,
  typeId: 0,
  description: "",
  createUserId: userStore.getInfo()?.id,
});
const typeForm = ref<StockType>({
  name: "",
  description: "",
  parentId: 0,
  createUserId: userStore.getInfo()?.id,
});
const tableData = ref<StockType[]>([]);
const typeRules = reactive({
  name: [{ required: true, message: "不能为空" }],
});
const dialogFormVisible = ref(false);
const closeModal = () => {
  dialogFormVisible.value = false;
};
const stockTypeOptions = ref<any>([{ id: 0, name: "无" }]);
//合并props
if (props.data) {
  Object.assign(form.value, props.data);
}
const rules = reactive({
  name: [{ required: true, message: "不能为空" }],
  typeId: [{ required: true, message: "不能为空" }],
});
const addType = () => {
  dialogFormVisible.value = true;
};
const stockTypeMap = new Map();
function buildStockTypeTree(stocks: StockType[]) {
  // 第一步：创建所有分类的映射并初始化children
  stocks.forEach((dept: StockType) => {
    stockTypeMap.set(dept.id, {
      ...dept,
      children: [],
    });
  });

  // 第二步：建立所有层级的父子关系
  stocks.forEach((dept: StockType) => {
    const current = stockTypeMap.get(dept.id);
    if (dept.parentId !== 0) {
      const parent = stockTypeMap.get(dept.parentId);
      if (parent) {
        parent.children.push(current);
      }
    }
  });

  // 第三步：收集顶级分类
  return stocks
    .filter((dept: StockType) => dept.parentId === 0)
    .map((dept: StockType) => stockTypeMap.get(dept.id));
}
const queryStockTypeOptions = async () => {
  const res = await getStockTypeList();
  if ((res as any)?.data?.length) {
    stockTypeOptions.value = buildStockTypeTree((res as any)?.data || []);
    if (!props.data?.id) form.value.typeId = stockTypeOptions.value[0]?.id || 0;
    tableData.value =
      (res as any)?.data.map((item: any, i: number) => {
        return { ...item, index: i + 1 };
      }) || [];
  }
};

const confirmSave = async (cb?: Function) => {
  const valid = await formRef.value.validate();
  if (valid) {
    const params = { ...form.value };
    const api = params.id ? editStock : createStock;
    await api(params);
    ElMessage({
      type: "success",
      message: "保存成功",
    });
    cb && cb();
  }
};
const saveType = async () => {
  const valid = await (typeFormRef as any).value.validate();
  if (valid) {
    const params = { ...typeForm.value };
    const api = params.id ? editStockType : createStockType;
    await api(params);
    ElMessage({
      type: "success",
      message: "保存成功",
    });
    typeForm.value.name = "";
    typeForm.value.description = "";
    typeFormRef.value.resetFields();
    queryStockTypeOptions();
  }
};
const edit = (row: StockType) => {
  typeForm.value = { ...row };
};
const remove = async (id: string) => {
  await deleteStockType(id);
  ElMessage({
    type: "success",
    message: "删除成功",
  });
  queryStockTypeOptions();
};
defineExpose({ confirmSave });
onMounted(() => {
  queryStockTypeOptions();
});
</script>
<style lang="scss" scoped>
@use "@@/assets/styles/size.scss" as *;
.width-300 {
  width: zrem(300);
}
.table-wrap {
  height: zrem(400);
}
</style>
