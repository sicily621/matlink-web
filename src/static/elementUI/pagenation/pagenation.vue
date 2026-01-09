<!-- {{ $t('elementUI.pagenation.title') }} -->
<template>
  <div class="box">
    <div class="pagenation left">
      <el-pagination
        v-bind="paginationProps"
        @current-change="handleCurrentChange"
      />

      <el-button size="small" @click="firstPage">{{ $t('elementUI.pagenation.firstPage') }}</el-button>
      <el-button size="small" @click="prevPage">{{ $t('elementUI.pagenation.prevPage') }}</el-button>
      <span class="pagiantor-info">
        {{ $t('elementUI.pagenation.pageInfo', { currentPage, totalPage }) }}
      </span>
      <el-button size="small" @click="nextPage">{{ $t('elementUI.pagenation.nextPage') }}</el-button>
      <el-button size="small" @click="lastPage">{{ $t('elementUI.pagenation.lastPage') }}</el-button>
    </div>

    <div class="pagenation right">{{ $t('elementUI.pagenation.itemInfo', { currentItem, totalItem }) }}</div>
  </div>
</template>
  <script setup>
import { defineProps, ref, computed } from "vue";


const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const { pagination, pageSize, total } = props;
const currentPage = ref(1);
const currentItem = ref(1)
const totalPage = computed(() => {
  if (pageSize.value <= 0) return 1;
  return Math.ceil(total.value / pageSize.value);
});
const totalItem = computed(() => {
  if (pageSize.value <= 0) return 1;
  return Math.ceil(total.value / pageSize.value);
});
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPage.value) currentPage.value++;
};

const firstPage = () => {
  currentPage.value = 1;
};

const lastPage = () => {
  currentPage.value = totalPage.value;
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
};
</script>
<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;

.box {
  width: 100%;
  height:zrem(50);
  background-color: #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  el-button{
    height: zrem(50);
  }
}
</style>