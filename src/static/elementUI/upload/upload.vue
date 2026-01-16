<template>
  <div class="z-el-upload-con">
    <div
      class="preview-item"
      :class="{ 'preview-error': noValidateFlag }"
      :style="imgStyle"
      v-if="!type && !imgBtn"
    >
      <template v-if="!themeImgFlag">
        <img v-if="fileObj && fileObj.url" :src="fileObj.url" />
        <img v-if="(!fileObj || !fileObj.url) && imgPath" :src="imgPath" />
      </template>
      <template v-if="themeImgFlag">
        <ThemeImg
          :fullFlag="true"
          v-if="fileObj && fileObj.url"
          :src="fileObj.url"
          :width="width ?? 0"
          :height="height ?? 0"
        />
        <ThemeImg
          :fullFlag="true"
          v-if="(!fileObj || !fileObj.url) && imgPath"
          :src="imgPath"
          :width="width ?? 0"
          :height="height ?? 0"
        />
      </template>
    </div>

    <div
      v-if="type === 'video'"
      class="preview-item"
      :style="imgStyle"
      :class="{ 'preview-error': noValidateFlag }"
    >
      <video v-if="fileObj && fileObj.url" :src="fileObj.url" controls></video>
      <video
        v-if="(!fileObj || !fileObj.url) && imgPath"
        :src="imgPath"
        controls
      ></video>
    </div>

    <el-upload
      :style="imgBtn ? imgStyle : {}"
      :before-upload="beforeUpload"
      :http-request="httpRequestFunc"
      :accept="accept"
      :disabled="disabled"
    >
      <el-button
        v-if="!imgBtn"
        class="upload-btn"
        size="small"
        type="primary"
        >{{ $t("elementUI.upload.upload") }}</el-button
      >
      <div
        class="preview-item2"
        :class="{ 'preview-error': noValidateFlag }"
        :style="imgStyle"
        v-if="imgBtn"
      >
        <template v-if="!themeImgFlag">
          <img v-if="fileObj && fileObj.url" :src="fileObj.url" />
          <img v-if="(!fileObj || !fileObj.url) && imgPath" :src="imgPath" />
        </template>
        <template v-if="themeImgFlag">
          <ThemeImg
            :fullFlag="true"
            v-if="fileObj && fileObj.url"
            :src="fileObj.url"
            :width="width ?? 0"
            :height="height ?? 0"
          />
          <ThemeImg
            :fullFlag="true"
            v-if="(!fileObj || !fileObj.url) && imgPath"
            :src="imgPath"
            :width="width ?? 0"
            :height="height ?? 0"
          />
        </template>
      </div>
    </el-upload>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import ThemeImg from "../../components/themeImg/themeImg.vue";
const { t } = useI18n();
const httpRequestFunc: any = () => {};
const props = defineProps<{
  imgPath?: string;
  imgStyle?: any;
  type?: string;
  noValidateFlag?: boolean;
  imgBtn?: boolean;
  noSizeLimitFlag?: boolean;
  accept?: string;
  disabled?: boolean;
  themeImgFlag?: boolean;
  width?: number;
  height?: number;
}>();
const emits = defineEmits(["fileChange"]);
const fileObj = ref<any>({});
const beforeUpload = (file: File) => {
  const promise = new Promise((resolve, reject) => {
    if (!props.noSizeLimitFlag && file.size / 1024 / 1204 > 10) {
      ElMessage.error(t("elementUI.upload.fileSizeLimit"));
      return reject();
    }
    if (props.accept) {
      const fileType = file.name.split(".")[1];
      const fileAccept = file.type.split("/")[0];
      if (
        props.accept.indexOf(fileType) === -1 &&
        fileAccept != props.accept.split("/")[0]
      ) {
        ElMessage.error(t("elementUI.upload.fileFormatError"));
        return reject();
      }
    }
    fileObj.value = {
      name: file.name,
      url: URL.createObjectURL(file),
    };
    emits("fileChange", file);
    resolve(null);
  });
  return promise.then(() => true).catch(() => false);
};
const reloadFile = () => {
  fileObj.value = {};
};
watch(
  () => props.imgPath,
  () => {
    fileObj.value = {};
  }
);
defineExpose({
  reloadFile,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.z-el-upload-con {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  .preview-item {
    width: zrem(75);
    height: zrem(75);
    border: 1px solid var(--el-border-color);
    margin-right: zrem(10);
    transition: 0.4s;
    img {
      width: 100%;
      height: 100%;
    }
    video {
      width: 100%;
      height: 100%;
    }
  }
  .preview-item2 {
    width: zrem(75);
    height: zrem(75);
    border: 1px solid var(--el-border-color);
    transition: 0.4s;
    font-size: 0;
    margin: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .preview-error {
    border: 1px solid var(--el-color-danger);
  }
  .upload-btn {
    width: zrem(64);
    height: zrem(32);
  }
}
::v-deep .el-upload-list {
  display: none;
}
</style>
