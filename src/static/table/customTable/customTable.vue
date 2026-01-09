<!-- {{ $t('table.customTable.title') }} -->
<template>
  <el-table stripe class="zc-table" v-bind="props.tableProps" :data="props.tableData">
    <el-table-column v-for="col in props.columns" :key="col.prop" v-bind="col.columnProps" :prop="col.prop" :label="col.label">
      <template #default="scope">
        <custom-cell v-if="col.customRender" :record="scope.row" :column="col" />
        <span v-else>{{ scope.row[col.prop] }}</span>
      </template>
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
</script>
