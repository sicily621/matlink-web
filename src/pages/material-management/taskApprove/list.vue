<template>
  <div class="d-flex h-full w-full">
    <div class="flex-1 d-flex h-full w-full" v-if="!processFlag">
      <div class="flex-1 flex-column h-full">
        <div class="zc-header d-flex align-items-center justify-content-between">
          <div class="d-flex flex-1 align-items-center">
            <div>
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
              <span class="m-r-8 m-l-16">{{ i18nM("material.label.name") }}</span>
              <el-input v-model="title" :placeholder="i18nM('material.placeholder.name')" class="w-200" @input="nameInputFunc">
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <span class="m-r-8 m-l-16">{{ i18nM("material.label.businessStatus") }}</span>
              <el-select class="select-item" v-model="taskStatus" :placeholder="i18nM('material.placeholder.status')" @change="refreshTable()">
                <el-option v-for="item of businessStatusOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
              <span class="m-r-8 m-l-16">{{ i18nM("material.label.reviewStatus") }}</span>
              <el-select class="select-item" v-model="status" :placeholder="i18nM('material.placeholder.status')" @change="refreshTable()">
                <el-option v-for="item of reviewStatusOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="flex-1 d-flex h-full w-full">
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
                  <template #taskType="scope">
                    {{ scope.scope.row.taskType === 1 ? i18nM("material.enumValue.allStocktaking") : i18nM("material.enumValue.areaStocktaking") }}
                  </template>
                  <template #taskStatus="scope">
                    {{ findNameById(businessStatusOptions, scope.scope.row.taskStatus) }}
                  </template>
                  <template #status="scope">
                    {{ findNameById(reviewStatusOptions, scope.scope.row.status) }}
                  </template>
                  <template #stockId="scope">
                    {{ findNameById(treeData, scope.scope.row.stockId) }}
                  </template>
                  <template #handleUserId="scope">
                    {{ userNameMap?.[scope.scope.row.handleUserId] ?? "-" }}
                  </template>
                  <template #createUserId="scope">
                    {{ userNameMap?.[scope.scope.row.createUserId] ?? "-" }}
                  </template>
                  <template #stocktakingNone="scope">
                    {{ scope.scope.row.stocktakingNone ? i18nM("material.enumValue.yes") : i18nM("material.enumValue.no") }}
                  </template>
                  <template #realCount="scope">
                    {{ scope.scope.row.taskType === 1 ? "-" : scope.scope.row.realCount }}
                  </template>
                  <template #startTime="scope">
                    {{ scope.scope.row.startTime ? new Date(scope.scope.row.startTime).toLocaleDateString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #endTime="scope">
                    {{ scope.scope.row.endTime ? new Date(scope.scope.row.endTime).toLocaleDateString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #createTime="scope">
                    {{ scope.scope.row.createTime ? new Date(scope.scope.row.createTime).toLocaleDateString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #operate="scope">
                    <IconSvg
                      :src="taskApprove"
                      class="fz20 m-r-20 pointer"
                      v-if="hasPermission(PermissionType.Update, permissions) && scope.scope.row.hasApprovalAuth"
                      @click="toApprove(scope.scope.row)"
                    ></IconSvg>
                    <el-icon class="fz20 m-r-20 pointer" @click="showDetail(scope.scope.row)" v-if="hasPermission(PermissionType.Read, permissions)">
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
    <div class="flex-1 flex-column h-full create-wrap" v-if="processFlag && currentData">
      <Create
        ref="createRef"
        class="content-wrap"
        :data="currentData"
        :stockId="currentNodeKey"
        :approve="approve"
        :projectId="projectId"
        v-if="processFlag === 1"
      >
      </Create>
      <Detail ref="detailRef" class="content-wrap" :id="currentData.id" :projectId="projectId" v-if="processFlag === 2 && currentData?.id"> </Detail>
      <div class="zc-footer p-r-20 p-l-20 d-flex align-items-center" style="justify-content: flex-end">
        <div>
          <el-button :type="'primary'" class="m-r-16 w-80" v-if="processFlag === 1" @click="save()">{{ i18nM("material.button.save") }}</el-button>
          <el-button class="w-80" plain @click="back()">{{ i18nM("material.button.back") }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
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
import { getTaskApprovedList, queryTaskPageParams, deleteTask, Task, Status } from "@functions/serviceCenter/material-management/api/task";
import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { Search } from "@element-plus/icons-vue";
import { usersGetNameMapByIds } from "@functions/userCenter/api/users";
import Create from "@functions/serviceCenter/material-management/taskApprove/create.vue";
import Detail from "@functions/serviceCenter/material-management/taskApprove/detail.vue";
import IconSvg from "@static/components/iconSvg/iconSvg.vue";
import taskApprove from "@functions/serviceCenter/material-management/taskApprove/taskApprove.svg";
const i18nM = window.$i18nM;
const tableRef = ref();
const detailRef = ref();
const title = ref("");
const createRef = ref();
const processFlag = ref(0);
const menuStore = useMenuStore();
const props = defineProps<ComponentPropsType>();
const permissions = computed(() => menuStore.getComponentPermissions(props.configData?.operateTypes));
const currentData = ref<Task | null>(null);
const addDataFlag = ref(false);
const tableData = ref([]);
const treeRef = ref();
const treeData = ref<TreeNode[]>([]);
const defaultProps = {
  children: "children",
  label: "name",
};
const userNameMap = ref<{ [key: string]: string }>({});
const status = ref(-1);
const taskStatus = ref(-1);
const expandedKeys = ref<Array<number | string>>([0]);
const currentNodeKey = ref<any>(0);
const reviewStatusOptions = computed(() => {
  return [
    { id: -1, name: i18nM("material.enumValue.all") },
    { id: Status.Pending, name: i18nM("material.enumValue.pendingReview") },
    { id: Status.Failed, name: i18nM("material.enumValue.rejected") },
    { id: Status.Audited, name: i18nM("material.enumValue.approved") },
    { id: Status.underReview, name: i18nM("material.enumValue.underReview") },
  ];
});
const businessStatusOptions = computed(() => {
  return [
    { id: -1, name: i18nM("material.enumValue.all") },
    { id: 0, name: i18nM("material.enumValue.notYetAssessed") },
    { id: 1, name: i18nM("material.enumValue.stockChecked") },
    { id: 2, name: i18nM("material.enumValue.received") },
    { id: 3, name: i18nM("material.enumValue.voided") },
    { id: 4, name: i18nM("material.enumValue.profitOrLoss") },
  ];
});
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
  { prop: "name", label: i18nM("material.table.name") },
  { prop: "taskType", label: i18nM("material.table.taskType"), type: 2 },
  { prop: "stockId", label: i18nM("material.table.materialLibrary"), type: 2 },
  { prop: "taskStatus", label: i18nM("material.label.businessStatus"), type: 2 },
  { prop: "status", label: i18nM("material.label.reviewStatus") },
  { prop: "handleUserId", label: i18nM("material.table.handleUserId") },
  { prop: "realCount", label: i18nM("material.table.realCount") },
  { prop: "stocktakingNone", label: i18nM("material.table.stocktakingNone") },
  { prop: "startTime", label: i18nM("material.table.startTime") },
  { prop: "endTime", label: i18nM("material.table.endTime") },
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
  const params: queryTaskPageParams = {
    projectId: projectId.value,
    page: currentPage.value,
    size: pageSize.value,
    stockId: currentNodeKey.value,
  };
  if (status.value > -1) params.status = status.value;
  if (taskStatus.value > -1) params.taskStatus = taskStatus.value;
  if (title.value.length) params.name = title.value;

  getTaskApprovedList(params, (res: any) => {
    const { content, totalElements } = res.data;
    const userIds: string[] = [];
    content?.forEach((event: any) => {
      userIds.push(event.createUserId);
      userIds.push(event.handleUserId);
    });
    const newUserArr = Array.from(new Set(userIds));
    usersGetNameMapByIds(newUserArr, (res: any) => {
      userNameMap.value = res.data;
      tableData.value = content;
      totalItems.value = totalElements;
    });
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
const showDetail = (row: any) => {
  approve.value = false;
  currentData.value = row;
  processFlag.value = 2;
};
const approve = ref(false);
const toApprove = (row: any) => {
  approve.value = true;
  currentData.value = row;
  processFlag.value = 1;
};
const create = () => {
  currentData.value = null;
  processFlag.value = 1;
};
const back = () => {
  processFlag.value = 0;
  currentData.value = null;
  refreshTable();
};
const deleteFunc = (row: any) => {
  ElMessageBox.confirm(i18nM("material.confirm.deleteTask"), i18nM("material.title.deleteTask"), {
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
          message: i18nM("material.error.TaskEnabledCannotDelete"),
        });
        return;
      } else {
        deleteTask(row.id, (res: any) => {
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
