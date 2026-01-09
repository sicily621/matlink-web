<template>
  <div class="w-full h-full d-flex flex-column" v-if="processFlag == 0">
    <div class="zc-header d-flex align-items-center justify-space-between">
      <div class="d-flex align-items-center">
        <div class="zc-header-title">
          <div class="zc-header-icon"></div>
          <div class="zc-header-word">
            {{ i18nM("material.title.materialWarehouse") }}
          </div>
        </div>
      </div>

      <template v-if="Array.isArray(projects)">
        <span class="m-r-8 m-l-20">{{ i18nM("material.label.project") }}</span>
        <el-select
          class="select-item"
          v-model="projectId"
          :placeholder="i18nM('material.placeholder.selectProject')"
          @change="projectChange($event)"
        >
          <el-option
            v-for="item of projects"
            :key="item.projectId"
            :value="item.projectId"
            :label="projectMap[item.projectId]"
          ></el-option>
        </el-select>
      </template>

      <div class="addButton d-flex align-items-center">
        <el-button
          class="m-r-20"
          :type="'primary'"
          @click="toCreate"
          v-if="hasPermission(PermissionType.Create, permissions)"
        >
          <img :src="AddIcon" width="16" height="16" class="el-icon" />
          <span>{{ i18nM("material.button.add") }}</span>
        </el-button>
      </div>
    </div>

    <div class="zc-base p-r-20 p-l-20 flex-1 d-flex flex-column">
      <div ref="tableRef" class="flex-1 table-wrap">
        <multiSelectTreeTable
          border
          :columns="columns"
          :table-data="tableData"
          :row-key="(row: any) => row.id"
        >
          <!--      -->
          <template #user="scope">
            {{ scope.scope.row.user || "-" }}
          </template>
          <template #phone="scope">
            {{ scope.scope.row.phone || "-" }}
          </template>
          <template #operate="scope">
            <!-- <el-icon
              class="fz20 m-r-20 pointer"
              @click="add(scope.scope)"
              v-if="
                (hasPermission(PermissionType.Update, permissions) &&
                  scope.scope.row.parentId == 0) ||
                scope.scope.row.id == 0
              "
            >
              <Plus />
            </el-icon> -->
            <el-icon
              class="fz20 m-r-20 pointer"
              @click="edit(scope.scope)"
              v-if="hasPermission(PermissionType.Update, permissions)"
            >
              <Edit />
            </el-icon>
            <!-- scope.scope.row.children &&
                  scope.scope.row.children.length > 0 -->
            <el-icon
              class="fz20 pointer"
              @click="deleteFunc(scope.scope)"
              v-if="hasPermission(PermissionType.Delete, permissions)"
            >
              <Delete />
            </el-icon>
          </template>
        </multiSelectTreeTable>
      </div>
    </div>
  </div>
  <Create
    ref="newCreateRef"
    v-if="processFlag == 1"
    :info="info"
    :parentId="parentId"
    :projectId="projectId"
    :save="() => save()"
    :back="() => back()"
  />
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import Create from "@functions/serviceCenter/material-management/stock/create.vue";
import multiSelectTreeTable from "@static/table/multiSelectTreeTable/multiSelectTreeTable.vue";
import thumbnail from "@static/components/thumbnail/thumbnail.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getNameMapByIds } from "@functions/serviceCenter/tenant-management/api/projects";
import {
  materialStockFindStockTree,
  materialStockDelete,
} from "@functions/serviceCenter/material-management/api/materialStock";
import { indexMethod } from "@static/js/common/utils";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { Search } from "@element-plus/icons-vue";
import {
  PermissionType,
  hasPermission,
  getPermissionCount,
} from "@static/js/page/permission";

import AddIcon from "@static/images/add.png";
import useMenuStore from "@static/js/store/menu";
import { ComponentPropsType } from "@static/js/page/props";
const i18nM = window.$i18nM;
const tableRefTop = ref(0);
const menuStore = useMenuStore();
const projectMap = ref<any>({});

const props = defineProps<ComponentPropsType>();
const permissions = computed(() =>
  menuStore.getComponentPermissions(props.configData?.operateTypes)
);
const permissionCount = getPermissionCount(
  [PermissionType.Create, PermissionType.Update, PermissionType.Delete],
  permissions.value
);
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
const newCreateRef = ref();
const addDataFlag = ref(false);
const processFlag = ref(0);
const parentId = ref();
const projects = ref(window.$HyGlobal.getCurrentProject()?.projects);

const projectId = ref(
  window.$HyGlobal.getCurrentProject()?.projects?.[0]?.projectId
);
const info = ref<any>({});
const columns = computed(() => [
  {
    prop: "index",
    label: i18nM("material.table.index"),
    type: 1,
    width: "100%",
  },
  { prop: "name", label: i18nM("material.table.name") },
  { prop: "typeName", label: i18nM("material.table.type") },
  { prop: "description", label: i18nM("material.table.notes") },

  { prop: "operate", label: i18nM("material.table.operate"), type: 2 },
]);
const tableRef = ref();
const tableData = ref<any>([]);
const pageNum = ref(0);
const pageSize = ref(12);

const getList = () => {
  let obj: any = {
    projectId: projectId.value,
  };
  materialStockFindStockTree(obj, (res: any) => {
    tableData.value = res.data;
  });
};

//新增
const toCreate = () => {
  info.value = {};
  parentId.value = "";
  processFlag.value = 1;
};
const add = (scope: any) => {
  parentId.value = scope.row.id;
  info.value = {};
  processFlag.value = 1;
};
const edit = (scope: any) => {
  info.value = scope.row;
  processFlag.value = 1;
};
// 保存
const save = () => {
  newCreateRef.value.confirmSave(() => {
    if (!info.value.id) {
      addDataFlag.value = true;
    }
    // getTableDataList();
    processFlag.value = 0;
    getList();
    // findAllShopTypes();
  });
};
const back = () => {
  processFlag.value = 0;
};
const editFunc = (item: any) => {
  processFlag.value = 1;
  info.value = item;
};
const swapArr = (arr: any[], index1: number, index2: number) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
};
const TopChange = (item: any, index: any) => {
  topNotices({ id: item.id, topFlag: 1 }, (res: any) => {
    getList();
  });
};
const deleteFunc = (scope: any, index: number) => {
  ElMessageBox.confirm(
    i18nM("material.modal.confirmDeleteMaterialWarehouse"),
    i18nM("material.title.deleteMaterialWarehouse"),
    {
      confirmButtonText: i18nM("material.button.delete"),
      confirmButtonClass: "w-80",
      cancelButtonText: i18nM("material.button.cancel"),
      cancelButtonClass: "message-box-cancel-btn w-80",
      type: "warning",
    }
  )
    .then(() => {
      if (scope.row.children == null) {
        materialStockDelete({ id: scope.row.id }, (res: any) => {
          if (res.code) {
            ElMessage({
              type: "success",
              message: i18nM("material.message.deleteMaterialWarehouseSuccess"),
            });
            getList();
          } else {
            ElMessage({
              type: "info",
              message: i18nM("material.message.deleteMaterialWarehouseFailed"),
            });
          }
        });
      } else {
        ElMessage({
          type: "info",
          message: i18nM("material.message.hasSubMaterialWarehouse"),
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
if (Array.isArray(projects.value) && projects.value.length > 0) {
  let ids = [];
  for (let item of projects.value) {
    ids.push(item.projectId);
  }
  getNameMapByIds(ids, (res: any) => {
    projectMap.value = res.data;
  });
}
const projectChange = (val: any) => {
  projectId.value = val;
  getList();
};

onMounted(() => {
  getList();
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;

.echart-con {
  width: 100%;
  height: zrem(400);
  position: relative;
  // padding-bottom: zrem(10);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.addButton {
  margin-left: auto;
}
.select-item {
  width: zrem(180);
}
.dynamic-icon {
  width: zrem(20);
  height: zrem(20);

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
