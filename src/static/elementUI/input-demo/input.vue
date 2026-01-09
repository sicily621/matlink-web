<template>
  <!-- 
    element组件外套一层自己的标签自己的类名 
    1.宽高设置为百分百 不同页面使用时要求宽高不一
    2.安全的修改样式 防止多个开发者修改同样的element.style.class,产生样式覆盖
   -->
  <div class="zc-el-input-con flex-center">
    <!-- 使用t-active-color类型修改字体颜色 类名在webapps/static/css/theme下已定义好-->
    <!-- 使用theme.background更改label背景 -->
    <label 
      class="zc-el-label m-r-10 t-active-color" 
      :for="id"
      :style="{'background': theme.background}"
    >{{ label }}:</label>
    <el-input 
      :id="id" 
      class="zc-el-input" 
      v-model="input" 
      :placeholder="placeholder"
      @input="inputHandler()"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getTheme } from '../../js/theme/themes';
  /**
   * @label @placeholder 
   * 涉及到i18n的传值进来 
   * 因为每个项目的i18n不同 有的项目可能不需要i18n 
   * 不要直接用这种写法: <el-input :placeholder="$t('定义好的jsonKey')"/>
   * @id 
   */
  defineProps<{
    placeholder: string;
    label: string;
    id?: string;
  }>();
  const emit = defineEmits(['input']);
  //绑定输入框内容
  const input = ref('');
  //input emit 延迟
  let timer: any = null;
  //这里不用写类型 ts会自动类型推论Theme类型
  const theme:any = getTheme();

  //用户输入停止后再进行emit 
  //不要进行多余的操作 之和父组件进行传值即可
  const inputHandler = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      emit('input', input.value);
    }, 400);
  }
</script>

<style scoped lang="scss">
@use '@static/css/common/size.scss' as *; //引入size.scss文件使用rem函数 使用定制化字体大小
  .zc-el-input-con {
    width: 100%;
    height: 100%;
    .zc-el-label {
      font-size: zrem(14);
    }
    //使用var(--定义好的变量名)函数获取定义好的主题色
    .zc-el-input {
      // background: var(--background); //在这里更改无效 那就去 ../theme/update-element.scss里更改
      flex: 1;
    }
  }
</style>
