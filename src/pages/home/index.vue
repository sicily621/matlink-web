<template>
  <div class="app-container flex flex-col h-full">首页</div>
</template>

<script setup lang="ts"></script>
<style lang="scss" scoped>
@use "@@/assets/styles/size.scss" as *;
.content-height {
  height: calc(100% - zrem(50));
}
.blue {
  color: var(--el-color-primary);
}
.yellow {
  color: var(--el-color-warning);
}
.red {
  color: var(--el-color-danger);
}
.green {
  color: var(--el-color-success);
}
</style>
