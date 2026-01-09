<template>
  <canvas ref="canvasRef" class="position-relative m-r-10" :width="$props.width" :height="props.height"></canvas>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { codeProps } from "./code";
const props = withDefaults(defineProps<codeProps>(), {
  width: 90,
  height: 36,
  background: "#181a1d",
  fontSize: 14,
  fontColor: "#fff",
  bit: 4,
  dotNum: 5,
  lineNum: 3,
});
const canvasRef = ref();
const code = ref("");
const canvas = ref<HTMLCanvasElement>();
const context = ref<CanvasRenderingContext2D>();
const width = ref<number>();
const height = ref<number>();
const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const randomColor = (min: number, max: number) => {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
};

const drawBg = () => {
  if (!context.value || !width.value || !height.value) return;
  context.value.clearRect(0, 0, width.value, height.value);
};

//绘制验证码
const drawText = () => {
  if (!context.value || !width.value || !height.value) return;
  context.value.font = `${props.fontSize}px Arial`; // 设置字号
  context.value.fillStyle = props.fontColor; // 设置文本颜色
  const charCount = props.bit;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charsArr: string[] = [];
  for (let i = 0; i < charCount; i++) {
    const charIndex = randomNum(0, chars.length - 1);
    charsArr.push(chars[charIndex]);
  }
  code.value = charsArr.join("").toLowerCase();
  const padding = 10;
  const charWidth = Math.floor((width.value - padding * 2) / charCount);
  for (let i = 0; i < charCount; i++) {
    let x = i * charWidth + padding;
    const y = height.value / 2 + 5;
    context.value.fillText(charsArr[i], x, y);
  }
};

//随机线
const drawLine = () => {
  if (!context.value || !width.value || !height.value) return;
  for (let i = 0; i < props.lineNum; i++) {
    context.value.strokeStyle = randomColor(0, 255);
    context.value.beginPath();
    context.value.moveTo(Math.random() * width.value, height.value);
    context.value.lineTo(Math.random() * width.value, Math.random() * height.value);
    context.value.stroke();
  }
};

//随机点
const drawDot = () => {
  if (!context.value || !width.value || !height.value) return;
  for (let i = 0; i < props.dotNum; i++) {
    context.value.save();
    context.value.beginPath();
    context.value.arc(randomNum(0, width.value), randomNum(0, height.value), 1, 0, 2 * Math.PI);
    context.value.closePath();
    context.value.fillStyle = randomColor(150, 200);
    context.value.fill();
    context.value.restore();
  }
};

const generateCode = () => {
  if (!canvasRef.value) return;
  canvas.value = canvasRef.value;
  context.value = canvasRef.value.getContext("2d")!;
  width.value = canvasRef.value.width;
  height.value = canvasRef.value.height;
  canvasRef.value.style.backgroundColor = props.background;
  drawBg();
  drawText();
  drawLine();
  drawDot();
};
onMounted(() => {
  generateCode();
});
defineExpose({
  code,
  generateCode,
});
</script>
