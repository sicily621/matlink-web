<template>
  <div class="custom-model-con" v-if="customModelConFlag">
    <div class="custom-model d-flex flex-column"
      :class="{ 'show-custom-model': customModelShowFlag, 'el-bg': noHeaderFlag, 'p-b-0': noContentPaddingFlag }"
      :style="style">
      <div class="custom-model-header" v-if="!noHeaderFlag">
        <div class="custom-model-title">{{ translatedTitle }}</div>
        <div class="custom-model-close" v-if="!closeCustomFlag" @click="closeCustomModel(true)">
          <el-icon>
            <Close />
          </el-icon>
        </div>
      </div>
      <div class="custom-model-content d-flex flex-1"
        :class="{ 'btn-hidden': noConfirmBtnFlag, 'padding-none': noHeaderFlag || noContentPaddingFlag }">
        <slot></slot>
      </div>
      <div class="custom-model-buttons" v-if="!noConfirmBtnFlag">
        <el-button type="primary" class="custom-model-button" @click="modelConfirm()">{{ i18nM('zModel.confirm')
          }}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>
<script setup lang="ts">
import { ref,computed } from "vue";
const customModelConFlag = ref(false);
const customModelShowFlag = ref(false);
const i18nM = window.$i18nM;
const props = defineProps<{
  customModelTitle?: string;
  style?: any;
  closeCustomFlag?: boolean,
  noConfirmBtnFlag?: boolean;
  noHeaderFlag?: boolean;
  noContentPaddingFlag?: boolean;
}>();
const translatedTitle = computed(() => {
  return props.customModelTitle ? i18nM(props.customModelTitle) : '';
});
const emits = defineEmits(["confirm", "close"]);
const openCustomModel = () => {
  customModelConFlag.value = true;
  setTimeout(() => {
    customModelShowFlag.value = true;
  });
};
const closeCustomModel = (emitFlag?: boolean) => {
  if (emitFlag) emits('close');
  customModelShowFlag.value = false;
  setTimeout(() => {
    customModelConFlag.value = false;
  }, 400);
};
const modelConfirm = () => {
  emits("confirm");
};
defineExpose({
  openCustomModel,
  closeCustomModel,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;

.custom-model-con {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  // display: none;
  .custom-model {
    z-index: 3;
    width: zrem(420);
    background-color: var(--el-fill-color-light);
    border-radius: zrem(8);
    font-size: var(--el-messagebox-font-size);
    box-shadow: var(--el-box-shadow-light);
    backface-visibility: hidden;
    box-sizing: border-box;
    --el-messagebox-title-color: var(--el-text-color-primary);
    --el-messagebox-width: 420px;
    --el-messagebox-border-radius: 4px;
    --el-messagebox-font-size: var(--el-font-size-large);
    --el-messagebox-content-font-size: var(--el-font-size-base);
    --el-messagebox-content-color: var(--el-text-color-regular);
    --el-messagebox-error-font-size: 12px;
    --el-messagebox-padding-primary: 15px;
    margin-bottom: zrem(40);
    opacity: 0;
    transition: 0.4s;

    .custom-model-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: zrem(20);
      padding: zrem(20) zrem(28);

      .custom-model-title {
        color: var(--el-messagebox-title-color);
        font-size: zrem(14);
      }

      .custom-model-close {
        color: var(--el-text-color-primary);
        cursor: pointer;
      }
    }

    .custom-model-content {
      &.btn-hidden {
        height: calc(100% - zrem(62));
      }

      max-height: 100%;
      padding: 0 zrem(20) zrem(20);
      box-sizing: border-box;
    }

    .padding-none {
      padding: 0;
    }

    .custom-model-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 zrem(28);
      margin-top: zrem(32);
      box-sizing: border-box;

      .custom-model-button {
        width: zrem(80);
        text-align: center;
        padding: zrem(8) 0;
        margin-left: 10px;
        background: var(--el-color-primary);
        font-size: zrem(14);
        color: var(--el-color-white);
        border-radius: zrem(4);
        //height: zrem(32);
        //line-height: zrem(32);
        cursor: pointer;
      }
    }
  }

  .el-bg {
    background-color: var(--el-bg-color);
  }

  .show-custom-model {
    margin-bottom: 0;
    opacity: 1;
  }

  .mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    background: var(--el-overlay-color-lighter);
    z-index: 2;
  }

  .p-b-0 {
    padding-bottom: 0;
  }
}
</style>
