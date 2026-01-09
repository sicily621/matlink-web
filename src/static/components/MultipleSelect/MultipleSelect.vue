<template>
  <el-select
      size="small"
      multiple
      filterable
      :disabled="disabled"
      :loading="mulSelectLoading"
      :collapse-tags="collapseTags"
      :max-collapse-tags="maxCollapseTags"
      v-model='selectedArr'
      placeholder='请选择'
      @change='changeSelect'
      class="zc-select"
  >
    <el-checkbox v-model="checked" @change='selectAll'>全选</el-checkbox>
    <el-option v-for='item in selectOptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
  </el-select>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';

interface SelectOption {
  value: string | number;
  label?: string;
}

const props = defineProps<{
  selectOptions: SelectOption[]; // 选项
  disabled?: boolean; // 是否禁用
  mulSelecteds?: (string | number)[]; // 已选中选项
  mulSelectLoading?: boolean; // 加载状态
  collapseTags?: boolean; // 是否折叠标签
  maxCollapseTags?:number; // 需要显示的 Tag 的最大数量 只有当 collapse-tags 设置为 true 时才会生效。
}>();

const emit = defineEmits<{
  (e: 'update:updateMultipleSelect', value: (string | number)[]): void;
}>();

const checked = ref(false); // 是否全选
const selectedArr = ref<(string | number)[]>([]); // 当前选中的值

// 全选/取消全选
const selectAll = () => {
  if (checked.value) {
    selectedArr.value = props.selectOptions.map((item) => item.value);
  } else {
    selectedArr.value = [];
  }
  emit('update:updateMultipleSelect', selectedArr.value);
};

// 监听选中值变化
const changeSelect = (val: (string | number)[]) => {
  if (val.length === props.selectOptions.length) {
    checked.value = true;
  } else {
    checked.value = false;
  }
  emit('update:updateMultipleSelect', val);
};

// 监听外部传入的已选中值变化
watch(
    () => props.mulSelecteds,
    (newVal) => {
      selectedArr.value = newVal || [];
      if (selectedArr.value.length === props.selectOptions.length) {
        checked.value = true;
      } else {
        checked.value = false;
      }
    },
    { immediate: true }
);
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin-left: 10px;
}
</style>
