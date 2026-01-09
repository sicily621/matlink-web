<template>
  <div
    :class="{ 'm-choose-icon-dialog-body-height': isScroll }"
    class="zc-dialog"
    v-show="dialogVisible"
  >
    <el-dialog
      v-model="dialogVisible"
      v-bind="$attrs"
      :class="!isScroll ? 'showAll_dialog' : ''"
    >
      <template #default>
        <Form
          ref="form"
          :options="options"
          label-width="100px"
          @on-change="onChange"
          @before-upload="beforeUpload"
          @on-preview="onPreview"
          @on-remove="onRemove"
          @before-remove="beforeRemove"
          @on-success="onSuccess"
          @on-exceed="onExceed"
        >
          <template #uploadArea>
            <slot name="uploadArea"></slot>
          </template>
          <template #uploadTip>
            <slot name="uploadTip"></slot>
          </template>
        </Form>
      </template>
      <template #footer>
        <slot :form="form" name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import Form from "../form/form.vue";
import { FormOptions, FormInstance } from "../form/types/type";
let props = defineProps({
  // 控制组件显隐
  visible: {
    type: Boolean,
    default: false,
  },
  // 表单配置项
  options: {
    type: Array as PropType<FormOptions[]>,
    required: true,
  },
  // 事件回调函数定义，统一使用 (...args: any[]) => void 类型
  onChange: {
    type: Function as PropType<(...args: any[]) => void>,
  },
  beforeUpload: {
    type: Function as PropType<(...args: any[]) => void>,
  },
  onPreview: {
    type: Function as PropType<(...args: any[]) => void>,
  },
  onRemove: {
    type: Function as PropType<(...args: any[]) => void>,
  },
  beforeRemove: {
    type: Function as PropType<(...args: any[]) => void>,
  },
  onSuccess: {
    type: Function as PropType<(...args: any[]) => void>,
  },
  onExceed: {
    type: Function as PropType<(...args: any[]) => void>,
  },
  // 是否只在可视区域内滚动
  isScroll: {
    type: Boolean,
    default: false,
  },
});

// let props = defineProps({
//   visible: {
//     type: Boolean,
//     default: false,
//   },
//   //表单配置项
//   options: {
//     type: Array as PropType<FormOptions[]>,
//     required: true,
//   },
//   onChange: {
//     type: Function
//   },
//   beforeUpload: {
//     type: Function
//   },
//   onPreview: {
//     type: Function
//   },
//   onRemove: {
//     type: Function
//   },
//   beforeRemove: {
//     type: Function
//   },
//   onSuccess: {
//     type: Function
//   },
//   onExceed: {
//     type: Function
//   },
//   // 是否只在可视区域内滚动
//   isScroll: {
//     type: Boolean,
//     default: false
//   },
// });

let form = ref<FormInstance | null>();

let emits = defineEmits(["update:visible"]);

let dialogVisible = ref<boolean>(props.visible);

watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val;
  }
);

watch(
  () => dialogVisible.value,
  (val) => {
    emits("update:visible", val);
  }
);
</script>

<style lang="scss"></style>
