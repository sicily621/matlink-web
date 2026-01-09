<template>
  <div class="d-flex h-full w-full">
    <div class="flex-1 d-flex h-full w-full" v-if="!processFlag">
      <div class="flex-1 flex-column h-full">
        <div class="zc-header d-flex align-items-center justify-content-between">
          <div class="d-flex flex-1 align-items-center">
            <div class="d-flex align-items-center">
              <div class="title d-flex w-150">
                <div class="titleIcon"></div>
                <span>{{ i18nM("material.title.materialApprove") }}</span>
              </div>
              <template v-if="Array.isArray(projects)">
                <span class="m-r-8">{{ i18nM("material.label.project") }}</span>
                <el-select
                  class="select-item"
                  v-model="projectId"
                  :placeholder="i18nM('material.placeholder.selectProject')"
                  @change="projectChange()"
                >
                  <el-option v-for="item of projects" :key="item.projectId" :value="item.projectId" :label="projectMap[item.projectId]"></el-option>
                </el-select>
              </template>
              <span class="m-r-8 m-l-16">{{ i18nM("material.label.oddNumbers") }}</span>
              <el-input class="w-150 m-r-8" v-model="applyNo" :placeholder="i18nM('material.placeholder.inputOddNumbers')"
                ><template #append> <el-button :icon="Search" /> </template>
              </el-input>
              <span class="m-r-8 m-l-16">{{ i18nM("material.label.materialIssueStatus") }}</span>
              <el-select class="select-item" v-model="applyStatus" :placeholder="i18nM('material.placeholder.select')" @change="refreshTable()">
                <el-option v-for="item of applyStatusOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
              <span class="m-r-8 m-l-16">{{ i18nM("material.label.reviewStatus") }}</span>
              <el-select class="select-item" v-model="reviewStatus" :placeholder="i18nM('material.placeholder.select')" @change="refreshTable()">
                <el-option v-for="item of reviewStatusOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
              <span class="m-r-8 m-l-16">{{ i18nM("material.label.time") }}</span>
              <el-date-picker
                v-model="timeValue"
                type="daterange"
                :start-placeholder="i18nM('material.placeholder.startTime')"
                :end-placeholder="i18nM('material.placeholder.endTime')"
                :default-time="defaultTime"
                @change="refreshTable()"
              />
            </div>
          </div>
        </div>
        <div class="flex-1 d-flex content-wrap w-full">
          <div class="left h-full">
            <div class="flex1 flex-column h-full">
              <div class="flex-1" style="height: 50%">
                <tree
                  :data="treeData"
                  ref="treeRef"
                  :propsObj="defaultProps"
                  :expandedKeys="expandedKeys"
                  :currentNodeKey="currentNodeKey"
                  @changeNode="enterChange($event)"
                  :placeholder="i18nM('material.placeholder.selectMaterialCategory')"
                >
                </tree>
              </div>
            </div>
          </div>
          <div class="right flex-1 flex-column h-full">
            <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
              <div ref="tableRef" class="flex-1 table-wrap">
                <baseTable :columns="columns" :table-data="tableData" :indexMethod="indexMethod(currentPage, pageSize)">
                  <template #stockId="scope">
                    {{ findNameById(treeData, scope.scope.row.stockId) }}
                  </template>
                  <template #applyStatus="scope">
                    {{ findNameById(applyStatusOptions, scope.scope.row.applyStatus) }}
                  </template>
                  <template #status="scope">
                    {{ findNameById(reviewStatusOptions, scope.scope.row.status) }}
                  </template>
                  <template #applyUserId="scope">
                    {{ userNameMap?.[scope.scope.row.applyUserId] ?? "-" }}
                  </template>
                  <template #approveUserId="scope">
                    {{ userNameMap?.[scope.scope.row.approveUserId] ?? "-" }}
                  </template>
                  <template #createUserId="scope">
                    {{ userNameMap?.[scope.scope.row.createUserId] ?? "-" }}
                  </template>
                  <template #createTime="scope">
                    {{ scope.scope.row.createTime ? new Date(scope.scope.row.createTime).toLocaleString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #applyTime="scope">
                    {{ scope.scope.row.applyTime ? new Date(scope.scope.row.applyTime).toLocaleString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #approveTime="scope">
                    {{ scope.scope.row.approveTime ? new Date(scope.scope.row.approveTime).toLocaleString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #operate="scope">
                    <IconSvg
                      :src="Approve"
                      class="fz20 m-r-20 pointer"
                      v-if="hasPermission(PermissionType.Update, permissions) && scope.scope.row.hasApprovalAuth"
                      @click="toApprove(scope.scope.row)"
                    ></IconSvg>
                    <el-icon class="fz20 m-r-20 pointer" v-if="hasPermission(PermissionType.Read, permissions)" @click="showDetail(scope.scope.row)">
                      <View />
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
      </div>
    </div>
    <div class="flex-1 flex-column h-full create-wrap w-full" v-if="processFlag && currentData">
      <Create
        ref="createRef"
        class="content-wrap"
        :data="currentData"
        :stockId="currentNodeKey"
        :projectId="projectId"
        :approve="approve"
        v-if="processFlag === 1"
      >
      </Create>
      <div class="zc-footer p-r-20 p-l-20 d-flex align-items-center" style="justify-content: flex-end">
        <div>
          <el-button :type="'primary'" class="m-r-16 w-80" v-if="processFlag === 1 && !onlyView" @click="save()">{{
            i18nM("material.button.save")
          }}</el-button>
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
  queryApplyApprovedListParams,
  MaterialApply,
  postApplyApprovedList,
  updateApplyStatus,
} from "@functions/serviceCenter/material-management/api/materialOutBoundApply";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { usersGetNameMapByIds } from "@functions/userCenter/api/users";
import Create from "@functions/serviceCenter/material-management/materialOutBoundApplyApprove/create.vue";
import Approve from "@functions/serviceCenter/material-management/materialOutBoundApplyApprove/approve.svg";
import IconSvg from "@static/components/iconSvg/iconSvg.vue";
import { Search } from "@element-plus/icons-vue";
import { watchDebounced } from "@vueuse/core";
const i18nM = window.$i18nM;
const tableRef = ref();
const applyNo = ref("");
watchDebounced(
  applyNo,
  () => {
    refreshTable();
  },
  { debounce: 500, maxWait: 1000 }
);
const reviewStatus = ref(-1);
const reviewStatusOptions = computed(() => {
  return [
    { id: -1, name: i18nM("material.enumValue.all") },
    { id: 0, name: i18nM("material.enumValue.pendingReview") },
    { id: 3, name: i18nM("material.enumValue.underReview") },
    { id: 2, name: i18nM("material.enumValue.approved") },
    { id: 1, name: i18nM("material.enumValue.rejected") },
  ];
});
const onlyView = ref(false);
const applyStatus = ref(-1);
const applyStatusOptions = computed(() => {
  return [
    { id: -1, name: i18nM("material.enumValue.all") },
    { id: 0, name: i18nM("material.enumValue.unclaimed") },
    { id: 1, name: i18nM("material.enumValue.claimed") },
    { id: 2, name: i18nM("material.enumValue.scrapped") },
  ];
});
const today = new Date().toLocaleString().split(" ")[0];
const firstDayOfMonth = new Date(`${today} 00:00:00`);
firstDayOfMonth.setDate(1);
const timeValue = ref<any>([firstDayOfMonth, new Date(`${today} 23:59:59`)]);
const defaultTime: [Date, Date] = [firstDayOfMonth, new Date()];
// 禁用日期
const disabledDate = (time: Date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return time.getTime() > currentDate.getTime();
};
const createRef = ref();
const processFlag = ref(0);
const menuStore = useMenuStore();
const props = defineProps<ComponentPropsType>();
const permissions = computed(() => menuStore.getComponentPermissions(props.configData?.operateTypes));
const currentData = ref<MaterialApply | null>(null);
const addDataFlag = ref(false);
const tableData = ref([]);
const treeRef = ref();
const treeData = ref<TreeNode[]>([]);
const defaultProps = {
  children: "children",
  label: "name",
};
const userNameMap = ref<{ [key: string]: string }>({});
const expandedKeys = ref<Array<number | string>>([0]);
const currentNodeKey = ref<any>(0);
const findDeepestFirstChildOfFirstNode = (firstNode: any) => {
  let currentNode = firstNode?.children?.[0] || firstNode;
  while (currentNode?.children?.length > 0) {
    currentNode = currentNode.children[0];
  }
  return currentNode;
};
const getTreeData = (cb: Function) => {
  materialStockFindStockTree({ projectId: projectId.value }, (res: any) => {
    treeData.value = res.data;
    currentNodeKey.value = findDeepestFirstChildOfFirstNode(treeData.value?.[0])?.id;
    cb();
  });
};
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
const enterChange = (data: any) => {
  currentNodeKey.value = data.id;
  changeRightTable();
};
const columns = computed(() => [
  { prop: "index", label: i18nM("material.table.index"), type: 1, width: "100%" },
  { prop: "applyNo", label: i18nM("material.table.applicationForm") },
  { prop: "applyTime", label: i18nM("material.table.applicationTime"), type: 2 },
  { prop: "applyUserId", label: i18nM("material.label.applicant"), type: 2 },
  { prop: "status", label: i18nM("material.label.reviewStatus") },
  { prop: "applyStatus", label: i18nM("material.label.materialIssueStatus") },
  { prop: "workorderId", label: i18nM("material.label.oddNumbers") },
  { prop: "approveUserId", label: i18nM("material.table.approver") },
  { prop: "approveTime", label: i18nM("material.table.approvalTime") },
  { prop: "createUserId", label: i18nM("material.table.createUser") },
  { prop: "createTime", label: i18nM("material.table.createTime") },
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
const projectChange = () => {
  getTreeData(() => {
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
  const startTime = `${new Date(timeValue.value[0]).toLocaleString().split(" ")[0]} 00:00:00`;
  const endTime = `${new Date(timeValue.value[1]).toLocaleString().split(" ")[0]} 23:59:59`;
  const params: queryApplyApprovedListParams = {
    projectId: projectId.value,
    page: currentPage.value,
    size: pageSize.value,
    stockId: currentNodeKey.value,
    startTime: new Date(startTime).getTime(),
    endTime: new Date(endTime).getTime(),
  };
  if (reviewStatus.value > -1) params.status = reviewStatus.value;
  if (applyStatus.value > -1) params.applyStatus = applyStatus.value;
  if (applyNo.value.length) params.applyNo = applyNo.value;
  postApplyApprovedList(params, (res: any) => {
    const { content, totalElements } = res.data;
    const userIds: string[] = [];
    content?.forEach((event: any) => {
      userIds.push(event.applyUserId);
      userIds.push(event.createUserId);
      userIds.push(event.approveUserId);
    });
    const newUserArr = Array.from(new Set(userIds));
    usersGetNameMapByIds(newUserArr, (res: any) => {
      userNameMap.value = res.data;
      tableData.value = content;
      totalItems.value = totalElements;
    });
  });
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
const save = () => {
  if (processFlag.value == 1) {
    if (!currentData?.value?.id) {
      addDataFlag.value = true;
    }
    createRef.value.confirmSave(() => {
      back();
    });
  }
};
const approve = ref(false);
const toApprove = (row: any) => {
  approve.value = true;
  currentData.value = row;
  processFlag.value = 1;
};
const showDetail = (row: any) => {
  approve.value = false;
  currentData.value = row;
  processFlag.value = 1;
};
const abandon = (row: any) => {
  ElMessageBox.confirm(i18nM("material.confirm.abandon"), i18nM("material.title.materialRequisition"), {
    confirmButtonText: i18nM("material.button.confirm"),
    confirmButtonClass: "w-80",
    cancelButtonText: i18nM("material.button.cancel"),
    cancelButtonClass: "message-box-cancel-btn w-80",
    type: "warning",
  })
    .then(() => {
      updateApplyStatus({ applyId: row.id, applyStatus: 2 }, (res: any) => {
        if (res.code) {
          ElMessage({
            type: "success",
            message: i18nM("material.message.abandonSuccess"),
          });
          refreshTable();
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: i18nM("material.message.cancelAbandon"),
      });
    });
};
const create = () => {
  onlyView.value = false;
  currentData.value = null;
  processFlag.value = 1;
};
const back = () => {
  processFlag.value = 0;
  currentData.value = null;
  refreshTable();
};

onMounted(() => {
  getTreeData(() => {
    changeRightTable();
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
.content-wrap {
  height: calc(100% - zrem(60));
}
</style>
