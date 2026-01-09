<template>
  <div
    class="marker absolute d-flex flex-center pointer"
    :class="{ bg: type === MarkerType.TEXT }"
    ref="markerRef"
    :object-id="objectId"
    :group-id="groupId"
    :style="{ left: position.x, top: position.y }"
    @mouseover="toggleTitle(true)"
    @mouseout="toggleTitle(false)"
    @click="onClick"
  >
    <div @mousedown.prevent="startDrag($event)" class="d-flex flex-center relative">
      <div class="title absolute" v-if="titleVisible && type === MarkerType.IMAGE">
        <el-tag effect="dark" class="m-b-10">
          {{ name }}
        </el-tag>
      </div>
      <template v-if="type === MarkerType.TEXT">
        {{ name }}
      </template>
      <template v-if="type === MarkerType.IMAGE">
        <img :src="data.url" :style="{ width: zrem(width || 20), height: zrem(height || 20) }" draggable="true" />
      </template>
    </div>
    <slot name="marker" :marker="data"></slot>
    <el-icon class="m-l-5 icon-close" @click.stop="onRemove" v-if="bindPointMode"><CircleClose /></el-icon>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs } from "vue";
import { MarkerProps, MarkerType } from "./marker";
import { zrem } from "@static/js/theme/zrem";
const props = defineProps(MarkerProps);
const emits = defineEmits(["onRemove", "startDrag", "click"]);
const slots = defineSlots<{
  marker: (args: any) => any;
}>();
const { name, width, height, position, type, objectId, groupId } = toRefs(props.data);
const titleVisible = ref(false);
const toggleTitle = (val: boolean) => {
  titleVisible.value = val;
};
const markerRef = ref();
const onRemove = () => {
  emits("onRemove");
};
const startDrag = (event: MouseEvent) => {
  emits("startDrag", event);
  return false;
};
const onClick = () => {
  emits("click");
};
</script>
<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.marker {
  &.bg {
    padding: zrem(5) zrem(8);
    background: var(--el-fill-color-light-opacity-2);
    border-radius: zrem(2);
  }
}
.title {
  top: 0%;
  left: 50%;
  transform: translate(-50%, -100%);
  white-space: nowrap;
}
.icon-close {
  font-size: zrem(18);
  color: var(--el-color-primary);
}
</style>
