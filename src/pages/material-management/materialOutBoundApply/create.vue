<template>
  <div class="flex-1 flex-column h-full">
    <div class="wrap">
      <div class="d-flex h-full">
        <div class="fill-bg radius p-16 m-r-8">
          <div class="zc-header-title">
            <div class="zc-header-icon"></div>
            <div class="zc-header-word">
              {{ i18nM("material.title.materialApply") }}
            </div>
          </div>
          <el-form ref="formRef" :model="form" :rules="rules" label-position="right" class="d-flex relative m-r-10 m-t-20" :label-width="zrem(120)">
            <div class="d-flex" v-if="onlyView">
              <div class="m-r-30">
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.applicationForm") }}</div>
                  <div>{{ form.applyNo }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.title.materialWarehouse") }}</div>
                  <div>{{ findNameById(sourceOptions, form.stockId) }}</div>
                </div>

                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.applicationTime") }}</div>
                  <div>{{ new Date(form.applyTime).toLocaleString().replace(/\//g, "-") }}</div>
                </div>

                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.applicationDepartment") }}</div>
                  <div>{{ form.deptName }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.label.applicant") }}</div>
                  <div>{{ form.applyUserName }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.usage") }}</div>
                  <div>{{ form.useage }}</div>
                </div>
                <div class="d-flex row align-items-center">
                  <div>{{ i18nM("material.table.notes") }}</div>
                  <div>{{ form.description }}</div>
                </div>
              </div>
            </div>
            <div class="d-flex" v-else>
              <div class="m-r-30">
                <el-form-item :label="i18nM('material.table.applicationForm')" prop="applyNo">
                  <el-input
                    v-model="form.applyNo"
                    class="w-200"
                    :placeholder="i18nM('material.placeholder.applyNo')"
                    maxlength="32"
                    required
                    :disabled="onlyView"
                  >
                    <template #append>
                      <el-button :icon="Search" />
                    </template>
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
                    :disabled="onlyView || !!tableData.length"
                    class="w-200"
                  />
                </el-form-item>

                <el-form-item :label="i18nM('material.table.applicationTime')" prop="applyTime">
                  <el-date-picker
                    :disabled="onlyView"
                    v-model="form.applyTime"
                    type="datetime"
                    :disabled-date="disabledDate"
                    :disabled-hours="disabledHours"
                    :disabled-minutes="disabledMinutes"
                    :placeholder="i18nM('material.placeholder.select')"
                  />
                </el-form-item>
                <el-form-item :label="i18nM('material.label.applicationDepartment')" prop="deptName"
                  ><el-input class="w-200" disabled v-model="form.deptName" :placeholder="i18nM('material.placeholder.select')">
                    <template #append>
                      <el-button :icon="More" @click="openModal" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="i18nM('material.label.applicant')" prop="applyUserName"
                  ><el-input class="w-200" disabled v-model="form.applyUserName" :placeholder="i18nM('material.placeholder.select')">
                    <template #append>
                      <el-button :icon="More" @click="openModal" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="i18nM('material.table.usage')" prop="useage" class="dept">
                  <el-input
                    :disabled="onlyView"
                    class="w-200"
                    v-model="form.useage"
                    type="textarea"
                    :placeholder="i18nM('material.placeholder.inputUse')"
                    maxlength="64"
                  ></el-input>
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
              <span v-if="errorShow" class="error m-r-8">{{ i18nM("material.error.applyDetailCannotBeEmpty") }}</span>
              <el-button :type="'primary'" @click="addMaterial" v-if="!onlyView">
                <img :src="AddIcon" width="16" height="16" class="el-icon" />
                <span>{{ i18nM("material.button.addition") }}</span>
              </el-button>
            </div>
          </div>
          <div class="flex-1 table-wrap" ref="tableWrapRef">
            <baseTable :columns="columns" :table-data="tableData" :tableProps="tableProps">
              <template #applyCount="scope">
                <el-input-number
                  v-if="editCountRow?.id == scope.scope.row.id"
                  size="small"
                  class="w-90"
                  v-model="scope.scope.row.applyCount"
                  :precision="0"
                  :step="1"
                  :min="0"
                  :max="scope.scope.row.inventoryCount"
                />
                <div v-if="editCountRow?.id != scope.scope.row.id" @click="targetRowCol(1, scope.scope.row)" class="pointer">
                  {{ scope.scope.row.applyCount }}
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
  </div>
</template>
<script setup lang="ts">
import AddIcon from "@static/images/add.png";
import { ref, reactive, onMounted, computed, nextTick } from "vue";
import { MaterialApply, saveMaterialApply, generateApplyNo } from "@functions/serviceCenter/material-management/api/materialOutBoundApply";
import {
  saveMaterialApplyDetail,
  deleteMaterialApplyDetail,
  getMaterialApplyDetail,
} from "@functions/serviceCenter/material-management/api/materialOutBoundApplyDetail";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { materialPage } from "@functions/serviceCenter/material-management/api/material";
import { postMaterialStockDetailList } from "@functions/serviceCenter/material-management/api/materialStockDetail";
import { ElMessage, ElMessageBox } from "element-plus";
import { More, Search, CircleClose } from "@element-plus/icons-vue";
import { zrem } from "@static/js/theme/zrem";
import zModel from "@static/components/zModel/zModel.vue";
import tree, { TreeNode } from "@static/elementUI/tree/tree.vue";
import baseTable from "@static/table/baseTable/baseTable.vue";
import { enterprisesPage } from "@functions/userCenter/api/enterprises";
import { getDeptTreeByCurUserId, postDepartmentsByIds } from "@functions/userCenter/api/departments";
import { usersGetByDeptId, usersGet } from "@functions/userCenter/api/users";
import { nameToLabel } from "@static/js/page/data";
import Material from "@functions/serviceCenter/material-management/materialOutBoundApply/material.vue";
const props = defineProps<{ data: MaterialApply | null; projectId: string | number; stockId: string | number; onlyView: boolean }>();
const i18nM = window.$i18nM;
const formRef = ref();
const title = ref("");
const tableRef = ref();
const tableWrapRef = ref();
const tableProps = ref({
  highlightCurrentRow: false,
});
const editCountRow = ref<any>(null);
const targetRowCol = (type: number, e: any) => {
  if (props.onlyView) return;
  editCountRow.value = e;
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

//表单
const form = ref<MaterialApply>({
  projectId: props.projectId,
  stockId: props.stockId,
  applyNo: "",
  status: 0,
  applyStatus: 0,
  description: "",
  useage: "",
  applyUserId: "",
  applyTime: new Date(),
  deptId: "",
  deptName: "",
});
const materialIds = ref<string[]>([]);
if (props.data) {
  Object.assign(form.value, props.data);
}

const rules = reactive({
  applyNo: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  stockId: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  applyTime: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  applyUserName: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  deptName: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  description: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
  useage: [{ required: true, message: i18nM("material.error.cannotBeEmpty") }],
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
    { prop: "code", label: i18nM("material.table.code") },
    { prop: "simpleName", label: i18nM("material.table.material") },
    { prop: "brand", label: i18nM("material.table.brand") },
    { prop: "specification", label: i18nM("material.table.specifications") },
    { prop: "unitName", label: i18nM("material.table.unit") },
    { prop: "applyCount", label: i18nM("material.table.applyCount"), type: props.onlyView ? 0 : 8 },
    { prop: "actualCount", label: i18nM("material.table.actualQuantity") },
    { prop: "inventoryCount", label: i18nM("material.table.inventoryCount") },
  ];
  if (!props.onlyView) result.push({ prop: "operate", type: 2, label: i18nM("material.table.operate"), width: 100 });
  return result;
});
const now = new Date();
// // 禁用开始日期
const disabledDate = (time: Date) => {
  return time.getTime() < now.getTime();
};
const disabledHours = () => {
  if (!form.value.applyTime) return [];

  const selectedDate = new Date(form.value.applyTime);
  const isToday = selectedDate.toDateString() === now.toDateString();

  if (isToday) {
    const currentHour = now.getHours();
    return Array.from({ length: currentHour }, (_, i) => i);
  }
  return [];
};

const disabledMinutes = () => {
  if (!form.value.applyTime) return [];

  const selectedDate = new Date(form.value.applyTime);
  const isToday = selectedDate.toDateString() === now.toDateString();
  const isCurrentHour = selectedDate.getHours() === now.getHours();

  if (isToday && isCurrentHour) {
    const currentMinute = now.getMinutes();
    return Array.from({ length: currentMinute }, (_, i) => i);
  }
  return [];
};
const applyUserId = ref("");
const applyUserName = ref("");
const currentChange = (row: any) => {
  applyUserId.value = row?.id || "";
  applyUserName.value = row?.name || "";
};
const modelRef = ref<any>(null);
const openModal = () => {
  modelRef.value.openCustomModel();
  nextTick(() => {
    const targetRow = userTableData.value.find((row: any) => row.id === form.value.applyUserId);
    if (targetRow) tableRef.value.setCurrentRow(targetRow);
  });
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
  form.value.deptId = departmentCurrentNodeKey.value;
  form.value.applyUserId = applyUserId.value;
  form.value.applyUserName = applyUserName.value;
  form.value.deptName = departTreeRef.value.getCurrentNode()?.name || "";
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
  departmentCurrentNodeKey.value = data.id;
};
const queryEnterprise = (cb?: Function) => {
  enterprisesPage(
    {
      parentId: enterpriseCurrentNodeKey.value,
      page: null,
      size: null,
      abbreviation: enterpriseSearch || null,
    },
    (res: any) => {
      enterChangeFunc(nameToLabel(res.data.content, "abbreviation"), form.value?.enterpriseId ?? res.data.content?.[0]?.id);
      getDepartmentLeftList(cb);
    }
  );
};
const getSelectedEnterprise = (cb?: Function) => {
  postDepartmentsByIds([String(form.value.deptId)], (res: any) => {
    form.value.enterpriseId = res?.data?.[0]?.enterpriseId ?? "";
    cb && cb();
  });
};
/**
 * 获取企业列表
 * @param rightListFlag
 */
const getEnterpriseList = (cb?: Function) => {
  if (props.data) {
    getSelectedEnterprise(() => {
      queryEnterprise(cb);
    });
  } else {
    queryEnterprise(cb);
  }
};
const departmentMap = ref<Map<string, string>>(new Map());

/**
 * 获取左侧部门树形列表
 */
const getDepartmentLeftList = (cb?: Function) => {
  getDeptTreeByCurUserId(
    {
      enterPriseId: enterpriseCurrentNodeKey.value,
    },
    (res: any) => {
      res.data.map((item: any, index: number) => {
        const { id, name } = item;
        departmentMap.value.set(id, name);
        if (index === 0) {
          departmentCurrentNodeKey.value = id;
        }
      });
      departTreeData.value = res.data;
      getUserList();
      cb && cb();
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
  getEnterpriseList();
};
/**
 * 点击左侧部门事件
 * @param dp
 */
const dpChange = (dp: any) => {
  departmentCurrentNodeKey.value = dp.id;
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
  getEnterpriseList();
};
const getUserList = () => {
  const params: any = {
    deptId: Number(departmentCurrentNodeKey.value),
    page: 0,
    size: 1000,
  };
  if (title.value.length) params.name = title.value;
  usersGetByDeptId(params, (res: any) => {
    applyUserId.value = "";
    applyUserName.value = "";
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
        applyTime: new Date(form.value.applyTime).getTime(),
      };
      delete params["applyUserName"];
      delete params["details"];
      if (!params["approverCreateTime"]) delete params["approverCreateTime"];
      if (!params["approverUserId"]) delete params["approverUserId"];
      saveMaterialApply(params, (res: any) => {
        if (res.code) {
          const params: any = tableData.value.map((item: any) => {
            const { tradeId, applyCount, actualCount } = item;
            const result = {
              projectId: props.projectId,
              applyId: res.data.id,
              tradeId,
              actualCount,
              applyCount,
            };
            return result;
          });
          saveMaterialApplyDetail(params, (saveRes: any) => {
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
};
const materialMap = ref<Map<string, any>>(new Map());
const queryMaterial = (cb: Function) => {
  const params: any = {
    projectId: props.projectId,
    tradeIds: materialIds.value,
    stockId: form.value.stockId,
  };
  postMaterialStockDetailList(params, (res: any) => {
    materialMap.value.clear();
    res.data.map((item: any) => {
      materialMap.value.set(item.tradeId, item);
    });
    cb();
  });
};
const hasAddMap = new Map();
const refreshTable = () => {
  if (materialIds.value.length === 0) {
    tableData.value = [];
    return;
  }
  queryMaterial(() => {
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
        const row: any = { applyCount: 0, actualCount: item.actualCount };
        const material = materialMap.value.get(item.id);
        const detail = detailMap.value.get(item.id);
        const lastData = hasAddMap.get(item.id);
        if (detail) {
          Object.assign(row, detail);
        }
        if (material) {
          row.inventoryCount = Number(material.count);
        }
        const result = lastData ?? { ...item, ...row, tradeId: item.id };
        return result;
      });
      detailMap.value.clear();
    });
  });
};

const detailMap = ref<Map<String, any>>(new Map());
onMounted(() => {
  getEnterpriseList(() => {
    if (props.data) {
      form.value.deptName = findNameById(departTreeData.value, form.value.deptId);
      departmentCurrentNodeKey.value = form.value.deptId;
    }
  });

  materialStockFindStockTree({ projectId: props.projectId }, (res: any) => {
    sourceOptions.value = res.data;
  });
  if (props?.data?.id) {
    usersGet({ userId: String(props.data.applyUserId) }, (res: any) => {
      form.value.applyUserName = res.data.name;
    });
    getMaterialApplyDetail({ applyId: props.data.id }, (res: any) => {
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
    generateApplyNo((res: any) => {
      form.value.applyNo = res.data;
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
