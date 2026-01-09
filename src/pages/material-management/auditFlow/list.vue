<template>
  <div class="d-flex h-full w-full">
    <div class="flex-1 d-flex h-full w-full" v-if="!processFlag">
      <div class="left h-full">
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
      <div class="right flex-1 flex-column h-full">
        <div class="zc-header d-flex align-items-center justify-content-between">
          <div class="title d-flex w-200">
            <div class="titleIcon"></div>
            <span>{{ i18nM("material.label.disposalFlow") }}</span>
          </div>
          <div class="d-flex flex-1 align-items-center justify-content-between">
            <div>
              <template v-if="Array.isArray(projects)">
                <span class="m-r-8">{{ i18nM("material.label.project") }}</span>
                <el-select class="select-item" v-model="projectId" :placeholder="i18nM('material.placeholder.select')" @change="projectChange()">
                  <el-option v-for="item of projects" :key="item.projectId" :value="item.projectId" :label="projectMap[item.projectId]"></el-option>
                </el-select>
              </template>
              <span class="m-r-8 m-l-10">{{ i18nM("material.label.name") }}</span>
              <el-input v-model="title" :placeholder="i18nM('material.placeholder.name')" class="w-200" @input="nameInputFunc">
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
            </div>
            <div>
              <el-button class="m-r-20" :type="'primary'" @click="create" v-if="hasPermission(PermissionType.Create, permissions)">
                <img :src="AddIcon" width="16" height="16" class="el-icon" />
                <span>{{ i18nM("material.button.add") }}</span>
              </el-button>
            </div>
          </div>
        </div>
        <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
          <div ref="tableRef" class="flex-1 table-wrap">
            <baseTable :columns="columns" :table-data="tableData" :indexMethod="indexMethod(currentPage, pageSize)">
              <template #deptId="scope">
                {{ getDepartment(scope.scope.row.deptId) }}
              </template>
              <template #resourceId="scope">
                {{ findNameById(sourceOptions, scope.scope.row.resourceId) }}
              </template>
              <template #resourceType="scope">
                {{ getName(scope.scope.row.resourceType) }}
              </template>

              <template #enable="scope">
                <el-switch
                  v-model="scope.scope.row.enable"
                  :inactive-value="0"
                  :active-value="1"
                  :disabled="!hasPermission(PermissionType.Update, permissions)"
                  @change="changeStatus(scope.scope.row)"
                />
              </template>
              <template #operate="scope">
                <el-icon class="fz20 m-r-20 pointer" @click="edit(scope.scope.row)" v-if="hasPermission(PermissionType.Update, permissions)">
                  <Edit />
                </el-icon>
                <el-icon class="fz20 pointer" text @click="deleteFunc(scope.scope.row)" v-if="hasPermission(PermissionType.Delete, permissions)">
                  <Delete />
                </el-icon>
              </template>
            </baseTable>
          </div>
          <div class="zc-footer d-flex align-items-center justify-content-end" v-if="totalItems > 0">
            <pagination
              :page-size="pageSize"
              :current-page="currentPage + 1"
              :total="totalItems"
              @pageChange="pageChange($event)"
              @sizeChange="sizeChange($event)"
              class="zc-page"
            ></pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 flex-column h-full create-wrap" :class="{ 'fill-bg': processFlag != 2 }" v-if="processFlag">
      <Create ref="createRef" :data="currentData" :deptId="departmentCurrentNodeKey" :projectId="projectId" v-if="processFlag === 1"> </Create>
      <Step
        ref="stepRef"
        :data="currentData"
        :deptId="departmentCurrentNodeKey"
        :enterpriseId="enterpriseCurrentNodeKey"
        :projectId="projectId"
        v-if="processFlag === 2 && currentData"
      >
      </Step>
      <div class="zc-footer p-r-20 p-l-20 d-flex align-items-center" style="justify-content: flex-end">
        <div>
          <el-button :type="'primary'" class="m-r-16 w-80" v-if="processFlag !== 1" @click="prev()">{{ i18nM("material.button.prev") }}</el-button>
          <el-button :type="'primary'" class="m-r-16 w-80" v-if="processFlag == 1" @click="next()">{{ i18nM("material.button.next") }}</el-button>
          <el-button class="w-80" plain @click="back()">{{ i18nM("material.button.back") }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import AddIcon from "@static/images/add.png";
import useMenuStore from "@static/js/store/menu";
import tree, { TreeNode } from "@static/elementUI/tree/tree.vue";
import { ref, computed, onMounted } from "vue";
import { indexMethod } from "@static/js/common/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { ComponentPropsType } from "@static/js/page/props";
import baseTable from "@static/table/baseTable/baseTable.vue";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { getPageSizeCount, getPageCount } from "@static/js/page/utils";
import { PermissionType, hasPermission } from "@static/js/page/permission";
import { getNameMapByIds } from "@functions/serviceCenter/tenant-management/api/projects";
import {
  getFlowPage,
  queryFlowPageParams,
  editFlowEnable,
  deleteFlow,
  Flow,
} from "@functions/serviceCenter/material-management/api/materialAuditFlow";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { enterprisesPage } from "@functions/userCenter/api/enterprises";
import { getDeptTreeByCurUserId } from "@functions/userCenter/api/departments";
import { nameToLabel } from "@static/js/page/data";
import { Search } from "@element-plus/icons-vue";
import Create from "@functions/serviceCenter/material-management/auditFlow/create.vue";
import Step from "@functions/serviceCenter/material-management/auditFlow/step.vue";
const i18nM = window.$i18nM;
const tableRef = ref();
const stepRef = ref();
const title = ref("");
const createRef = ref();
const processFlag = ref(0);
const menuStore = useMenuStore();
const props = defineProps<ComponentPropsType>();
const permissions = computed(() => menuStore.getComponentPermissions(props.configData?.operateTypes));
const currentData = ref<Flow | null>(null);
const addDataFlag = ref(false);
const tableData = ref([]);
const enterTreeRef = ref();
const departTreeRef = ref();
const enterTreeData = ref<TreeNode[]>([]);
const departTreeData = ref<TreeNode[]>([]);
const defaultProps = {
  children: "children",
  label: "name",
};
const typeOptions = computed(() => {
  return [
    { id: 1, name: i18nM("material.label.stockIn") },
    { id: 2, name: i18nM("material.label.stockOut") },
    { id: 3, name: i18nM("material.label.pickUpSupplies") },
    { id: 4, name: i18nM("material.label.stocktaking") },
    { id: 5, name: i18nM("material.label.purchase") },
  ];
});
const getName = (id: number) => {
  return typeOptions.value.find((item: any) => item.id === id)?.name;
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
//编辑时保存编辑前选中的部门
const oldDepartmentCurrentNodeKey = ref<any>(0);
//左侧部门搜索条件
let departmentLeftSearch = "";
//编辑时选中的对象
const info = ref<any>({});
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
const getDepartment = (id: string) => {
  return departmentMap.value.get(id);
};
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
      });
      departTreeData.value = res.data;
      changeRightTable();
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
  getEnterpriseList(true);
};
/**
 * 点击左侧部门事件
 * @param dp
 */
const dpChange = (dp: any) => {
  departmentCurrentNodeKey.value = dp.id;
  changeRightTable();
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

const columns = computed(() => [
  { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
  { prop: "title", label: i18nM("material.table.name") },
  { prop: "resourceId", label: i18nM("material.table.materialLibrary"), type: 2 },
  { prop: "deptId", label: i18nM("material.table.department"), type: 2 },
  { prop: "resourceType", label: i18nM("material.table.type") },
  { prop: "remark", label: i18nM("material.table.notes") },
  { prop: "enable", label: i18nM("material.table.enable") },
  { prop: "operate", type: 2, label: i18nM("material.table.operate"), width: 100 },
]);

const projects = ref(window.$HyGlobal.getCurrentProject()?.projects);
const projectId = ref(window.$HyGlobal.getCurrentProject()?.projects?.[0]?.projectId || 0);
const projectMap = ref<any>({});
if (Array.isArray(projects.value) && projects.value.length > 0) {
  let ids = [];
  for (let item of projects.value) {
    ids.push(item.projectId);
  }
  getNameMapByIds(ids, (res: any) => {
    projectMap.value = res.data;
  });
}

const changeStatus = (row: any) => {
  if (row.id) {
    editFlowEnable(
      {
        enable: row.enable,
        id: row.id,
      },
      (res: any) => {
        if (res.code) {
          ElMessage({
            type: "success",
            message: i18nM("material.message.editSuccess"),
          });
          refreshTable();
        }
      }
    );
  }
};
const projectChange = () => {
  materialStockFindStockTree({ projectId: projectId.value }, (res: any) => {
    sourceOptions.value = res.data;
    refreshTable();
  });
};
//分页
const pageSize = ref(0);
const currentPage = ref(0);
const totalItems = ref(0);
const pageChange = (page: any) => {
  currentPage.value = page - 1;
  refreshTable();
};
const sizeChange = (i: number) => {
  currentPage.value = i;
  refreshTable();
};
const refreshTable = () => {
  const params: queryFlowPageParams = {
    projectId: projectId.value,
    page: currentPage.value,
    size: pageSize.value,
    deptId: departmentCurrentNodeKey.value,
  };
  if (title.value.length) params.title = title.value;

  getFlowPage(params, (res: any) => {
    tableData.value = res.data.content;
    totalItems.value = res.data.totalElements;
  });
};

let nameTimer: any = null;
const nameInputFunc = () => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};

//重新计算表格每页条数
const changeRightTable = () => {
  if (tableRef.value) {
    getPageSizeCount(
      tableRef.value,
      (count: number) => {
        pageSize.value = count;
        if (addDataFlag.value) {
          const pageCount = getPageCount(totalItems.value + 1, pageSize.value);
          currentPage.value = pageCount;
          addDataFlag.value = false;
        } else {
          const pageCount = getPageCount(totalItems.value, pageSize.value);
          if (currentPage.value > pageCount) currentPage.value = pageCount;
        }
        refreshTable();
      },
      { header: 62 }
    );
  }
};
const next = () => {
  if (processFlag.value == 1) {
    if (!currentData?.value?.id) {
      addDataFlag.value = true;
    }
    createRef.value.confirmSave((data: Flow) => {
      currentData.value = data;
      processFlag.value = 2;
    });
  }
};
const prev = () => {
  processFlag.value = 1;
};

const edit = (row: any) => {
  currentData.value = row;
  processFlag.value = 1;
};
const create = () => {
  currentData.value = null;
  processFlag.value = 1;
};
const back = () => {
  if (processFlag.value == 2) {
    const valid = stepRef.value.confirmSave();
    if (!valid) return;
  }
  processFlag.value = 0;
  currentData.value = null;
  refreshTable();
};
const deleteFunc = (row: any) => {
  ElMessageBox.confirm(i18nM("material.confirm.deleteFlow"), i18nM("material.title.deleteFlow"), {
    confirmButtonText: i18nM("material.button.delete"),
    confirmButtonClass: "w-80",
    cancelButtonText: i18nM("material.button.cancel"),
    cancelButtonClass: "message-box-cancel-btn w-80",
    type: "warning",
  })
    .then(() => {
      if (row.enable === 1) {
        ElMessage({
          type: "error",
          message: i18nM("material.error.flowEnabledCannotDelete"),
        });
        return;
      } else {
        deleteFlow({ id: row.id }, (res: any) => {
          if (res.code) {
            ElMessage({
              type: "success",
              message: i18nM("material.message.deleteSuccess"),
            });
            refreshTable();
          } else {
            ElMessage({
              type: "info",
              message: i18nM("material.message.deleteFailed"),
            });
          }
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: i18nM("material.message.cancelDelete"),
      });
    });
};
const sourceOptions = ref<any[]>([]);

function findNameById(tree: any[], targetId: string) {
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
onMounted(() => {
  materialStockFindStockTree({ projectId: projectId.value }, (res: any) => {
    sourceOptions.value = res.data;
    const children = enterTreeData.value;
    getEnterpriseList(Array.isArray(children) && children.length ? false : true);
  });
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.titleIcon {
  margin-right: zrem(10);
  width: zrem(5);
  background-color: var(--el-color-primary);
}
.select-item {
  width: zrem(180);
}
</style>
