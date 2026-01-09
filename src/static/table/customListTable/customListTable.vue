<!-- {{ $t('table.customListTable.title') }} -->
<template>
  <el-table stripe class="zc-table" :data="listData" :span-method="spanMethod">
    <el-table-column type="index" />
    <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
      <template #default="scope">
        <custom-cell v-if="column.customRender" :record="scope.row" :column="column" />
        <span v-else>{{ scope.row[column.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface Column {
  prop: string;
  label: string;
  customRender?: boolean;
}

interface Props {
  tableProps?: Record<string, any>;
  columns: Column[];
  listData: any[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: "update:tableData", ...args: any[]): void;
}>();
console.log(props, emit);

const spanMethod = (data: { row: any; rowIndex: number; column: any; columnIndex: number }): { rowspan: number; colspan: number } | undefined => {
  // 根据业务需求动态返回
  if (data.columnIndex === 0) {
    return {
      rowspan: 2, // 比如，设置跨行两行
      colspan: 1, // 设置跨列为1
    };
  }
  return { rowspan: 1, colspan: 1 }; // 默认返回
};
</script>
