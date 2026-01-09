<template>
  <el-form
    class="zc-form"
    ref="form"
    v-if="model"
    :validate-on-rule-change="false"
    :model="model"
    :rules="rules"
    v-bind="$attrs"
  >
    <template v-for="(item, index) in options" :key="index">
      <el-form-item
        v-if="!item.children || !item.children!.length"
        :prop="item.prop"
        :label="item.label"
      >
        <component
          v-if="item.type !== 'upload' && item.type !== 'editor'"
          v-bind="item.attrs"
          :is="`el-${item.type}`"
          v-model="model[item.prop!]"
          :placeholder="item.placeholder"
        ></component>
        <el-upload
          v-if="item.type === 'upload'"
          v-bind="item.uploadAttrs"
          :on-preview="onPreview"
          :on-remove="onRemove"
          :on-success="onSuccess"
          :on-error="onError"
          :on-progress="onProgress"
          :on-change="onChange"
          :before-upload="beforeUpload"
          :before-remove="beforeRemove"
          :http-request="httpRequest"
          :on-exceed="onExceed"
          class="m-el-upload"
        >
          <slot name="uploadArea"></slot>
          <slot name="uploadTip"></slot>
        </el-upload>
        <div v-if="item.type === 'editor'" id="editor" class="editor">
          <div class="editorBorder">
            <!-- <Toolbar
              class="editorBorderBottom"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="item.value"
            />
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              :mode="item.value"
              @onCreated="handleCreated"
              @onChange="handleChange"
            /> -->
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="item.children && item.children.length"
        :prop="item.prop"
        :label="item.label"
      >
        <component
          v-bind="item.attrs"
          :is="`el-${item.type}`"
          v-model="model[item.prop!]"
          :placeholder="item.placeholder"
        >
          <component
            v-for="(child, i) in item.children"
            :key="i"
            :label="child.label"
            :value="child.value"
            :is="`el-${child.type}`"
          >
          </component>
        </component>
      </el-form-item>
    </template>

    <el-form-item>
      <slot name="action" :form="form" :model="model"></slot>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import type { UploadFile, UploadRawFile,UploadUserFile } from "element-plus";
import {
  PropType,
  ref,
  onMounted,
  watch,
  shallowRef,
  onBeforeUnmount,
} from "vue";
import { FormOptions, FormInstance } from "./types/type";
import cloneDeep from "lodash/cloneDeep";

//import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

let props = defineProps({
  //表单配置项
  options: {
    type: Array as PropType<FormOptions[]>,
    required: true,
  },
  // 用户自定义上传方法
  httpRequest: {
    type: Function as PropType<import("element-plus").UploadRequestHandler>,
  },
});

let emits = defineEmits([
  "on-preview",
  "on-remove",
  "on-success",
  "on-error",
  "on-progress",
  "on-change",
  "before-upload",
  "before-remove",
  "on-exceed",
]);
let model = ref<any>(null);
let rules = ref<any>(null);
let form = ref<FormInstance | null>();
let editorVal = ref("");
// const handleChange = (editor: any) => {
//   editorVal.value = editor.children[0].children[0].text;
//   console.log(editorVal.value);
// };
//初始化菜单
const initForm = () => {
  if (props.options && props.options.length) {
    let m: any = {};
    let r: any = {};
    props.options.map((item: FormOptions) => {
      m[item.prop!] = item.value;
      r[item.prop!] = item.rules;
      if (item.type === "editor") {
        watch(
          () => editorVal.value,
          () => {
            item.value = editorVal.value;
          }
        );
      }
    });
    model.value = cloneDeep(m);
    rules.value = cloneDeep(r);
  }
};
const resetFields = () => {
  //重置表单
  form.value!.resetFields();
  //重置editor
  editorVal.value = "";
};
//表单验证的方法
const validate = () => {
  return form.value!.validate;
};
//获取表单数据
const getFormData = () => {
  return model.value;
};
defineExpose({
  resetFields,
  validate,
  getFormData,
});
onMounted(() => {
  initForm();
});

watch(
  () => props.options,
  () => {
    initForm();
  },
  { deep: true }
);

// 上传组件的所有方法
let onPreview = (file: UploadFile) => {
  emits("on-preview", file);
};
let onRemove = (file: UploadFile, fileList: UploadFile[]) => {
  emits("on-remove", { file, fileList });
};
let onSuccess = (response: any, file: UploadFile, fileList: UploadFile[]) => {
  // 上传图片成功 给表单上传项赋值
  let uploadItem = props.options.find((item) => item.type === "upload")!;
  model.value[uploadItem.prop!] = { response, file, fileList };
  emits("on-success", { response, file, fileList });
};
let onError = (err: any, file: UploadFile, fileList: UploadFile[]) => {
  emits("on-error", { err, file, fileList });
};
let onProgress = (event: any, file: UploadFile, fileList: UploadFile[]) => {
  emits("on-progress", { event, file, fileList });
};
let onChange = (file: UploadFile, fileList: UploadFile[]) => {
  emits("on-change", { file, fileList });
};
let beforeUpload = (file: UploadRawFile) => {
  emits("before-upload", file);
  return true;
};
let beforeRemove = (file: UploadFile, fileList: UploadFile[]) => {
  emits("before-remove", { file, fileList });
  return true; // or add your own logic to return true/false or a Promise<boolean>
};

let onExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
  emits("on-exceed", { files, uploadFiles });
};
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
// const valueHtml = ref("<p>hello</p>");

// const toolbarConfig = {};
// const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// const handleCreated = (editor: any) => {
//   editorRef.value = editor; // 记录 editor 实例，重要！
// };
</script>

<style scoped lang="scss">
.el-upload {
  flex-direction: column !important;
}
</style>
