<template>
  <div v-if="show">
    <div class="tool flex-column">
      <div
        class="tool-icon pointer d-flex flex-center"
        :class="{ active: activeIndex === index }"
        v-for="(tool, index) in tools"
        :key="tool.id"
        @click="openTool(index)"
      >
        <ThemeImg
          :color="
            activeIndex === index
              ? 'var(--el-text-color-primary)'
              : 'var(--el-color-primary)'
          "
          :width="26"
          :height="26"
          :src="tool.icon"
        />
      </div>
    </div>
    <div class="mask" v-if="toolVisible"></div>
    <el-dialog v-model="toolVisible" modal-class="modal-large" @close="close">
      <template #header v-if="toolVisible">
        {{
          getLocaleValue(lang, tools?.[activeIndex], {
            cnNameKey: "cnName",
            enNameKey: "enName",
          })
        }}
      </template>
      <template v-for="(tool, index) of tools">
        <component
          v-show="index === activeIndex"
          :is="tool.configAlias"
          :configData="tool"
          :configType="index"
        />
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import useMenuStore from "@static/js/store/menu";
import ThemeImg from "@static/components/themeImg/themeImg.vue";
import { getLocaleValue } from "@static/js/locales/index";
import useLocaleStore from "@static/js/store/locale";
const localeStore = useLocaleStore();
const lang = computed(() => localeStore.getLang);
const menuStore = useMenuStore();
interface Tool {
  id: string | number;
  icon: any;
  configAlias: string | number;
}
const tools = computed<Tool[]>(() => menuStore.getConfig.tool ?? []);
const show = computed(() => tools.value.length > 0);
const activeIndex = ref(-1);
const toolVisible = computed({
  get: () => activeIndex.value > -1,
  set: (val) => val,
});
const openTool = (index: any) => {
  activeIndex.value = index;
};
const close = () => {
  activeIndex.value = -1;
};
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.tool {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  .tool-icon {
    width: zrem(36);
    height: zrem(36);
    margin-bottom: zrem(5);
    border: zrem(1) solid var(--el-color-primary);
    border-radius: zrem(3);
    &.active {
      background: var(--el-color-primary);
    }
    &:last-child {
      margin-bottom: 0;
    }
    img {
      width: zrem(26);
    }
  }
}
.mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background: var(--el-overlay-color-lighter);
  z-index: 3;
}
</style>
