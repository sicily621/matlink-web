<template>
  <div class="d-flex h-full w-full">
    <div class="flex-1 d-flex h-full w-full" v-if="!processFlag">
      <div class="flex-1 flex-column h-full">
        <div class="zc-header d-flex align-items-center justify-content-between">
          <div class="d-flex flex-1 align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <div class="title d-flex w-150">
                <div class="titleIcon"></div>
                <span>{{ i18nM("material.title.purchaseOrder") }}</span>
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

              <span class="m-r-8 m-l-10">{{ i18nM("material.label.oddNumbers") }}</span>
              <el-input v-model="oddNumbers" :placeholder="i18nM('material.placeholder.inputOddNumbers')" class="w-200" @input="nameInputFunc">
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <span class="m-r-8 m-l-16">{{ i18nM("material.label.approveStatus") }}</span>
              <el-select
                class="select-item"
                v-model="approveStatus"
                :placeholder="i18nM('material.placeholder.select')"
                @change="approveStatusChange($event)"
              >
                <el-option v-for="item of approveStatusOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
              <span class="m-r-8 m-l-16">{{ i18nM("material.label.purchaseStatus") }}</span>
              <el-select
                class="select-item"
                v-model="purchaseStatus"
                :placeholder="i18nM('material.placeholder.select')"
                @change="purchaseStatusChange($event)"
              >
                <el-option v-for="item of purchaseStatusOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
              <span class="m-r-8 m-l-16">{{ i18nM("material.label.time") }}</span>
              <el-date-picker
                v-model="timeValue"
                type="daterange"
                :start-placeholder="i18nM('material.placeholder.startTime')"
                :end-placeholder="i18nM('material.placeholder.endTime')"
                :default-time="defaultTime"
                @change="dateChange($event)"
                :disabled-date="disabledDate"
              />
            </div>
            <div>
              <el-button class="m-r-20" :type="'primary'" @click="create" v-if="hasPermission(PermissionType.Create, permissions)">
                <img :src="AddIcon" width="16" height="16" class="el-icon" />
                <span>{{ i18nM("material.button.add") }}</span>
              </el-button>
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
                  :placeholder="i18nM('material.placeholder.inputClassificationName')"
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
                  <template #purStatus="scope">
                    {{ findNameById(purchaseStatusOptions, scope.scope.row.purStatus) }}
                  </template>
                  <template #status="scope">
                    {{ findNameById(approveStatusOptions, scope.scope.row.status) }}
                  </template>

                  <template #applyUserId="scope">
                    {{ userNameMap?.[scope.scope.row.applyUserId] ?? "-" }}
                  </template>
                  <template #approverUserId="scope">
                    {{ userNameMap?.[scope.scope.row.approverUserId] ?? "-" }}
                  </template>
                  <template #createUserId="scope">
                    {{ userNameMap?.[scope.scope.row.createUserId] ?? "-" }}
                  </template>

                  <template #applyDate="scope">
                    {{ scope.scope.row.applyDate ? new Date(scope.scope.row.applyDate).toLocaleString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #createTime="scope">
                    {{ scope.scope.row.createTime ? new Date(scope.scope.row.createTime).toLocaleString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #approverTime="scope">
                    {{ scope.scope.row.approverTime ? new Date(scope.scope.row.approverTime).toLocaleString().replace(/\//g, "-") : "-" }}
                  </template>
                  <!--  -->
                  <template #inStockTime="scope">
                    {{ scope.scope.row.inStockTime ? new Date(scope.scope.row.inStockTime).toLocaleString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #approverCreateTime="scope">
                    {{ scope.scope.row.approverCreateTime ? new Date(scope.scope.row.approverCreateTime).toLocaleString().replace(/\//g, "-") : "-" }}
                  </template>
                  <template #operate="scope">
                    <el-icon
                      class="fz20 m-r-20 pointer"
                      v-if="hasPermission(PermissionType.Update, permissions) && scope.scope.row.status == 2 && scope.scope.row.purStatus == 0"
                      @click="statusChange(scope.scope.row)"
                    >
                      <Finished />
                    </el-icon>

                    <el-icon
                      class="fz20 m-r-20 pointer"
                      @click="edit(scope.scope.row)"
                      v-if="hasPermission(PermissionType.Update, permissions) && scope.scope.row.status !== 2"
                    >
                      <Edit />
                      <!--采购0 审批2    -->
                    </el-icon>

                    <el-icon class="fz20 m-r-20 pointer" v-if="hasPermission(PermissionType.Read, permissions)" @click="showDetail(scope.scope.row)">
                      <View />
                    </el-icon>

                    <el-icon
                      class="fz20 m-r-20 pointer"
                      v-if="hasPermission(PermissionType.Update, permissions) && scope.scope.row.status !== 2"
                      @click="deleteFn(scope.scope.row)"
                    >
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
      </div>
    </div>
    <div class="flex-1 flex-column h-full create-wrap w-full" v-if="processFlag">
      <Create
        ref="createRef"
        class="content-wrap"
        :data="currentData"
        :stockId="currentNodeKey"
        :projectId="projectId"
        :onlyView="onlyView"
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
import { Search } from "@element-plus/icons-vue";

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
  purchasingRequisitionApprovedList,
  purchasingRequisitionDelete,
  updatePurStatus,
} from "@functions/serviceCenter/material-management/api/purchasingRequisition";

import { materialStockFindStockTree } from "@functions/serviceCenter/material-management/api/materialStock";
import { usersGetNameMapByIds } from "@functions/userCenter/api/users";
import Create from "@functions/serviceCenter/material-management/purchase/create.vue";
import StockIn from "@functions/serviceCenter/material-management/stockIn/stockIn.svg";
import IconSvg from "@static/components/iconSvg/iconSvg.vue";

const i18nM = window.$i18nM;
const tableRef = ref();
const approveStatus = ref();
const oddNumbers = ref();
const approveStatusOptions = computed(() => {
  return [
    { id: "", name: i18nM("material.enumValue.all") },
    { id: 0, name: i18nM("material.enumValue.pendingReview") },
    { id: 3, name: i18nM("material.enumValue.underReview") },
    { id: 2, name: i18nM("material.enumValue.approved") },
    { id: 1, name: i18nM("material.enumValue.rejected") },
  ];
});
const onlyView = ref(false);
const purchaseStatus = ref();
const purchaseStatusOptions = computed(() => {
  return [
    { id: "", name: i18nM("material.enumValue.all") },
    { id: 0, name: i18nM("material.enumValue.notPurchased") },
    { id: 1, name: i18nM("material.enumValue.purchased") },
    { id: 2, name: i18nM("material.enumValue.voided") },
    { id: 3, name: i18nM("material.enumValue.received") },
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
const currentData = ref<any>(null);
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
const nameInputFunc = () => {
  refreshTable();
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
  {
    prop: "index",
    label: i18nM("material.table.index"),
    type: 1,
    width: "100%",
  },
  { prop: "stockId", label: i18nM("material.table.purchase") },
  {
    prop: "applyDate",
    label: i18nM("material.table.purchaseTime"),
    type: 2,
  },
  {
    prop: "applyUserId",
    label: i18nM("material.table.applicant"),
    type: 2,
  },
  { prop: "purStatus", label: i18nM("material.table.purchaseStatus") },
  { prop: "status", label: i18nM("material.table.approveStatus") },
  { prop: "approverUserId", label: i18nM("material.table.approver") },
  { prop: "approverTime", label: i18nM("material.table.approveTime") },
  { prop: "createUserId", label: i18nM("material.table.createUser") },
  { prop: "createTime", label: i18nM("material.table.createTime") },
  { prop: "description", label: i18nM("material.table.use") },

  {
    prop: "operate",
    type: 2,
    label: i18nM("material.table.operate"),
    width: 100,
  },
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
const purchaseStatusChange = (val: any) => {
  purchaseStatus.value = val;
  refreshTable();
};
const approveStatusChange = (val: any) => {
  approveStatus.value = val;
  refreshTable();
};
const dateChange = (val: any) => {
  timeValue.value[0] = val[0];
  timeValue.value[1] = val[1];
  refreshTable();
};
const refreshTable = () => {
  const startTime = `${new Date(timeValue.value[0]).toLocaleString().split(" ")[0]} 00:00:00`;
  const endTime = `${new Date(timeValue.value[1]).toLocaleString().split(" ")[0]} 23:59:59`;
  const params: any = {
    projectId: projectId.value,
    page: currentPage.value,
    size: pageSize.value,
    stockId: currentNodeKey.value,
    startTime: new Date(startTime).getTime(),
    endTime: new Date(endTime).getTime(),
  };
  if (oddNumbers.value) params.billNo = oddNumbers.value;
  if (purchaseStatus.value) params.purStatus = purchaseStatus.value;
  if (approveStatus.value) params.status = approveStatus.value;

  purchasingRequisitionApprovedList(params, (res: any) => {
    const { content, totalElements } = res.data;

    // tableData.value = content;
    const userIds: string[] = [];
    content?.forEach((event: any) => {
      userIds.push(event.applyUserId);
      userIds.push(event.createUserId);
      userIds.push(event.approverUserId);
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
const statusChange = (row: any) => {
  ElMessageBox.confirm(i18nM("material.modal.confirmThePurchase"), i18nM("material.title.purchaseStatus"), {
    confirmButtonText: i18nM("material.button.purchase"),
    cancelButtonText: i18nM("material.button.cancel"),
    type: "warning",
  })
    .then(() => {
      updatePurStatus({ id: row.id, purStatus: 1 }, (res: any) => {
        if (res.code) {
          ElMessage({
            type: "success",
            message: i18nM("material.message.purchaseSuccess"),
          });
          refreshTable();
        } else {
          ElMessage({
            type: "info",
            message: i18nM("material.message.cancelPurchase"),
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: i18nM("material.message.cancelPurchase"),
      });
    });
};
const edit = (row: any) => {
  onlyView.value = false;
  currentData.value = row;
  processFlag.value = 1;
};
const showDetail = (row: any) => {
  onlyView.value = true;
  currentData.value = row;
  processFlag.value = 1;
};

const deleteFn = (scope: any) => {
  ElMessageBox.confirm(i18nM("material.modal.confirmDeleteSupplier"), i18nM("material.title.deleteSupplier"), {
    confirmButtonText: i18nM("material.button.delete"),
    cancelButtonText: i18nM("material.button.cancel"),
    type: "warning",
  })
    .then(() => {
      purchasingRequisitionDelete({ id: scope.id }, (res: any) => {
        if (res.code) {
          ElMessage({
            type: "success",
            message: i18nM("material.message.deleteSuccess"),
          });
          refreshTable();
        } else {
          ElMessage({
            type: "info",
            message: i18nM("material.message.cancelDelete"),
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
const changeStatus = (scope: any) => {
  if (!scope.row.id) return;

  // getAutoOrderConfig(
  //   {
  //     id: scope.row.id,
  //   },
  //   (res: any) => {
  //     editInfo.value = res.data;

  //     if (editInfo.value.objectIdList && Array.isArray(editInfo.value.objectIdList)) {
  //       deviceGetNameMapByIds(editInfo.value.objectIdList, (res: any) => {
  //         let newArray = Object.entries(res.data).map(([id, deviceOrAreaName]) => ({
  //           id: parseInt(id),
  //           deviceOrAreaName: deviceOrAreaName,
  //         }));

  //         arr.value = []; // 清空数组，防止重复
  //         newArray.forEach((item: any) => {
  //           arr.value.push(item.id);
  //         });

  //         // 在这里创建 obj，再调用 updateAutoOrderConfig
  //         const obj = {
  //           ...scope.row,
  //           enable: scope.row.enable ? 1 : 0, // 整理 enable
  //           flag: null,
  //           objectIdList: arr.value, // 确保将 objectIdList 赋值到 obj
  //         };

  //         updateAutoOrderConfig(obj, () => {
  //           ElMessage({
  //             type: "success",
  //             message: i18nM('mopaiPlatform.message.updateSuccess'),
  //           });
  //           getList();
  //         });
  //       });
  //     } else {
  //       // 如果没有 objectIdList，直接构建 obj
  //       const obj = {
  //         ...scope.row,
  //         enable: scope.row.enable ? 1 : 0,
  //         flag: null,
  //       };

  //       updateAutoOrderConfig(obj, () => {
  //         ElMessage({
  //           type: "success",
  //           message: i18nM('mopaiPlatform.message.updateSuccess'),
  //         });
  //         getList();
  //       });
  //     }
  //   }
  // );
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
