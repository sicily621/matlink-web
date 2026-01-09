<template>
  <Plane ref="markerRef" v-if="type == MarkerType.IMAGE" :args="[width, height]">
    <TresMeshBasicMaterial />
  </Plane>
</template>
<script setup lang="ts">
import { ref, onMounted, h, render, onBeforeUnmount, toRefs, watch } from "vue";
import { Plane } from "@tresjs/cientos";
import { useTresContext, useRenderLoop, useTexture, extend } from "@tresjs/core";
import { MeshBasicMaterial, ShapeGeometry, Mesh, SRGBColorSpace } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { MarkerProps, MarkerType } from "./marker";
import { RoamingStatus } from "./road";
import { THREE_GetGifTexture } from "threejs-gif-texture";
const props = defineProps(MarkerProps);
const slots = defineSlots<{
  marker?: (args: any) => any;
}>();
const { width, height, position, type } = props.data;
const { status, data } = toRefs(props);
watch(
  () => data.value.showLabel,
  () => {
    const marker = markerRef.value.instance;
    if (marker?.children?.[0]) marker.children[0].visible = data.value.showLabel;
  }
);
const { x, y, z } = position;
extend({ MeshBasicMaterial, Mesh, ShapeGeometry });
const { camera, cameras } = useTresContext();
const markerRef = ref();
const { onLoop } = useRenderLoop();
const loadedMap = ref(false);
const roamingCamera = ref();
const pausedCamera = ref();
onLoop(() => {
  if (markerRef.value && props.data.type == MarkerType.IMAGE) {
    const marker = markerRef.value.instance;
    const currentCamera = status.value === RoamingStatus.STOP ? camera.value : status.value === RoamingStatus.ROAMING ? roamingCamera.value : pausedCamera.value;
    if (status.value !== RoamingStatus.STOP) {
      const distance = marker.position.distanceTo(currentCamera.position);
      const isCloseToCamera = distance < 100;
      marker.children[0].visible = isCloseToCamera;
      marker.material.opacity = 0;
    } else if (props.data.showName) {
      marker.material.opacity = 0;
      marker.children[0].visible = true;
    } else {
      marker.material.opacity = 1;
      marker.children[0].visible = false;
    }
    currentCamera && marker.rotation.copy(currentCamera.rotation);
  }
});
onMounted(() => {
  if (markerRef.value) {
    const marker = markerRef.value.instance;
    marker.name = props.data.name;
    marker.rawData = props.data;
    marker.position.set(x, y, z);
    if (props.data.type == MarkerType.IMAGE) {
      //添加贴图
      if (!loadedMap.value && props.data?.url) {
        loadedMap.value = true;
        const isGIF = /\.gif$/i.test(props.data.url);
        if (isGIF) {
          THREE_GetGifTexture(props.data.url).then((texture) => {
            texture.colorSpace = SRGBColorSpace;
            marker.material = new MeshBasicMaterial({ map: texture, transparent: true });
          });
        } else {
          useTexture({
            map: props.data.url,
          }).then((res: any) => {
            const { map } = res;
            map.colorSpace = SRGBColorSpace;
            marker.material = new MeshBasicMaterial({ map, transparent: true });
          });
        }
      }
      const labelContentWrap = document.createElement("div");
      if (slots?.marker) {
        const selectVNode = h(slots.marker, {
          marker: props.data,
        });
        render(selectVNode, labelContentWrap);
      } else {
        labelContentWrap.className = "label";
        labelContentWrap.textContent = marker.name;
        labelContentWrap.style.backgroundColor = "transparent";
      }
      labelContentWrap.style.pointerEvents = "auto";
      const label = new CSS2DObject(labelContentWrap);
      const { x, y, z } = props.labelOffset;
      label.position.set(x, y, z);
      label.center.set(0, 0);
      label.visible = false;
      marker.add(label);
    }
  }
  if (cameras) {
    roamingCamera.value = cameras.value.find((camera) => camera.name === "roaming");
    pausedCamera.value = cameras.value.find((camera) => camera.name === "pausedCamera");
  }
});
onBeforeUnmount(() => {
  const marker = props.data.type == MarkerType.IMAGE ? markerRef.value.instance : markerRef.value;
  if (marker) {
    marker.clear();
    marker.removeFromParent();
  }
});
</script>
