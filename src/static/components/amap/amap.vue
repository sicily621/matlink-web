<template>
  <div :style="style" class="amap-container" id="amap-container"></div>
</template>
<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted } from "vue";
import { shallowRef } from "@vue/reactivity";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps<{
  style: any;
  searchName?: string;
  optLevel?: "country" | "province" | "city" | "district";
}>();
const emits = defineEmits(["lnglatChange", 'mapMounted']);
let map: any = shallowRef(null);
let _amap: any = null;
let country = t('amap.country');
let province = "";
let city = "";
let county = "";
let marker: any = shallowRef(null);
let mountedFlag = false;
onMounted(() => {
  AMapLoader.load({
    key: "bb70f6db8cd4dab572e83678a3a8e156", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.DistrictSearch", "AMap.AutoComplete", "AMap.PlaceSearch"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      _amap = AMap;
      if (props.searchName && props.optLevel) {
        districtSearch(props.searchName, props.optLevel);
      } else {
        districtSearch(t('amap.country'), "country");
      }
    })
    .catch((e) => {
      console.log("捕获错误:", e);
    });
});
const districtSearch = (searchName: string, optLevel: "country" | "province" | "city" | "district") => {
  if (!_amap) return;
  const district = new _amap.DistrictSearch({
    subdistrict: 0,
    extensions: "all",
    level: optLevel,
  });
  if (optLevel === "country") country = searchName;
  if (optLevel === "province") province = searchName;
  if (optLevel === "city") city = searchName;
  if (optLevel === "district") county = searchName;
  district.search(searchName, function (_: any, result: any) {
    var bounds = result.districtList[0]["boundaries"];
    const center = result.districtList[0]["center"];
    var mask = [];
    for (var i = 0; i < bounds.length; i++) {
      mask.push([bounds[i]]);
    }
    //实例化地图
    const zoomObj = {
      country: 10,
      province: 10,
      city: 11,
      district: 12,
    };
    map = new _amap.Map("amap-container", {
      mask: mask,
      zoom: zoomObj[optLevel], //设置当前显示级别
      expandZoomRange: true, //开启显示范围设置
      zooms: [4, 20], //最小显示级别为5，最大显示级别为20
      center: [center.lng, center.lat],
      viewMode: "3D", //这里特别注意，设置为3D则其它地区不显示
      zoomEnable: true, //是否可以缩放地图
      resizeEnable: true,
      mapStyle: "amap://styles/dark",
    });
    //添加描边
    for (var i = 0; i < bounds.length; i++) {
      new _amap.Polyline({
        path: bounds[i],
        strokeWeight: 2,
        map: map,
      });
    }
    if (!mountedFlag) {
      emits('mapMounted');
      mountedFlag = true;
    }
  });
};
const searchLocal = (val: string, cb: Function) => {
  placeSearch(val, cb);
};
const confirmLocal = (location: any, info: any) => {
  if (marker) map.remove(marker);
  marker = new _amap.Marker({
    title: info.address,
    position: new _amap.LngLat(location.lng, location.lat),
    icon: new _amap.Icon({
      size: [28, 30],
      image: "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
      imageSize: [28, 30],
    }),
    anchor: "bottom-center",
    draggable: true,
    zIndex: 18,
  });
  marker.on("dragging", function (event: any) {
    console.log('查看事件：', event);
    emits("lnglatChange", event.lnglat);
  });
  map.add(marker);
  map.setZoomAndCenter(16, [location.lng, location.lat], true, 400);
};
const placeSearch = (val: string, cb?: Function) => {
  var PlaceSearchOptions = {
    //设置PlaceSearch属性
    city: country + (province || "") + (county || "") + (city || ""), //城市
    type: "", //数据类别
    pageSize: 10, //每页结果数,默认10
    pageIndex: 1, //请求页码，默认1
    extensions: "base", //返回信息详略，默认为base（基本信息）
  };
  var MSearch = new _amap.PlaceSearch(PlaceSearchOptions); //构造PlaceSearch类
  MSearch.search(PlaceSearchOptions.city + val, (_: any, results: any) => {
    if (!results || !results.poiList || !Array.isArray(results.poiList.pois) || !results.poiList.pois.length) return;
    if (cb) {
      cb(results.poiList.pois);
    } else {
      let item = results.poiList.pois[0];
      const _marker: any = marker;
      if (_marker && _marker.setMap) _marker.setMap(null);
      confirmLocal(item.location, item);
    }
  });
};

defineExpose({
  districtSearch,
  searchLocal,
  confirmLocal,
  placeSearch,
});
</script>
<style scoped lang="scss">
.amap-container {
  padding: 0px;
  margin: 0px;
  height: 400px;
}
</style>
