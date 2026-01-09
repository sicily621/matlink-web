<template>
  <div class="flex-1 flex-column">
    <div class="m-l-20 m-t-16 w-full">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">
          {{ i18nM("material.title.materialInfo") }}
        </div>
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="d-flex relative w-full m-t-20"
        label-width="120px"
      >
        <div class="d-flex">
          <div class="w-296 m-r-30">
            <el-form-item
              :label="i18nM('material.label.materialCategory')"
              prop="materialCategory"
            >
              <el-tree-select
                v-model="form.materialCategory"
                :placeholder="
                  i18nM('material.placeholder.selectMaterialCategory')
                "
                :data="typeOptions"
                check-strictly
                :render-after-expand="true"
                :props="selectProps"
                @change="changeType($event)"
              />
            </el-form-item>
            <el-form-item :label="i18nM('material.label.code')" prop="code">
              <el-input
                v-model="form.code"
                class="flex-1"
                :placeholder="i18nM('material.placeholder.inputCode')"
                maxlength="32"
                required
              >
              </el-input>
            </el-form-item>
            <el-form-item :label="i18nM('material.label.name')" prop="name">
              <el-input
                v-model="form.name"
                class="flex-1"
                :placeholder="i18nM('material.placeholder.name')"
                maxlength="32"
                required
              >
              </el-input>
            </el-form-item>

            <el-form-item
              :label="i18nM('material.label.abbreviation')"
              prop="abbreviation"
            >
              <el-input
                v-model="form.abbreviation"
                class="flex-1"
                :placeholder="i18nM('material.placeholder.inputAbbreviation')"
                maxlength="16"
                required
              >
              </el-input>
            </el-form-item>
            <el-form-item :label="i18nM('material.label.brand')" prop="brand">
              <el-input
                v-model="form.brand"
                class="flex-1"
                :placeholder="i18nM('material.placeholder.inputBrand')"
                maxlength="32"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="i18nM('material.label.specifications')"
              prop="specifications"
            >
              <el-input
                v-model="form.specifications"
                class="flex-1"
                :placeholder="i18nM('material.placeholder.inputSpecifications')"
                maxlength="64"
                required
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="w-296 m-l-80 m-r-30">
            <el-form-item :label="i18nM('material.label.model')" prop="model">
              <el-input
                v-model="form.model"
                class="flex-1"
                :placeholder="i18nM('material.placeholder.inputModel')"
                maxlength="32"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="i18nM('material.label.barcode')"
              prop="barcode"
            >
              <el-input
                v-model="form.barcode"
                class="flex-1"
                :placeholder="i18nM('material.placeholder.inputBarcode')"
                maxlength="64"
                required
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="i18nM('material.label.referencePurchasePrice')"
              prop="referencePurchasePrice"
            >
              <el-input
                v-model="form.referencePurchasePrice"
                class="flex-1"
                :placeholder="
                  i18nM('material.placeholder.inputReferencePurchasePrice')
                "
                required
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="i18nM('material.label.referenceSellingPrice')"
              prop="referenceSellingPrice"
            >
              <el-input
                v-model="form.referenceSellingPrice"
                class="flex-1"
                :placeholder="
                  i18nM('material.placeholder.inputReferenceSellingPrice')
                "
                required
              >
              </el-input>
            </el-form-item>

            <el-form-item
              :label="i18nM('material.label.minimumInventory')"
              prop="minimumInventory"
            >
              <el-input
                v-model="form.minimumInventory"
                class="flex-1"
                :placeholder="
                  i18nM('material.placeholder.inputMinimumInventory')
                "
                required
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="i18nM('material.label.maximumInventory')"
              prop="maximumInventory"
            >
              <el-input
                v-model="form.maximumInventory"
                class="flex-1"
                :placeholder="
                  i18nM('material.placeholder.inputMaximumInventory')
                "
                required
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="w-296 m-l-80 m-r-30">
            <el-form-item
              :label="i18nM('material.label.safetyInventory')"
              prop="safetyInventory"
            >
              <el-input
                v-model="form.safetyInventory"
                class="flex-1"
                :placeholder="
                  i18nM('material.placeholder.inputSafetyInventory')
                "
                required
              >
              </el-input>
            </el-form-item>

            <el-form-item
              :label="i18nM('material.label.unit')"
              prop="unit"
              required
            >
              <el-select
                v-model="form.unit"
                :placeholder="$t('material.placeholder.selectUnit')"
                class="m-r-10 flex-1"
              >
                <el-option
                  v-for="item of unitOptions"
                  :key="item.id"
                  :value="item.id"
                  :label="item.cnname"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              prop="status"
              class="flex-1"
              :label="i18nM('material.label.status')"
            >
              <el-switch
                class="switch"
                v-model="form.status"
                @change="handleSwitchChange"
                inline-prompt
                :active-value="1"
                :active-text="i18nM('material.button.enable')"
                :inactive-text="i18nM('material.button.disable')"
              />
            </el-form-item>

            <el-form-item :label="i18nM('material.label.origin')" prop="origin">
              <el-input
                v-model="form.origin"
                class="flex-1"
                :placeholder="i18nM('material.placeholder.inputOrigin')"
                maxlength="32"
                required
              >
              </el-input>
            </el-form-item>
            <el-form-item :label="i18nM('material.label.remark')" prop="remark">
              <el-input
                v-model="form.remark"
                class="flex-1"
                :placeholder="i18nM('material.placeholder.inputRemark')"
                maxlength="64"
                required
              >
              </el-input>
            </el-form-item>

            <el-form-item
              :label="i18nM('material.label.picture')"
              label-width="200"
              class="d-flex"
            >
              <Upload
                class="m-r-10"
                @fileChange="fileImgChange($event, 1)"
                :imgBtn="true"
                :imgPath="imgUrls.img1"
                :accept="UploadType.commonImg"
              ></Upload>
              <Upload
                class="m-r-10"
                @fileChange="fileImgChange($event, 2)"
                :imgBtn="true"
                :imgPath="imgUrls.img2"
                :accept="UploadType.commonImg"
              ></Upload>
              <Upload
                class="m-r-10"
                @fileChange="fileImgChange($event, 3)"
                :imgBtn="true"
                :imgPath="imgUrls.img3"
                :accept="UploadType.commonImg"
              ></Upload>
            </el-form-item>
          </div>
        </div>
        <div class="code-wrap" v-if="codeShow">
          <qrcode-vue
            :value="codeValue"
            :level="level"
            :render-as="renderAs"
            :size="size"
          />
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import Upload from "@static/elementUI/upload/upload.vue";
import { zrem } from "@static/js/theme/zrem";
import { UploadType } from "@static/js/common/enum";
import { findTree } from "@functions/serviceCenter/material-management/api/classCatalog";
import { materialUnitFindPage } from "@functions/serviceCenter/material-management/api/materialUnit";
import { materialSave } from "@functions/serviceCenter/material-management/api/material";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { ElMessage } from "element-plus";
import QrcodeVue from "qrcode.vue";

const projectId = ref();
const selectProps = { value: "id", label: "name" };

const props = defineProps<{
  data: any;
  projectId: string | number;
  deptId: string | number;
  classificationId: string | number;
}>();
const i18nM = window.$i18nM;
const formRef = ref();
const isEnable = ref(1);

//表单
const form = ref<any>({
  projectId: props?.projectId,
  name: "",
  code: "",
  materialCategory: "",
  abbreviation: "",
  category: "",
  brand: "",
  model: "",
  specifications: "",
  safetyQuantity: "",
  minimumStock: "",
  barcode: "",
  referencePurchasePrice: "0.00",
  referenceSellingPrice: "0.00",
  minimumInventory: "0",
  maximumInventory: "0",
  safetyInventory: "0",
  origin: "",
  remark: "",
  unit: "",
  status: 1,
  images: [],
  image_file: null,
});
const imgUrls = ref<any>({
  img1: "",
  img2: "",
  img3: "",
  imgFile1: null,
  imgFile2: null,
  imgFile3: null,
});
const fileImgChange = (e: any, index: number) => {
  imgUrls.value[`imgFile${index}`] = e;
};
//二维码
const codeValue = ref("");
const codeShow = ref(true);
const level = ref<Level>("M");
const renderAs = ref<RenderAs>("svg");
const size = ref(120);
codeShow.value = !!props?.data?.code;
codeValue.value = props?.data?.code;
// JSON.stringify(
// code: props?.data?.code,
// type: 3,
// );
if (props.data) {
  form.value.materialCategory = props.data.tradeTypeId;
  form.value.name = props.data.name;
  form.value.abbreviation = props.data.simpleName;
  form.value.code = props.data.code;
  form.value.specifications = props.data.specification;
  form.value.unit = props.data.unit;
  form.value.status = props.data?.status ? 1 : 0;
  form.value.brand = props.data.brand;
  form.value.model = props.data.modelNo;
  form.value.origin = props.data.producingArea;
  form.value.remark = props.data.description;
  form.value.minimumInventory = props.data.minCountLimit;
  form.value.maximumInventory = props.data.maxCountLimit;
  form.value.safetyInventory = props.data.safeCountLimit;
  form.value.referenceSellingPrice = props.data.suggestedCostPrice;
  form.value.referencePurchasePrice = props.data.suggestedPurchasPrice;
  form.value.barcode = props.data.barcode;
  imgUrls.value.img1 = props.data?.imageDtos[0]?.imagePath;
  imgUrls.value.img2 = props.data?.imageDtos[1]?.imagePath;
  imgUrls.value.img3 = props.data?.imageDtos[2]?.imagePath;
}
if (props.classificationId) {
  form.value.materialCategory = props.classificationId;
}
const changeType = (val: any) => {
  form.value.materialCategory = val;
};
const handleSwitchChange = (e: any) => {
  if (e == 1) {
  } else {
    isEnable.value = 0;
  }
};
const imageChange = (e: File) => {
  form.image_file = e;
};
const imageUrls = ref<string[]>([]);
const firstUpdateImg = ref(true);

const rules = reactive({
  name: [{ required: true, message: i18nM("material.placeholder.name") }],

  materialCategory: [
    {
      required: true,
      message: i18nM("material.placeholder.selectMaterialCategory"),
    },
  ],
  abbreviation: [
    {
      required: true,
      message: i18nM("material.placeholder.inputAbbreviation"),
    },
  ],
});
const typeOptions = ref<any[]>([]);
const sourceOptions = ref<any[]>([]);
const unitOptions = ref<any[]>([]);
// materialSave
const confirmSave = (cb: Function) => {
  const obj: any = {
    projectId: props?.projectId,
    tradeTypeId: form.value.materialCategory,
    name: form.value.name,
    simpleName: form.value.abbreviation,
    code: form.value.code,
    specification: form.value.specifications,
    unit: form.value.unit,
    status: form.value.status ? 1 : 0,
    brand: form.value.brand,
    modelNo: form.value.model,
    producingArea: form.value.origin,
    description: form.value.remark,
    minCountLimit: form.value.minimumInventory,
    maxCountLimit: form.value.maximumInventory,
    safeCountLimit: form.value.safetyInventory,
    suggestedCostPrice: form.value.referenceSellingPrice,
    suggestedPurchasPrice: form.value.referencePurchasePrice,
    barcode: form.value.barcode,
  };

  const formData: any = new FormData();
  Object.keys(obj).forEach((key) => {
    if (obj[key] != null) {
      formData.append(key, obj[key]);
    }
  });

  // props.data?.imageDtos[2]?.imagePath
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (props.data?.id) {
        if (imgUrls.value.imgFile1 && props.data?.imageDtos[0]) {
          formData.append(`images[0].file`, imgUrls.value.imgFile1);
          formData.append(`images[0].id`, props.data?.imageDtos[0]?.id);
        } else if (imgUrls.value.imgFile1) {
          formData.append(`images[0].file`, imgUrls.value.imgFile1);
        }
        if (imgUrls.value.imgFile2 && props.data?.imageDtos[1]) {
          formData.append(`images[1].file`, imgUrls.value.imgFile2);
          formData.append(`images[1].id`, props.data?.imageDtos[1]?.id);
        } else if (imgUrls.value.imgFile2) {
          formData.append(`images[1].file`, imgUrls.value.imgFile2);
        }
        if (imgUrls.value.imgFile3 && props.data?.imageDtos[2]) {
          formData.append(`images[2].file`, imgUrls.value.imgFile3);
          formData.append(`images[2].id`, props.data?.imageDtos[2]?.id);
        } else if (imgUrls.value.imgFile3) {
          formData.append(`images[2].file`, imgUrls.value.imgFile3);
        }
        formData.append(`id`, props.data.id);

        materialSave(formData, () => {
          cb();
          ElMessage({
            type: "success",
            message: i18nM("material.message.updateSuccess"),
          });
        });
      } else {
        if (imgUrls.value.imgFile1) {
          formData.append(`images[0].file`, imgUrls.value.imgFile1);
        }
        if (imgUrls.value.imgFile2) {
          formData.append(`images[1].file`, imgUrls.value.imgFile2);
        }
        if (imgUrls.value.imgFile3) {
          formData.append(`images[2].file`, imgUrls.value.imgFile3);
        }
        materialSave(formData, () => {
          cb();

          ElMessage({
            type: "success",
            message: i18nM("material.message.saveSuccess"),
          });
        });
      }
    } else {
      ElMessage({
        type: "error",
        message: i18nM("commonBase.error.fillCompleteInfo"),
      });
    }
  });
};
const getUnit = (arr: any) => {
  function traverse(items) {
    items.forEach((item: any) => {
      unitOptions.value.push({
        id: item.id,
        cnname: item.cnname,
      });

      // 如果有子节点，递归处理
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    });
  }

  traverse(arr);
  return unitOptions.value;
};
onMounted(() => {
  // materialStockFindStockTree({ projectId: props.projectId }, (res: any) => {
  //   sourceOptions.value = res.data;
  //   if (!props.data) {
  //     form.value.materialCategory = sourceOptions.value[0].id;
  //   }
  // });
  findTree(
    {
      projectId: props?.projectId,
    },
    (res: any) => {
      typeOptions.value = res.data;
      if (!props.data) {
        // form.value.materialCategory = typeOptions.value[0].id;
        form.value.materialCategory = props.classificationId;
      }
    }
  );
  materialUnitFindPage(
    {
      page: 0,
      size: 1000,
      projectId: props?.projectId,
    },
    (res: any) => {
      if (res.data.content.length > 0) {
        getUnit(res.data.content);
        setTimeout(() => {
          if (props?.data && unitOptions.value) {
            form.value.unit = props.data.unit;
          } else {
            form.value.unit = unitOptions.value[0].id;
          }
        }, 100);
      }
    }
  );
});
defineExpose({
  confirmSave,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.border {
  border: zrem(1) solid var(--el-border-color);
  border-radius: zrem(4);
}
.flex-wrap {
  flex-wrap: wrap;
}
.font-red {
  color: var(--el-color-danger);
}
</style>
