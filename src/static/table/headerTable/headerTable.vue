<template>
  <el-table stripe v-bind="tableProps" :data="tableData">
    <el-table-column
      v-for="col in columns"
      :key="col.prop"
      v-bind="col.columnProps"
      :prop="col.prop"
      :label="col.label"
      v-show="col.show !== undefined ? col.show : true"
    >
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
interface Props {
  tableProps: any;
  columns: {
    prop: string;
    label: string;
    columnProps?: any;
    show?: boolean;
  }[];
  tableData: any[];
}
const props = defineProps<Props>();

const hideColumn = (prop: string) => {
  for (let col of props.columns) {
    if (col.prop === prop) {
      col.show = false;
    }
  }
};

const showColumn = (prop: string) => {
  for (let col of props.columns) {
    if (col.prop === prop) {
      col.show = true;
    }
  }
};
</script>
