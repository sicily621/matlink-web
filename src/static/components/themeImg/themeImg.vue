<template>
  <div
    class="theme-img-con"
    :style="{
      width: fullFlag ? '100%' : zrem(width),
      height: fullFlag ? '100%' : zrem(height),
    }"
  >
    <div
      class="theme-img"
      :style="{
        top: 0,
        left: zrem(width),
        filter: `drop-shadow(${zrem(-width)} 0 ${color || 'var(--el-text-color-primary)'})`,
      }"
    >
      <img :src="src" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { zrem } from "../../js/theme/zrem";
defineProps<{
  width: number;
  height: number;
  src: string;
  color?: string;
  fullFlag?: boolean
}>();
</script>
<style scoped lang="scss">
.theme-img-con {
  position: relative;
  overflow: hidden;
  .theme-img {
    position: absolute;
    width: 100%;
    height: 100%;
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
