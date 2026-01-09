<template>
  <div class="flex-1 flex-column h-full">
    <div class="wrap">
      <div class="d-flex h-full">
        <div class="fill-bg radius p-16 m-r-8">
          <div class="zc-header-title">
            <div class="zc-header-icon"></div>
            <div class="zc-header-word">
              {{ i18nM("material.title.warehouseReceipt") }}
            </div>
          </div>
          <el-form ref="formRef" :model="form" :rules="rules" label-position="right" class="d-flex relative m-r-10 m-t-20" :label-width="zrem(120)">
            <div class="d-flex" v-if="onlyView">
              <div class="m-r-30">
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.warehouseReceiptNumber") }}</div>
                  <div>{{ form.inStockNo }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.title.materialWarehouse") }}</div>
                  <div>{{ findNameById(sourceOptions, form.stockId) }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.receiptType") }}</div>
                  <div>{{ getName(receiptTypeOptions, form.type) }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.sourceNumber") }}</div>
                  <div>{{ form.resourceNo }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.supplier") }}</div>
                  <div>{{ getName(supplierOptions, form.supplyId) }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.warehousingTime") }}</div>
                  <div>{{ new Date(form.inStockTime).toLocaleString().replace(/\//g, "-") }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.warehouser") }}</div>
                  <div>{{ form.inStockUserName }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.notes") }}</div>
                  <div>{{ form.description }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.direct") }}</div>
                  <div>{{ form.isDirect ? i18nM("material.enumValue.yes") : i18nM("material.enumValue.no") }}</div>
                </div>
                <el-form-item :label="i18nM('material.label.attachment')" prop="stocktakingNone">
                  <div class="d-flex w-200">
                    <div class="files-wrap w-full">
                      <el-scrollbar class="h-full">
                        <div class="d-flex justify-content-between align-items-center file-item" v-for="(file, index) in form.files">
                          <el-text default class="flex-1 overflow-spot">{{ file?.name || file.fileName }}</el-text>
                          <div class="d-flex flex-center">
                            <el-icon class="fz16 pointer m-l-8" text v-if="file.id" @click="download(file)">
                              <Download />
                            </el-icon>
                          </div>
                        </div>
                      </el-scrollbar>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
            <div class="d-flex" v-else>
              <div class="m-r-30">
                <el-form-item :label="i18nM('material.table.warehouseReceiptNumber')" prop="inStockNo">
                  <el-input
                    v-model="form.inStockNo"
                    class="w-200"
                    :placeholder="i18nM('material.placeholder.warehouseReceiptNumber')"
                    maxlength="32"
                    required
                    :disabled="onlyView"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item :label="i18nM('material.title.materialWarehouse')" prop="stockId">
                  <el-tree-select
                    v-model="form.stockId"
                    :placeholder="i18nM('material.placeholder.select')"
                    :data="sourceOptions"
                    check-strictly
                    :render-after-expand="true"
                    :props="selectProps"
                    :default-expand-all="true"
                    :disabled="onlyView || !!form.resourceId || !!tableData.length"
                    class="w-200"
                  />
                </el-form-item>
                <el-form-item :label="i18nM('material.label.receiptType')" prop="type">
                  <el-select
                    class="w-200"
                    :disabled="onlyView || !!form.resourceId || !!tableData.length"
                    v-model="form.type"
                    :placeholder="i18nM('material.placeholder.select')"
                  >
                    <el-option v-for="item of receiptTypeOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="i18nM('material.label.sourceNumber')" prop="resourceNo">
                  <el-input class="w-200" :disabled="true" v-model="form.resourceNo" :placeholder="i18nM('material.placeholder.select')">
                    <template #append>
                      <el-button class="w-30 p-0" :icon="CircleClose" v-if="!!form.resourceId" @click="clearOrder" />
                      <el-button class="w-30 p-0" :icon="More" v-else @click="selectOrder" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="i18nM('material.label.supplier')" prop="supplyId">
                  <el-select :disabled="onlyView" class="w-200" v-model="form.supplyId" :placeholder="i18nM('material.placeholder.select')">
                    <el-option v-for="item of supplierOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="i18nM('material.table.warehousingTime')" prop="inStockTime">
                  <el-date-picker
                    :disabled="onlyView"
                    v-model="form.inStockTime"
                    type="datetime"
                    :disabled-date="disabledDate"
                    :disabled-hours="disabledHours"
                    :disabled-minutes="disabledMinutes"
                    :placeholder="i18nM('material.placeholder.select')"
                  />
                </el-form-item>
                <el-form-item :label="i18nM('material.table.warehouser')" prop="inStockUserName"
                  ><el-input class="w-200" disabled v-model="form.inStockUserName" :placeholder="i18nM('material.placeholder.select')">
                    <template #append>
                      <el-button :icon="More" @click="openModal" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="i18nM('material.table.notes')" prop="description" class="dept">
                  <el-input
                    :disabled="onlyView"
                    class="w-200"
                    v-model="form.description"
                    type="textarea"
                    :placeholder="i18nM('material.placeholder.inputDescription')"
                    maxlength="64"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="i18nM('material.label.direct')" prop="isDirect">
                  <el-checkbox :disabled="onlyView" :true-value="1" :false-value="0" v-model="form.isDirect" />
                </el-form-item>
                <el-form-item :label="i18nM('material.label.attachment')" prop="stocktakingNone">
                  <div class="d-flex w-full">
                    <div class="files-wrap w-full">
                      <el-scrollbar class="h-full">
                        <div class="d-flex justify-content-between align-items-center file-item" v-for="(file, index) in form.files">
                          <el-text default class="flex-1 overflow-spot">{{ file?.name || file.fileName }}</el-text>
                          <div class="d-flex flex-center">
                            <el-icon class="fz16 pointer" text v-if="!onlyView" @click="remove(file, index)">
                              <Delete />
                            </el-icon>
                            <el-icon class="fz16 pointer m-l-8" text v-if="file.id" @click="download(file)">
                              <Download />
                            </el-icon>
                          </div>
                        </div>
                      </el-scrollbar>
                    </div>
                    <el-upload :before-upload="beforeUpload" class="h-30 m-l-8" v-if="!onlyView">
                      <el-button type="primary" class="upload-btn fz12 m-r-20">{{ i18nM("space.button.upload") }}</el-button>
                    </el-upload>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div class="fill-bg radius flex-1 flex-column p-16">
          <div class="d-flex align-items-center justify-content-between h-32">
            <div class="zc-header-title">
              <div class="zc-header-icon"></div>
              <div class="zc-header-word">
                {{ i18nM("material.title.materialInformation") }}
              </div>
            </div>
            <div>
              <span v-if="errorShow" class="error m-r-8">{{ i18nM("material.error.stockInDetailCannotBeEmpty") }}</span>
              <el-button :type="'primary'" @click="addMaterial" v-if="!onlyView && (form.type === 1 || form.type === 4)">
                <img :src="AddIcon" width="16" height="16" class="el-icon" />
                <span>{{ i18nM("material.button.addition") }}</span>
              </el-button>
            </div>
          </div>
          <div class="flex-1 table-wrap" ref="tableWrapRef">
            <baseTable :columns="columns" :table-data="tableData" :tableProps="tableProps">
              <template #actualCount="scope">
                <el-input-number
                  v-if="editCountRow?.id == scope.scope.row.id"
                  size="small"
                  class="w-90"
                  v-model="scope.scope.row.actualCount"
                  :precision="0"
                  :step="1"
                  :min="0"
                  :max="getMax(scope.scope.row)"
                  @change="inputChange(scope.scope.row)"
                />
                <div v-if="editCountRow?.id != scope.scope.row.id" @click="targetRowCol(1, scope.scope.row)" class="pointer">
                  {{ scope.scope.row.actualCount }}
                </div>
              </template>
              <template #perPrice="scope">
                <el-input-number
                  v-if="editPriceRow?.id == scope.scope.row.id"
                  size="small"
                  class="w-100"
                  v-model="scope.scope.row.perPrice"
                  :precision="2"
                  :step="0.01"
                  @change="inputChange(scope.scope.row)"
                />
                <div v-if="editPriceRow?.id != scope.scope.row.id" @click="targetRowCol(2, scope.scope.row)" class="pointer">
                  {{ scope.scope.row.perPrice }}
                </div>
              </template>
              <template #priceRatio="scope">
                <el-input-number
                  v-if="editTaxRow?.id == scope.scope.row.id"
                  size="small"
                  class="w-100"
                  v-model="scope.scope.row.priceRatio"
                  :precision="2"
                  :step="0.01"
                  :min="0"
                  :max="1"
                  @change="inputChange(scope.scope.row)"
                />
                <div v-if="editTaxRow?.id != scope.scope.row.id" @click="targetRowCol(3, scope.scope.row)" class="pointer">
                  {{ scope.scope.row.priceRatio }}
                </div>
              </template>
              <template #operate="scope">
                <el-icon class="fz20 pointer" text @click="removeMaterial(scope.scope.row)">
                  <Delete />
                </el-icon>
              </template>
            </baseTable>
          </div>
        </div>
      </div>
    </div>
    <zModel
      ref="modelRef"
      :style="{ width: '80%', height: '80%' }"
      :custom-model-title="i18nM('material.title.selectPerson')"
      :noConfirmBtnFlag="true"
      @confirm="() => {}"
    >
      <div class="flex-1 d-flex w-full h-full relative content-bg">
        <div class="left h-full box-shadow">
          <div class="flex1 flex-column h-full">
            <div class="flex-1" style="height: 50%" v-if="enterTreeData.length > 0">
              <tree
                :data="enterTreeData"
                ref="enterTreeRef"
                :expandedKeys="enterpriseExpandedKeys"
                :currentNodeKey="enterpriseCurrentNodeKey"
                @changeNode="enterChange($event)"
                @changeFilter="enterFilter($event)"
                :placeholder="i18nM('material.placeholder.placeEnterAbbreviation')"
              >
              </tree>
            </div>
            <div class="flex-1" style="height: 50%">
              <tree
                :data="departTreeData"
                :expandedKeys="departmentExpandedKeys"
                :currentNodeKey="departmentCurrentNodeKey"
                ref="departTreeRef"
                @changeNode="dpChange($event)"
                :propsObj="defaultProps"
                :placeholder="i18nM('material.placeholder.placeDepName')"
                :searchFlag="true"
              >
              </tree>
            </div>
          </div>
        </div>
        <div class="right flex-1 flex-column h-full fill-bg box-shadow">
          <div class="d-flex align-items-center justify-content-between m-t-8 m-b-8">
            <div>
              <span class="m-r-8 m-l-16 fz14">{{ i18nM("material.label.name") }}</span>
              <el-input v-model="title" :placeholder="i18nM('material.placeholder.name')" class="w-200" @input="nameInputFunc">
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
            </div>
            <el-button :type="'primary'" class="m-r-10" @click="savePerson()">{{ i18nM("material.button.confirm") }}</el-button>
          </div>
          <div class="flex-1 table-wrap p-0">
            <baseTable ref="tableRef" :columns="userColumns" :table-data="userTableData" @currentChange="currentChange"> </baseTable>
          </div>
        </div>
      </div>
    </zModel>
    <zModel
      ref="materialRef"
      :style="{ width: '100%', height: '100%' }"
      :custom-model-title="i18nM('material.title.selectMaterial')"
      :noConfirmBtnFlag="true"
      @confirm="() => {}"
    >
      <div class="flex-1 d-flex w-full h-full relative content-bg">
        <Material :materialIds="materialIds" :projectId="projectId" @save="saveMaterial"></Material>
      </div>
    </zModel>
    <zModel
      ref="orderRef"
      :style="{ width: '100%', height: '100%' }"
      :custom-model-title="form.type === 3 ? i18nM('material.title.materialOutBoundApply') : i18nM('material.title.purchase')"
      :noConfirmBtnFlag="true"
      @confirm="() => {}"
    >
      <div class="flex-1 d-flex w-full h-full relative content-bg">
        <Order :id="form.resourceId" :projectId="projectId" :stockId="form.stockId" :type="form.type" @save="saveOrder"></Order>
      </div>
    </zModel>
  </div>
</template>
<script setup lang="ts">
import AddIcon from "@static/images/add.png";
import { ref, reactive, onMounted, computed, nextTick } from "vue";
import { stockIn, saveInStock, generateInStockNo, deleteInStockFile } from "@functions/serviceCenter/material-management/api/instock";
import { saveInStockDetail, deleteByInStockId, getInStockDetail } from "@functions/serviceCenter/material-management/api/instockDetail";
import { supplierInformationFindPage } from "@functions/serviceCenter/material-management/api/supplierInformation";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { materialPage } from "@functions/serviceCenter/material-management/api/material";
import { getMaterialOutBoundApplyDetail } from "@functions/serviceCenter/material-management/api/materialOutBoundApplyDetail";
import { getPurchasingRequisitionDetail } from "@functions/serviceCenter/material-management/api/purchasingRequisitionDetails";
import { getMaterialOutBoundApplyById } from "@functions/serviceCenter/material-management/api/materialOutBoundApply";
import { getPurchasingRequisitionById } from "@functions/serviceCenter/material-management/api/purchasingRequisition";
import { ElMessage, ElMessageBox } from "element-plus";
import { More, Search, CircleClose } from "@element-plus/icons-vue";
import { zrem } from "@static/js/theme/zrem";
import zModel from "@static/components/zModel/zModel.vue";
import tree, { TreeNode } from "@static/elementUI/tree/tree.vue";
import baseTable from "@static/table/baseTable/baseTable.vue";
import { enterprisesPage } from "@functions/userCenter/api/enterprises";
import { getDeptTreeByCurUserId } from "@functions/userCenter/api/departments";
import { usersGetByDeptId, usersGet } from "@functions/userCenter/api/users";
import { nameToLabel } from "@static/js/page/data";
import Material from "@functions/serviceCenter/material-management/stockIn/material.vue";
import Order from "@functions/serviceCenter/material-management/stockIn/resourceOrder.vue";
const props = defineProps<{ data: stockIn | null; projectId: string | number; stockId: string | number; onlyView: boolean }>();
const i18nM = window.$i18nM;
const formRef = ref();
const title = ref("");
const tableRef = ref();
const orderRef = ref();
const tableWrapRef = ref();
const receiptTypeOptions = computed(() => {
  return [
    { id: 1, name: i18nM("material.enumValue.opening") },
    { id: 2, name: i18nM("material.enumValue.purchase") },
    { id: 3, name: i18nM("material.enumValue.return") },
    { id: 4, name: i18nM("material.enumValue.others") },
  ];
});
const tableProps = ref({
  highlightCurrentRow: false,
});
const editCountRow = ref<any>(null);
const editPriceRow = ref<any>(null);
const editTaxRow = ref<any>(null);
const targetRowCol = (type: number, e: any) => {
  if (props.onlyView) return;
  if (type === 1) {
    editCountRow.value = e;
  } else if (type === 2) {
    editPriceRow.value = e;
  } else if (type === 3) {
    editTaxRow.value = e;
  }
};
function findNameById(tree: any[], targetId: string | number) {
  for (let node of tree) {
    const { id, name, children } = node;
    if (id === targetId) {
      return name;
    }
    if (children && children.length > 0) {
      const result: any = findNameById(children, targetId);
      if (result !== null) {
        return result;
      }
    }
  }
  return null;
}
const getName = (list: any[], targetId: string | number) => {
  return list.find((item: any) => item.id === targetId)?.name ?? "";
};
const inputChange = (row: any) => {
  row.totalPrice = Number(Number(+row.perPrice * +row.actualCount).toFixed(2));
  row.inStockPrice = Number(Number(row.totalPrice - row.inStockPrice * +row.priceRatio).toFixed(2));
};
const supplierOptions = ref<any[]>([{ name: i18nM("material.enumValue.none"), id: 0 }]);
const querySupplier = (cb?: Function) => {
  const params = {
    projectId: props.projectId as any as number,
    page: 0,
    size: 1000,
  };
  supplierInformationFindPage(params, (res: any) => {
    supplierOptions.value = res?.data?.content ?? [];
    supplierOptions.value.unshift({ name: i18nM("material.enumValue.none"), id: 0 });
    if (!props.data?.id) {
      form.value.supplyId = 0;
    }
    cb && cb();
  });
};
const download = (file: any) => {
  const a = document.createElement("a");
  a.download = file.fileName;
  const blobUrl = file.filePath;
  a.href = blobUrl;
  a.click();
};
const remove = (file: any, index: number) => {
  ElMessageBox.confirm(i18nM("material.confirm.deleteFile"), i18nM("material.title.deleteFile"), {
    confirmButtonText: i18nM("material.button.delete"),
    confirmButtonClass: "w-80",
    cancelButtonText: i18nM("material.button.cancel"),
    cancelButtonClass: "message-box-cancel-btn w-80",
    type: "warning",
  })
    .then(() => {
      if (file.id) {
        deleteInStockFile({ id: file.id }, (res: any) => {
          if (res.code) {
            ElMessage({
              type: "success",
              message: i18nM("material.message.deleteSuccess"),
            });
            form.value.files.splice(index, 1);
          } else {
            ElMessage({
              type: "info",
              message: i18nM("material.message.deleteFailed"),
            });
          }
        });
      } else {
        form.value.files.splice(index, 1);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: i18nM("material.message.cancelDelete"),
      });
    });
};
const beforeUpload = (file: File) => {
  form.value.files.push(file);
  return false;
};
//表单
const form = ref<stockIn>({
  projectId: props.projectId,
  resourceId: "",
  resourceNo: "",
  stockId: props.stockId,
  inStockNo: "",
  status: 0,
  inStockStatus: 0,
  supplyId: 0,
  type: 1,
  description: "",
  isDirect: 1,
  inStockUserId: "",
  inStockTime: new Date(),
  source: "web",
  deptId: "",
  files: [],
});
const materialIds = ref<string[]>([]);
if (props.data) {
  Object.assign(form.value, props.data);
}
// 校验规则
let validatorResourceId = (rule: any, value: string, callback: Function) => {
  if (form.value.type === 1 || form.value.type === 4) callback();
  if (value.length === 0) {
    return callback(new Error(i18nM("material.error.cannotBeEmpty")));
  }
  callback();
};
const rules = reactive({
  inStockNo: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  type: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  inStockTime: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  inStockUserName: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  description: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  resourceNo: [
    {
      validator: validatorResourceId,
      trigger: "blur",
    },
  ],
});
const sourceOptions = ref<any[]>([]);
const selectProps = { value: "id", label: "name" };
const userColumns = computed(() => [
  { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
  { prop: "name", label: i18nM("material.label.name") },
  { prop: "userName", label: i18nM("material.label.username"), type: 2 },
  { prop: "userCode", label: i18nM("material.label.userCode"), type: 2 },
]);
const userTableData = ref<any[]>([]);
const tableData = ref<any[]>([]);
const columns = computed(() => {
  const result: any[] = [
    { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
    { prop: "tradeTypeName", label: i18nM("material.table.category") },
    { prop: "simpleName", label: i18nM("material.table.material") },
    { prop: "brand", label: i18nM("material.table.brand") },
    { prop: "modelNo", label: i18nM("material.table.model") },
    { prop: "specification", label: i18nM("material.table.specifications") },
    { prop: "unitName", label: i18nM("material.table.unit") },
    { prop: "expectedCount", label: i18nM("material.table.sourceQuantity") },
    { prop: "actualCount", label: i18nM("material.table.actualQuantity"), type: props.onlyView ? 0 : 8 },
    { prop: "perPrice", label: i18nM("material.table.unitPrice"), type: props.onlyView ? 0 : 8 },
    { prop: "totalPrice", label: i18nM("material.table.totalPrice") },
    { prop: "priceRatio", label: i18nM("material.table.taxRate"), type: props.onlyView ? 0 : 8 },
    { prop: "inStockPrice", label: i18nM("material.table.warehousingPrice") },
  ];
  if (!props.onlyView) result.push({ prop: "operate", type: 2, label: i18nM("material.table.operate"), width: 100 });
  return result;
});
const getMax = (row: any) => {
  if (form.value.type === 1 || form.value.type === 4) {
    return Infinity;
  } else {
    return row.expectedCount;
  }
};
const now = new Date();
// // 禁用开始日期
const disabledDate = (time: Date) => {
  return time.getTime() < now.getTime();
};
const disabledHours = () => {
  if (!form.value.inStockTime) return [];

  const selectedDate = new Date(form.value.inStockTime);
  const isToday = selectedDate.toDateString() === now.toDateString();

  if (isToday) {
    const currentHour = now.getHours();
    return Array.from({ length: currentHour }, (_, i) => i);
  }
  return [];
};

const disabledMinutes = () => {
  if (!form.value.inStockTime) return [];

  const selectedDate = new Date(form.value.inStockTime);
  const isToday = selectedDate.toDateString() === now.toDateString();
  const isCurrentHour = selectedDate.getHours() === now.getHours();

  if (isToday && isCurrentHour) {
    const currentMinute = now.getMinutes();
    return Array.from({ length: currentMinute }, (_, i) => i);
  }
  return [];
};
const inStockUserId = ref("");
const inStockUserName = ref("");
const currentChange = (row: any) => {
  inStockUserId.value = row.id;
  inStockUserName.value = row.name;
};
const modelRef = ref<any>(null);
const openModal = () => {
  modelRef.value.openCustomModel();
  nextTick(() => {
    const targetRow = userTableData.value.find((row: any) => row.id === form.value.inStockUserId);
    if (targetRow) tableRef.value.setCurrentRow(targetRow);
  });
};
const saveOrder = (data: any) => {
  form.value.resourceId = data?.resourceId;
  form.value.resourceNo = data?.resourceNo;
  orderRef.value.closeCustomModel();
  if (form.value.type == 3) {
    getMaterialOutBoundApplyDetail({ applyId: form.value.resourceId }, (res: any) => {
      detailMap.value.clear();
      materialIds.value =
        res.data?.map((item: any) => {
          const { tradeId } = item;
          detailMap.value.set(tradeId, { ...item, expectedCount: item.actualCount, perPrice: Number(item?.material?.suggestedCostPrice ?? 0) });
          return tradeId;
        }) ?? [];
      refreshTable();
    });
  }
  if (form.value.type == 2) {
    getPurchasingRequisitionDetail({ billId: form.value.resourceId }, (res: any) => {
      detailMap.value.clear();
      materialIds.value =
        res.data?.map((item: any) => {
          const { tradeId, count } = item;
          detailMap.value.set(tradeId, { ...item, expectedCount: count, actualCount: count, perPrice: item?.perPrice ?? 0 });
          return tradeId;
        }) ?? [];
      refreshTable();
    });
  }
};
const selectOrder = () => {
  if (form.value.type !== 2 && form.value.type !== 3) {
    return;
  }
  orderRef.value.openCustomModel();
};
const clearOrder = () => {
  form.value.resourceId = "";
  form.value.resourceNo = "";
  materialIds.value = [];
  tableData.value = [];
};
const materialRef = ref<any>(null);
const addMaterial = () => {
  materialRef.value.openCustomModel();
};
const removeMaterial = (row: any) => {
  ElMessageBox.confirm(i18nM("material.modal.confirmDeleteMaterial"), i18nM("material.title.deleteMaterial"), {
    confirmButtonText: i18nM("material.button.delete"),
    confirmButtonClass: "w-80",
    cancelButtonText: i18nM("material.button.cancel"),
    cancelButtonClass: "message-box-cancel-btn w-80",
    type: "warning",
  })
    .then(() => {
      materialIds.value = materialIds.value.filter((id: any) => id !== row.tradeId);
      ElMessage({
        type: "success",
        message: i18nM("material.message.deleteSuccess"),
      });
      refreshTable();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: i18nM("material.message.cancelDelete"),
      });
    });
};
const saveMaterial = (ids: any[]) => {
  materialIds.value = ids;
  materialRef.value.closeCustomModel();
  errorShow.value = ids.length == 0;
  refreshTable();
};
const savePerson = () => {
  form.value.inStockUserId = inStockUserId.value;
  form.value.inStockUserName = inStockUserName.value;
  modelRef.value.closeCustomModel();
};
const enterTreeRef = ref();
const departTreeRef = ref();
const enterTreeData = ref<TreeNode[]>([]);
const departTreeData = ref<TreeNode[]>([]);
const defaultProps = {
  children: "children",
  label: "name",
};
//企业搜索
let enterpriseSearch = "";
//默认展开企业
const enterpriseExpandedKeys = ref<Array<number | string>>([0]);
//当前选中企业
const enterpriseCurrentNodeKey = ref<any>(0);
//默认展开部门
const departmentExpandedKeys = ref<Array<number | string>>([0]);
//当前选中部门
const departmentCurrentNodeKey = ref<any>(0);
/**
 * 更改企业数据闭包事件
 * @param data
 * @param id
 */
let enterChangeFunc = (data: any, id?: number) => {
  enterTreeData.value = data;
  if (id) enterpriseCurrentNodeKey.value = id;
};
/**
 * 更改部门数据闭包事件
 * @param data
 */
let dpChangeFunc = (data: any) => {
  departTreeData.value = data;
};
/**
 * 获取企业列表
 * @param rightListFlag
 */
const getEnterpriseList = (changeFlag: boolean) => {
  enterprisesPage(
    {
      parentId: enterpriseCurrentNodeKey.value,
      page: null,
      size: null,
      abbreviation: enterpriseSearch || null,
    },
    (res: any) => {
      if (changeFlag) enterChangeFunc(nameToLabel(res.data.content, "abbreviation"), res.data.content?.[0]?.id);
      getDepartmentLeftList(changeFlag);
    }
  );
};
const departmentMap = ref<Map<string, string>>(new Map());

/**
 * 获取左侧部门树形列表
 */
const getDepartmentLeftList = (changeFlag: boolean) => {
  getDeptTreeByCurUserId(
    {
      enterPriseId: enterpriseCurrentNodeKey.value,
    },
    (res: any) => {
      res.data.map((item: any, index: number) => {
        const { id, name } = item;
        departmentMap.value.set(id, name);
        if (index === 0) departmentCurrentNodeKey.value = id;
        form.value.deptId = departmentCurrentNodeKey.value;
      });
      departTreeData.value = res.data;
      getUserList();
    }
  );
};

/**
 * 点击企业事件
 */
const enterChange = (enterprise: any) => {
  enterChangeFunc = (data: any) => {
    if (data.length && data[0].parentId == enterprise.id) {
      enterprise.children = data;
    }
    dpChangeFunc = (dpData: any) => {
      departTreeData.value = dpData;
    };
  };
  enterpriseCurrentNodeKey.value = enterprise.id;
  departmentCurrentNodeKey.value = 0;
  form.value.deptId = departmentCurrentNodeKey.value;
  getEnterpriseList(true);
};
/**
 * 点击左侧部门事件
 * @param dp
 */
const dpChange = (dp: any) => {
  departmentCurrentNodeKey.value = dp.id;
  form.value.deptId = departmentCurrentNodeKey.value;
  getUserList();
};
/**
 * 左侧企业搜索
 * @param val
 */
const enterFilter = (val: string) => {
  enterpriseSearch = val;
  if (!val) enterpriseCurrentNodeKey.value = 0;
  else enterpriseCurrentNodeKey.value = null;
  enterChangeFunc = (data: any, id?: number) => {
    enterTreeData.value = data;
    if (id) enterpriseCurrentNodeKey.value = id;
    dpChangeFunc = (dpData: any) => {
      departTreeData.value = dpData;
    };
  };
  getEnterpriseList(true);
};
const getUserList = () => {
  const params: any = {
    deptId: Number(departmentCurrentNodeKey.value),
    page: 0,
    size: 1000,
  };
  if (title.value.length) params.name = title.value;
  usersGetByDeptId(params, (res: any) => {
    userTableData.value = res.data.content;
  });
};
let nameTimer: any = null;
const nameInputFunc = () => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => {
    getUserList();
  }, 400);
};
const errorShow = ref(false);
let errorTime: any;
const confirmSave = (cb: Function) => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (tableData.value.length == 0) {
        errorShow.value = true;
        if (errorTime) clearTimeout(errorTime);
        errorTime = setTimeout(() => {
          errorShow.value = false;
        }, 5000);
        return;
      }
      const params: any = {
        ...form.value,
        inStockTime: new Date(form.value.inStockTime).getTime(),
      };
      delete params["inStockUserName"];
      if (!params["approverCreateTime"]) delete params["approverCreateTime"];
      if (!params["approverUserId"]) delete params["approverUserId"];
      const formData: any = new FormData();
      for (let key in params) {
        if (key != "files") {
          formData.append(key, params[key]);
        } else {
          for (let index in params[key]) {
            if (!params[key][index].id) {
              formData.append(`files[${index}].fileName`, params[key][index].name);
              formData.append(`files[${index}].file`, params[key][index]);
            }
          }
        }
      }
      saveInStock(formData, (res: any) => {
        if (res.code) {
          deleteByInStockId({ inStockId: res.data.id }, (delRes: any) => {
            if (delRes.code) {
              const formData: any = new FormData();
              tableData.value.map((item: any, index: number) => {
                const { tradeId, expectedCount, actualCount, perPrice, totalPrice, priceRatio, inStockPrice } = item;
                const result: any = {
                  projectId: props.projectId,
                  inStockId: res.data.id,
                  tradeId,
                  stockId: form.value.stockId,
                  expectedCount,
                  actualCount,
                  perPrice,
                  totalPrice,
                  priceRatio,
                  inStockPrice,
                };
                for (let key in result) {
                  formData.append(`list[${index}].${key}`, result[key]);
                }
              });
              saveInStockDetail(formData, (saveRes: any) => {
                if (saveRes.code) {
                  ElMessage({
                    type: "success",
                    message: props.data ? i18nM("material.message.editSuccess") : i18nM("material.message.saveSuccess"),
                  });
                  cb && cb(res.data);
                }
              });
            }
          });
        }
      });
    }
  });
};
const hasAddMap = new Map();
const refreshTable = () => {
  if (materialIds.value.length === 0) {
    tableData.value = [];
    return;
  }
  const params: any = {
    projectId: props.projectId,
    page: 0,
    size: 1000,
    ids: materialIds.value,
  };
  materialPage(params, (res: any) => {
    const { content } = res.data;
    hasAddMap.clear();
    tableData.value.map((item: any) => {
      const { tradeId } = item;
      hasAddMap.set(tradeId, item);
    });
    tableData.value = content.map((item: any) => {
      const row = { expectedCount: "", actualCount: 0, perPrice: 0, totalPrice: 0, priceRatio: 0, inStockPrice: 0 };
      const detail = detailMap.value.get(item.id);
      const lastData = hasAddMap.get(item.id);
      if (detail) {
        Object.assign(row, detail);
      }
      const result = lastData ?? { ...item, ...row, tradeId: item.id };
      return result;
    });
    detailMap.value.clear();
  });
};
const detailMap = ref<Map<String, any>>(new Map());
onMounted(() => {
  querySupplier();
  getEnterpriseList(true);
  materialStockFindStockTree({ projectId: props.projectId }, (res: any) => {
    sourceOptions.value = res.data;
  });
  if (props?.data?.id) {
    usersGet({ userId: String(props.data.inStockUserId) }, (res: any) => {
      form.value.inStockUserName = res.data.name;
    });
    if (form.value.type == 3) {
      getMaterialOutBoundApplyById({ id: form.value.resourceId }, (res: any) => {
        form.value.resourceNo = res.data.applyNo;
      });
    } else if (form.value.type == 2) {
      getPurchasingRequisitionById({ id: form.value.resourceId }, (res: any) => {
        form.value.resourceNo = res.data.billNo;
      });
    }
    getInStockDetail({ inStockId: props.data.id }, (res: any) => {
      detailMap.value.clear();
      materialIds.value =
        res.data?.map((item: any) => {
          const { tradeId } = item;
          detailMap.value.set(tradeId, item);
          return tradeId;
        }) ?? [];
      refreshTable();
    });
  } else {
    generateInStockNo((res: any) => {
      form.value.inStockNo = res.data;
    });
  }
});
defineExpose({
  confirmSave,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.files-wrap {
  border: zrem(1) solid var(--el-border-color);
  border-radius: zrem(8);
  padding: zrem(10);
  height: zrem(60);
  .file-item {
    line-height: zrem(30);
    height: zrem(30);
  }
}
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
.content-bg {
  background: var(--el-bg-color);
}
.box-shadow {
  box-shadow: var(--el-box-shadow-light);
}
.p-0 {
  padding: 0 !important;
}
.h-32 {
  height: zrem(32);
}
.wrap {
  width: 100%;
  height: calc(100% - zrem(8));
  margin-bottom: zrem(8);
}
.content-wrap {
  height: calc(100% - zrem(20));
}
.radius {
  border-radius: zrem(4);
  overflow: hidden;
}
.w-50 {
  width: zrem(50);
}
.dept {
  :deep {
    height: zrem(55);
    .el-form-item__content {
      height: 100% !important;
    }
  }
}
.row {
  height: zrem(32);
  margin-bottom: zrem(10);
  div {
    &:nth-child(1) {
      width: zrem(120);
      margin-right: zrem(16);
      text-align: right;
    }
  }
}
.error {
  color: var(--el-color-danger);
}
</style>
