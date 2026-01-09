<template>
  <el-tooltip effect="dark" :disabled="isShowTooltip" :content="content" placement="top">
    <p :class="['line', className]" @mouseover="onMouseOver(refName)">
      <span :ref="setItemRef">{{ content || '-' }}</span>
    </p>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
const props = defineProps({
  // 显示的文字内容
  content: {
    type: String,
    default: '',
  },
  // 外层框的样式，在传入的这个类名中设置文字显示的宽度
  className: {
    type: String,
    default: 'w100',
  },
  // 为页面文字标识（如在同一页面中调用多次组件，此参数不可重复）
  refName: {
    type: String,
    default: '',
  },
});

const iframeRefs = ref<any>({});
const setItemRef = (el:any, key?:any) => {
  if (el) {
    iframeRefs.value[props.refName] = el;
  }
};
const isShowTooltip = ref(true);
const onMouseOver = (str:any) => {
  let parentWidth = iframeRefs.value[str].parentNode.offsetWidth;
  let contentWidth = iframeRefs.value[str].offsetWidth;
  // 判断是否开启tooltip功能
  if (contentWidth > parentWidth) {
    isShowTooltip.value = false;
  } else {
    isShowTooltip.value = true;
  }
};
</script>

<style lang="scss" scoped>
.w86 {
  width: 86%;
}
.w100 {
  width: 100%;
}
.line{
  margin:0;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: normal;
  white-space: nowrap;
}
</style>