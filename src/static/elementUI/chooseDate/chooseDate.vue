<template>
  <div style="display: flex;">
    <div style="margin-right: 20px;" class="zc-el-input-con">
      <el-date-picker v-model="startDate" type="date" :placeholder="startPlaceholder" :disabledDate="startDisabledData"/>
    </div>
    <div class="zc-el-input-con">
      <el-date-picker v-model="endDate" type="date" :placeholder="endPlaceholder" :disabled="endDateDisable" :disabledDate="endDisabledDate "/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  startPlaceholder: {
    type: String,
    default: () => window.$i18nMFunc('chooseDate.selectStartDate')
  },
  endPlaceholder: {
    type: String,
    default: () => window.$i18nMFunc('chooseDate.selectEndDate')
  },
  //是否禁用选择今天之前的日期
  disableToday: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['startChange','endChange'])
//开始日期
const startDate = ref<any>()
//结束日期
const endDate = ref<any>()
const endDateDisable = ref<any>(true)

//禁用开始日期函数
const startDisabledData = (time: Date) => {
  if (props.disableToday) return time.getTime() < Date.now() - 1000*60*60*24
}
//禁用结束日期函数
const endDisabledDate = (time: Date) => {
  if (startDate.value) {
    return time.getTime() < startDate.value.getTime() + 1000*60*60*24
  }
}
watch(() => startDate.value, val => {
  if (!val) {
    endDate.value = null
    endDateDisable.value = true
  } else {
    emits('startChange',val)
    endDateDisable.value = false
  }
})

watch(() => endDate.value, val => {
  if (val) {
    emits('endChange', {
      startDate: startDate.value,
      endDate: val
    })
  }
})
const setStartDate = (date: Date) => startDate.value = date;
const setEndDate = (date: Date) => endDate.value = date;
defineExpose({
  setStartDate,
  setEndDate
})
</script>

<style scoped lang="scss">
@use '@static/css/theme/update-element.scss' as *;

</style>
