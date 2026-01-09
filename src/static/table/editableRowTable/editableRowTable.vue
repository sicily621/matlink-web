<!-- {{ $t('table.editableRowTable.title') }} -->
<template>
  <el-table
    class="zc-table"
    v-bind="props.tableProps"
    :data="props.editList"
    @current-change="onCurrentChange"
  >
    <el-table-column
      v-for="col in props.columns"
      :key="col.prop"
      v-bind="col.columnProps"
      :prop="col.prop"
      :label="col.label"
    >
      <template #default="scope">
        <el-input v-if="scope.row === editRow" v-model="editRow[scope.column.prop]" />
        <span v-else>
          {{ scope.row[scope.column.prop] }}
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  tableProps?: any;
  columns: any[];
  tableData: any[];
  editList: any[];
}

const props = defineProps<Props>();
const editList = ref(props.tableData); // 创建副本
const editRow = ref<any>(null);

const onCurrentChange = (row: any) => {
  editRow.value = row; // 设置当前编辑行
};

watch([() => props.tableData], () => {
  editList.value = props.tableData.slice(); // 更新副本
});
</script>
