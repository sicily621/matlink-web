<template>
  <div class="app-container flex flex-col h-full">
    <div class="h-full w-full flex flex-col">
      <el-card v-loading="loading" shadow="never" class="search-wrapper">
        <div class="flex justify-between">
          <div class="zc-header-title">
            <div class="zc-header-icon"></div>
            <div class="zc-header-word">物料单位</div>
          </div>
          <el-button type="primary" v-if="enableCreate" @click="create"
            >新增一级单位</el-button
          >
        </div>
      </el-card>
      <div
        v-loading="loading"
        class="flex-grow-1 flex flex-col el-card table-card"
        shadow="never"
      >
        <div class="table-wrap">
          <el-table
            :data="tableData"
            row-key="id"
            default-expand-all
            highlight-current-row
            stripe
            class="text-align-center"
          >
            <el-table-column prop="cnname" label="名称" />
            <el-table-column prop="enname" label="英文" />
            <el-table-column prop="unitSymbol" label="换算比例" />
            <el-table-column prop="description" label="备注" />
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
                    class="fz16 pointer m-r-5 cursor-pointer"
                    text
                    v-if="enableCreate"
                    @click="addSubUnit(scope.row)"
                  >
                    <Plus />
                  </el-icon>
                  <el-icon
                    class="fz16 cursor-pointer"
                    text
                    @click="remove(scope.row.id)"
                    v-if="!hasChildren(scope.row) && enableDelete"
                  >
                    <Delete />
                  </el-icon>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialogFormVisible"
      :title="isEdit ? '编辑单位' : '添加单位'"
      width="500"
      @close="closeModal()"
    >
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item
          label="所属单位名称"
          :label-width="140"
          v-if="!isEdit && currentData"
        >
          {{ currentData.cnname }}
        </el-form-item>
        <el-form-item label="名称" :label-width="140" prop="cnname">
          <el-input v-model="form.cnname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="英文" :label-width="140" prop="enname">
          <el-input v-model="form.enname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="换算比例" :label-width="140" prop="unitSymbol">
          <el-input v-model="form.unitSymbol" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" :label-width="140" prop="description">
          <el-input v-model="form.description" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeModal()">取消</el-button>
          <el-button type="primary" @click="add()">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import {
  Unit,
  getUnitList,
  deleteUnit,
  createUnit,
  editUnit,
} from "../api/unit";
import { ElMessage } from "element-plus";
import { ModuleCode } from "@/router/moduleCode";
import { usePermissionStore } from "@/pinia/stores/permission";
import { PermissionAction } from "@/pages/employeeManagement/api/permission";
const permissionStore = usePermissionStore();

const enableDelete = permissionStore.hasPermission(
  ModuleCode.Unit,
  PermissionAction.Delete
);
const enableCreate = permissionStore.hasPermission(
  ModuleCode.Unit,
  PermissionAction.Add
);
const enableEdit = permissionStore.hasPermission(
  ModuleCode.Unit,
  PermissionAction.Edit
);
const dialogFormVisible = ref(false);
const form = reactive({
  cnname: "",
  enname: "",
  unitSymbol: "1",
  description: "",
});
const loading = ref<boolean>(false);
const formRef = ref();
const currentData = ref<Unit | null>(null);
const isEdit = ref(false);
const rules = reactive({
  name: [{ required: true, message: "不能为空" }],
  cnname: [{ required: true, message: "不能为空" }],
  enname: [{ required: true, message: "不能为空" }],
  unitSymbol: [{ required: true, message: "不能为空" }],
});
const tableData = ref<Unit[]>([]);

function refreshTable() {
  loading.value = true;
  getUnitList()
    .then((res: any) => {
      const { data } = res;
      if (data.length > 0) tableData.value = buildUnitTree(data);
    })
    .catch(() => {
      tableData.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
}
const create = () => {
  currentData.value = null;
  dialogFormVisible.value = true;
};

const remove = async (id: string) => {
  await deleteUnit(id);
  ElMessage({
    type: "success",
    message: "删除成功",
  });
  refreshTable();
};
const unitMap = new Map();
const hasChildren = (row: Unit) => {
  return unitMap.get(row?.id)?.children.length > 0;
};
function buildUnitTree(units: Unit[]) {
  // 第一步：创建所有单位的映射并初始化children
  units.forEach((dept: Unit) => {
    unitMap.set(dept.id, {
      ...dept,
      children: [],
    });
  });

  // 第二步：建立所有层级的父子关系
  units.forEach((dept: Unit) => {
    const current = unitMap.get(dept.id);
    if (dept.parentId !== 0) {
      const parent = unitMap.get(dept.parentId);
      if (parent) {
        parent.children.push(current);
      }
    }
  });

  // 第三步：收集顶级单位
  return units
    .filter((dept: Unit) => dept.parentId === 0)
    .map((dept: Unit) => unitMap.get(dept.id));
}
const closeModal = () => {
  form.cnname = "";
  form.enname = "";
  form.unitSymbol = "";
  form.description = "";
  dialogFormVisible.value = false;
  currentData.value = null;
  isEdit.value = false;
};

const add = async () => {
  const valid = await formRef.value.validate();
  if (valid) {
    if (isEdit.value) {
      const params: any = {
        ...currentData.value,
        ...form,
      };
      await editUnit(params);
    } else {
      const params: Unit = {
        ...form,
        parentId: currentData.value?.id ?? 0,
      };
      await createUnit(params);
    }

    closeModal();
    refreshTable();
  }
};
const addSubUnit = (row: Unit) => {
  currentData.value = { ...row };
  dialogFormVisible.value = true;
};
const edit = (row: Unit) => {
  isEdit.value = true;
  currentData.value = { ...row };
  form.cnname = currentData.value.cnname;
  form.enname = currentData.value.enname;
  form.unitSymbol = currentData.value.unitSymbol;
  form.description = currentData.value.description;
  dialogFormVisible.value = true;
};
onMounted(async () => {
  refreshTable();
});
</script>

<style lang="scss" scoped>
@use "@@/assets/styles/size.scss" as *;
.table-card {
  height: calc(100% - zrem(110));
}
.table-wrap {
  height: calc(100% - zrem(45));
}

.search-wrapper {
  height: zrem(60);
  margin-bottom: zrem(10);
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
.create-wrap {
  height: calc(100% - zrem(45));
}
.footer {
  height: zrem(45);
}
</style>
