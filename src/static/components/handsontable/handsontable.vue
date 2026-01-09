<template>
  <div class="hot-table-con" ref="tableWrapRef">
    <hot-table ref="hotTableRef" :data="data" :settings="hotSettings"></hot-table>
  </div>
</template>
<script setup lang="ts">
import { HotTable } from "@handsontable/vue3";
import handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";
import { ref, watch, render, h, nextTick } from "vue";
import { useElementSize, debouncedWatch } from "@vueuse/core";
// 注册自定义渲染器
handsontable.renderers.registerRenderer("delIcon", function (instance, td, row) {
  if (!instance) return true;
  td.innerHTML = "";
  const operateIconsCon = `
        <div class="handsontable-operate-item">
            <i data-v-76231e99="" class="el-icon fz20 pointer" text=""><svg data-v-76231e99="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M352 192V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64H96a32 32 0 0 1 0-64zm64 0h192v-64H416zM192 960a32 32 0 0 1-32-32V256h704v672a32 32 0 0 1-32 32zm224-192a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32m192 0a32 32 0 0 0 32-32V416a32 32 0 0 0-64 0v320a32 32 0 0 0 32 32"></path></svg></i>
        </div>
    `;
  const divDom = document.createElement("div");
  divDom.className = "handsontable-operate-con";
  divDom.innerHTML = operateIconsCon;
  td.appendChild(divDom);
  divDom.addEventListener("click", () => {
    props.data && props.data.splice(row, 1);
  });
  return true;
});

handsontable.renderers.registerRenderer("select", function (instance, td, row, col, prop, value, cellProperties) {
  if (instance && slots[prop]) {
    nextTick(() => {
      const selectVNode = h(slots[prop], { row, col, prop, value, cellProperties });
      const divDom = document.createElement("div");
      render(selectVNode, divDom);
      td.innerHTML = "";
      td.appendChild(divDom);
    });
  }
  return true;
});

handsontable.renderers.registerRenderer("checkbox", function (instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = "";
  const divDom: any = document.createElement("div");
  divDom.className = "handsontable-checkbox-con";
  const customCheckbox: any = document.createElement("div");
  customCheckbox.className = "handsontable-custom-checkbox";
  customCheckbox.innerText = "";
  customCheckbox._checkFlag = value;
  if (!customCheckbox._checkFlag) {
    customCheckbox.classList.remove("checked");
    customCheckbox._checkFlag = false;
    customCheckbox.innerText = "";
  } else {
    customCheckbox.classList.add("checked");
    customCheckbox._checkFlag = true;
    customCheckbox.innerText = "✓";
  }
  customCheckbox.addEventListener("click", () => {
    if (customCheckbox._checkFlag) {
      customCheckbox.classList.remove("checked");
      customCheckbox._checkFlag = false;
      customCheckbox.innerText = "";
    } else {
      customCheckbox.classList.add("checked");
      customCheckbox._checkFlag = true;
      customCheckbox.innerText = "✓";
    }
    emits("checkboxChange", { row, col, checked: customCheckbox._checkFlag });
  });
  divDom.appendChild(customCheckbox);
  td.appendChild(divDom);
  return true;
});
handsontable.renderers.registerRenderer("indexNum", function (instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = "";
  const divDom: any = document.createElement("div");
  divDom.innerHTML = row + 1;
  td.appendChild(divDom);
  return true;
});

const props = defineProps<{
  colHeaders: any[];
  data?: any[];
  columns?: any[];
  settings?: any;
}>();
const slots = defineSlots<{
  [name: string]: (args: any) => any;
}>();
watch(
  () => props.data,
  () => {
    hotTableRef.value.hotInstance.loadData(props.data);
  }
);
const emits = defineEmits(["afterPaste", "checkboxChange", "allCheckBoxChange", "afterChange", "afterScroll"]);
const hotTableRef = ref();
// const data = ref(props.data);
const hotSettings = ref({
  data: props.data,
  rowHeaders: false,
  colHeaders: props.colHeaders.map((res: any) => res.name),
  afterGetColHeader: function (i: number, th: Element) {
    hotSettings.value.data = props.data;
    const isCheckbox = props.colHeaders[i] && props.colHeaders[i].type === 3;
    const editable = props?.settings ? !props.colHeaders[i].readonly : !props.colHeaders[i].type;
    if (isCheckbox) {
      const oldCheckboxWrap = (th as any)._checkboxDom;
      if (oldCheckboxWrap) {
        th.innerHTML = "";
        const checkbox = oldCheckboxWrap.querySelector(".handsontable-custom-checkbox");
        checkbox._checkFlag = (this as any).getDataAtCol(i).every(Boolean);
        checkbox.innerText = checkbox._checkFlag ? "✓" : "";
        th.appendChild(oldCheckboxWrap);
        return;
      }
      const divDom = document.createElement("div");
      divDom.className = "handsontable-checkbox-con";
      const customCheckbox: any = document.createElement("div");
      customCheckbox.className = "handsontable-custom-checkbox";
      customCheckbox._checkFlag = props.colHeaders[i]?.initVal ?? props.colHeaders[i - props.colHeaders.length]?.initVal ?? false;
      customCheckbox.innerText = customCheckbox._checkFlag ? "✓" : "";
      customCheckbox.addEventListener("click", () => {
        if (customCheckbox._checkFlag) {
          customCheckbox.classList.remove("checked");
          customCheckbox._checkFlag = false;
          customCheckbox.innerText = "";
        } else {
          customCheckbox.classList.add("checked");
          customCheckbox._checkFlag = true;
          customCheckbox.innerText = "✓";
        }
        emits("allCheckBoxChange", customCheckbox._checkFlag);
      });
      divDom.appendChild(customCheckbox);
      // 将勾选框添加到表头元素中
      th.innerHTML = "";
      th.appendChild(divDom);
      (th as any)._checkboxDom = divDom;
    } else if (editable) {
      const name = props?.settings ? props?.colHeaders?.[i]?.label : props?.colHeaders?.[i]?.name;
      const editIcon = `<i data-v-76231e99="" class="el-icon fz20 pointer" text=""><svg data-v-f18a99fc="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640z"></path><path fill="currentColor" d="m469.952 554.24 52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z"></path></svg></i>`;
      th.innerHTML = `<div class="d-flex flex-center h-full"><span class="m-r-3">${name}</span>${editIcon}</div>`;
    }
  },
  disableVisualSelection: "current",
  columns: props.columns || null,
  width: "100%", // 表格宽度
  readonly: true,
  stretchH: "all",
  contextMenu: false,
  className: "zc-hot-table",
  fillHandle: false,
  autoColumnSize: false,
  autoRowSize: false,
  dropdownMenu: false,
  manualRowResize: false,
  manualColumnResize: false,
  manualRowMove: false,
  manualColumnMove: false,
  manualColumnFreeze: false,
  manualTopFreeze: false,
  mergeCell: false, //合并单元格
  cells: (row: number, col: number, prop: any) => {
    // 指定在哪些单元格使用自定义渲染器
    //type === 1 是只读列 不可粘贴
    if (props.colHeaders[col].type === 1) {
      return {
        readOnly: true,
      };
    }
    //type === 2 是渲染icon的列 并且只读
    if (props.colHeaders[col].type === 2) {
      return {
        renderer: props.colHeaders[col].icon, // 使用已注册的自定义渲染器
        readOnly: true,
      };
    }
    //type === 3 是渲染勾选框 并且只读
    if (props.colHeaders[col].type === 3) {
      return {
        renderer: "checkbox",
        readOnly: true,
      };
    }
    //type === 4 是渲染序号列 并且只读
    if (props.colHeaders[col].type === 4) {
      return {
        renderer: "indexNum",
        readOnly: true,
      };
    }
  },
  // beforePaste: (data, coords) => {
  //     if (coords[0].startCol === 1 || coords[0].endCol === 1) {
  //         return false;
  //     } else {
  //         return true;
  //     }
  // },
  afterPaste: (data: any, coords: any) => {
    emits("afterPaste", { data, coords });
  },
  afterChange: (changes: any[]) => {
    emits("afterChange", changes);
  },
  afterScroll: () => {
    emits("afterScroll");
  },
});
const tableWrapRef = ref();
const { height } = useElementSize(tableWrapRef);
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
let settings = props.settings;
let colHeaders = props.colHeaders;
watch(height, () => {
  Object.assign(hotSettings.value, props.settings);
  if (hotSettings.value?.data) hotTableRef.value.hotInstance.updateSettings(hotSettings.value);
});
watch(locale, () => {
  hotSettings.value.colHeaders = props.colHeaders.map((col) => col.name || col?.label);
});
if (props.settings) Object.assign(hotSettings.value, props.settings);
debouncedWatch(
  () => props.settings,
  () => {
    if (settings) Object.assign(hotSettings.value, props.settings);
    if (hotSettings.value?.data) hotTableRef.value.hotInstance.updateSettings(hotSettings.value);
  },
  {
    debounce: 500,
  }
);
//校验每个单元格
const validateCells = () => {
  const instance = hotTableRef.value.hotInstance;
  instance && instance.validateCells();
};
const validateRows = (rows: number[], cb: Function) => {
  const instance = hotTableRef.value.hotInstance;
  instance && instance.validateRows(rows, cb);
};
defineExpose({
  validateCells,
  validateRows,
});
</script>
<style lang="scss">
@use "@static/css/common/size.scss" as *;
.handsontable {
  font-size: zrem(14) !important;
  font-family: PingFang SC, Arial;
  thead tr th {
    font-weight: 500;
  }
}
.hot-table-con {
  width: 100%;
  height: calc(100% - zrem(10));
  margin-top: zrem(10);
  box-sizing: border-box;
  background: var(--el-fill-color-blank);
  border-radius: zrem(8);
  overflow: hidden;
}
.handsontable-operate-con {
  width: zrem(40);
  height: zrem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0 auto;
  .handsontable-operate-item {
    width: zrem(40);
    height: zrem(40);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: zrem(14);
    overflow: hidden;
  }
}
.handsontable-checkbox-con {
  // margin: 0 auto;
  // background: red;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.handsontable-checkbox {
  position: absolute;
  left: zrem(-20);
  top: zrem(-20);
}
.handsontable-custom-checkbox {
  width: zrem(13);
  height: zrem(13);
  border: zrem(1) solid var(--el-color-primary);
  cursor: pointer;
  border-radius: zrem(2);
  font-size: zrem(12);
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  &.checked {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    color: var(--el-color-white);
  }
}
</style>
