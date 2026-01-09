<template>
  <el-button 
    class="zc-el-button" 
    :class="type ? type : 'main'"
    :disabled="disabled"
  >
    <slot></slot>
    <div 
      class="zc-btn-theme-img-con" 
      v-if="loadFlag" 
      :style="{transform: `rotate(${rotateNum}deg)`}"
    >
      <ThemeImg 
        :src="LoadingSvg" 
        :width="16" 
        :height="16"
        :color="buttonTheme[(type ? type : 'main') + 'ButtonColor']"
      />
    </div>
  </el-button>
</template>
<script setup lang="ts">
import ThemeImg from '../../components/themeImg/themeImg.vue';
import LoadingSvg from '../../images/loading.svg';
import { ref, computed } from 'vue';
import useThemeStore from '../../js/store/theme';
  defineProps<{
    type?: '' | 'main' | 'secondary' | 'disabled' | 'warn',
    disabled?: boolean
  }>();
  //存储按钮主题颜色
  const themeStore = useThemeStore();
  const buttonTheme = computed<any>(() => {
    return themeStore.getTheme;
  });
  //渲染指数
  const rotateNum = ref(0);
  //存储播放函数
  let fram: any = null;
  //加载标识
  const loadFlag = ref(false);
  /**
   * 渲染播放
   */
  const rotateAnimate = () => {
    if (!loadFlag) return;
    if (rotateNum.value === 360) {
      rotateNum.value = -10;
    }
    rotateNum.value+=10;
    requestAnimationFrame(rotateAnimate);
  }
  /**
   * 开启加载动画
   */
  const startLoading = () => {
    if (fram) return;
    loadFlag.value = true;
    fram = requestAnimationFrame(rotateAnimate);
  };
  /**
   * 关闭加载动画
   */
  const stopLoading = () => {
    if (!fram) return;
    loadFlag.value = false;
    cancelAnimationFrame(fram);
    fram = null;
  }

  defineExpose({
    startLoading,
    stopLoading
  })
  
</script>
<style scoped lang="scss">
@use '../../css/common/size.scss' as *;
@use '../../css/theme/style.scss';
  .zc-el-button {
    border-radius: 0;
    font-family: PingFang SC;
    font-weight: bold;
    font-size: zrem(14);
    box-sizing: border-box;
  }
  // @include defaultStyle('btn', 'main') {
  //   background: var(--mainButtonBackground);
  //   color: var(--mainButtonColor);
  //   &:hover {
  //     box-shadow: 0px 0px zrem(30) 0px var(--mainButtonHoverColor);
  //   }
  // }
  // @include defaultStyle('btn', 'secondary') {
  //   background: var(--secondaryButtonBackground);
  //   color: var(--secondaryButtonColor);
  //   &:hover {
  //     box-shadow: 0px 0px zrem(30) 0px var(--mainButtonHoverColor);
  //   }
  // }
  // @include defaultStyle('btn', 'disabled') {
  //   background: var(--disabledButtonBackground);
  //   color: var(--disabledButtonColor);
  // }
  // @include defaultStyle('btn', 'warn') {
  //   background: var(--warnButtonBackground);
  //   color: var(--warnButtonColor);
  //   &:hover {
  //     box-shadow: 0px 0px zrem(30) 0px var(--warnButtonHoverColor);
  //   }
  // }
  // @include testStyle('btn', 'main') {
  //   background: var(--background);
  //   color: var(--borderColor);
  //   border: zrem(1) solid var(--mainButtonBorderColor);
  //   &:hover {
  //     box-shadow: 0px 0px zrem(30) 0px var(--mainButtonHoverColor);
  //   }
  // }
  // @include testStyle('btn', 'secondary') {
  //   background: var(--secondaryButtonBackground);
  //   color: var(--borderColor);
  //   border: zrem(1) solid var(--secondaryButtonBorderColor);
  //   &:hover {
  //     box-shadow: 0px 0px zrem(30) 0px var(--mainButtonHoverColor);
  //   }
  // }
  // @include testStyle('btn', 'disabled') {
  //   color: var(--disabledButtonColor);
  //   background: var(--disabledButtonBackground);
  //   border: zrem(1) solid var(--disabledButtonBorderColor);
  // }
  // @include testStyle('btn', 'warn') {
  //   color: var(--warnButtonColor);;
  //   background: var(--warnButtonBackground);  
  //   border: zrem(1) solid var(--warnButtonBorderColor);
  //   &:hover {
  //     box-shadow: 0px 0px zrem(30) 0px var(--warnButtonHoverColor);
  //   }
  // }
  .zc-btn-theme-img-con {
    margin-left: zrem(10);
  }
</style>