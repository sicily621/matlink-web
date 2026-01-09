<template>
  <div class="thumbnail-con" ref="thumbnailRef">
    <img class="thumbnail-img" :src="src" alt="" />
    <div class="thumbnail-large" :class="{ 'thumbnail-large-bottom-0': refTop > 180 }" :style="{ right: `${zrem(absoluteRight || 40)}` }">
      <img :src="src" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { zrem } from "@static/js/theme/zrem";
const props = defineProps<{
  src: string;
  tableRefTop: number;
  absoluteRight?: number;
}>();
const thumbnailRef = ref();
const refTop = ref(0);
onMounted(() => {
  refTop.value = thumbnailRef.value.getBoundingClientRect().top - 186 - 50;
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.thumbnail-con {
  width: zrem(40);
  height: zrem(20);
  .thumbnail-img {
    width: 100%;
    height: 100%;
  }
  .thumbnail-large {
    width: zrem(600);
    height: zrem(300);
    right: zrem(40);
    top: 0;
    display: none;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .thumbnail-large-bottom-0 {
    top: zrem(-280);
  }
}
.thumbnail-con:hover {
  position: relative;
  z-index: 100;
  .thumbnail-large {
    position: absolute;
    display: block;
  }
}
</style>
