<template>
  <!-- 滚动容器，用于包裹整个滚动内容，设置了固定高度并隐藏溢出部分 -->
  <div class="seamless-scroll" ref="scrollContainer">
    <!-- 滚动内容区域，根据滚动方向添加不同的类名以应用相应的动画 -->
    <div class="scroll-content" :class="{
      'scroll-up': direction === 'up',
      'scroll-down': direction === 'down',
    }">
      <!-- 第一组内容，展示原始的滚动项 -->
      <div class="scroll-item">
        <!-- 使用 v-for 指令遍历数据源数组 items，为每个项目渲染一个滚动项 -->
        <div v-for="(item, index) in items" :key="item.key || index" class="scroll-item-content">
          <!-- 使用插槽插入每个滚动项的具体内容 -->
          <slot :item="item" :index="index"></slot>
        </div>
      </div>
      <!-- 第二组内容，与第一组内容相同，用于实现无缝衔接滚动效果 -->

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// 组件属性定义
const props = defineProps({
  // 滚动速度（秒），值越小滚动越快
  speed: {
    type: Number,
    default: 5,
  },
  // 滚动方向：up-向上，down-向下，left-向左，right-向右
  direction: {
    type: String,
    default: "up",
    // 验证传入的方向值是否合法
    validator: (value) => ["up", "down", "left", "right"].includes(value),
  },
  // 是否启用鼠标悬停暂停
  hover: {
    type: Boolean,
    default: false,
  },
  // 数据源数组，用于渲染滚动项
  items: {
    type: Array,
    default: () => [],
  },
  // 每个项目的高度（像素），目前未在代码中使用，可用于后续计算滚动距离等
  itemHeight: {
    type: Number,
    default: 40,
  },
});

// 组件状态和引用
// 引用滚动容器元素，用于添加和移除鼠标事件监听器
const scrollContainer = ref(null);
// 记录鼠标是否悬停在滚动容器上的状态
const isHovered = ref(false);

// 处理鼠标进入事件
const handleMouseEnter = () => {
  // 如果启用了鼠标悬停暂停功能
  if (props.hover) {
    // 将鼠标悬停状态设置为 true
    isHovered.value = true;
  }
};

// 处理鼠标离开事件
const handleMouseLeave = () => {
  // 如果启用了鼠标悬停暂停功能
  if (props.hover) {
    // 将鼠标悬停状态设置为 false
    isHovered.value = false;
  }
};

// 生命周期钩子：在组件挂载后执行
onMounted(() => {
  // 如果启用了鼠标悬停暂停功能
  if (props.hover) {
    // 为滚动容器添加鼠标进入事件监听器，触发 handleMouseEnter 方法
    scrollContainer.value?.addEventListener("mouseenter", handleMouseEnter);
    // 为滚动容器添加鼠标离开事件监听器，触发 handleMouseLeave 方法
    scrollContainer.value?.addEventListener("mouseleave", handleMouseLeave);
  }
});

// 生命周期钩子：在组件卸载前执行
onBeforeUnmount(() => {
  // 如果启用了鼠标悬停暂停功能
  if (props.hover) {
    // 移除滚动容器的鼠标进入事件监听器
    scrollContainer.value?.removeEventListener("mouseenter", handleMouseEnter);
    // 移除滚动容器的鼠标离开事件监听器
    scrollContainer.value?.removeEventListener("mouseleave", handleMouseLeave);
  }
});

// 监听窗口大小变化
window.addEventListener("resize", () => {
  // 这里需要重新计算滚动样式，因为窗口大小变化可能会影响滚动距离
  // 但是这里没有提供重新计算滚动样式的方法，所以暂时保留原来的样式
  // 后续可添加根据窗口大小重新计算滚动距离和动画的逻辑
});
</script>

<style lang="scss" scoped>
/* 滚动容器样式 */
.seamless-scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  /* 滚动内容区域样式 */
  .scroll-content {
    position: absolute;
    width: 100%;
    /* 性能优化相关属性 */
    will-change: transform;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    perspective: 1000px;

    /* 向上滚动动画 */
    &.scroll-up {
      // 使用 Vue 的 v-bind 指令动态绑定动画的持续时间，根据传入的 speed 属性设置
      animation: scrollUp v-bind('speed + "s"') linear infinite;

      // 当鼠标悬停在滚动内容上时，暂停动画
      &:hover {
        animation-play-state: paused;
      }
    }

    /* 向下滚动动画 */
    &.scroll-down {
      // 动态绑定动画的持续时间
      animation: scrollDown v-bind('speed + "s"') linear infinite;

      // 鼠标悬停时暂停动画
      &:hover {
        animation-play-state: paused;
      }
    }

    /* 滚动项样式 */
    .scroll-item {
      width: 100%;
    }
  }
}

/* 向上滚动动画关键帧 */
@keyframes scrollUp {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-50%);
  }
}

/* 向下滚动动画关键帧 */
@keyframes scrollDown {
  0% {
    transform: translateY(-50%);
  }

  100% {
    transform: translateY(0);
  }
}

/* 水平滚动时的布局方式 */
.scroll-content[style*="translateX"] {
  display: flex;
  align-items: center;

  .scroll-item {
    display: flex;
    flex-shrink: 0;
  }
}
</style>
