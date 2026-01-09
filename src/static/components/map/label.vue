<template>
  <TresMesh ref="labelRef" :visible="props.status === RoamingStatus.STOP">
    <TresShapeGeometry />
    <TresMeshBasicMaterial />
  </TresMesh>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, h, render, toRefs, watch } from "vue";
import { useTresContext, useTexture, extend } from "@tresjs/core";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
  MeshBasicMaterial,
  ShapeGeometry,
  Mesh,
  Shape,
  Float32BufferAttribute,
  BufferGeometry,
  Line,
  LineDashedMaterial,
  LineBasicMaterial,
  Box3,
} from "three";
import { getFont } from "./map";
import { LabelProps } from "./label";
import { DoubleSide } from "three";
import { RoamingStatus } from "./road";
const props = defineProps(LabelProps);
const slots = defineSlots<{
  label?: (args: any) => any;
}>();
extend({ MeshBasicMaterial, Mesh, ShapeGeometry });
const { position, direction } = props.data;
const { x: posX, y: posY, z: posZ } = position;
const { x: rotX, y: rotY, z: rotZ } = direction;

const { data } = toRefs(props);
watch(
  () => data.value.showLabel,
  () => {
    const marker = labelRef.value.instance;
    marker.material.opacity = !!props.data?.showLabel ? 0 : 1;
    marker.children.map((item: any) => {
      if (item.name === "labelDom") {
        item.visible = !!data.value?.showLabel;
      } else {
        item.visible = !data.value?.showLabel;
      }
    });
  }
);
const context = useTresContext();
const labelRef = ref();
const loadedMap = ref(false);

const getOpacity = (val: number) => {
  if (val == 0) return 1;
  if (val == 100) return 0;
  if (val > 0 && val < 100) {
    return val / 100;
  } else {
    return 1;
  }
};

onMounted(() => {
  if (labelRef.value && context) {
    const label = labelRef.value;
    label.name = props.data.name;
    label.rawData = props.data;
    label.position.set(posX, posY, posZ);
    label.rotation.set(rotX, rotY, rotZ);
    //文本
    getFont((font: any) => {
      const size = props.data?.fontSize ?? 8;
      const shapes = font.generateShapes(props.data.name, size);
      const geometry: BufferGeometry = new ShapeGeometry(shapes);
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox as Box3;
      const max = boundingBox.max;
      const min = boundingBox.min;
      //const xMid = boundingBox ? -0.5 * (max.x - min.x) : 0;
      //geometry.translate(xMid, -size / 2, 0);
      geometry.translate(0, -size, 0);
      const material = new MeshBasicMaterial({
        color: Number(`0x${props.data.fontColor}`),
        transparent: true,
        opacity: props.data.isTitle,
        side: DoubleSide,
      });
      label.geometry = geometry;
      label.material = material;
      //背景

      const shape = new Shape().moveTo(max.x, max.y).lineTo(max.x, min.y).lineTo(min.x, min.y).lineTo(min.x, max.y).lineTo(max.x, max.y);
      const bgGeometry = new ShapeGeometry(shape);
      const uvs = [];
      uvs.push(1, 0);
      uvs.push(1, 1);
      uvs.push(0, 1);
      uvs.push(0, 0);
      bgGeometry.setAttribute("uv", new Float32BufferAttribute(new Float32Array(uvs), 2));
      bgGeometry.getAttribute("uv").needsUpdate = true;
      const bgMaterial = new MeshBasicMaterial({
        color: Number(`0x${props.data.bgColor}`),
        transparent: true,
        opacity: props.data.isFull ? getOpacity(props.data.transparency) : 0,
        side: DoubleSide,
      });
      const mesh = new Mesh(bgGeometry, bgMaterial);
      mesh.position.z = -1;
      mesh.visible = !props.data.showLabel;
      label.add(mesh);
      if (!!props.data.isImage) {
        if (!loadedMap.value && props.data.image) {
          loadedMap.value = true;
          useTexture({
            map: props.data.image,
          }).then((res: any) => {
            const { map } = res;
            mesh.material.color.set(1, 1, 1);
            mesh.material.map = map;
            mesh.material.transparent = true;
          });
        }
      }

      //边框
      const points = shape.getPoints();
      const geometryPoints = new BufferGeometry().setFromPoints(points);
      const solidMtl = new LineBasicMaterial({
        color: Number(`0x${props.data.lineColor}`),
        linewidth: +props.data.lineWidth,
      });
      const dashedMtl = new LineDashedMaterial({
        color: Number(`0x${props.data.lineColor}`),
        linewidth: +props.data.lineWidth,
      });
      let line = new Line(geometryPoints, props.data.lineType == 0 ? solidMtl : dashedMtl);
      line.computeLineDistances();
      line.position.z = -1;
      line.visible = !props.data.showLabel;
      if (!!props.data.isLine) label.add(line);

      const labelContentWrap = document.createElement("div");
      if (slots?.label) {
        const selectVNode = h(slots.label, {
          label: props.data,
        });
        render(selectVNode, labelContentWrap);
      } else {
        labelContentWrap.className = "label";
        labelContentWrap.textContent = label.name;
        labelContentWrap.style.backgroundColor = "transparent";
      }
      labelContentWrap.style.pointerEvents = "auto";
      const labelDom = new CSS2DObject(labelContentWrap);
      labelDom.name = "labelDom";
      const { x, y, z } = props.labelOffset;
      labelDom.position.set(x, y, z);
      labelDom.center.set(0, 0);
      labelDom.visible = !!props.data.showLabel;
      label.add(labelDom);
      label.material.opacity = !!props.data?.showLabel ? 0 : 1;
    });
  }
});

onBeforeUnmount(() => {
  const label = labelRef.value;
  if (label) {
    label.clear();
    label.removeFromParent();
  }
});
</script>
