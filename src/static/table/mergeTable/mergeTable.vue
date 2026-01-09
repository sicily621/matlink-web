<!-- {{ $t('table.mergeTable.title') }} -->
<template>
  <el-table stripe v-bind="props.tableProps" :data="props.tableData">
    <el-table-column v-for="col in props.columns" :key="col.prop" v-bind="col.columnProps" :prop="col.prop" :label="col.label"> </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
interface Props {
  tableProps?: any;
  columns: any[];
  tableData: any[];
}
const props = defineProps<Props>();

const setSpanMethod = (method: (row: any, rowIndex: number) => number[]) => {
  props.tableProps.spanMethod = method;
};

defineExpose({
  setSpanMethod,
});
</script>
