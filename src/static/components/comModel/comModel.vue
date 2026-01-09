<template>
  <div
    class="com-model-con"
    v-if="maskFlag"
    :class="{ 'open-model': modelFlag }"
    :style="style"
  >
    <div class="com-model">
      <div
        class="com-model-header d-flex align-items-center justify-content-between"
      >
        <div class="com-model-title">{{ name || (info as any).name }}</div>
        <div class="com-model-close pointer">
          <el-icon @click="closeModel">
            <Close />
          </el-icon>
        </div>
      </div>
      <div class="com-model-content">
        <component
          ref="componentRef"
          :is="aliasName"
          :data="info"
          :width="width"
          :height="height"
        ></component>
      </div>
      <div class="com-model-footer"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const maskFlag = ref(false);
const modelFlag = ref(false);
const aliasName = ref("");
const info = ref({});
const componentRef = ref();
defineProps({
  style: {
    type: Object,
    default: {},
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: "",
  },
});
const openModel = (name: string, deviceInfo: any) => {
  if (name) aliasName.value = name;
  if (deviceInfo) info.value = deviceInfo;
  maskFlag.value = true;
  setTimeout(() => {
    modelFlag.value = true;
  });
};
// const closeModelCallback = ref(null);
const closeModelCallback = ref<(() => void) | null>(null);
const closeModel = (cb?: Function) => {
  modelFlag.value = false;
  componentRef?.value?.closed?.();
  if (typeof cb === "function") {
    // closeModelCallback.value = cb;
    closeModelCallback.value = () => cb();
  } else {
    closeModelCallback.value = null;
  }
  setTimeout(() => {
    maskFlag.value = false;
    closeModelCallback.value && closeModelCallback.value();
  }, 400);
};

defineExpose({
  openModel,
  closeModel,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.com-model-con {
  position: absolute;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -50%);
  transition: 0.4s;
  opacity: 0;
  z-index: 10;
  border-radius: zrem(4);
  overflow: hidden;
  box-shadow: var(--el-box-shadow-light);
  .com-model {
    background: var(--el-fill-color);
    .com-model-header {
      width: 100%;
      height: zrem(40);
      box-sizing: border-box;
      padding: 0 zrem(16);
      .com-model-title {
        font-size: zrem(14);
        font-weight: 500;
      }
    }
  }
}
.open-model {
  top: 50%;
  opacity: 1;
}
</style>
