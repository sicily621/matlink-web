<template>
  <div></div>
</template>
<script lang="ts" setup>
import { onMounted, computed, h, render, toRefs, watch } from "vue";
import useTopInfoStore from "@static/js/store/topInfo";
const topInfoStore = useTopInfoStore();
const props = defineProps<{ time: number | string }>();
const slots = defineSlots<{
  content?: (args: any) => any;
}>();
const delay = 10;
const { time } = toRefs(props);
const timer = computed(() => topInfoStore.getTimer);
watch(time, () => {
  if (timer.value) clearTimeout(timer.value);
  renderTopInfo();
});
//渲染插槽到置顶消息栏 10s后消失
const renderTopInfo = () => {
  const contentWrap = document.getElementById("topInfo");
  const selectVNode = h(slots?.content ?? "div", {});
  if (!contentWrap) return;
  render(selectVNode, contentWrap);
  const uuid = setTimeout(() => {
    render(h("div"), contentWrap);
  }, delay * 1000);
  topInfoStore.setTimer(uuid);
};
onMounted(() => {
  if (slots?.content) {
    if (timer.value) clearTimeout(timer.value);
    renderTopInfo();
  }
});
</script>
