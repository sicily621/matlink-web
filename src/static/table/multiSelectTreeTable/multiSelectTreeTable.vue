<template>
  <div class="relative h-full">
    <el-table
      class="zc-table h-full relative"
      stripe
      highlight-current-row
      v-bind="props.tableProps"
      :data="props.tableData"
      :header-row-style="{ height: zrem(46) }"
      :row-style="{ height: rowHeight ? zrem(rowHeight) : zrem(46) }"
      @select="select"
      @selectAll="selectAll"
      @current-change="currentChange"
      @selection-change="selectChange"
      @row-click="rowClick"
      ref="baseTableRef"
      empty-text="&nbsp"
      table-layout="auto"
      :height="props.height"
      :header-cell-style="headerCellStyle"
      :row-key="(row) => row.id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @expand-change="handleExpandChange"
    >
      <el-table-column
        v-if="checkboxFlag && (checkboxPosition === 'left' || !checkboxPosition)"
        type="selection"
        width="55"
        class-name="checkbox-column"
      />

      <template v-for="col in props.columns" :key="col.prop">
        <el-table-column v-if="col.type === 1" :label="col.label" width="80" type="index" :index="indexMethod"></el-table-column>

        <el-table-column v-if="!col.type" :label="col.label" :width="col.width">
          <template #default="scope">
            <slot :scope="scope" :name="col.prop">
              <span class="text-overflow" :style="{ width: `${col.width}px` }">
                {{ scope.row[col.prop] ?? "-" }}
              </span>
            </slot>
          </template>
        </el-table-column>

        <el-table-column v-if="col.type === 2 && (col?.width ?? true)" :label="col.label" :width="col.width">
          <template #default="scope">
            <slot :scope="scope" :name="col.prop">
              <el-tooltip v-if="(scope.row[col.prop]?.length ?? 0) * 14 > col.width" :content="scope.row[col.prop]" placement="top">
                <span class="text-overflow" :style="{ width: `${col.width}px` }">
                  {{ scope.row[col.prop] }}
                </span>
              </el-tooltip>
              <div v-else class="text-overflow" :style="{ width: `${col.width}px` }">
                {{ scope.row[col.prop] }}
              </div>
            </slot>
          </template>
          <template #header>
            <slot :scope="col" :name="`${col.prop}Header`">{{ col.label }}</slot>
          </template>
        </el-table-column>
        <el-table-column v-if="col.type === 3" :render-header="(data) => renderHeaderCheckbox(data, col)" :width="col.width">
          <template #default="scope">
            <slot :scope="scope" :name="col.prop">{{ scope.row[col.prop] }}</slot>
          </template>
        </el-table-column>
        <el-table-column v-if="col.type === 4" :label="col.label" :width="col.width">
          <template #default="scope">
            <slot :scope="scope" :name="col.prop">{{ scope.row[col.prop] ?? "-" }}</slot>
          </template>
          <template #header>
            <span>{{ col.label }}</span>
            <el-icon class="pointer m-r-10 editIcon">
              <Edit v-if="col.icon === 'edit'" />
              <Delete v-if="col.icon === 'delete'" />
              <Search v-if="col.icon === 'search'" />
              <Share v-if="col.icon === 'share'" />
              <Loading v-if="col.icon === 'loading'" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column v-if="col.type === 5" :label="col.label" fixed :prop="col.prop" :width="col.width">
          <template #default="scope">
            <slot :scope="scope" :name="col.prop">{{ scope.row[col.prop] ?? "-" }}</slot>
          </template>
        </el-table-column>
        <el-table-column v-if="col.type === 6" :label="col.label" :prop="col.prop"></el-table-column>
      </template>
      <el-table-column v-if="checkboxFlag && checkboxPosition === 'right'" type="selection" width="55" class-name="checkbox-column" />
    </el-table>
    <div class="empty-img absolute flex-column flex-center" v-if="!props.tableData?.length">
      <div class="m-t-10">{{ $t('table.multiSelectTreeTable.noData') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { zrem } from "@static/js/theme/zrem";
import { ref, h } from "vue";
import { ElCheckbox, CheckboxValueType } from "element-plus";
interface Props {
  tableProps?: any;
  columns: any[];
  tableData: any[];
  checkboxFlag?: boolean;
  checkboxPosition?: string;
  type?: 0 | 1; //0后台传的数据 1
  indexMethod?: Function;
  rowHeight?: number;
  hideTableEmptyImg?: boolean;
  height?: string;
  fixedColumnMore?: boolean;
}
const baseTableRef = ref();
const props = defineProps<Props>();
const emits = defineEmits(["select", "selectAll", "currentChange", "selectChange", "rowClick", "customSelectAll", "handleExpandChange"]);

const select = (selection: any, row: any) => emits("select", selection, row);
const selectAll = (selection: any) => emits("selectAll", selection);
const toggleRowSelection = (row: any, selected?: any) => baseTableRef.value.toggleRowSelection(row, selected);
const sort = (sortObj: any) => baseTableRef.value.sort(sortObj);
const currentChange = (row: any) => emits("currentChange", row);
const selectChange = (selection: any) => emits("selectChange", selection);
const rowClick = (e: any) => emits("rowClick", e);

const setCurrentRow = (row: any) => baseTableRef.value.setCurrentRow(row);
const indexMethod = (index: number) => props.indexMethod?.(index) ?? index + 1;
const renderHeaderCheckbox = (data: any, col: any) => {
  if (isCheckedObj.value[col.prop] == undefined) isCheckedObj.value[col.prop] = false;
  return h("div", {}, [
    h(ElCheckbox, {
      modelValue: isCheckedObj.value[col.prop],
      "onUpdate:modelValue": (e: CheckboxValueType) => {
        isCheckedObj.value[col.prop] = e as boolean;
        emits("customSelectAll", { col, checkbox: e as boolean });
      },
      label: col.label,
    }),
  ]);
};
const isCheckedObj = ref<any>({});
const setIsCheckedObj = (key: string, checkbox: boolean) => {
  isCheckedObj.value[key] = checkbox;
};
const headerCellStyle = ({ column }: { column: any }) => {
  if (column.property === "searchDate") {
    return { "background-color": "var(--el-table-header-bg-color)" };
  }
};

// const handleExpandChange = (selection: any, row: any) =>
//   emits("handleExpandChange", selection, row);

const handleExpandChange = (row: any, expanded: boolean) => {
  if (expanded && !row.children && row.hasChildren) {
    loadDataForNode(row);
  }
};
const loadDataForNode = (row: any) => {
  const childrenData = ref([]);
  row.children = childrenData.value;
};

defineExpose({
  toggleRowSelection,
  sort,
  setCurrentRow,
  setIsCheckedObj,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.text-overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 20px;
}
.empty-img {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: var(--el-text-color-placeholder);
}
.operator-column {
  width: auto;
}
.editIcon {
  margin-left: zrem(5);
  vertical-align: middle;
  width: zrem(16);
  height: zrem(16);
}
</style>
