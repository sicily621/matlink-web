<template>
  <div class="flex flex-col">
    <el-card class="w-full h-full">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">物料信息</div>
      </div>
      <el-divider />
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="flex relative flex-1"
        label-width="120px"
        require-asterisk-position="right"
      >
        <div class="width-300 d-flex">
          <el-form-item label="物料类别" prop="materialTypeId">
            <el-tree-select
              v-model="form.materialTypeId"
              placeholder="请选择物料类别"
              :data="categoryOptions"
              check-strictly
              :render-after-expand="false"
              :props="selectProps"
            />
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <el-input
              v-model="form.code"
              class="flex-1"
              placeholder="请输入编码"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="form.name"
              class="flex-1"
              placeholder="请输入名称"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="简称" prop="simpleName">
            <el-input
              v-model="form.simpleName"
              class="flex-1"
              placeholder="请输入简称"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brand">
            <el-input
              v-model="form.brand"
              class="flex-1"
              placeholder="请输入简称"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="规格" prop="specification">
            <el-input
              v-model="form.specification"
              class="flex-1"
              placeholder="请输入规格"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
        </div>
        <div class="width-300 d-flex m-l-16">
          <el-form-item label="型号" prop="modelNo">
            <el-input
              v-model="form.modelNo"
              class="flex-1"
              placeholder="请输入型号"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="条形码" prop="barcode">
            <el-input
              v-model="form.barcode"
              class="flex-1"
              placeholder="请输入条形码"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="参考进价(元)" prop="suggestedPurchasePrice">
            <el-input-number
              v-model="form.suggestedPurchasePrice"
              class="width-200"
              :step="0.01"
              :min="0"
              required
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="参考售价(元)" prop="suggestedCostPrice">
            <el-input-number
              v-model="form.suggestedCostPrice"
              class="width-200"
              required
              :step="0.01"
              :min="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="最低库存量" prop="minCountLimit">
            <el-input-number
              v-model="form.minCountLimit"
              class="width-200"
              required
              :step="1"
              :min="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="最高库存量" prop="maxCountLimit">
            <el-input-number
              v-model="form.maxCountLimit"
              class="width-200"
              required
              :step="1"
              :min="0"
            >
            </el-input-number>
          </el-form-item>
        </div>
        <div class="width-300 d-flex m-l-16">
          <el-form-item label="安全库存量" prop="safeCountLimit">
            <el-input-number
              v-model="form.safeCountLimit"
              class="width-200"
              required
              :step="1"
              :min="0"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-tree-select
              v-model="form.unit"
              placeholder="请选择单位"
              :data="unitOptions"
              check-strictly
              :render-after-expand="false"
              :props="selectUnitProps"
              class="flex-1"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch
              class="switch"
              v-model="form.status"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              :active-text="'启用'"
              :inactive-text="'禁用'"
            />
          </el-form-item>
          <el-form-item label="产地" prop="producingArea">
            <el-input
              v-model="form.producingArea"
              class="flex-1"
              placeholder="请输入产地"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input
              v-model="form.description"
              class="flex-1"
              placeholder="请输入备注"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="图片">
            <Upload
              class="m-r-3"
              @fileChange="fileImgChange($event, 1)"
              :imgBtn="true"
              :imgPath="imgUrls.img1"
              :accept="UploadType.commonImg"
            ></Upload>
            <Upload
              class="m-r-3"
              @fileChange="fileImgChange($event, 2)"
              :imgBtn="true"
              :imgPath="imgUrls.img2"
              :accept="UploadType.commonImg"
            ></Upload>
            <Upload
              class="m-r-3"
              @fileChange="fileImgChange($event, 3)"
              :imgBtn="true"
              :imgPath="imgUrls.img3"
              :accept="UploadType.commonImg"
            ></Upload>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import {
  Material,
  createMaterial,
  editMaterial,
  uploadMaterialImgs,
  batchSaveMaterialImages,
  getMaterialImageList,
} from "../api/material";
import { getCategoryList } from "../api/category";
import { ElMessage } from "element-plus";
import { formatTimeToString } from "@@/utils/datetime";
import { ModuleCode } from "@/router/moduleCode";
import { useUserStore } from "@/pinia/stores/user";
import { getUnitList } from "../api/unit";
import Upload from "@static/elementUI/upload/upload.vue";
import { UploadType } from "@static/js/common/enum";
const props = defineProps<{ data: Material | null; materialTypeId: string }>();
const formRef = ref();
const selectProps = { value: "id", label: "name" };
const selectUnitProps = { value: "id", label: "cnname" };
const userStore = useUserStore();
//表单
const form = ref<Material>({
  code: `${ModuleCode.Material}${formatTimeToString()}`,
  name: "",
  materialTypeId: props.materialTypeId,
  simpleName: "",
  brand: "",
  modelNo: "",
  producingArea: "",
  specification: "",
  description: "",
  unit: "",
  minCountLimit: 0,
  maxCountLimit: 0,
  safeCountLimit: 0,
  suggestedCostPrice: 0,
  suggestedPurchasePrice: 0,
  status: 1,
  barcode: "",
  createUserId: userStore.getInfo()?.id,
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
//合并props
if (props.data) {
  Object.assign(form.value, props.data);
}

const rules = reactive({
  simpleName: [{ required: true, message: "不能为空" }],
  name: [{ required: true, message: "不能为空" }],
  materialTypeId: [{ required: true, message: "不能为空" }],
});

function buildTree(categorys: any[]) {
  const map = new Map();

  // 第一步：创建所有部门的映射并初始化children
  categorys.forEach((dept: any) => {
    map.set(dept.id, {
      ...dept,
      children: [],
    });
  });

  // 第二步：建立所有层级的父子关系
  categorys.forEach((dept: any) => {
    const current = map.get(dept.id);
    if (dept.parentId !== 0) {
      const parent = map.get(dept.parentId);
      if (parent) {
        parent.children.push(current);
      }
    }
  });

  // 第三步：收集顶级部门
  return categorys
    .filter((dept: any) => dept.parentId === 0)
    .map((dept: any) => map.get(dept.id));
}
const categoryOptions = ref<any[]>([{ name: "无", id: 0 }]);
const unitOptions = ref<any[]>([{ name: "无", id: 0 }]);
const reg = /imgFile(\d+)/;

function extractNumberFromImgFile(str: string) {
  const matchResult = str.match(reg);
  return matchResult ? Number(matchResult[1]) : null;
}
const confirmSave = async (cb?: Function) => {
  try {
    const valid = await formRef.value.validate();
    if (valid) {
      const params = { ...form.value };
      const api = params.id ? editMaterial : createMaterial;
      const materialRes = await api(params);
      const files: any = new FormData();
      const newFileKeys: string[] = [];
      for (let key in imgUrls.value) {
        if (key.includes("imgFile") && imgUrls.value[key]) {
          files.append("files", imgUrls.value[key]);
          newFileKeys.push(key);
        }
      }
      if ([...files.entries()].length) {
        const res: any = await uploadMaterialImgs(files);
        const imagePaths = res?.fileNames ? res.fileNames.split(",") : [];
        const materialImages = imagePaths.map((path: string, i: number) => {
          const img: any = {
            materialId: String((materialRes as any)?.data?.id),
            imagePath: path,
          };
          const index = extractNumberFromImgFile(newFileKeys[i]);
          if (imgUrls.value[`img${index}`]) {
            img.id = materialImgs.value[Number(index) - 1]?.id;
          }
          return img;
        });
        await batchSaveMaterialImages(materialImages);
      }
      ElMessage({
        type: "success",
        message: "保存成功",
      });
      cb && cb();
    }
  } catch (error) {
    return false;
  }
};
const queryCategoryOptions = async () => {
  const res = await getCategoryList();
  if ((res as any)?.data?.length) {
    categoryOptions.value = buildTree((res as any)?.data || []);
    if (!props.data) form.value.materialTypeId = categoryOptions.value[0]?.id;
  }
};
const queryUnitOptions = async () => {
  const res = await getUnitList();
  if ((res as any)?.data?.length) {
    unitOptions.value = buildTree((res as any)?.data || []);
    if (!props.data) form.value.unit = unitOptions.value[0]?.id;
  }
};
const materialImgs = ref<any[]>([]);
onMounted(async () => {
  await queryCategoryOptions();
  await queryUnitOptions();
  if (props?.data?.id) {
    const res = await getMaterialImageList({
      materialId: props.data.id as any as string,
    });
    materialImgs.value = (res as any).data || [];
    (res as any).data.map((item: any, i: number) => {
      imgUrls.value[`img${i + 1}`] = `/static` + item.imagePath;
    });
  }
});
defineExpose({ confirmSave });
</script>
<style lang="scss" scoped>
@use "@@/assets/styles/size.scss" as *;
.width-300 {
  width: zrem(300);
}
.avatar-upload {
  font-size: zrem(20);
  border: zrem(1) solid var(--el-border-color-darker);
  border-radius: 50%;
  &,
  & img {
    width: zrem(60);
    height: zrem(60);
  }
}
</style>
