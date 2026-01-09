<!-- {{ $t('table.fixedHeaderTable.title') }} -->
<template>
  <el-table stripe v-bind="props.tableProps" :data="props.tableData">
    <el-table-column v-for="col in computedColumns" :key="col.prop" v-bind="col.columnProps" :prop="col.prop" :label="col.label" :fixed="col.fixed">
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  tableProps?: any;
  columns: any[];
  tableData: any[];
}
const props = defineProps<Props>();

const fixedColumns = ref<any[]>([]);

const computedColumns = computed(() => {
  const columns = [...props.columns];
  if (fixedColumns.value.length > 0) {
    columns.unshift(...fixedColumns.value);
  }
  return columns;
});

const setFixedColumns = (columns: any[]) => {
  fixedColumns.value = columns;
};
defineExpose({
  setFixedColumns,
});
</script>
