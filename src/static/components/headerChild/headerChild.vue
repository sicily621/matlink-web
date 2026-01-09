<template>
  <div class="header">
    <div class="test">
      <span class="item" v-if="title"></span>
      <span class="header-child-title fz24">{{ title }}</span>
    </div>
    <template v-if="!hiddenButtonFlag">
      <el-button
        :type="'primary'"
        class="fz14 test new_create"
        v-if="!isEdit"
        @click="create"
        >{{ crateBtnWord || $t("common.create") }}</el-button>
      <div v-if="isEdit">
        <el-button  class="fz14 save" v-if="!hiddenSave" :type="'primary'" @click="save">{{
          $t("common.save")
        }}</el-button>
        <el-button
            v-if="prevPage"
            class="fz14 next"
            :type="'primary'"
            @click="prev"
        >{{ $t("common.prev") }}</el-button>
        <el-button
          v-if="nextPage"
          class="fz14 next"
          :type="'primary'"
          @click="next"
          >{{ $t("common.next") }}</el-button>
        <el-button
          class="fz14 newCreate"
          :type="'primary'"
          v-if="showNewButton"
          @click="newCreate"
        >
          {{ $t("common.newCreate") }}
        </el-button>
        <el-button  class="fz14 back" :type="'primary'" @click="back">{{
          $t("common.back")
        }}</el-button>
      </div>
    </template>
    <template v-if="customButtons && customButtons.length">
      <div>
        <el-button v-for="(item, index) of customButtons" class="fz14 save" :type="'primary'" @click="customButtonChange(index)">{{ item }}</el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
export interface HanderChildProp {
  title: string;
  isEdit?: boolean;
  prevPage?:boolean;
  nextPage?: boolean;
  hiddenButtonFlag?: boolean;
  crateBtnWord?: string;
  customButtons?: string[];
  showNewButton?: boolean;
  hiddenSave?: boolean;
  create?: ((evt: MouseEvent) => any) | undefined;
  save?: ((evt: MouseEvent) => any) | undefined;
  prev?: ((evt: MouseEvent) => any) | undefined;
  back?: ((evt: MouseEvent) => any) | undefined;
  next?: ((evt: MouseEvent) => any) | undefined;
  newCreate?: ((evt: MouseEvent) => any) | undefined;
}

const emits = defineEmits(['customButtonChange']);
const customButtonChange = (index: number) => {
  emits('customButtonChange', index);
}

defineProps<HanderChildProp>();
</script>
<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.header {
  width: 100%;
  height: 8%;
  @include headerBackground;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--el-color-white);
  margin-bottom: zrem(4);
  .test:nth-child(1) {
    margin-left: zrem(15);
    display: flex;
    .item {
      width: zrem(6);
      height: zrem(20);
      background-color: var(--el-color-primary);
      margin: auto;
    }
    .header-child-title {
      text-align: center;
      line-height: zrem(60);
      margin-left: zrem(20);
      font-size: zrem(18);
    }
  }

  .new_create {
    margin-right: zrem(30);
  }
  .save {
    margin-right: zrem(20);
  }
  .prev {
    margin-right: zrem(20);
  }
  .back {
    margin-right: zrem(20);
  }
  .next {
    margin-right: zrem(30);
  }
  .newCreate {
    margin-right: zrem(30);
  }
}
</style>
