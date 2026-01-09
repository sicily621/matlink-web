<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.shadow__btn {
  padding: zrem(5) zrem(20);
  border: none;
  font-size: zrem(14);
  color: #fff;
  border-radius: zrem(7);
  letter-spacing: zrem(4);
  // font-weight: 700;
  text-transform: uppercase;
  transition: 0.5s;
  transition-property: box-shadow;
}

.shadow__btn {
  background: rgb(0, 140, 255);
  box-shadow: 0 0 zrem(25) rgb(0, 140, 255);
}

.shadow__btn:hover {
  box-shadow: 0 0 zrem(5) rgb(0, 140, 255), 0 0 zrem(25) rgb(0, 140, 255), 0 0 zrem(50) rgb(0, 140, 255), 0 0 zrem(100) rgb(0, 140, 255);
}
</style>

<template>
  <button class="shadow__btn">新增</button>
</template>
