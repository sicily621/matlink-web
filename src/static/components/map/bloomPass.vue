<template></template>

<script setup lang="ts">
import { watchEffect, toRefs, watch } from "vue";
import * as THREE from "three";
import { useTresContext, useRenderLoop } from "@tresjs/core";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { SSAARenderPass } from "three/addons/postprocessing/SSAARenderPass.js";
const { renderer, scene, sizes } = useTresContext();
const props = defineProps<{ mode: number; materials: { [key: string]: THREE.Material }; camera: THREE.PerspectiveCamera; width: number; height: number }>();
const { mode, materials, camera } = toRefs(props);

const BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });

const params = {
  strength: 0.8, // 强度
  radius: 0.1, // 半径
  threshold: 0.0,
};
let bloomComposer = null as any,
  finalComposer = null as any;
const bloomPassEffect = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, width: number, height: number) => {
  // 渲染器通道，将场景全部加入渲染器
  const renderScene = new RenderPass(scene, camera);
  // 添加虚幻发光通道
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(props.width, props.height), params.strength, params.radius, params.threshold);
  // 创建合成器
  bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  // 将渲染器和场景结合到合成器中
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  const mixPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: `varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
      fragmentShader: `uniform sampler2D baseTexture;
      uniform sampler2D bloomTexture;
      varying vec2 vUv;
      void main() {
          gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
      }`,
      defines: {},
    }),
    "baseTexture"
  );
  mixPass.needsSwap = true;

  const outputPass = new OutputPass();

  var ssaaRenderPassP = new SSAARenderPass(scene, camera);
  ssaaRenderPassP.sampleLevel = 1;
  ssaaRenderPassP.unbiased = true;
  finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(ssaaRenderPassP);
  finalComposer.addPass(mixPass);

  renderer.setPixelRatio(window.devicePixelRatio);
  finalComposer.setPixelRatio(window.devicePixelRatio);
  // finalComposer.addPass(outputPass);
};
watchEffect(() => {
  if (sizes.width.value) {
    bloomPassEffect(scene.value, camera.value, renderer.value, sizes.width.value, sizes.height.value);
  }
});
function darkenNonBloomed(obj: any) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials.value[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj: any) {
  if (materials.value[obj.uuid]) {
    obj.material = materials.value[obj.uuid];
    delete materials.value[obj.uuid];
  }
}
const { onLoop } = useRenderLoop();
onLoop(() => {
  if (bloomComposer && finalComposer) {
    if (mode.value) {
      scene.value.traverse(darkenNonBloomed);
      bloomComposer.render();
      scene.value.traverse(restoreMaterial);
      finalComposer.render();
    } else {
      renderer.value.render(scene.value, camera.value);
    }
  }
});
</script>
