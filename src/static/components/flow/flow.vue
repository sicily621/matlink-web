<template>
  <div class="w-full h-full">
    <!-- :zoom-on-scroll="false"
      :nodes-draggable="false" -->
    <VueFlow class="basic-flow" ref="vueFlowRef" @click="click" @node-click="onNodeClick" @node-mouse-leave="onNodeMouseLeave" @node-mouse-enter="onNodeMouseEnter" :node-types="nodeTypes" :nodes="nodes" :edges="edges">
      <Background />
      <template #node-diamond="props"> <DiamondNode v-bind="{ selectedNodeId, ...props }" /></template>
      <template #node-rectangle> <slot name="rectangle"></slot> </template>
    </VueFlow>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { VueFlow } from "@vue-flow/core";
import DiamondNode from "@static/components/flow/diamondNode.vue";
import { Background } from "@vue-flow/background";
const vueFlowRef = ref();
defineProps<{
  nodes: any[];
  edges: any[];
}>();
const emits = defineEmits(["nodeClick"]);
const slots = defineSlots<{
  rectangle: (args: any) => any;
}>();
const nodeTypes: any = {
  diamond: DiamondNode,
  rectangle: "rectangle",
};
const onNodeClick = ({ node }: any) => {
  selectedNodeId.value = node.id;
  emits("nodeClick", node, isNode.value);
};
const isNode = ref(false);
const selectedNodeId = ref("");
const onNodeMouseEnter = () => {
  isNode.value = true;
};
const onNodeMouseLeave = () => {
  isNode.value = false;
};
const click = () => {
  if (!isNode.value) {
    selectedNodeId.value = "";
    emits("nodeClick", null, isNode.value);
  }
};

const updateNode = (...args: any[]) => vueFlowRef.value.updateNode(...args);
const getNode = (...args: any[]) => vueFlowRef.value.getNode(...args);
const getNodes = () => vueFlowRef.value.getNodes;
const addNodes = (nodes: any[]) => vueFlowRef.value.addNodes(nodes);
const addEdges = (edges: any[]) => vueFlowRef.value.addEdges(edges);
const removeNodes = (...args: any[]) => vueFlowRef.value.removeNodes(...args);

defineExpose({
  updateNode,
  getNodes,
  addNodes,
  addEdges,
  removeNodes,
  getNode,
});
</script>
