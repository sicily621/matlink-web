<template>
  <div class="message-box d-flex align-items-center" v-if="content">
    <img class="icon" :src="icon" alt="" v-if="icon" />
    <div class="scrolling-text" :class="{ isOverflow: isOverflow }" ref="outer">
      <div class="content" :style="{ 'animation-delay': delayTime + 's' }">
        <el-text default ref="inner"> {{ content }}</el-text>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useElementSize, useResizeObserver } from "@vueuse/core";
import useMessageStore from "@static/js/store/message";
import { zrem } from "@static/js/theme/zrem";
const messageStore = useMessageStore();
const content = computed(() => messageStore.getContent); //消息内容
const icon = computed(() => messageStore.getIcon); //消息图标
const outer = ref(); //消息外边框
const inner = ref(); //消息框
const isOverflow = ref(false); //消息是否超过外边框宽度
const animationTime = ref(20); //动画执行时间 根据长度计算
const animationTimeStyle = computed(() => animationTime.value + "s");
const end = ref("100%"); //动画结束帧的偏移位置
const delayTime = ref(3); //动画延迟时间
let timer: any, clearMessageTimer: any;

//当消息框尺寸改变时
useResizeObserver(outer, () => {
  const outerSize = useElementSize(outer);
  const innerSize = useElementSize(inner);
  const outerWidth = outerSize.width.value;
  const innerWidth = innerSize.width.value;

  animationTime.value = ((innerWidth / outerWidth) * 10) | 0;
  isOverflow.value = innerWidth > outerWidth;

  //如果消息超过宽度就横向滚动
  if (isOverflow.value) {
    end.value = zrem(outerWidth - innerWidth);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      //动画结束就清空消息
      if (clearMessageTimer) clearTimeout(clearMessageTimer);
      clearMessageTimer = setTimeout(() => {
        messageStore.setContent("");
      }, 10 * 1000);
    }, (animationTime.value + delayTime.value) * 1000);
  }
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.message-box {
  padding: 0 zrem(10);
  max-width: calc(100% - zrem(850));
  background: var(--el-color-primary);
  border-radius: zrem(4);
  .icon {
    width: zrem(20);
    height: zrem(20);
    margin-right: zrem(8);
    vertical-align: middle;
  }
}
.scrolling-text {
  white-space: nowrap;
  max-width: 100%;
  height: zrem(40);
  line-height: zrem(40);

  overflow: hidden;

  &.isOverflow {
    .content {
      display: inline-block;
      animation: marquee v-bind(animationTimeStyle) linear 1;
      animation-fill-mode: forwards;
    }
  }
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(v-bind(end));
  }
}
</style>
