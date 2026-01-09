<!-- {{ $t('table.fixedColumnTable.title') }} -->
<template>
  <el-table stripe v-bind="props.tableProps" :data="props.tableData" border>
    <el-table-column v-for="col in computedColumns" :key="col.prop" v-bind="col.columnProps" :prop="col.prop" :label="col.label"> </el-table-column>
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

const fixedLeftColumns = ref<any[]>([]);
const fixedRightColumns = ref<any[]>([]);

const computedColumns = computed(() => {
  const columns = [...props.columns];

  if (fixedLeftColumns.value.length > 0) {
    columns.unshift(...fixedLeftColumns.value);
  }

  if (fixedRightColumns.value.length > 0) {
    columns.push(...fixedRightColumns.value);
  }

  return columns;
});

const setFixedLeftColumns = (columns: any[]) => {
  fixedLeftColumns.value = columns;
  props.tableProps.fixedLeftColumns = fixedLeftColumns.value;
};

const setFixedRightColumns = (columns: any[]) => {
  fixedRightColumns.value = columns;
  props.tableProps.fixedRightColumns = fixedRightColumns.value;
};
defineExpose({
  setFixedLeftColumns,
  setFixedRightColumns,
});
</script>
