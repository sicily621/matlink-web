<template>
  <button class="btn-donate d-flex flex-center"><img :src="AddIcon" width="16" height="16" class="el-icon m-r-5" />新增</button>
</template>
<script setup lang="ts">
import AddIcon from "@static/images/add.png";
</script>

<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.btn-donate {
  --clr-font-main: hsla(0 0% 20% / 100);
  --btn-bg-1: hsla(194 100% 69% / 1);
  --btn-bg-2: hsla(217 100% 56% / 1);
  --btn-bg-color: hsla(360 100% 100% / 1);
  --radii: zrem(4);
  cursor: pointer;
  padding: zrem(5) zrem(20);
  font-size: var(--size, 1rem);
  font-weight: 500;
  transition: 0.8s;
  background-size: 280% auto;
  background-image: linear-gradient(325deg, var(--btn-bg-2) 0%, var(--btn-bg-1) 55%, var(--btn-bg-2) 90%);
  border: none;
  border-radius: zrem(2);
  color: var(--btn-bg-color);
  box-shadow: zrem(0) zrem(0) zrem(20) rgba(71, 184, 255, 0.5), zrem(0) zrem(5) zrem(5) zrem(-1) rgba(58, 125, 233, 0.25),
    inset zrem(4) zrem(4) zrem(8) rgba(175, 230, 255, 0.5), inset zrem(-4) zrem(-4) zrem(8) rgba(19, 95, 216, 0.35);
}

.btn-donate:hover {
  background-position: right top;
}

.btn-donate:is(:focus, :focus-visible, :active) {
  outline: none;
  box-shadow: 0 0 0 zrem(3) var(--btn-bg-color), 0 0 0 zrem(6) var(--btn-bg-2);
}

@media (prefers-reduced-motion: reduce) {
  .btn-donate {
    transition: linear;
  }
}
</style>
