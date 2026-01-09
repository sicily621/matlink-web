<template></template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";
import { useLoader, useTresContext } from "@tresjs/core";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EquirectangularReflectionMapping, PMREMGenerator } from "three";

// 异步加载HDR环境贴图
const loadHDR = async () => {
  const { scene, renderer } = useTresContext();
  const hdrUrl = "./cloudy.hdr";

  try {
    // 使用TresJS的useLoader加载HDR
    const pmremGenerator = new PMREMGenerator(renderer.value);
    const hdrTexture = await useLoader(RGBELoader, hdrUrl);
    const envMapFromHDR = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    scene.value.background = envMapFromHDR;

    return envMapFromHDR;
  } catch (error) {
    console.error("加载HDR失败:", error);
    throw error;
  }
};

// 组件挂载时加载HDR
onMounted(async () => {
  await loadHDR();
});
</script>
