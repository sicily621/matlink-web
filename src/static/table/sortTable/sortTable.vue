<!-- {{ $t('table.sortTable.title') }} -->
<template>
  <el-table stripe v-bind="props.tableProps" :data="props.tableData">
    <el-table-column v-for="col in props.columns" :key="col.prop" v-bind="col.columnProps" :prop="col.prop" :label="col.label" sortable="custom">
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
interface Props {
  tableProps?: any;
  columns: any[];
  tableData: any[];
}
const props = defineProps<Props>();

const setSortChange = (cb: (sort: any) => void) => {
  props.tableProps.sortChange = cb;
};
defineExpose({
  setSortChange,
});
</script>
