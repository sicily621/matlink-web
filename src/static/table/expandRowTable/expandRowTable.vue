<!-- {{ $t('table.expandRowTable.title') }}   :row-key="'id'"-->

<template>
  <el-table
    v-bind="props.tableProps"
    :data="props.tableData"
    :row-key="props.rowKey"
    :expand-row-keys="expandedRows">
    <el-table-column
      v-for="col in props.columns"
      :key="col.prop"
      v-bind="col.columnProps"
      :prop="col.prop"
      :label="col.label">
    </el-table-column>
    <el-table-column :label="$t('table.expandRowTable.operate')" width="100">
      <template #default="scope">
        <el-button @click="toggleExpand">
          {{ props.$index !== undefined && expandedRows.includes(props.$index) ? $t('table.expandRowTable.collapse') : $t('table.expandRowTable.expand') }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column
    v-if="props.$index !== undefined && props.tableData[props.$index] && !props.tableData[props.$index].noExpand"
      type="expand">
      <template #default="scope">
        <div>
          <el-row>
            <el-col :span="6">
              <span>{{ $t('table.expandRowTable.detail') }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              {{scope.row.details}}
            </el-col>
          </el-row>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { ref } from 'vue'
interface Props {
  $index?: number; 
  tableData: any[];
  tableProps?: any;
  columns: any[];
  rowKey?: string;
}
const props = defineProps<Props>()
const expandedRows = ref<number[]>([])
const toggleExpand = () => {
  if (props.$index === undefined) return;
  expandedRows.value = expandedRows.value.includes(props.$index)
    ? expandedRows.value.filter(i => i !== props.$index)
    : [...expandedRows.value, props.$index];
}
</script>
