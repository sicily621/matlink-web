<!-- {{ $t('table.editableTable.title') }} -->
<template>
  <el-table stripe class="zc-table" v-bind="props.tableProps" :data="tableData" @current-change="onCurrentChange">
    <el-table-column v-for="col in props.columns" :key="col.prop" v-bind="col.columnProps" :prop="col.prop" :label="col.label">
      <template #header>
        <el-input v-model="col.prop" />
      </template>
      <template #default="scope">
        <el-input v-if="scope.row === editRow" v-model="scope.row[scope.column.prop]" @change="onCellChange(scope.row)" />
        <span v-else>{{ scope.row[scope.column.prop] }}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('table.editableTable.operate')">
      <template #default="scope">
        <el-button @click="onDeleteRow(scope.$index)">{{ $t('table.editableTable.delete') }}</el-button>
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

const tableData = ref([]);

interface Emit {
  (event: "change", ...args: any[]): void;
}

const emit = defineEmits<Emit>();

const props = defineProps<Props>();

const editRow = ref<any>(null);

const onCurrentChange = (row: any) => {
  editRow.value = row;
};
interface TableData {
  [key: string]: any;
}

const onCellChange = (row: TableData) => {
  emit("change", row);
};

const onDeleteRow = (index: number) => {
  tableData.value.splice(index, 1);
};
</script>
