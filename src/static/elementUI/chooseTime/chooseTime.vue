<template>
  <div style="display: flex">
    <div style="margin-right: 20px">
      <el-time-select
        v-model="startTime"
        :max-time="endTime"
        class="mr-4"
        :placeholder="startPlaceholder"
        :start="startTimeStart"
        :step="startTimeStep"
        :end="startTimeEnd"
        v-bind="startOptions"
      />
    </div>
    <!--   v-bind="$attrs.startOptions"-->
    <div>
      <el-time-select
        v-model="endTime"
        :min-time="startTime"
        :placeholder="endPlaceholder"
        :start="endTimeStart"
        :step="endTimeStep"
        :end="endTimeEnd"
        :disabled="endTimeDisable"
        v-bind="endOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, getCurrentInstance } from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { startOptions, endOptions } = (getCurrentInstance()?.proxy?.$attrs ||
  {}) as Record<string, any>;

let props = defineProps({
  //开始时间的占位符
  startPlaceholder: {
    type: String,
    default: () => t("chooseTime.selectStartTime"),
  },
  //开始时间初始化
  startTimeStart: {
    type: String,
    default: "08:00",
  },
  //开始时间的步进
  startTimeStep: {
    type: String,
    default: "00:30",
  },
  //开始时间结束选择
  startTimeEnd: {
    type: String,
    default: "18:30",
  },
  //结束时间的占位符
  endPlaceholder: {
    type: String,
    default: () => t("chooseTime.selectEndTime"),
  },
  //结束时间初始化
  endTimeStart: {
    type: String,
    default: "08:00",
  },
  //结束时间的步进
  endTimeStep: {
    type: String,
    default: "00:30",
  },
  //结束时间结束选择
  endTimeEnd: {
    type: String,
    default: "18:30",
  },
});

let emits = defineEmits(["startChange", "endChange"]);
//开始时间
let startTime = ref<string>("");
//结束时间
let endTime = ref<string>("");
let endTimeDisable = ref<Boolean>(true);

watch(
  () => startTime.value,
  (val) => {
    if (val === "") {
      endTime.value = "";
      endTimeDisable.value = true;
    } else {
      endTimeDisable.value = false;
      emits("startChange", val);
    }
  }
);

watch(
  () => endTime.value,
  (val) => {
    if (val !== "") {
      emits("endChange", {
        startTime: startTime.value,
        endTime: val,
      });
    }
  }
);
</script>

<style scoped lang="scss">
svg {
  width: 1em;
  height: 1em;
}
</style>
