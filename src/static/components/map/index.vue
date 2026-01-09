<template>
  <div class="h-full relative" @click="click" @mousedown="mousedown" @mouseup="mouseup" @mousewheel="wheel" ref="mapRef">
    <TresCanvas
      ref="canvasRef"
      renderMode="manual"
      :toneMappingExposure="1"
      :toneMapping="NoToneMapping"
      :antialias="true"
      :alpha="true"
      :logarithmicDepthBuffer="false"
      powerPreference="high-performance"
    >
      <TresOrthographicCamera v-if="bindPointMode" ref="cameraRef" name="default" :position="[0, 500, 0]" />
      <TresPerspectiveCamera v-if="!bindPointMode" ref="cameraRef" name="default" :position="[0, 500, 0]" :far="100000" />
      <TresPerspectiveCamera v-if="!onlySky && !bindPointMode" ref="roamingCameraRef" name="roaming" :position="[0, 0, 0]" :far="1000" />
      <TresPerspectiveCamera v-if="!onlySky && !bindPointMode" ref="pausedCameraRef" name="pausedCamera" :far="1000" />
      <!-- <TresOrbitControls ref="roamingOrbitControlsRef" v-if="!onlySky && labelRenderer && !bindPointMode" :args="[pausedCameraRef, labelRenderer?.domElement]" :enableZoom="false" :screenSpacePanning="false" :keyPanSpeed="200" /> -->
      <Suspense v-if="skySceneUrls?.length && sky && !onlySky && !mode">
        <Environment :files="skySceneUrls" :background="true" />
      </Suspense>
      <Box ref="boxRef" v-if="onlySky" :args="[skyBoxSize - 50, skyBoxSize - 50, skyBoxSize - 50]" :position="[0, 0, 0]">
        <TresMeshBasicMaterial :side="BackSide" :opacity="0" :transparent="true" />
      </Box>
      <TresObject3D ref="gridRef" v-if="grid">
        <TresGridHelper :args="[5000, 60, gridColor, gridColor]" :position="[0, -1, 0]" />
      </TresObject3D>
      <TresHemisphereLight :intensity="mode ? 2 : 0.3" />
      <TresAmbientLight :intensity="1" />
      <!-- <TresDirectionalLight :intensity="mode ? 0 : 0.2" :position="[100, 0, 100]" />
      <TresDirectionalLight :intensity="mode ? 0 : 0.2" :position="[-100, 0, 100]" />
      <TresDirectionalLight :intensity="mode ? 0 : 0.2" :position="[100, 0, -100]" /> -->
      <TresDirectionalLight :intensity="mode ? 0.5 : 1" :position="[50, 30, -30]" />
      <TresDirectionalLight ref="directionLightRef" :intensity="mode ? 0.5 : 10" />
      <TresMesh ref="floorRef" :rotation="[-Math.PI / 2, 0, 0]">
        <TresPlaneGeometry :args="[5000, 5000]" :position="[0, -5, 0]" />
        <TresMeshBasicMaterial :opacity="0" :transparent="true" />
      </TresMesh>
      <TresObject3D ref="modelRootRef"></TresObject3D>
      <TresObject3D ref="markerRootRef">
        <Marker v-for="marker in markerList" :data="marker" :key="marker.objectId" :labelOffset="labelOffset" :status="roamingStatus">
          <template #marker="{ marker }">
            <slot name="marker" :marker="marker"></slot>
          </template>
        </Marker>
      </TresObject3D>
      <TresObject3D ref="labelRootRef">
        <Label v-for="label in labelList" :data="label" :key="label.objectId" :labelOffset="labelOffset" :status="roamingStatus">
          <template #label="{ label }">
            <slot name="label" :label="label"></slot>
          </template>
        </Label>
      </TresObject3D>
      <TresObject3D ref="roadRootRef">
        <Road
          v-for="(road, index) in roadList"
          :data="road"
          :roadLabelShowIndex="roadLabelShowIndex"
          :key="road.key"
          :status="roamingStatus"
          :roamingRoadIndex="currentRoadIndex"
          :currentIndex="index"
          :setRoamingCamera="setRoamingCamera"
          :onReachRoamingPoint="onReachRoamingPoint"
          :roamingSpeed="roamingSpeed"
        >
        </Road>
      </TresObject3D>
      <labelRender ref="labelRef" :width="width" :height="height" :mapRef="mapRef" :camera="currentCamera" />
      <bloomPass :materials="materials" :mode="mode" :camera="currentCamera" :width="width" :height="height" />
    </TresCanvas>
    <div
      class="compass flex-column flex-center"
      ref="compassRef"
      v-if="!onlySky && !bindPointMode && props.compass && roamingStatus === RoamingStatus.STOP"
    >
      <img :src="compassWhiteBg" class="white bg" />
      <img :src="compassBlackBg" class="black bg" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeUnmount, toRefs, watch, computed, onMounted } from "vue";
import { TresCanvas, useRenderLoop, extend, useLoader } from "@tresjs/core";
import { useFBX, Environment, Box } from "@tresjs/cientos";
import {
  type Object3D,
  MOUSE,
  BoxHelper,
  Vector3,
  type Sphere,
  GridHelper,
  Raycaster,
  Vector2,
  Material,
  MeshBasicMaterial,
  MeshPhongMaterial,
  CubeTextureLoader,
  ShaderMaterial,
  BoxGeometry,
  Mesh,
  BackSide,
  ShaderLib,
  CubeRefractionMapping,
  AnimationMixer,
  Layers,
  TextureLoader,
  CanvasTexture,
  RepeatWrapping,
  AdditiveBlending,
  MeshPhysicalMaterial,
  PMREMGenerator,
  ACESFilmicToneMapping,
  SRGBColorSpace,
  BasicShadowMap,
  NoToneMapping,
} from "three";
import { Tween, Easing, Group } from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MapProps, Position } from "./map";
import { RoamingStatus } from "./road";
import Marker from "./marker.vue";
import Label from "./label.vue";
import Road from "./road.vue";
import { useElementBounding } from "@vueuse/core";
import { createObserver } from "@static/components/observer/HyObserver";
import HyEnumDataType from "@static/components/observer/HyEnumDataType";
import IHyTopic from "@static/components/observer/IHyTopic";
import { getCssVar } from "@static/js/theme/var";
import compassWhiteBg from "@static/images/map-compass-white-bg.png";
import compassBlackBg from "@static/images/map-compass-black-bg.png";
import bloomPass from "./bloomPass.vue";
import labelRender from "./labelRenderer.vue";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { traverseModel, mtlTweenGroup } from "./theme/index";

const labelRef = ref();
const topicManager = window.$HyGlobal.getTopicManager();
const topic: IHyTopic | undefined = topicManager.getByKey(HyEnumDataType.THEME.getName());
if (topic) {
  const observer = createObserver(topic, (data: any) => {
    if (data) {
      backgroundColor.value = getCssVar("--el-map-bg");
      gridColor = getCssVar("--el-map-grid-color");
      if (gridRef.value) gridRef.value.children[0] = new GridHelper(5000, 60, gridColor, gridColor);
    }
  });
  const unsubscribe = () => {
    observer && observer.destroy();
  };
  onBeforeUnmount(() => unsubscribe());
}

extend({ GridHelper, MeshBasicMaterial, OrbitControls });
const props = defineProps(MapProps);
//roadList
const { roamingStatus, skyUrls, prevSceneUrls, onlySky, needCacheSky, autoRotate, grid, mode } = toRefs(props);
const backgroundColor = ref(props?.backgroundColor || getCssVar("--el-map-bg"));
backgroundColor.value = mode.value ? "#000000" : "#ffffff";
let gridColor = getCssVar("--el-map-grid-color");
defineSlots<{
  marker?: (args: any) => any;
  label?: (args: any) => any;
}>();

const mapRef = ref<HTMLElement | null>(null);
const canvasRef = ref();
const cameraRef = ref();
const floorRef = ref();
const roadRootRef = ref();
const roamingCameraRef = ref();
const pausedCameraRef = ref();
const directionLightRef = ref();
const modelRootRef = ref<Object3D>();
const markerRootRef = ref<Object3D>();
const labelRootRef = ref<Object3D>();
const orbitControlsRef = ref();
const roamingOrbitControlsRef = ref();
const labelRenderer = ref();
const gridRef = ref();
const compassRef = ref();
const tweenGroup = new Group();
// const mtlTweenGroup = new Group();
const mixers = ref<AnimationMixer[]>([]);
let skyBox: Mesh | null = null;
const boxRef = ref();
const skyBoxSize = 200;
const skySceneUrls = computed(() => {
  const defaultSkyUrls = ["/right.jpg", "/left.jpg", "/top.jpg", "/bottom.jpg", "/before.jpg", "/after.jpg"].map((url: string) => `./scene${url}`);
  const result = skyUrls?.value?.length ? skyUrls.value : defaultSkyUrls;
  return result;
});

watch(skySceneUrls, () => {
  reset();
  loadCubeMap();
});
watch(prevSceneUrls, () => {
  preloadCubeTexture();
});
const { onLoop, onBeforeLoop, onAfterLoop } = useRenderLoop();

const initLabelRenderer = ref(false);
const flag = ref(true);
const { width, height, left, top } = useElementBounding(mapRef);
const raycaster = new Raycaster();
const pointer = new Vector2();

const mouseButtons = {
  LEFT: MOUSE.PAN,
  MIDDLE: MOUSE.DOLLY,
  RIGHT: MOUSE.ROTATE,
};
const maxPolarAngle = onlySky.value ? Math.PI : 0.45 * Math.PI;
const center = ref<Vector3>(new Vector3(0, 0, 0));
const maxDistance = ref(5000);
const minDistance = ref(0);
const { x, y, z } = props.cameraPosition;
const cameraPosition = ref<Vector3>(new Vector3(x, y, z));

const modelPathsCacheSet = ref<Set<string>>(new Set()); //需要被缓存的FBX路径
const currentFbxPaths = ref<string[]>([]);
const emits = defineEmits(["loaded", "click", "mousedown", "mouseup"]);
//当前漫游路径索引
const currentRoadIndex = ref(0);

//加载完的模型个数
const currentCamera = computed(() => {
  let camera = cameraRef.value;
  if (!props.bindPointMode) {
    if (roamingStatus.value === RoamingStatus.ROAMING) {
      camera = roamingCameraRef.value;
    } else if (roamingStatus.value === RoamingStatus.PAUSE) {
      camera = pausedCameraRef.value;
    }
  }
  return camera;
});
const loadedModelLength = ref<number>(0);
const handleEvent = (event: any, cb?: Function) => {
  pointer.x = ((event.clientX - left.value) / width.value) * 2 - 1;
  pointer.y = -((event.clientY - top.value) / height.value) * 2 + 1;
  raycaster.setFromCamera(pointer, currentCamera.value);
  const environmentObject = boxRef?.value?.instance ? [boxRef.value.instance] : [floorRef.value];
  const intersects = raycaster.intersectObjects(environmentObject);
  const isMarker = raycaster.intersectObjects(markerRootRef.value?.children ?? []);
  const labelList =
    labelRootRef.value?.children &&
    labelRootRef.value.children.reduce((prev: any, cur: any) => {
      return [...prev, ...cur.children];
    }, []);
  const isLabel = raycaster.intersectObjects(labelList || []);
  if (intersects.length > 0 || isMarker.length || isLabel.length) {
    let target: any = isMarker.length > 0 ? isMarker[0] : isLabel.length > 0 ? isLabel[0] : intersects[0];
    const object = isLabel.length > 0 ? target.parent : target.object;
    const position = target.point;
    const { x, y, z } = position;
    const point: Position = {
      x: Math.ceil(x),
      y: Math.ceil(y),
      z: Math.ceil(z),
    };
    const isBindObject = isMarker.length > 0 || isLabel.length > 0;
    cb && cb(object, point, isBindObject);
  }
};
const click = (event: any) => {
  if (event.button !== 0) return;
  handleEvent(event, (object: any, point: Position, isBindObject: boolean) => {
    emits("click", object, point, isBindObject);
  });
};
const mousedown = (event: any) => {
  if (event.button !== 0) return;
  handleEvent(event, (object: any, point: Position, isBindObject: boolean) => {
    if (props.bindPointMode) {
      const control: any = orbitControlsRef.value;
      control.enablePan = !isBindObject;
      control.update();
    }
    emits("mousedown", object, point, isBindObject);
  });
};
const mouseup = (event: any) => {
  if (event.button !== 0) return;
  if (props.bindPointMode) {
    const control: any = orbitControlsRef.value;
    control.enablePan = true;
    control.update();
  }
  handleEvent(event, (object: any, point: Position, isBindObject: boolean) => {
    emits("mouseup", object, point, isBindObject);
  });
};
const wheel = (event: any) => {
  if (!onlySky.value) return;
  const wheelDelta = event.wheelDelta || -event.detail;
  if (wheelDelta > 0) {
    if (cameraRef.value.zoom < 3) cameraRef.value.zoom += 0.1;
  } else {
    if (cameraRef.value.zoom > 1) cameraRef.value.zoom -= 0.1;
  }
};

// 加载FBX模型
const load = (modelFbxPaths: string[], cache: boolean = false, overlying: boolean = false, needRefreshCamera: boolean = true) => {
  if (overlying) {
    currentFbxPaths.value = currentFbxPaths.value.concat(modelFbxPaths);
  } else {
    loadedModelLength.value = 0;
    currentFbxPaths.value = modelFbxPaths;
  }

  //是否缓存加载过
  const hasLoad = modelFbxPaths.every((url) => {
    return modelPathsCacheSet.value.has(url);
  });
  //先清场
  clearSceneBeforeLoadModel();
  //没有缓存加载过再去加载
  if (!hasLoad) {
    if (cache) {
      modelFbxPaths.map((url) => {
        modelPathsCacheSet.value.add(url);
      });
    }
    loadFbxFilesFromPaths(modelFbxPaths, needRefreshCamera);
  } else {
    loadedModelLength.value = modelFbxPaths.length;
    emits("loaded", !overlying);
    if (hasLoad) {
      const cameraParams: [Vector3, Vector3, number, boolean?, number?] = modelCameraCacheMap.value.get(currentFbxPaths.value.join(","));
      cameraParams && setCameraView(...cameraParams);
    }
  }
};
//加载天空盒子
const skyCacheMap: Map<string, any> = new Map();
const loadCubeMap = () => {
  if (skyBox) {
    let texture = skyCacheMap.get(skySceneUrls.value.join(","));
    if (!texture) {
      texture = new CubeTextureLoader().setPath("").load(skySceneUrls.value);
      texture.mapping = CubeRefractionMapping;
      if (needCacheSky.value) {
        skyCacheMap.set(skySceneUrls.value.join(","), texture);
      }
    }
    const cubeShader = ShaderLib["cube"];
    cubeShader.uniforms["tCube"].value = texture;
    const cubeMaterial = new ShaderMaterial({
      fragmentShader: cubeShader.fragmentShader,
      vertexShader: cubeShader.vertexShader,
      uniforms: cubeShader.uniforms,
      depthWrite: false,
      side: BackSide,
    });
    skyBox.material = cubeMaterial;
    skyBox.visible = !!skyUrls?.value?.length;
  }
};
const preloadCubeTexture = () => {
  if (skyBox) {
    skyCacheMap.clear();
    prevSceneUrls.value.map((urls: string) => {
      let texture = skyCacheMap.get(urls);
      if (!texture) {
        texture = new CubeTextureLoader().setPath("").load(urls.split(","));
        texture.mapping = CubeRefractionMapping;
        if (needCacheSky.value) {
          skyCacheMap.set(urls, texture);
        }
      }
    });
  }
};
// 清除叠加的模型
const removeOverlyingModel = (modelFbxPaths: string[]) => {
  currentFbxPaths.value = currentFbxPaths.value.filter((url: string) => {
    modelPathsCacheSet.value.delete(url);
    return !modelFbxPaths.includes(url);
  });
  loadedModelLength.value = modelFbxPaths.length;
  clearSceneBeforeLoadModel();
};
// 加载FBX文件
const loadFbxFilesFromPaths = (fbxPaths: string[], needRefreshCamera: boolean = true) => {
  const loadFBXFile = (path: string, model: Object3D) => {
    const belongCurrent = currentFbxPaths.value.includes(path);
    if (belongCurrent) {
      model.name = path;
      loadedModelLength.value++;
      addToScene(model, needRefreshCamera);
      if (loadedModelLength.value == fbxPaths.length) {
        emits("loaded", needRefreshCamera);
      }
    }
  };

  fbxPaths.map((path) => {
    new FBXLoader().load(path, (model) => {
      loadFBXFile(path, model);
    });
  });
};

const materials = ref<{ [key: string]: Material }>({});
watch(mode, () => {
  backgroundColor.value = mode.value ? "#000000" : "#ffffff";
  if (modelRootRef.value) {
    materials.value = traverseModel(modelRootRef.value, mode.value);
  }
  roamingOrbitControlsRef.value.enabled = !!mode.value;
});
// 添加模型到场景
const addToScene = async (model: Object3D, needRefreshCamera: boolean = true) => {
  //需要缓存的模型先隐藏，不需要缓存的模型直接删除
  if (!modelRootRef.value) return;
  modelRootRef.value.add(model);
  materials.value = traverseModel(model, mode.value);
  const { animations } = model;
  if (animations.length) {
    const mixer = new AnimationMixer(model);
    mixers.value.push(mixer);
    animations.forEach((animation: any) => {
      const action = mixer.clipAction(animation, model);
      action.play();
    });
  }
  if (needRefreshCamera) cameraAdjustment();
};
const modelCameraCacheMap = ref<Map<string, any>>(new Map());
//调整镜头
const cameraAdjustment = () => {
  if (!modelRootRef.value) return;
  if (!orbitControlsRef.value) return;
  if (currentFbxPaths.value.length === 0) return;
  const control: any = orbitControlsRef.value;
  const model: Object3D = modelRootRef.value.clone();
  model.children = model.children.filter((child) => child.visible);
  const box: BoxHelper = new BoxHelper(model);
  const { center: lookAt, radius } = box.geometry.boundingSphere as Sphere;
  center.value = new Vector3(lookAt.x + model.position.x, radius, lookAt.z + model.position.z);
  if (props.bindPointMode) {
    cameraPosition.value = new Vector3(center.value.x, radius * 1 + lookAt.y + model.position.y, center.value.z);
  } else {
    cameraPosition.value = new Vector3(
      lookAt.x - radius / 2.0 + model.position.x,
      radius * 1 + lookAt.y + model.position.y,
      lookAt.z + radius / 2.0 + model.position.z
    );
  }
  const maxDiameter = Math.max(cameraPosition.value.x, cameraPosition.value.y, cameraPosition.value.z);
  maxDistance.value = maxDiameter * 2;
  minDistance.value = maxDiameter / 2;
  control.reset();
  if (props.bindPointMode) {
    control.maxZoom = 2;
    control.minZoom = 0.5;
  } else {
    control.maxDistance = maxDistance.value;
    // control.minDistance = minDistance.value;
  }
  const cameraParams: [Vector3, Vector3, number, boolean?, number?] = [lookAt, cameraPosition.value, 1, true];
  const hasLoad = currentFbxPaths.value.every((url) => {
    return modelPathsCacheSet.value.has(url);
  });
  if (hasLoad) {
    modelCameraCacheMap.value.set(currentFbxPaths.value.join(","), cameraParams);
  }
  if (props.bindPointMode) {
    cameraParams.push(0);
  }
  setCameraView(...cameraParams);
  directionLightRef.value.position.copy(cameraPosition.value);
};

// 加载模型前清场
const clearSceneBeforeLoadModel = () => {
  //缓存的模型,属于当前模型显示，不属于先隐藏，不需要缓存的模型直接删除
  if (modelRootRef.value) {
    mixers.value = [];
    for (let i = modelRootRef.value.children.length - 1; i >= 0; i--) {
      const group = modelRootRef.value.children[i];
      const cache = modelPathsCacheSet.value.has(group.name);
      const belongCurrent = currentFbxPaths.value.includes(group.name);
      if (!belongCurrent) {
        if (cache) {
          group.visible = false;
        } else {
          group.removeFromParent();
        }
      } else {
        group.visible = true;
      }
    }
  }
};

//根据objectId找Marker
const getMarkerByObjectId = (objectId: string) => {
  if (markerRootRef.value) {
    const marker = markerRootRef.value.children.find((marker: any) => {
      return marker.rawData.objectId === objectId;
    });
    return marker;
  }
};

//根据objectId找Label
const getLabelByObjectId = (objectId: string) => {
  if (labelRootRef.value) {
    const label = labelRootRef.value.children.find((label: any) => {
      return label.rawData.objectId === objectId;
    });
    return label;
  }
};

//根据objectId更新marker位置
const setMarkerPositionByObjectId = (objectId: string, position: Position) => {
  if (markerRootRef.value) {
    const marker = getMarkerByObjectId(objectId);
    if (marker) {
      const { x, y, z } = position;
      marker.position.set(x, y, z);
    }
  }
};
//根据objectId更新label位置
const setLabelPositionByObjectId = (objectId: string, position: Position) => {
  if (labelRootRef.value) {
    const label = getLabelByObjectId(objectId);
    if (label) {
      const { x, y, z } = position;
      label.position.set(x, y, z);
    }
  }
};

//根据objectId更新marker的visible
const setMarkerVisibleByObjectId = (objectId: string, visible: boolean) => {
  if (markerRootRef.value) {
    const marker = getMarkerByObjectId(objectId);
    if (marker) marker.visible = visible;
  }
};

//获取当前camera的旋转角度
const getCameraRotation = () => {
  if (cameraRef.value) {
    const { x, y, z } = cameraRef.value.rotation;
    const res = { x: +x.toFixed(2), y: +y.toFixed(2), z: +z.toFixed(2) };
    return res;
  }
};

//获取视角
const getCameraView = () => {
  if (!orbitControlsRef.value || !cameraRef.value) return;
  const control: any = orbitControlsRef.value;
  const { target: lookAt } = control;
  const { position, zoom } = cameraRef.value;
  return { position, zoom: +zoom.toFixed(2), lookAt };
};
const cameraCacheMap = ref<Map<string, { maxDistance: number; minDistance: number }>>(new Map());
/**
 * 设置视角
 * @param lookAt 看向点
 * @param position 位置
 * @param zoom 相机伸缩
 * @param cache 是否缓存
 * @param time 动画时长
 */
const setCameraView = (lookAt: Vector3, position: Vector3, zoom: number, cache: boolean = false, time: number = 0) => {
  if (!orbitControlsRef.value || !cameraRef.value) return;
  const control: any = orbitControlsRef.value;
  const camera = cameraRef.value;
  const savedParams = cameraCacheMap.value.get(currentFbxPaths.value.join(","));
  if (savedParams) {
    const { maxDistance, minDistance } = savedParams;
    control.maxDistance = maxDistance;
    control.minDistance = minDistance;
  }

  const clip1 = new Tween({ ...control.target })
    .to({ ...lookAt }, time)
    .easing(Easing.Quadratic.InOut)
    .onUpdate((object) => {
      const { x, y, z } = object;
      control.target.set(x, y, z);
      control.update();
    });

  const clip2 = new Tween({ ...camera.position, zoom: camera.zoom })
    .to({ ...position, zoom }, time)
    .easing(Easing.Quadratic.InOut)
    .onUpdate((object) => {
      const { x, y, z, zoom } = object;
      camera.position.set(x, y, z);
      camera.zoom = zoom;
      control.update();
    })
    .onComplete(() => {
      if (cache) {
        const { maxDistance, minDistance } = control;
        cameraCacheMap.value.set(currentFbxPaths.value.join(","), { maxDistance, minDistance });
        control.saveState();
        control.update();
      }
    });
  clip1.chain(clip2);
  clip1.start();
  tweenGroup.getAll().forEach((tween) => tween.stop());
  tweenGroup.removeAll();
  tweenGroup.add(clip1, clip2);
};
//镜头聚焦marker
const focusMarker = (objectId: string, callback?: Function, time: number = 1000, zoom: number = 2) => {
  if (!orbitControlsRef.value || !cameraRef.value) return;
  const marker = getMarkerByObjectId(objectId);
  if (!marker) return;
  const control: any = orbitControlsRef.value;
  const camera = cameraRef.value;
  const clip1 = new Tween({ zoom: camera.zoom })
    .to({ zoom: 0.8 }, 600)
    .easing(Easing.Quadratic.InOut)
    .onUpdate((object) => {
      const { zoom } = object;
      camera.zoom = zoom;
    });

  const clip2 = new Tween(control.target)
    .to(marker.position, time)
    .easing(Easing.Quadratic.InOut)
    .onUpdate((object) => {
      const { x, y, z } = object;
      control.target.set(x, y, z);
      control.update();
    });

  const clip3 = new Tween({ zoom: 0.8 })
    .to({ zoom }, 800)
    .easing(Easing.Quadratic.InOut)
    .onUpdate((object) => {
      const { zoom } = object;
      camera.zoom = zoom;
    })
    .onComplete(() => {
      callback && callback();
    });

  clip1.chain(clip2);
  clip2.chain(clip3);

  if (onlySky.value) {
    const { x: x1, y: y1, z: z1 } = marker.position;
    const target = new Vector3().subVectors(new Vector3(x1, y1, z1), camera.position).divideScalar(10);
    const { x, y, z } = target;
    control.reset();
    control.target.set(x, y, z);
    control.update();
    callback && callback();
  } else {
    control.reset();
    clip1.start();
  }
  tweenGroup.getAll().forEach((tween) => tween.stop());
  tweenGroup.removeAll();
  tweenGroup.add(clip1, clip2, clip3);
};
//复位
const reset = () => {
  orbitControlsRef.value?.reset();
};
const setRoamingCamera = (lookAt: Vector3, position: Vector3) => {
  const isRoaming = roamingStatus.value !== RoamingStatus.STOP && !props.bindPointMode;
  if (!isRoaming) return;
  roamingCameraRef.value.position.copy(position);
  roamingCameraRef.value.lookAt(lookAt);
  roamingOrbitControlsRef.value.target.copy(lookAt);
};

const initCamera = (camera: any) => {
  camera.left = width.value / -2;
  camera.right = width.value / 2;
  camera.top = height.value / 2;
  camera.bottom = height.value / -2;
  camera.near = 1;
  camera.far = 10000;
};
watch(autoRotate, () => {
  orbitControlsRef.value.autoRotate = autoRotate.value;
});
const hasAddKeyEvents = ref(false);
watch(
  () => roamingStatus.value,
  () => {
    if (roamingStatus.value === RoamingStatus.PAUSE) {
      if (pausedCameraRef.value) {
        const { position } = roamingCameraRef.value;
        const lookAt = roamingOrbitControlsRef.value.target;
        const lookAtCloseToPosition = lookAt.clone().sub(position).multiplyScalar(0.01).add(position);
        roamingOrbitControlsRef.value.target.copy(lookAtCloseToPosition);
        pausedCameraRef.value.position.copy(position);
        roamingOrbitControlsRef.value.saveState();
        roamingOrbitControlsRef.value.update();
        if (!hasAddKeyEvents.value) {
          roamingOrbitControlsRef.value.listenToKeyEvents(window);
          hasAddKeyEvents.value = true;
        }
        orbitControlsRef.value.enabled = false;
        roamingOrbitControlsRef.value.enabled = true;
      }
    } else {
      orbitControlsRef.value.enabled = true;
      roamingOrbitControlsRef.value.enabled = false;
    }
  }
);
onBeforeLoop(({ delta }) => {
  if (mixers.value.length) {
    mixers.value.forEach((mixer: any) => mixer.update(delta));
  }
  if (cameraRef.value && flag.value) {
    flag.value = false;
    if (props.bindPointMode) {
      initCamera(cameraRef.value);
    } else {
      if (roamingCameraRef.value) initCamera(roamingCameraRef.value);
    }
  }
  if (!initLabelRenderer.value && labelRef.value) {
    initLabelRenderer.value = true;
    labelRenderer.value = labelRef.value.labelRenderer;
    orbitControlsRef.value = new OrbitControls(cameraRef.value, labelRenderer.value.domElement);
    orbitControlsRef.value.maxPolarAngle = maxPolarAngle;
    orbitControlsRef.value.mouseButtons = mouseButtons;
    orbitControlsRef.value.autoRotate = props.autoRotate;
    orbitControlsRef.value.enableDamping = true;
    if (!onlySky.value && !props.bindPointMode) {
      roamingOrbitControlsRef.value = new OrbitControls(pausedCameraRef.value, labelRenderer.value.domElement);
      roamingOrbitControlsRef.value.enableZoom = false;
      roamingOrbitControlsRef.value.screenSpacePanning = false;
      roamingOrbitControlsRef.value.keyPanSpeed = 200;
    }
    if (onlySky.value) {
      const cubeMap = new CubeTextureLoader().setPath("").load(skySceneUrls.value);
      cubeMap.mapping = CubeRefractionMapping;
      var cubeShader = ShaderLib["cube"];
      cubeShader.uniforms["tCube"].value = cubeMap;
      var cubeMaterial = new ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: BackSide,
      });
      const geometry = new BoxGeometry(skyBoxSize, skyBoxSize, skyBoxSize);
      skyBox = new Mesh(geometry, cubeMaterial);
      skyBox.visible = !!skyUrls?.value?.length;
      canvasRef.value.context.scene.value.add(skyBox);
      orbitControlsRef.value.enableZoom = false;
      orbitControlsRef.value.enablePan = false;
      orbitControlsRef.value.panSpeed = 0;
      cameraRef.value.fov = 75;
      cameraRef.value.position.set(5, 0, 0);
      orbitControlsRef.value.saveState();
      orbitControlsRef.value.update();
    }
  }
  let currentCamera = cameraRef.value;
  if (roamingStatus.value === RoamingStatus.PAUSE) {
    currentCamera = pausedCameraRef.value;
  } else if (roamingStatus.value === RoamingStatus.ROAMING) {
    currentCamera = roamingCameraRef.value;
  }
  if (directionLightRef.value) directionLightRef.value.position.copy(currentCamera.position);
  //labelRenderer.value.render(canvasRef.value.context.scene.value, currentCamera);
  if (compassRef.value) {
    var angle = (currentCamera.rotation.z * 180) / Math.PI;
    compassRef.value.style.transform = `rotate(${angle}deg)`;
  }
});
onLoop(() => {
  orbitControlsRef.value?.update();
  roamingOrbitControlsRef.value?.update();
  tweenGroup.update();
  mtlTweenGroup && mtlTweenGroup.update();
});
defineExpose({
  load,
  getMarkerByObjectId,
  setMarkerPositionByObjectId,
  setMarkerVisibleByObjectId,
  getLabelByObjectId,
  setLabelPositionByObjectId,
  getCameraRotation,
  getCameraView,
  setCameraView,
  reset,
  focusMarker,
  removeOverlyingModel,
});
</script>
<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.compass {
  position: absolute;
  right: zrem(20);
  bottom: zrem(18);
  z-index: 2;
  img {
    width: zrem(60);
  }
}
html.black {
  .black {
    display: inline-block;
  }
  .white {
    display: none;
  }
}
html.white {
  .black {
    display: none;
  }
  .white {
    display: inline-block;
  }
}
</style>
