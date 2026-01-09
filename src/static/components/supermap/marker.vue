<template></template>
<script setup lang="ts">
import { ref, onMounted, h, render, onBeforeUnmount, toRefs, watchEffect } from "vue";
import { Marker } from "./index";
import L from "leaflet";
import "@supermapgis/iclient-leaflet";
const props = defineProps<{ map: any; data: any }>();
const slots = defineSlots<{
  marker?: (args: any) => any;
}>();
const { x, y } = toRefs(props.data);
const emits = defineEmits(["markerClick"]);
const layerRef = ref();
const markerRef = ref();
watchEffect(() => {
  if (markerRef.value) {
    markerRef.value.setLatLng({ lng: y.value, lat: x.value });
  }
});
const addMarker = (marker: Marker) => {
  const labelContentWrap = document.createElement("div");
  if (slots?.marker) {
    const selectVNode = h(slots.marker, {
      marker: marker,
    });
    render(selectVNode, labelContentWrap);
  }
  var icon = L.divIcon({
    html: labelContentWrap,
    iconAnchor: [0, 0],
  });
  markerRef.value = L.marker({ lng: y.value, lat: x.value }, { icon });
  layerRef.value = L.layerGroup([markerRef.value]);
  layerRef.value.addTo(props.map);
  layerRef.value.eachLayer((layer: any) => {
    layer.on("click", function () {
      emits("markerClick", props.data);
    });
  });
};
onMounted(() => {
  if (props.data) {
    addMarker(props.data);
  }
});
onBeforeUnmount(() => {
  if (layerRef.value && props.map) {
    props.map.removeLayer(layerRef.value);
  }
});
</script>
