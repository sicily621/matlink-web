<template>
  <div>
    <slot name="province-label"></slot>
    <el-select
      clearable
      :placeholder="t('chooseArea.selectProvince')"
      v-model="province"
      class="select"
    >
      <el-option
        v-for="item in areas"
        :key="item.code"
        :value="item.code"
        :label="item.name"
      ></el-option>
    </el-select>
    <slot name="city-label"></slot>
    <el-select
      clearable
      :disabled="!province"
      :placeholder="t('chooseArea.selectCity')"
      v-model="city"
      class="select"
      style="margin: 0 10px"
    >
      <el-option
        v-for="item in selectCity"
        :key="item.code"
        :value="item.code"
        :label="item.name"
      >
      </el-option>
    </el-select>

    <slot name="area-label"></slot>
    <el-select
      clearable
      :disabled="!province || !city"
      :placeholder="t('chooseArea.selectArea')"
      v-model="area"
      class="select"
    >
      <el-option
        v-for="item in selectArea"
        :key="item.code"
        :value="item.code"
        :label="item.name"
      ></el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import allArea from "./lib/pca-code.json";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
export interface AreaItem {
  name: string;
  code: string;
  children?: AreaItem[];
}
export interface Data {
  name: string;
  code: string | number;
}
let province = ref<string>("");
let city = ref<string>("");
let area = ref<string>("");
let areas = ref<any[]>(allArea);

let selectCity = ref<AreaItem[]>([]);
selectCity = computed(() => {
  if (!province.value) return [];
  else {
    let citys = areas.value.find((item) => item.code === province.value)
      ?.children!;
    return citys;
  }
});
watch(
  () => province.value,
  () => {
    city.value = "";
    area.value = "";
  }
);

let selectArea = ref<AreaItem[]>([]);
selectArea = computed(() => {
  if (!city.value || !selectCity.value) {
    return [];
  } else {
    let areas = selectCity.value.find((item) => item.code === city.value)
      ?.children!;
    return areas;
  }
});
watch(
  () => city.value,
  () => {
    area.value = "";
  }
);
//分发事件给父组件
let emits = defineEmits(["change"]);
watch(
  () => area.value,
  (val) => {
    if (val) {
      let provinceData: Data = {
        code: Number(province.value),
        name:
          (province.value &&
            (
              allArea.find((item) => item.code === Number(province.value)) as {
                code: number;
                name: string;
              }
            )?.name) ||
          "",
      };

      let cityData: Data = {
        code: city.value,
        name:
          city.value &&
          selectCity.value.find((item) => item.code === city.value)!.name,
      };
      let areaData: Data = {
        code: val,
        name:
          val &&
          selectArea.value.find((item) => item.code === area.value)!.name,
      };
      emits("change", {
        province: provinceData,
        city: cityData,
        area: areaData,
      });
    }
  }
);
</script>

<style scoped lang="scss">
.select {
  width: 115px;
}
</style>
