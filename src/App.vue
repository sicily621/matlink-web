<script lang="ts" setup>
import { useGreyAndColorWeakness } from "@@/composables/useGreyAndColorWeakness";
import { useTheme } from "@@/composables/useTheme";
import zhCn from "element-plus/es/locale/lang/zh-cn"; // Element Plus 中文包
import { useI18n } from "vue-i18n";
const { initTheme } = useTheme();

const { initGreyAndColorWeakness } = useGreyAndColorWeakness();

// 初始化主题
initTheme();

// 初始化灰色模式和色弱模式
initGreyAndColorWeakness();

const { t } = useI18n();
const ztFunc = function (key: string) {
  let res = t(key);
  if (res.indexOf(".") == -1) {
    return res;
  }
  let arr = res.split(".");
  return arr[arr.length - 1];
};
const win: any = window;
win.$i18nM = ztFunc;
win.$i18nMFunc = (key: string) => {
  return () => ztFunc(key);
};
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
