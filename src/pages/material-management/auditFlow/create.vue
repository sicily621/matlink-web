<template>
  <div class="flex-1 flex-column">
    <div class="m-l-20 m-t-16 w-full">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">
          {{ i18nM("material.label.disposalFlow") }}
        </div>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="d-flex relative w-full m-t-20" label-width="120px">
        <div class="d-flex">
          <div class="w-296 m-r-30">
            <el-form-item :label="i18nM('material.label.name')" prop="title">
              <el-input v-model="form.title" class="flex-1" :placeholder="i18nM('material.placeholder.name')" maxlength="32" required> </el-input>
            </el-form-item>
            <el-form-item :label="i18nM('material.label.description')" prop="remark">
              <el-input
                class="flex-1 m-r-10"
                v-model="form.remark"
                type="textarea"
                :placeholder="i18nM('material.placeholder.inputDescription')"
                maxlength="64"
              ></el-input>
            </el-form-item>
            <el-form-item :label="i18nM('material.label.flowType')" prop="resourceType">
              <div class="d-flex w-full">
                <el-select class="flex-1 m-r-16" v-model="form.resourceType" :placeholder="i18nM('material.placeholder.select')">
                  <el-option v-for="item of typeOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
                <el-checkbox :true-value="1" :false-value="0" v-model="form.enable" :label="i18nM('material.table.enable')" />
              </div>
            </el-form-item>
            <el-form-item :label="i18nM('material.title.materialWarehouse')" prop="resourceId">
              <el-tree-select
                v-model="form.resourceId"
                :placeholder="i18nM('space.placeholder.select')"
                :data="sourceOptions"
                check-strictly
                :render-after-expand="true"
                :props="selectProps"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { Flow, saveFlow } from "@functions/serviceCenter/material-management/api/materialAuditFlow";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { ElMessage } from "element-plus";
const props = defineProps<{ data: Flow | null; projectId: string | number; deptId: string | number }>();
const i18nM = window.$i18nM;
const formRef = ref();
//表单
const form = ref<Flow>({
  projectId: props.projectId,
  title: "",
  resourceId: "",
  resourceType: 1,
  deptId: props.deptId,
  remark: "",
  enable: 1,
});
if (props.data) {
  Object.assign(form.value, props.data);
}
const rules = reactive({
  title: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  remark: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  resourceType: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  resourceId: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
});
const typeOptions = computed(() => {
  return [
    { id: 1, name: i18nM("material.label.stockIn") },
    { id: 2, name: i18nM("material.label.stockOut") },
    { id: 3, name: i18nM("material.label.pickUpSupplies") },
    { id: 4, name: i18nM("material.label.stocktaking") },
    { id: 5, name: i18nM("material.label.purchase") },
  ];
});
const sourceOptions = ref<any[]>([]);
const selectProps = { value: "id", label: "name" };
const confirmSave = (cb: Function) => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const params = {
        ...form.value,
      };
      saveFlow(params, (res: any) => {
        if (res.code) {
          ElMessage({
            type: "success",
            message: props.data ? i18nM("material.message.editSuccess") : i18nM("material.message.addSuccess"),
          });
          cb && cb(res.data);
        }
      });
    }
  });
};
onMounted(() => {
  materialStockFindStockTree({ projectId: props.projectId }, (res: any) => {
    sourceOptions.value = res.data;
    if (!props.data) {
      form.value.resourceId = sourceOptions.value[0].id;
    }
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
</style>
