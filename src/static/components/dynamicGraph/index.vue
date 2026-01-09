<template>
  <div class="h-full relative" ref="dynamicGraphRef" @mouseup="mouseup" @mousemove="onDrag">
    <slot name="content"></slot>
    <Marker
      v-for="(marker, index) in markerList"
      :data="marker"
      :key="marker.objectId"
      :bindPointMode="bindPointMode"
      @startDrag="startDrag($event, index)"
      @onRemove="onRemove(index)"
      @click="onClick(index)"
    >
      <template #marker="{ marker }">
        <slot name="marker" :marker="marker"></slot>
      </template>
    </Marker>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs } from "vue";
import { useMouseInElement } from "@vueuse/core";
import Marker from "./marker.vue";
import { DynamicGraphProps, Node } from "./index";
const props = defineProps(DynamicGraphProps);
const { markerList, bindPointMode } = toRefs(props);
const dynamicGraphRef = ref();
const offsetX = ref(0);
const offsetY = ref(0);
const currentData = ref<Node | null>(null);
const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(dynamicGraphRef);
const emits = defineEmits(["mouseup", "onRemove", "clickMarker"]);
defineSlots<{
  content?: (args: any) => any;
  marker?: (args: any) => any;
}>();

const movingIndex = ref(-1);
const getPosition = (offset?: { x: number; y: number }) => {
  const x = offset ? offset.x : offsetX.value;
  const y = offset ? offset.y : offsetY.value;
  const position = {
    x: `${Number((((elementX.value - x) / elementWidth.value) * 100).toFixed(2))}%`,
    y: `${Number((((elementY.value - y) / elementHeight.value) * 100).toFixed(2))}%`,
  };
  return position;
};
const mouseup = () => {
  movingIndex.value = -1;
  currentData.value = null;
  offsetX.value = 0;
  offsetY.value = 0;
  const position = getPosition();
  emits("mouseup", position);
};
const startDrag = (event: MouseEvent, index: number) => {
  offsetX.value = event.offsetX;
  offsetY.value = event.offsetY;
  if (bindPointMode.value) movingIndex.value = index;
};
const onDrag = () => {
  if (movingIndex.value > -1 && !isOutside.value) {
    const position = getPosition();
    markerList.value[movingIndex.value].position = position;
  }
};
const onRemove = (index: number) => {
  emits("onRemove", index);
};
const onClick = (index: number) => {
  emits("clickMarker", index);
};
</script>
