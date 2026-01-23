<template>
  <div class="flex">
    <el-card class="width-200 h-full">
      <div class="zc-header-title">
        <div class="zc-header-icon"></div>
        <div class="zc-header-word">入库单</div>
      </div>
      <el-divider class="m-t-3 m-b-3" />
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        class="flex relative flex-1"
        label-width="120px"
        require-asterisk-position="right"
      >
        <div class="width-300">
          <el-form-item label="入库单号" prop="inStockNo">
            <el-input
              v-model="form.inStockNo"
              class="flex-1"
              placeholder="请输入入库单号"
              maxlength="32"
              required
            >
            </el-input>
          </el-form-item>
          <el-form-item label="物料库" prop="stockId">
            <el-tree-select
              v-model="form.stockId"
              placeholder="请选择物料库"
              :data="stockOptions"
              check-strictly
              :render-after-expand="false"
              :props="selectProps"
            />
          </el-form-item>
          <el-form-item label="入库类型" prop="type">
            <el-select
              class="flex-1"
              v-model="form.type"
              placeholder="请选择入库类型"
            >
              <el-option
                v-for="item of typeOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="源单号" prop="originOrderId">
            <el-input
              class="w-200"
              :disabled="true"
              v-model="form.originOrderId"
              placeholder="请选择"
            >
              <template #append>
                <el-button
                  class="w-10 p-0"
                  :icon="CircleClose"
                  v-if="!!form.originOrderId"
                  @click="clearOrder"
                />
                <el-button
                  class="w-10 p-0"
                  :icon="More"
                  v-else
                  @click="selectOrder"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="supplyId">
            <el-select
              class="flex-1"
              v-model="form.supplyId"
              placeholder="请选择供应商"
            >
              <el-option
                v-for="item of supplierOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入库时间" prop="inStockTime">
            <el-date-picker
              :disabled="onlyView"
              v-model="form.inStockTime"
              type="datetime"
              :disabled-date="disabledDate"
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes"
              placeholder="请选择入库时间"
            />
          </el-form-item>
          <el-form-item label="入库人" prop="inStockUserName">
            <el-input
              disabled
              v-model="form.inStockUserName"
              placeholder="请选择入库人"
            >
              <template #append>
                <el-button :icon="More" @click="openModal" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input
              :disabled="onlyView"
              class="w-200"
              v-model="form.description"
              type="textarea"
              placeholder="请输入备注"
              maxlength="64"
            ></el-input>
          </el-form-item>
          <el-form-item label="直接入库" prop="isDirect">
            <el-checkbox
              :disabled="onlyView"
              :true-value="1"
              :false-value="0"
              v-model="form.isDirect"
            />
          </el-form-item>
          <el-form-item label="附件">
            <div class="flex w-full">
              <div class="files-wrap w-full">
                <el-scrollbar class="h-full">
                  <div
                    class="flex justify-content-between align-items-center file-item"
                    v-for="(file, index) in form.files"
                  >
                    <el-text default class="flex-1 overflow-spot">{{
                      file?.name || file.fileName
                    }}</el-text>
                    <div class="flex flex-center">
                      <el-icon
                        class="fz16 pointer"
                        text
                        v-if="!onlyView"
                        @click="remove(file, +index)"
                      >
                        <Delete />
                      </el-icon>
                      <el-icon
                        class="fz16 pointer m-l-8"
                        text
                        v-if="file.id"
                        @click="download(file)"
                      >
                        <Download />
                      </el-icon>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
              <el-upload
                :before-upload="beforeUpload"
                class="h-30 m-l-3"
                v-if="!onlyView"
              >
                <el-button type="primary" class="upload-btn fz12 m-r-2"
                  >上传</el-button
                >
              </el-upload>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <div class="p-4 el-card flex-1 h-full m-l-3 flex flex-column">
      <div class="flex align-items-center justify-content-between">
        <div class="zc-header-title">
          <div class="zc-header-icon"></div>
          <div class="zc-header-word">物料信息</div>
        </div>
        <div>
          <span v-if="errorShow" class="error m-r-8">入库详情不能为空</span>
          <el-button
            :type="'primary'"
            @click="addMaterial"
            v-if="!onlyView && (form.type === 1 || form.type === 4)"
          >
            <span>添加</span>
          </el-button>
        </div>
      </div>
      <el-divider class="m-t-3 m-b-3" />
      <div class="flex-1 table-wrap" ref="tableWrapRef">
        <baseTable
          :columns="columns"
          :table-data="tableData"
          :tableProps="tableProps"
        >
          <template #materialTypeId="scope"
            >{{ categoryMap.get(scope.scope.row.materialTypeId)?.name }}
          </template>
          <template #unit="scope"
            >{{ unitMap.get(scope.scope.row.unit)?.cnname }}
          </template>
          <template #imageUrls="scope">
            <div class="icons-con">
              <div class="icon-con" v-for="url in scope.scope.row.imageUrls">
                <img :src="`/static${url}`" />
              </div>
            </div>
          </template>
          <template #actualCount="scope">
            <el-input-number
              v-if="editCountRow?.id == scope.scope.row.id"
              size="small"
              class="w-30"
              v-model="scope.scope.row.actualCount"
              :precision="0"
              :step="1"
              :min="0"
              :max="getMax(scope.scope.row)"
              @change="inputChange(scope.scope.row)"
            />
            <div
              v-if="editCountRow?.id != scope.scope.row.id"
              @click="targetRowCol(1, scope.scope.row)"
              class="pointer"
            >
              {{ scope.scope.row.actualCount }}
            </div>
          </template>
          <template #perPrice="scope">
            <el-input-number
              v-if="editPriceRow?.id == scope.scope.row.id"
              size="small"
              class="w-30"
              v-model="scope.scope.row.perPrice"
              :precision="2"
              :step="0.01"
              @change="inputChange(scope.scope.row)"
            />
            <div
              v-if="editPriceRow?.id != scope.scope.row.id"
              @click="targetRowCol(2, scope.scope.row)"
              class="pointer"
            >
              {{ scope.scope.row.perPrice }}
            </div>
          </template>
          <template #priceRatio="scope">
            <el-input-number
              v-if="editTaxRow?.id == scope.scope.row.id"
              size="small"
              class="w-30"
              v-model="scope.scope.row.priceRatio"
              :precision="2"
              :step="0.01"
              :min="0"
              :max="1"
              @change="inputChange(scope.scope.row)"
            />
            <div
              v-if="editTaxRow?.id != scope.scope.row.id"
              @click="targetRowCol(3, scope.scope.row)"
              class="pointer"
            >
              {{ scope.scope.row.priceRatio }}
            </div>
          </template>
          <template #operate="scope">
            <el-icon
              class="fz20 pointer"
              text
              @click="removeMaterial(scope.scope.row)"
            >
              <Delete />
            </el-icon>
          </template>
        </baseTable>
      </div>
    </div>
    <zModel
      ref="modelRef"
      :style="{ width: '80%', height: '80%' }"
      custom-model-title="选择人员"
      :noConfirmBtnFlag="true"
      @confirm="() => {}"
    >
      <div class="flex-1 flex w-full h-full relative content-bg">
        <div class="left el-card">
          <tree
            :data="treeData"
            :expandedKeys="expandedKeys"
            :currentNodeKey="currentNodeKey"
            ref="deptTreeRef"
            @changeNode="changeNode($event)"
            placeholder="请输入部门名称"
            :propsObj="defaultProps"
            :searchFlag="true"
          >
          </tree>
        </div>
        <div class="flex-1 p-0 m-l-3 el-card">
          <div
            class="flex align-items-center justify-content-between m-t-2 m-b-2"
          >
            <div>
              <span class="m-r-2 m-l-2 fz12">名称</span>
              <el-input
                v-model="title"
                placeholder="请输入名称"
                class="w-50"
                @input="nameInputFunc"
              >
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
            </div>
            <el-button :type="'primary'" class="m-r-3" @click="savePerson()"
              >确定</el-button
            >
          </div>
          <div class="table-wrap">
            <baseTable
              ref="tableRef"
              :columns="userColumns"
              :table-data="userTableData"
              @currentChange="currentChange"
              class="h-full"
            >
            </baseTable>
          </div>
        </div>
      </div>
    </zModel>
    <zModel
      ref="materialRef"
      :style="{ width: '96%', height: '80%' }"
      custom-model-title="选择物料"
      :noConfirmBtnFlag="true"
      @confirm="() => {}"
    >
      <div class="flex-1 d-flex w-full h-full relative content-bg">
        <Material :materialIds="materialIds" @save="saveMaterial"></Material>
      </div>
    </zModel>
    <zModel
      ref="orderRef"
      :style="{ width: '96%', height: '80%' }"
      :custom-model-title="form.type === 3 ? '领料单' : '采购单'"
      :noConfirmBtnFlag="true"
      @confirm="() => {}"
    >
      <div class="flex-1 d-flex w-full h-full relative content-bg">
        <Order
          :id="form.resourceId"
          :stockId="form.stockId"
          :type="form.type"
          @save="saveOrder"
        ></Order>
      </div>
    </zModel>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { InStock, createInStock, editInStock } from "../api/inStock";
import { getDepartmentList } from "@pages/employeeManagement/api/department";
import { getEmployeeList } from "@pages/employeeManagement/api/employee";
import { ElMessage } from "element-plus";
import { getStockList } from "@pages/baseManagement/api/stock";
import { More, Search, CircleClose } from "@element-plus/icons-vue";
import { getSupplierList } from "@pages/baseManagement/api/supplier";
import { findMaterialListByIds } from "@pages/baseManagement/api/material";
import { useUserStore } from "@/pinia/stores/user";
import { getCategoryListByIds } from "@pages/baseManagement/api/category";
import { getUnitListByIds } from "@pages/baseManagement/api/unit";
import { getOutBoundApplyDetailList } from "@pages/outBoundApplyManagement/api/outBoundApplyDetail";
import { getPurchaseDetailList } from "@pages/purchaseManagement/api/purchaseDetail";
import { saveInStockDetail, deleteInStockDetail } from "../api/inStockDetail";
import baseTable from "@@/components/baseTable/baseTable.vue";
import zModel from "@static/components/zModel/zModel.vue";
import tree from "@@/components/tree/tree.vue";
import Material from "./material.vue";
import Order from "./resourceOrder.vue";
const props = defineProps<{
  data: InStock | null;
  stockId: string;
  onlyView: boolean;
}>();
const errorShow = ref(false);
const formRef = ref();
const title = ref("");
const selectProps = { value: "id", label: "name" };
const typeOptions = ref([
  { id: 1, name: "期初入库" },
  { id: 2, name: "采购入库" },
  { id: 3, name: "归还入库" },
  { id: 4, name: "其它入库" },
]);
const userStore = useUserStore();
//表单
const form = ref<InStock>({
  originOrderId: "",
  originOrderNo: "",
  stockId: props.stockId,
  inStockNo: "",
  auditStatus: 0,
  status: 0,
  supplyId: 0,
  type: 1,
  description: "",
  isDirect: 1,
  inStockUserId: "",
  inStockTime: new Date(),
  deptId: "",
  files: [],
  createUserId: userStore.getInfo()?.id,
});
const materialIds = ref<string[]>([]);
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
const inputChange = (row: any) => {
  row.totalPrice = Number(Number(+row.perPrice * +row.actualCount).toFixed(2));
  row.inStockPrice = Number(
    Number(row.totalPrice - row.inStockPrice * +row.priceRatio).toFixed(2)
  );
};
//合并props
if (props.data) {
  Object.assign(form.value, props.data);
}
// 校验规则
let validatorOriginOrderId = (rule: any, value: string, callback: Function) => {
  if (form.value.type === 1 || form.value.type === 4) callback();
  if (value.length === 0) {
    return callback(new Error("不能为空"));
  }
  callback();
};
const rules = reactive({
  inStockNo: [{ required: true, message: "不能为空" }],
  type: [{ required: true, message: "不能为空" }],
  inStockTime: [{ required: true, message: "不能为空" }],
  inStockUserName: [{ required: true, message: "不能为空" }],
  description: [{ required: true, message: "不能为空" }],
  originOrderNo: [
    {
      validator: validatorOriginOrderId,
      trigger: "blur",
    },
  ],
});
const userColumns = computed(() => [
  { prop: "index", label: "序号", type: 1, width: "20" },
  { prop: "realName", label: "名称" },
  { prop: "username", label: "用户名" },
  { prop: "code", label: "用户编号" },
]);
const columns = computed(() => {
  const result: any[] = [
    { prop: "index", label: "序号", type: 1, width: "20" },
    { prop: "materialTypeId", label: "类别" },
    { prop: "simpleName", label: "物料" },
    { prop: "brand", label: "品牌" },
    { prop: "modelNo", label: "型号" },
    { prop: "specification", label: "规格" },
    { prop: "unit", label: "单位" },
    { prop: "expectedCount", label: "原单数量" },
    { prop: "actualCount", label: "实际数量", type: props.onlyView ? 0 : 8 },
    { prop: "perPrice", label: "入库单价", type: props.onlyView ? 0 : 8 },
    { prop: "totalPrice", label: "总价" },
    { prop: "priceRatio", label: "税率", type: props.onlyView ? 0 : 8 },
    { prop: "inStockPrice", label: "入库总价(不含税)" },
  ];
  if (!props.onlyView)
    result.push({
      prop: "operate",
      type: 2,
      label: "操作",
      width: 100,
    });
  return result;
});
const getMax = (row: any) => {
  if (form.value.type === 1 || form.value.type === 4) {
    return Infinity;
  } else {
    return row.expectedCount;
  }
};
const inStockUserId = ref("");
const inStockUserName = ref("");
const currentChange = (row: any) => {
  inStockUserId.value = row.id;
  inStockUserName.value = row.realName;
};
const orderRef = ref();
const tableData = ref<any[]>([]);
const selectOrder = () => {
  if (form.value.type !== 2 && form.value.type !== 3) {
    return;
  }
  orderRef.value.openCustomModel();
};
const clearOrder = () => {
  form.value.stockId = "";
  form.value.inStockNo = "";
  materialIds.value = [];
  tableData.value = [];
};
const now = new Date();
//  禁用开始日期
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
const modelRef = ref<any>(null);
const userTableData = ref<any[]>([]);
const tableRef = ref();
const openModal = () => {
  modelRef.value.openCustomModel();
  nextTick(() => {
    const targetRow = userTableData.value.find(
      (row: any) => row.id === form.value.inStockUserId
    );
    if (targetRow) tableRef.value.setCurrentRow(targetRow);
  });
};
const saveOrder = async (data: any) => {
  form.value.resourceId = data?.resourceId;
  form.value.resourceNo = data?.resourceNo;
  orderRef.value.closeCustomModel();
  if (form.value.type == 3) {
    const res: any = await getOutBoundApplyDetailList({
      applyId: form.value.resourceId,
    });
    detailMap.value.clear();
    materialIds.value =
      res.data?.map((item: any) => {
        const { materialId } = item;
        detailMap.value.set(materialId, {
          ...item,
          expectedCount: item.actualCount,
          perPrice: Number(item?.material?.suggestedCostPrice ?? 0),
        });
        return materialId;
      }) ?? [];
    refreshTable();
  }
  if (form.value.type == 2) {
    const res: any = await getPurchaseDetailList({
      billId: form.value.resourceId,
    });
    detailMap.value.clear();
    materialIds.value =
      res.data?.map((item: any) => {
        const { materialId, count } = item;
        detailMap.value.set(materialId, {
          ...item,
          expectedCount: count,
          actualCount: count,
          perPrice: item?.perPrice ?? 0,
        });
        return materialId;
      }) ?? [];
    refreshTable();
  }
};
const materialRef = ref<any>();
const addMaterial = () => {
  materialRef.value.openCustomModel();
};
const removeMaterial = (row: any) => {
  ElMessageBox.confirm("确定要删除物料吗", "删除物料", {
    confirmButtonText: "删除",
    confirmButtonClass: "w-80",
    cancelButtonText: "取消",
    cancelButtonClass: "message-box-cancel-btn w-80",
    type: "warning",
  })
    .then(() => {
      materialIds.value = materialIds.value.filter(
        (id: any) => id !== row.materialId
      );
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      refreshTable();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除失败",
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
const defaultProps = {
  children: "children",
  label: "name",
};
const stockOptions = ref<any[]>([{ name: "无", id: 0 }]);
const queryStockOptions = async () => {
  const res = await getStockList();
  if ((res as any)?.data?.length) {
    stockOptions.value = buildTree((res as any)?.data || []);
    if (!props.data) form.value.stockId = stockOptions.value[0]?.id;
  }
};
const supplierOptions = ref<any[]>([{ name: "无", id: 0 }]);
const querySupplierOptions = async () => {
  const res = await getSupplierList();
  if ((res as any)?.data?.length) {
    supplierOptions.value = (res as any)?.data || [];
    supplierOptions.value.unshift({ name: "无", id: 0 });
    if (!props.data) form.value.supplyId = supplierOptions.value[0]?.id;
  }
};
function buildTree(departments: any[]) {
  const map = new Map();

  // 第一步：创建所有部门的映射并初始化children
  departments.forEach((dept: any) => {
    map.set(dept.id, {
      ...dept,
      children: [],
    });
  });

  // 第二步：建立所有层级的父子关系
  departments.forEach((dept: any) => {
    const current = map.get(dept.id);
    if (dept.parentId !== 0) {
      const parent = map.get(dept.parentId);
      if (parent) {
        parent.children.push(current);
      }
    }
  });

  // 第三步：收集顶级部门
  return departments
    .filter((dept: any) => dept.parentId === 0)
    .map((dept: any) => map.get(dept.id));
}
const departmentOptions = ref<any[]>([{ name: "无", id: 0 }]);
// 左侧树列表
const virtualRootId = "root";
const treeData: any = ref<any[]>([]);
//树列表默认展开建筑
const expandedKeys = ref<Array<number | string>>([virtualRootId]);
//树列表当前选中建筑
const currentNodeKey = ref<number | string>("");
const deptTreeRef = ref();
//左侧树列表 选中节点变化触发
const changeNode = (data: any) => {
  if (data.id === virtualRootId) {
    if (data.children.length > 0) {
      currentNodeKey.value = data?.children[0]?.id;
      deptTreeRef.value.setCurrentKey(currentNodeKey.value);
    } else {
      currentNodeKey.value = virtualRootId;
      return;
    }
  } else {
    currentNodeKey.value = data.id;
  }
  getUserList();
};
let errorTime: any;
const confirmSave = async (cb?: Function) => {
  try {
    const valid = await formRef.value.validate();
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
        inStockTime: new Date(form.value.inStockTime),
      };
      delete params["inStockUserName"];
      if (!params["approverCreateTime"]) delete params["approverCreateTime"];
      if (!params["approverUserId"]) delete params["approverUserId"];
      const api = params.id ? editInStock : createInStock;
      const res: any = await api(params);
      ElMessage({
        type: "success",
        message: "保存成功",
      });
      await deleteInStockDetail(res.data.id);
      const details = tableData.value.map((item: any) => {
        const {
          materialId,
          expectedCount,
          actualCount,
          perPrice,
          totalPrice,
          priceRatio,
          inStockPrice,
        } = item;
        const result: any = {
          inStockId: res.data.id,
          materialId,
          stockId: form.value.stockId,
          expectedCount,
          actualCount,
          perPrice,
          totalPrice,
          priceRatio,
          inStockPrice,
        };
        return result;
      });
      await saveInStockDetail(details);
      ElMessage({
        type: "success",
        message: props.data ? "编辑成功" : "新增成功",
      });
      cb && cb(res.data);
    }
  } catch (error) {
    return false;
  }
};
const queryDepartmentOptions = async () => {
  const res = await getDepartmentList();
  if ((res as any)?.data?.length) {
    departmentOptions.value = buildTree((res as any)?.data || []);
    treeData.value = buildTree((res as any)?.data || []);
    if (!props.data) form.value.deptId = departmentOptions.value[0]?.id;
    getUserList();
  }
};
const getUserList = async () => {
  const params: any = {
    departmentId: currentNodeKey.value,
  };
  if (title.value.length) params.realName = title.value;
  const res: any = await getEmployeeList(params);
  userTableData.value = res.data;
};
let nameTimer: any = null;
const nameInputFunc = () => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => {
    getUserList();
  }, 400);
};
const download = (file: any) => {
  const a = document.createElement("a");
  a.download = file.fileName;
  const blobUrl = file.filePath;
  a.href = blobUrl;
  a.click();
};
const remove = (file: any, index: number) => {};
const beforeUpload = (file: File) => {
  form.value.files.push(file);
  return false;
};
const queryCategoryList = async (ids: string[]) => {
  const res = await getCategoryListByIds(ids);
  (res as any).data.map((item: any) => {
    categoryMap.value.set(item.id, item);
  });
};
const categoryMap = ref<Map<string, any>>(new Map());
const unitMap = ref<Map<string, any>>(new Map());
const getUnitList = async (ids: string[]) => {
  unitMap.value.clear();
  const res = await getUnitListByIds(ids);
  (res as any).data.map((item: any) => {
    unitMap.value.set(item.id, item);
  });
};
const hasAddMap = new Map();
const detailMap = ref<Map<String, any>>(new Map());
const refreshTable = async () => {
  if (materialIds.value.length === 0) {
    tableData.value = [];
    return;
  }
  const ids = materialIds.value.join(",");
  const res: any = await findMaterialListByIds(ids);
  hasAddMap.clear();
  tableData.value.map((item: any) => {
    const { materialId } = item;
    hasAddMap.set(materialId, item);
  });
  const categoryIds = res.data.map((item: any) => item.materialTypeId);
  if (categoryIds.length) await queryCategoryList(categoryIds);
  const unitIds = res.data.map((item: any) => item.unit);
  if (unitIds.length) await getUnitList(unitIds);
  tableData.value = res.data.map((item: any) => {
    const row = {
      expectedCount: "",
      actualCount: 0,
      perPrice: 0,
      totalPrice: 0,
      priceRatio: 0,
      inStockPrice: 0,
    };
    const detail = detailMap.value.get(item.id);
    const lastData = hasAddMap.get(item.id);
    if (detail) {
      Object.assign(row, detail);
    }
    const result = lastData ?? { ...item, ...row, materialId: item.id };
    return result;
  });
  detailMap.value.clear();
};

onMounted(async () => {
  await queryDepartmentOptions();
  await queryStockOptions();
  await querySupplierOptions();
});
defineExpose({ confirmSave });
</script>
<style lang="scss" scoped>
@use "@@/assets/styles/size.scss" as *;
.width-300 {
  width: zrem(300);
}

.table-wrap {
  height: calc(100% - zrem(45));
}
.files-wrap {
  border: zrem(1) solid var(--el-border-color);
  border-radius: zrem(8);
  padding: zrem(10);
  height: zrem(90);
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
