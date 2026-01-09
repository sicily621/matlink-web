<template>
  <div id="map" class="h-full w-full relative">
    <Marker v-for="marker in markerList" :data="marker" :map="map" :key="marker.objectId" @markerClick="markerClick">
      <template #marker="{ marker }">
        <slot name="marker" :marker="marker"></slot>
      </template>
    </Marker>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, toRefs } from "vue";
import axios from "axios";
import L from "leaflet";
import "leaflet.heat";
import "@supermapgis/iclient-leaflet";
import Marker from "./marker.vue";
const http = axios.create();
const props = defineProps<{
  heatmap?: boolean;
  url: string;
  markerList: any[];
}>();
const { markerList } = toRefs(props);
const emits = defineEmits(["click", "markerClick"]);
const slots = defineSlots<{
  marker?: (args: any) => any;
}>();
const map = ref<any>(null);
const heatmapLayer = ref<any>(null);
const markerClick = (marker: any) => {
  emits("markerClick", marker);
};
watch(
  () => props.url,
  () => {
    initMap();
  }
);
watch(
  () => props.heatmap,
  () => {
    if (props.heatmap) {
      loadHeatMap();
    } else {
      clearHeatmap();
    }
  }
);
const initMap = () => {
  if (!props.url) return;
  if (map.value) {
    map.value.remove();
  }
  const layer = new (L as any).supermap.TiledMapLayer(props.url, {
    noWrap: true,
    maxZoom: 22,
    zoom: 18,
  });
  map.value = (L as any).map("map", {
    crs: L.CRS.EPSG4326,
    center: { lon: 116.3828, lat: 40.0028 },
    maxZoom: 22,
    zoom: 18,
    zoomControl: false,
    layers: [layer],
  });
  map.value.on("click", (evt: any) => {
    emits("click", evt);
  });
  if (props.heatmap) {
    clearHeatmap();
    loadHeatMap();
  }
};

function loadHeatMap() {
  if (!props.heatmap) return;
  const floorCode = props.url.split("/").pop();
  http
    .get(`/api/smart/main/api/third/proxy?floorCode=${floorCode}`, {
      headers: {
        proxyTargetUrl: "third-party.guohui.heat-map.listUrl",
        token: "KMc3hLtYz0x6OrGifpsqeb5DmIPVw2BJ",
      },
    })
    .then((res) => {
      const heatPoints = res.data.data.map((item: any) => {
        const { lat, lng, weight } = item;
        return [lat, lng, weight];
      });
      heatmapLayer.value = (L as any)
        .heatLayer(heatPoints, {
          radius: 20,
          minOpacity: 0.5,
        })
        .addTo(map.value);
    });
}
//清空热力图
const clearHeatmap = () => {
  map.value.removeLayer(heatmapLayer.value);
  heatmapLayer.value = null;
};
//清空所有marker
const clearAllMarker = () => {
  map.value.clearLayers();
};
defineExpose({
  clearAllMarker,
});
onMounted(() => {
  initMap();
});
</script>
<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
#map {
  background: var(--el-map-bg);
  z-index: 2;
}
</style>
