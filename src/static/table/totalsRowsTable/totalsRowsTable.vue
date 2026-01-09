<!-- {{ $t('table.totalsRowsTable.title') }} -->
<template>
  <el-table stripe v-bind="props.tableProps" :data="props.tableData">
    <el-table-column v-for="col in props.columns" :key="col.prop" v-bind="col.columnProps" :prop="col.prop" :label="col.label"> </el-table-column>
    <el-table-column :label="$t('table.totalsRowsTable.total')">
      <template #default="scope">
        <span>{{ summary[scope.column.property] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from "vue";
interface Props {
  tableProps?: any;
  columns: any[];
  tableData: any[];
}
const props = defineProps<Props>();

const summary = ref<any>({});

const setSummaryMethod = (cb: (...args: string[]) => any) => {
  props.tableProps.summaryMethod = (...args: string[]) => {
    summary.value = cb(...args);
  };
};

defineExpose({
  setSummaryMethod,
});
</script>
