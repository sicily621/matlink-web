<template>
  <div class="diamond-node" :class="{ active: props.selectedNodeId == nodeId }" :style="{ width: `${width}px`, height: `${height}px` }">
    <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
      <polygon :points="diamondPoints" stroke-width="2" class="diamond-shape" />
      <text x="50" y="32" text-anchor="middle" dominant-baseline="middle" font-size="14">{{ data.label }}</text>
    </svg>
    <Handle type="source" :position="Position.Right" :id="`${nodeId}-right`" class="handle-right" />
    <Handle type="target" :position="Position.Left" :id="`${nodeId}-left`" class="handle-left" />
  </div>
</template>

<script setup lang="ts">
import { Handle, useNodeId, Position } from "@vue-flow/core";
import { computed } from "vue";
import { getCssVar } from "@static/js/theme/var";

interface NodeProps {
  data: {
    label?: string;
    color?: string;
    [key: string]: any;
  };
  width?: number;
  height?: number;
  selectedNodeId?: any;
}

const props = withDefaults(defineProps<NodeProps>(), {
  data: () => ({
    label: "",
    color: getCssVar("--el-color-primary"),
    active: true,
  }),
  width: 100,
  height: 60,
});

const nodeId = useNodeId();
const diamondPoints = computed(() => {
  const centerX = props.width / 2;
  const centerY = props.height / 2;
  return [
    centerX,
    0, // 上顶点
    props.width,
    centerY, // 右顶点
    centerX,
    props.height, // 下顶点
    0,
    centerY, // 左顶点
  ].join(",");
});
</script>

<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.diamond-node {
  position: relative;
  user-select: none;
  cursor: move;
  text {
    fill: var(--el-text-color-primary);
  }
  polygon {
    fill: var(--el-fill-color);
    stroke: var(--el-color-primary);
  }
  &.active {
    polygon {
      fill: var(--el-color-primary);
      stroke: var(--el-color-primary-dark-2);
    }
    text {
      fill: var(--el-color-white);
    }
  }
}

.node-handles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 连接点默认样式优化（hover时显示） */
:deep(.vue-flow__handle) {
  width: zrem(10);
  height: zrem(10);
  background: white;
  border: zrem(1) solid var(--el-color-primary);
  opacity: 0; /* 默认隐藏，hover节点时显示 */
}

.diamond-node:hover :deep(.vue-flow__handle) {
  opacity: 1; /* hover显示连接点，方便连线 */
}
</style>
