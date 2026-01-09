<template>
  <div class="strength-container">
    <div class="input-top">
      <!-- <span class="label">密码：</span> -->
      <el-input
        type="password"
        v-model="password"
        @input="pasInput"
        :placeholder="props.placeholder"
        :disabled = "props.disabled"
        show-password
      >
      </el-input>
    </div>
    <div class="password__strength-meter-bar">
      <div class="strength-meter-bar--fill"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { zxcvbn } from '@zxcvbn-ts/core';
import { ref, unref, computed, watch } from 'vue';
interface Props {
  placeholder?: any,
  disabled?:boolean
}
const props = defineProps<Props>()
let colorMap = {
  0: '#FB4242', //红
  1: '#FB4242', 
  2: '#F39F3B',// 黄
  3: '#78E54E', //绿
  4: '#78E54E' //绿
}
let password = ref<string | number>('');
let barColor = ref<string | number>('')
let barWidth = ref<string>('0%')
const pasInput = (value:any) => {
  let { score } = zxcvbn(value);
  barColor.value = colorMap[score]
  barWidth.value = `${(score + 1) * 20}%`
  if(value === '') {
    barWidth.value = '0'
  }
};
</script>

<style lang="scss" scoped>
.strength-container {
  width: 100%;
}
.input-top {
  display: flex;
  align-items: center;
  .label {
    display: block;
    width: 60px;
  }
}
.password__strength-meter-bar {
  position: relative;
  height: 6px;
  margin: 10px auto 6px;
  background-color: #045A96;
  border-radius: 6px;
  &::before,
  &::after {
    position: absolute;
    z-index: 10;
    display: block;
    width: calc(20% - 10px);
    height: inherit;
    background-color: transparent;
    border-color: #032847;
    border-style: solid;
    border-width: 0 5px;
    content: '';
  }

  &::before {
    left: 20%;
  }

  &::after {
    right: 20%;
  }
  .strength-meter-bar--fill {
    position: absolute;
    height: 100%;
    left: 0;
    width: v-bind(barWidth);
    background-color: v-bind(barColor);
    transition: width 0.5s ease-in-out, background 0.25s;
  }
}
</style>