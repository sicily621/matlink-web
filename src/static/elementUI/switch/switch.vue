<template>
  <el-switch
    v-model="value"
    :style="{'--el-switch-on-color': theme.activeColor,'--el-switch-off-color': theme.inactiveColor}"
    @change="swtichHandler"
    :inline-prompt="inlinePrompt"
    :active-icon="icon && icon.active"
    :inactive-icon="icon && icon.inactive"
    :active-text="text && text.active"
    :inactive-text="text && text.inactive"
  />
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import useThemeStore from '../../js/store/theme';
  //存在icon时 text将无效
  const props = defineProps<{
    text?: {
      active: string,
      inactive: string
    },
    icon?: {
      active: string,
      inactive: string
    }
    inlinePrompt?: boolean,
    defaultValue?: boolean
  }>();

  //主题色
  const themeStore = useThemeStore();
  const theme: any = computed(() => themeStore.getTheme);

  const emits = defineEmits(['value']);


  //绑定输入框内容
  let value = ref(props.defaultValue || false);
  const swtichHandler = () => {
    emits('value', value.value);
  }

  const changeValue = (b: boolean) => {
    value.value = b; 
  }

  defineExpose({
    changeValue
  })
</script>