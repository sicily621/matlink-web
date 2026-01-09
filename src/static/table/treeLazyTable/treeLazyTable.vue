<!-- {{ $t('table.treeLazyTable.title') }} -->
<template>
  <el-table stripe v-bind="props.tableProps" :data="treeData" :default-expand-all="false" :row-key="props.rowKey" :expand-row-keys="expandedRowKeys">
    <el-table-column v-for="col in props.columns" :key="col.prop" v-bind="col.columnProps" :prop="col.prop" :label="col.label"> </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from "vue";
interface Props {
  tableProps?: any;
  columns: any[];
  tableData: any[];
  rowKey?: string;
}
const props = defineProps<Props>();

const treeData = ref<any[]>([]);
const expandedRowKeys = ref<any[]>([]);

const setLazyTreeNode = (node: any, resolve: (...args: any[]) => void) => {
  node.loadData = () => {
    setTimeout(() => {
      resolve(getChildNodes(node));
    }, 200);
  };
};

const getChildNodes = (node: any) => {
  /* ... */
};

const toggleRowExpansion = (row: any, expandedRows: any[]) => {
  expandedRowKeys.value = expandedRows;
};

const loadNode = (node: any, resolve: (...args: any[]) => void) => {
  if (node.level === 0) {
    setLazyTreeNode(node, resolve);
  } else {
    resolve(getChildNodes(node));
  }
};
</script>
