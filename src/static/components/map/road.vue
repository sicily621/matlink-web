<template>
  <TresObject3D ref="tubeRootRef">
    <Tube v-if="pointList.length > 1 && tubePathShow" :visible="roadLabelShowIndex === currentIndex" :args="[tubePathShow, 100, 0.5, 8, false]">
      <TresMeshToonMaterial color="red" />
    </Tube>
    <Tube ref="roadRef" v-if="pointList.length > 1 && tubePath" :visible="false" :args="[tubePath, 100, 0.5, 8, false]"> </Tube>
    <TresObject3D ref="groupRef" v-if="roadLabelShowIndex === currentIndex">
      <Marker v-for="marker in markerList" :data="marker" :key="marker.objectId" :status="status">
        <template #marker="{ marker }">
          <slot name="marker" :marker="marker"></slot>
        </template>
      </Marker>
      <Label v-for="label in midPoints" :data="label" :key="label.objectId" :status="status"> </Label>
    </TresObject3D>
  </TresObject3D>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, toRefs, computed, watch } from "vue";
import { CatmullRomCurve3, Vector3 } from "three";
import { Tube } from "@tresjs/cientos";
import { useRenderLoop, useTresContext } from "@tresjs/core";
import { RoadProps, RoamingStatus } from "./road";
import Marker from "./marker.vue";
import Label from "./label.vue";
import { MarkerType, Marker as IMarker } from "./marker";
import { Position } from "./map";
import { getCssVar } from "@static/js/theme/var";

const props = defineProps(RoadProps);
const { data, status, roamingRoadIndex, currentIndex, roadLabelShowIndex, setRoamingCamera, roamingSpeed } = toRefs(props);
const { onLoop } = useRenderLoop();
const { cameras, setCameraActive } = useTresContext();
const groupRef = ref();
const roamingCamera = ref();
const pausedCamera = ref();
const defaultCamera = ref();
const roadRef = ref();
const tubeRootRef = ref();
const distance = ref(0);
const getPointList = () => {
  let lastVector = new Vector3(0, 0, 0);
  const result = data.value.roadPoints.map((point: Position, i: number) => {
    const { x, y, z } = point;
    const currentVector = new Vector3(x, y, z);
    if (i > 0) {
      distance.value += currentVector.distanceTo(lastVector);
    }
    lastVector = new Vector3(x, y, z);
    return currentVector;
  });
  return result;
};
const pointList = ref<Vector3[]>(getPointList());
watch(
  () => data.value,
  () => {
    pointList.value = getPointList();
  }
);
const markerList = computed<IMarker[]>(() => {
  const result = pointList.value.map((point: Position) => {
    const { x, y, z } = point;
    const marker: IMarker = {
      name: "",
      objectId: new Date().getTime(),
      position: { x, y, z },
      url: "point.svg",
      width: 8,
      height: 10,
      visible: true,
      color: 0xffffff,
      type: MarkerType.IMAGE,
    };
    return marker;
  });
  return result;
});
const midPoints = computed<any[]>(() => {
  const result: any[] = [];
  if (!defaultCamera.value) return [];
  const { rotation } = defaultCamera.value;
  if (pointList.value.length <= 1 || !rotation) return [];
  pointList.value.reduceRight((v1, v2) => {
    var center = new Vector3();
    center.addVectors(v1, v2).divideScalar(2);
    const { x, y, z } = center;
    const name = v1.distanceTo(v2);
    const { x: directionX, y: directionY, z: directionZ } = rotation;
    const midPoint: any = {
      name: `${name.toFixed(1)}m`,
      objectId: new Date().getTime(),
      position: { x, y, z },
      visible: true,
      fontColor: getCssVar("--el-text-primary-color").slice(1),
      fontSize: 5,
      isFull: 0,
      isLine: 0,
      isTitle: 1,
      direction: { x: +directionX.toFixed(2), y: +directionY.toFixed(2), z: +directionZ.toFixed(2) },
    };
    result.push(midPoint);
    return v2;
  });
  return result;
});

const tubePath = computed(() => {
  return pointList.value.length > 1 ? new CatmullRomCurve3(pointList.value, false, "catmullrom", 0.15) : null;
});
const tubePathShow = computed(() => {
  return pointList.value.length > 1 ? new CatmullRomCurve3(pointList.value, false, "catmullrom", 0) : null;
});
watch(
  () => status.value,
  () => {
    if (status.value === RoamingStatus.ROAMING) {
      setCameraActive(roamingCamera.value.uuid);
    } else if (status.value === RoamingStatus.PAUSE) {
      lastPauseTime = Date.now() - 300;
      setCameraActive(pausedCamera.value.uuid);
    } else if (status.value === RoamingStatus.STOP) {
      setCameraActive(defaultCamera.value.uuid);
      passRoadSegments = [true];
      lastPauseTime = 0;
      minusTime = 0;
    }
  }
);
let startRoamingTime = Date.now();
let lastPauseTime = 0;
let minusTime = 0;
let passRoadSegments: boolean[] = [true];
onLoop(() => {
  if (roadRef.value && roamingCamera.value && status.value === RoamingStatus.ROAMING) {
    if (roamingRoadIndex.value !== currentIndex.value) return;
    const tubeGeometry = roadRef.value.instance.geometry;
    const path = tubeGeometry.parameters.path;
    if (lastPauseTime > 0) {
      minusTime += Date.now() - lastPauseTime;
      lastPauseTime = 0;
    }
    var time = Date.now() - minusTime;
    const t = ((((time - startRoamingTime) * 0.02 * roamingSpeed.value) / 2) % distance.value) / distance.value;
    const point = path.getPointAt(t);
    const passRoadSegmentsIndex = (passRoadSegments as any).findLastIndex((item: boolean) => item === true);
    const passPointIndex = passRoadSegmentsIndex + 1;
    const lookAt = pointList.value[passPointIndex];
    const distanceToLooAt = point.distanceTo(lookAt);
    setRoamingCamera.value(lookAt, point);
    if (distanceToLooAt < 2 && !passRoadSegments[passRoadSegmentsIndex + 1]) {
      passRoadSegments[passRoadSegmentsIndex + 1] = true;
      const end = passPointIndex === pointList.value.length - 1;
      if (props.onReachRoamingPoint) props.onReachRoamingPoint(passPointIndex, pointList.value[passPointIndex], end);
      if (end) {
        lastPauseTime = 0;
        minusTime = 0;
        passRoadSegments = [true];
      }
    }
  }

  if (status.value === RoamingStatus.STOP) {
    startRoamingTime = Date.now();
  }
});

onMounted(() => {
  if (cameras) {
    defaultCamera.value = cameras.value.find((camera) => camera.name === "default");
    roamingCamera.value = cameras.value.find((camera) => camera.name === "roaming");
    pausedCamera.value = cameras.value.find((camera) => camera.name === "pausedCamera");
  }
});
onBeforeUnmount(() => {
  if (tubeRootRef.value) {
    tubeRootRef.value.remove();
  }
});
</script>
