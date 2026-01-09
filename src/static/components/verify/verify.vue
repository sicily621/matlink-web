<template>
  <div class="slider-verification" ref="sliderContainer">
    <div class="slider-left-bg" :style="sliderLeftWidthStyle"></div>
    <div class="prompt-text" :style="verifySuccess ? promptTextStyleSuccess: {}">
      {{ verifySuccess ? $t('verify.verificationPassed') : $t('verify.dragSliderToVerify') }}
    </div>
    <div ref="slider" @mousedown="mouseDownHandler($event)" :class="{'slider-verify-success':verifySuccess}"
         class="slider" :style="sliderToLeftStyle">
      <el-icon v-if="verifySuccess" :size="iconSize">
        <CircleCheck/>
      </el-icon>
      <el-icon v-else :size="iconSize">
        <DArrowRight/>
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted,computed} from "vue";

interface Props {
  multiple: number,
  promptTextStyleSuccess: Record<any, any>
}

interface Emits {
  (e: 'statusChange', val: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  multiple: 2,
  promptTextStyleSuccess: () => ({
    color: '#ffffff'
  })
})
const emits = defineEmits<Emits>()


let sliderState = ref(false)
let verifySuccess = ref(false)
let beginClientX = ref(0)
let maxWidth = ref(0)
const iconSize = ref(22)
const slideWidth = ref(0)

//鼠标移动
const mouseMoveHandler = (e:any) => {
  if (sliderState.value) {
    let width = (e.clientX - beginClientX.value) / props.multiple;
    if (width > 0 && width <= maxWidth.value) {
      slideWidth.value = width
    } else if (width > maxWidth.value) {
      slideWidth.value = maxWidth.value
      verifySuccessFun();
    }
  }
}

//鼠标松开
const mouseUpHandler = (e:any) => {
  sliderState.value = false;
  let width = (e.clientX - beginClientX.value) / props.multiple;
  if (width < maxWidth.value) {
    slideWidth.value = 0
  }
}

//验证通过
const verifySuccessFun = () => {
  verifySuccess.value = true
  emits('statusChange', true)
  document.getElementsByTagName('html')[0].removeEventListener('mousemove', mouseMoveHandler);
  document.getElementsByTagName('html')[0].removeEventListener('mouseup', mouseUpHandler);
  slideWidth.value = maxWidth.value
}
const slider = ref<any>(null)
const sliderContainer = ref<any>(null)


//事件监听
const addListener = () => {
  document.getElementsByTagName('html')[0].addEventListener('mousemove', mouseMoveHandler);
  document.getElementsByTagName('html')[0].addEventListener('mouseup', mouseUpHandler)
}

// 重置
const reset = () => {
  addListener()
  emits('statusChange', false)
  beginClientX.value = 0
  sliderState.value = false
  verifySuccess.value = false
  slideWidth.value = 0
}
// 鼠标在滑块上按下事件
const mouseDownHandler = (e:any) => {
  if (!verifySuccess.value) {
    sliderState.value = true;
    beginClientX.value = e.clientX;
  }
}

onMounted(() => {
  maxWidth.value = sliderContainer.value.offsetWidth - slider.value.offsetWidth;
  addListener()
})
const sliderToLeftStyle = computed(() => ({left: slideWidth.value + 'px'}))
const sliderLeftWidthStyle = computed(() => ({width: slideWidth.value + 'px'}))

defineExpose({
  reset
})
</script>

<style scoped lang="scss">
@use '@static/css/common/size.scss' as *;
.slider-verification {
  position: relative;
  background-color: #0C4675;
  width: 100%;
  height: 100%;
  line-height: zrem(48);
  text-align: center;
  user-select: none;
}

.slider {
  position: absolute;
  top: 0;
  width: zrem(48);
  height: zrem(48);
  cursor: move;
  background: #ffffff;
  background-size: zrem(30) zrem(30);
  display: flex;
  align-items: center;
  justify-content: center;
  .el-icon{
    color:#032847;
  }
}

.slider-verify-success {
  background: #FFFFFF;
  background-size: zrem(30) zrem(30);
  .el-icon{
    color:#032847;
  }
}

//滑块滑过区域的样式
.slider-left-bg {
  // background-color: rgba(0, 235, 255, 0.42);
  background: #45DDFF;
  width: 0;
  height: 100%;
}

//提示文本样式
.prompt-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: zrem(48);
  text-align: center;
  font-size: zrem(16);
  line-height: zrem(48);
  color: #ffffff;
}

</style>