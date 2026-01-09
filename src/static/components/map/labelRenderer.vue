<template></template>

<script setup lang="ts">
import { watchEffect, toRefs, onMounted, ref, watch } from "vue";
import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useTresContext, useRenderLoop } from "@tresjs/core";

const props = defineProps<{ width: number; height: number; mapRef: HTMLElement | null; camera: THREE.PerspectiveCamera }>();
const { renderer, scene } = useTresContext();
const { camera } = toRefs(props);

const { onLoop } = useRenderLoop();
onLoop(() => {
  if (labelRenderer.value) {
    labelRenderer.value.render(scene.value, camera.value);
  }
});
const labelRenderer = ref();

watchEffect(() => {
  if (props.width && camera.value && props.mapRef && !labelRenderer.value) {
    labelRenderer.value = new CSS2DRenderer();
    labelRenderer.value.setSize(props.width, props.height);
    labelRenderer.value.domElement.style.position = "absolute";
    labelRenderer.value.domElement.style.top = "0";
    labelRenderer.value.domElement.style.width = `100%`;
    labelRenderer.value.domElement.style.height = `100%`;
    props.mapRef.appendChild(labelRenderer.value.domElement);
  }
});
defineExpose({
  labelRenderer,
});
</script>
