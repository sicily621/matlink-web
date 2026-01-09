
<!-- {{ $t('elementUI.carousel.title') }} -->
<template>
  <el-carousel 
    v-bind="props.carouselProps"
    :interval="interval"
    arrow="always"
    @change="handleChange">
    <el-carousel-item 
      v-for="item in props.items"
      :key="item">
      <img :src="item" alt="">
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
import {ref} from 'vue' 

interface Props { 
  carouselProps: any
  items: string[]
}
const props = defineProps<Props>()

const interval = ref(3000)

const handleChange = (val: number) => {
  console.log(val)
}  

const setInterval = (time: number) => {
  interval.value = time 
}
</script>