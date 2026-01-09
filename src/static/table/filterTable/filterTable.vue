<!-- {{ $t('table.filterTable.title') }} -->
<template>
  <div>
    <el-input v-model="filterText" :placeholder="$t('table.filterTable.inputPlaceholder')" />
    <el-table
      v-bind="props.tableProps"
      :data="computedTableData">
      <el-table-column 
        v-for="col in props.columns"
        :key="col.prop" 
        v-bind="col.columnProps"
        :prop="col.prop"
        :label="col.label"> 
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  tableProps?: any
  columns: any[]
  tableData: any[] 
}

const props = defineProps<Props>()
const filterText = ref('')

const computedTableData = computed(() => {
  if (!props.tableData.length) return []
  return props.tableData.filter(row => {
    return Object.keys(row)
      .some(key => {
        return String(row[key])
          .toLowerCase()
          .includes(filterText.value.toLowerCase())
      })
  })
})
</script>