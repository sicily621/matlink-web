
<template>
  <el-date-picker
    v-bind="props.pickerProps"
    type="date"
    :placeholder="t('datePicker.selectDate')"
    @change="handleChange"
    ref="datePicker">
  </el-date-picker>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n(); 
interface Props { 
  pickerProps?: any
}
const props = defineProps<Props>()

const value = ref<Date | null>(null)

const handleChange = (val: Date) => {
  value.value = val
}

</script>