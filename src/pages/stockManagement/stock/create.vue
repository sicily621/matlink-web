<template>
  <div class="d-flex h-full w-full flex-1">
    <div class="flex-1 flex-column h-full fill-bg">
      <el-form
        class="d-flex flex-1 create-content h-full merchant"
        ref="formRef"
        :model="form"
        label-width="120px"
        label-position="top"
        :rules="formRules"
      >
        <div class="create-left">
          <el-form-item
            class="from_item"
            :label="i18nM('material.label.name')"
            prop="name"
            required
            maxlength="32"
          >
            <el-input
              maxlength="32"
              v-model="form.name"
              :placeholder="i18nM('material.placeholder.name')"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="from_item m-t-30 d-flex"
            :label="i18nM('material.label.type')"
            prop="typeId"
            required
          >
            <el-select
              v-model="form.typeId"
              :placeholder="i18nM('material.placeholder.selectTypes')"
              @change="typeChange($event)"
              class="m-l-20 w-200"
              clearable
              required
            >
              <el-option
                v-for="item of typeOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
            <el-button class="m-l-20" :type="'primary'" @click="add">
              <img :src="AddIcon" width="16" height="16" class="el-icon" />
              <span>{{ i18nM("material.button.add") }}</span>
            </el-button>
          </el-form-item>
          <el-form-item
            class="from_item"
            :label="i18nM('material.label.notes')"
            prop="notes"
            maxlength="64"
          >
            <el-input
              :placeholder="i18nM('material.placeholder.inputDescription')"
              maxlength="64"
              v-model="form.notes"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div
        class="zc-footer d-flex align-items-center justify-content-end create-footer"
      >
        <el-button :type="'primary'" class="m-r-16 w-80" @click="save">{{
          i18nM("operating.button.save")
        }}</el-button>
        <el-button :type="'primary'" class="m-r-16 w-80" @click="back">{{
          i18nM("operating.button.back")
        }}</el-button>
      </div>
    </div>
  </div>
  <zModel
    ref="modelRef"
    :customModelTitle="i18nM('operating.title.addType')"
    @confirm="modelConfirm()"
    :style="{ width: zrem(800), height: zrem(700) }"
    :noConfirmBtnFlag="true"
  >
    <div class="h-full d-flex flex-column zc-content-con">
      <div class="zc-header d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <div class="zc-header-title">
            <div class="zc-header-word">
              <el-form
                ref="formTypeRef"
                :model="formType"
                label-width="60px"
                label-position="left"
                :rules="formTypeRules"
                class="d-flex m-t-20"
              >
                <el-form-item
                  class="from_item m-l-20"
                  :label="i18nM('material.label.name')"
                  prop="name"
                  required
                  maxlength="32"
                >
                  <el-input
                    maxlength="32"
                    v-model="formType.name"
                    :placeholder="i18nM('material.placeholder.name')"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  class="from_item m-l-60"
                  :label="i18nM('material.label.description')"
                  prop="description"
                  maxlength="64"
                >
                  <el-input
                    maxlength="64"
                    v-model="formType.description"
                    :placeholder="
                      i18nM('material.placeholder.inputDescription')
                    "
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <el-button class="m-r-20" :type="'primary'" @click="typeSave">
            <span>{{ i18nM("material.button.save") }}</span>
          </el-button>
        </div>
      </div>

      <div class="zc-base p-l-20 p-r-20 d-flex flex-column">
        <div ref="tableRef" class="table-wrap m-t-20">
          <baseTable
            border
            :columns="columns"
            :table-data="tableData"
            :row-key="(row: any) => row.id"
          >
            <template #operate="scope">
              <el-icon
                class="fz20 m-r-20 pointer"
                @click="editType(scope.scope)"
              >
                <Edit />
              </el-icon>

              <el-icon class="fz20 pointer" @click="deleteType(scope.scope)">
                <Delete />
              </el-icon>
            </template>
          </baseTable>
        </div>
      </div>
      <div class="test-button">
        <el-button
          class="m-r-20 m-t-10"
          :type="'primary'"
          @click="modelConfirm"
        >
          <span>{{ i18nM("material.button.back") }}</span>
        </el-button>
      </div>
    </div>
  </zModel>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { zrem } from "@static/js/theme/zrem";
import { UploadType } from "@static/js/common/enum";
import {
  ref,
  reactive,
  onMounted,
  watch,
  shallowRef,
  onBeforeUnmount,
  computed,
} from "vue";

import baseTable from "@static/table/baseTable/baseTable.vue";
import {
  materialStockTypeSave,
  findStockTypeList,
  materialStockTypeDelete,
} from "@functions/serviceCenter/material-management/api/materialStockType";
import { materialStockSave } from "@functions/serviceCenter/material-management/api/materialStock";

import AddIcon from "@static/images/add.png";
import zModel from "@static/components/zModel/zModel.vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { ComponentPropsType } from "@static/js/page/props";

import "@wangeditor/editor/dist/css/style.css";
import { marked } from "marked";
const typeName = ref();
const typeDescription = ref();
const typeId = ref();
const typeOptions = ref<any>([]);
const columns = computed(() => [
  {
    prop: "index",
    label: i18nM("material.table.index"),
    type: 1,
    width: "100%",
  },
  { prop: "name", label: i18nM("material.table.name") },
  { prop: "description", label: i18nM("material.table.description") },
  { prop: "operate", label: i18nM("material.table.operate"), type: 2 },
]);
const tableRef = ref();
const tableData = ref<any>([]);
const i18nM = window.$i18nM;
const formRef = ref();
const formTypeRef = ref();
const modelRef = ref();
const editTypeId = ref();
const isActive = ref<boolean>();
const typeNameInput = () => {};

const projectId = ref(
  String(window.$HyGlobal.getCurrentProject()?.projects?.[0]?.projectId) || ""
);

const getStartOfDay = (daysOffset: number): string => {
  const now = new Date();
  now.setDate(now.getDate() + daysOffset);
  now.setHours(0, 0, 0, 0);
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 月份从0开始，所以需要加1
  const date = now.getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(
    2,
    "0"
  )} 00:00:00`;
};
const startDate = ref<string>(getStartOfDay(-7));
const endDate = ref<string>(getStartOfDay(0));

const timestampStart = ref<number>(
  new Date(getStartOfDay(-7)).getTime() / 1000
);
const timestampEnd = ref<number>(new Date(getStartOfDay(0)).getTime() / 1000);
const props = defineProps<{
  info: any;
  parentId: any;
  projectId: any;
  save: () => void;
  back: () => void;
}>();

// const props = defineProps<ComponentPropsType>();

const form = reactive({
  name: "",
  notes: "",
  typeId: "",
});
const formType = reactive({
  name: "",
  description: "",
});
// 表单校验信息
const formRules = reactive({
  name: [{ required: true, message: i18nM("material.placeholder.name") }],
  typeId: [
    { required: true, message: i18nM("material.placeholder.selectTypes") },
  ],
});
const formTypeRules = reactive({
  name: [
    {
      required: true,
      message: i18nM("material.placeholder.name"),
      trigger: "blur",
    },
  ],
});
const emits = defineEmits(["back", "save"]);

// const renderedMarkdown = computed(() => marked(valueHtml.value));
const valueHtml = ref("");

const renderedMarkdown = computed(() => {
  const html = marked(valueHtml.value);
  // 移除所有HTML标签
  return html.replace(/<[^>]*>/g, "");
});
const editorRef = shallowRef();
const typeChange = (item: any) => {
  form.typeId = item;
};
const add = () => {
  modelRef.value.openCustomModel();
  getTableData();
};
const getTableData = () => {
  findStockTypeList(
    {
      projectId: props?.projectId,
    },
    (res: any) => {
      tableData.value = res.data;
      typeOptions.value = res.data;
    }
  );
};
const editType = (scope: any) => {
  editTypeId.value = scope.row.id;
  formType.name = scope.row.name;
  formType.description = scope.row.description;
};
const deleteType = (scope: any) => {
  ElMessageBox.confirm(
    i18nM("material.modal.confirmDeleteMaterialStockType"),
    i18nM("material.title.deleteMaterialStockType"),
    {
      confirmButtonText: i18nM("material.button.delete"),
      confirmButtonClass: "w-80",
      cancelButtonText: i18nM("material.button.cancel"),
      cancelButtonClass: "message-box-cancel-btn w-80",
      type: "warning",
    }
  )
    .then(() => {
      materialStockTypeDelete({ id: scope.row.id }, (res: any) => {
        if (res.code) {
          ElMessage({
            type: "success",
            message: i18nM("material.message.deleteMaterialStockTypeSuccess"),
          });
          getTableData();
        } else {
          ElMessage({
            type: "info",
            message: i18nM("material.message.deleteMaterialStockTypeFailed"),
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: i18nM("material.message.cancelDelete"),
      });
    });
};
const modelConfirm = () => {
  modelRef.value.closeCustomModel();

  modelRef.value.validate((valid: boolean) => {
    if (valid) {
      // if (form2.value.id) {
      //   technicalDocumentsPut(
      //     {
      //       brandNo: form.value.brandNo,
      //       modelNo: form.value.modelNo,
      //       file: form2.value.file,
      //       projectId: projectId.value,
      //       fileTypeId: form2.value.type,
      //       typeId: form2.value.typeId,
      //       fileName: form2.value.fileName,
      //       id: form2.value.id,
      //     },
      //     () => {
      //       ElMessage({
      //         type: "success",
      //         message: i18nM("graph.message.updateTechnicalDocumentsSuccess"),
      //       });
      //       getTechnicalList();
      //       modelRef.value.closeCustomModel();
      //     }
      //   );
      // } else {
      //   technicalDocumentsForm(
      //     {
      //       brandNo: form.value.brandNo,
      //       modelNo: form.value.modelNo,
      //       file: form2.value.file,
      //       projectId: projectId.value,
      //       fileTypeId: form2.value.type,
      //       typeId: form2.value.typeId,
      //       fileName: form2.value.fileName,
      //     },
      //     () => {
      //       ElMessage({
      //         type: "success",
      //         message: i18nM("graph.message.createTechnicalDocumentsSuccess"),
      //       });
      //       getTechnicalList();
      //       modelRef.value.closeCustomModel();
      //     }
      //   );
      // }
    }
  });
};
//编辑
if (props.info.id) {
  form.name = props.info.name;
  form.notes = props.info.description;
  form.typeId = props.info.typeId;

  // startDate.value = "2025-08-08 11:11";
}

const fileChange = (file: File) => {
  form.file = file;
  form.fileName = file.name;
};

const typeSave = () => {
  let obj: any = {
    name: formType.name,
    projectId: props?.projectId,
    description: formType.description,
  };
  const sameName = tableData.value.some(
    (item: any) => item.name === formType.name
  );

  formTypeRef.value.validate((valid: boolean) => {
    if (valid) {
      if (editTypeId.value) {
        materialStockTypeSave({ ...obj, id: editTypeId.value }, () => {
          getTableData();

          ElMessage({
            type: "success",
            message: i18nM("material.message.updateSuccess"),
          });

          formType.name = "";
          formType.description = "";
          editTypeId.value = "";
        });
      } else {
        if (!sameName) {
          materialStockTypeSave(obj, () => {
            getTableData();

            ElMessage({
              type: "success",
              message: i18nM("material.message.saveSuccess"),
            });
            formType.name = "";
            formType.description = "";
            editTypeId.value = "";
          });
        } else {
          ElMessage({
            type: "info",
            message: i18nM("material.message.typeExists"),
          });
        }
      }
    }
  });
};

const confirmSave = (cb: Function) => {
  const obj: any = {
    projectId: props?.projectId,
    name: form.name,
    description: form.notes,
    typeId: form.typeId,
    parentId: props.parentId || null,
  };
  if (props.parentId) obj.parentId = props.parentId;
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (props.info?.id) {
        materialStockSave({ ...obj, id: props.info.id }, () => {
          cb();
          ElMessage({
            type: "success",
            message: i18nM("operating.message.updateSuccess"),
          });
        });
      } else {
        materialStockSave(obj, () => {
          cb();

          ElMessage({
            type: "success",
            message: i18nM("operating.message.saveSuccess"),
          });
        });
      }
    } else {
      ElMessage({
        type: "error",
        message: i18nM("operating.error.fillCompleteInfo"),
      });
    }
  });
};
onMounted(() => {
  getTableData();
});
defineExpose({
  confirmSave,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.zc-base {
  height: calc(100% - zrem(80));
  max-height: calc(100% - zrem(80));
}
.test-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.merchant {
  padding: zrem(20);
  box-sizing: border-box;
}
.create-content {
  display: flex;
  height: 100%;
  .create-left {
    width: 33%;
  }
  .create-middle {
    width: 33%;
  }
  .create-right {
    width: 33%;
    height: 100%;
    margin: zrem(40);
    .create-right-box {
      width: zrem(375);
      height: zrem(600);

      max-height: zrem(600);
      max-width: zrem(335);
      margin: zrem(20) zrem(0) zrem(0) zrem(20);
      overflow-y: auto;
      // background-color: red;
    }
    .preview {
      color: var(--el-label-text-color);
      font-size: zrem(16);
      color: #000;
    }

    .option-large-list {
      border: zrem(1) solid var(--el-border-color-lighter);
      padding: zrem(20) zrem(10);
      border-radius: zrem(8);
      box-sizing: border-box;
      width: 100%;
      height: zrem(350);
      .el-tag.is-closable {
        height: zrem(32);
        font-size: zrem(14);
      }
    }
  }
}

:deep .el-dialog {
  height: 60% !important;
  .el-dialog__body {
    height: 93%;
  }
}
#editor—wrapper {
  border: zrem(1) solid var(--el-border-color-lighter);
  z-index: 100; /* 按需定义 */
}

.shopDialog {
  .el-form {
    height: 90%;
    :deep .shopList {
      height: 55%;
      .el-form-item__content {
        height: 100% !important;
      }
      .shop-list {
        border: zrem(1) solid var(--el-border-color-lighter);
        padding: zrem(10);
        border-radius: zrem(8);
        box-sizing: border-box;
        width: zrem(400);
        height: 100%;
        overflow: hidden;
      }
    }
  }
}
.zc-content-con {
  width: 100%;
  height: 100% !important;
  .zc-content: {
    // height: 90%;
  }
}
.merchantTypeTable {
  height: 80%;
  overflow: hidden;
}
</style>
