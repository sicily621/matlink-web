<template>
  <a-spin :spinning="state.loading" :tip="t('pdf.loading')" class="flex-1">
    <div class="pdf-preview">
      <div class="pdf-wrap">
        <vue-pdf-embed :page="state.pageNum" :source="state.source" :style="scaleFun" class="vue-pdf-embed" @loaded="handleDocumentLoad" />
      </div>
      <div class="page-tool">
        <div class="page-tool-item" @click="lastPage">{{ t('pdf.previousPage') }}</div>
        <div class="page-tool-item" @click="nextPage">{{ t('pdf.nextPage') }}</div>
        <div class="page-tool-item">
          {{ state.pageNum }}/{{ state.numPages }}
        </div>
        <div class="page-tool-item" @click="pageZoomOut">{{ t('pdf.zoomIn') }}</div>
        <div class="page-tool-item" @click="pageZoomIn">{{ t('pdf.zoomOut') }}</div>
        <div class="page-tool-item" @click="downloadPDF">{{ t('pdf.download') }}</div>
      </div>
    </div>
  </a-spin>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import VuePdfEmbed from "vue-pdf-embed";
import { reactive, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  source: {
    type: String,
    required: true,
  },
});

const state = ref({
  source: props.source, // 预览pdf文件地址
  pageNum: 1, //当前页面
  scale: 1, // 缩放比例
  numPages: 1, // 总页数
  loading: false,//加载效果
});
const scaleFun = computed(() => {
  return {
    width: "100vh", //按照pdf大约7：10的宽高比，对应80vh的高度，直接设置高度不生效
    // height: "80vh",
    transform: `scale(${state.value.scale})`,
  };
});
// 下载pdf
function downloadPDF() {
  fetch(encodeURI(props.source)).then((res) => {
    res.blob().then((myBlob) => {
      const href = URL.createObjectURL(myBlob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "report.pdf"; // 下载文件重命名，并指定文件扩展名为 ".pdf"
      document.body.appendChild(a); // 将<a>元素添加到文档中，以便进行点击下载
      a.click();
      document.body.removeChild(a); // 下载完成后移除<a>元素
    });
  });
}
state.value.loading = true; // 添加一个loading状态
function handleDocumentLoad({numPages}) {
  state.value.numPages = numPages
  state.value.loading = false; // 加载完成后将loading状态设置为false
}
onMounted(() => {
});
function lastPage() {
  if (state.value.pageNum > 1) {
    state.value.pageNum -= 1;
  }
}
function nextPage() {
  if (state.value.pageNum < state.value.numPages) {
    state.value.pageNum += 1;
  }
}
function pageZoomOut() {
  if (state.value.scale < 1) {
    state.value.scale += 0.1;
  } else {
    ElMessage({
      message: t('pdf.maxZoomReached'),
      type: "warning",
    });
  }
}
function pageZoomIn() {
  if (state.value.scale > 0.6) {
    state.value.scale -= 0.1;
  } else {
    ElMessage({
      message: t('pdf.minZoomReached'),
      type: "warning",
    });
  }
}
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;

.pdf-preview {
  position: relative;
  height: calc(100% - zrem(20));
  padding: zrem(20) 0;
  //box-sizing: border-box;
  background-color: var(--el-bg-color);
}

.pdf-wrap {
  height: 100%;
  overflow-y: auto;
}

.vue-pdf-embed {
  text-align: center;
  width: 100%;
  border: zrem(1) solid var(--el-bg-color);
  margin: 0 auto;
  box-sizing: border-box;
}

.page-tool {
  position: absolute;
  bottom: 35px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  background: var(--el-bg-color);
  color: var(--el-text-color);
  border-radius: 19px;
  z-index: 100;
  cursor: pointer;
  margin-left: 50%;
  transform: translateX(-50%);
}

.page-tool-item {
  padding: 8px 15px;
  padding-left: 10px;
  cursor: pointer;
}
</style>
