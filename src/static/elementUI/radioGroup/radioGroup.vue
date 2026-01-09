<template>
  <el-radio-group 
    class="t-main zc-radio-group-con" 
    v-model="radio" 
    @change="radioChange()"
  >
    <el-radio 
      v-for="item of radios"
      :label="item.key" 
      class="zc-el-radio"
    >{{ item.name }}</el-radio>
  </el-radio-group>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const props = defineProps<{
    radios: {key: string, name: string}[],
    defaultRadio?: string
  }>();

  const emit = defineEmits(['change']);

  const radio = ref(props.defaultRadio)

  const radioChange = () => emit('change', radio.value);

  defineExpose({
    changeValue(v: string) {
      radio.value = v;
    }
  })

</script>


<style lang="scss" scoped>
  .zc-radio-group-con {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .zc-el-radio {
      margin: 0;
    }
  }
</style>
