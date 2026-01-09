<template>
  <div class="button-wrap">
    <div class="dots_border"></div>
    <button class="telegram btn-donate">
      <!-- <img :src="AddIcon" width="16" height="16" class="el-icon m-r-5 telegram-svg" /> -->
      <div class="telegram-svg-wrap">
        <svg class="telegram-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
          <g mask="url(#mask0_21_345)">
            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
          </g>
        </svg>
      </div>
      <span class="telegram-text">新增</span>
    </button>
  </div>
</template>
<script setup lang="ts">
import AddIcon from "@static/images/add.png";
</script>
<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.telegram {
  transition: none 0.5s ease;
  display: flex;
  align-items: center;
  position: relative;
  height: zrem(32);
  border: none;
  background-color: rgb(42 171 238);
  color: white;
  border-radius: zrem(2);
  cursor: pointer;
  overflow: hidden;
  padding: 0 zrem(20);
  white-space: nowrap;
}

.telegram-text {
  transition: 0.8s;
  font-size: zrem(14);
  margin-left: zrem(5);
}
.telegram:hover .telegram-text {
  /* display: none;
  position: absolute; */
  transform: translateX(200%);
}
.telegram-svg-wrap {
  width: zrem(20);
  height: zrem(20);
  transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
  transition: 0.8s;
}
.telegram-svg {
  fill: white;
  width: zrem(20);
  height: zrem(20);
  z-index: 1;
  transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
  transition: 0.8s;
  animation: fangda 0.8s ease-in-out infinite;
}

@keyframes fangda {
  from {
    transform: scale(1);
    fill: #dbdbdb;
  }

  50% {
    transform: scale(1.3);
    fill: #fff;
  }

  to {
    transform: scale(1);
    fill: #dbdbdb;
  }
}
.telegram:hover .telegram-svg-wrap {
  display: block;
  transform: translateX(90%) rotate(180deg);
}
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
