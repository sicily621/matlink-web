<template>
  <div class="flex-column h-full">
    <div class="flex-1 flex-column h-full" v-if="!processFlag">
      <div class="zc-header d-flex align-items-center justify-content-between">
        <div class="header-left d-flex">
          <div class="title">
            <span class="title-icon"></span
            >{{ i18nM("material.label.supplier") }}
          </div>
          <el-text default class="m-r-8 m-l-50">{{
            i18nM("material.label.project")
          }}</el-text>
          <el-select
            class="w-200 m-r-10"
            v-model="projectId"
            :placeholder="i18nM('material.placeholder.selectProject')"
            @change="projectChange"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.projectId"
              :value="item.projectId"
              :label="item.projectName"
            ></el-option>
          </el-select>
          <el-text default class="m-r-8 m-l-10">{{
            i18nM("material.label.name")
          }}</el-text>
          <el-input v-model="searchName" class="w-200">
            <template #append>
              <el-button :icon="Search" />
            </template>
          </el-input>
          <el-text default class="m-r-8 m-l-10">{{
            i18nM("material.label.code")
          }}</el-text>
          <el-input v-model="searchCode" class="w-200">
            <template #append>
              <el-button :icon="Search" />
            </template>
          </el-input>
        </div>
        <div class="m-r-20">
          <el-button :type="'primary'" @click="add"
            ><img :src="AddIcon" width="16" height="16" class="el-icon" />
            <span>{{ i18nM("material.button.add") }}</span></el-button
          >
        </div>
      </div>
      <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
        <div class="flex-1 table-wrap" ref="tableRef">
          <baseTable
            :columns="columns"
            :table-data="tableData"
            :indexMethod="indexMethod(page, pageSize)"
          >
            <template #status="scope">
              {{
                scope.scope.row.status === 0
                  ? i18nM("material.enumValue.deactivate")
                  : i18nM("material.enumValue.normal")
              }}
            </template>
            <template #operate="scope">
              <el-icon
                class="fz20 m-r-20 pointer"
                @click="editEvent(scope.scope)"
              >
                <Edit />
              </el-icon>
              <el-icon class="fz20 pointer" @click="deleteEvent(scope.scope)">
                <Delete />
              </el-icon>
            </template>
          </baseTable>
        </div>
      </div>
      <div
        class="zc-footer d-flex align-items-center justify-content-end"
        v-if="total > 0"
      >
        <pagination
          :total="total"
          :page-size="pageSize"
          :current-page="page + 1"
          @pageChange="pageChange($event)"
          @sizeChange="sizeChange($event)"
        ></pagination>
      </div>
    </div>
    <template v-if="processFlag == 1">
      <create
        :saveFn="saveFn"
        :back="back"
        ref="createRef"
        :info="info"
      ></create>
    </template>
  </div>
</template>
<script setup lang="ts">
const i18nM = window.$i18nM;
import { ref, computed, watch, onMounted } from "vue";
import { watchDebounced } from "@vueuse/core";
import { Search } from "@element-plus/icons-vue";
import useMenuStore from "@static/js/store/menu";
import baseTable from "@@/components/baseTable/baseTable.vue";
import {
  supplierInformationFindPage,
  supplierInformationDelete,
} from "@pages/material-management/api/supplierInformation";
import { ElMessage, ElMessageBox } from "element-plus";
import pagination from "@static/elementUI/pagination/pagination.vue";
import AddIcon from "@static/images/add.png";
import { indexMethod } from "@static/js/common/utils";
import create from "@page/material-management/supplier/create.vue";
import { getPageCount, getPageSizeCount } from "@static/js/page/utils";
import { getNameMapByIds } from "@pages/tenant-management/api/projects";

const page = ref(0);
const pageSize = ref(0);
const total = ref(0);
const menuStore = useMenuStore();

const createRef = ref();
const processFlag = ref(0);
const searchName = ref("");
const searchCode = ref("");
const tableRef = ref();
const info = ref<any>({});
const projectOptions = ref<{ projectId: number; projectName: string }[]>([]);
const projectId = ref(0);
const columns = computed(() => {
  return [
    {
      prop: "index",
      label: i18nM("material.table.index"),
      width: 100,
      type: 1,
    },
    { prop: "name", label: i18nM("material.table.name") },
    { prop: "supplierNo", label: i18nM("material.table.code") },
    { prop: "linkMan", label: i18nM("material.table.contacts") },
    { prop: "phone", label: i18nM("material.table.phone") },
    { prop: "email", label: i18nM("material.table.email") },
    { prop: "status", label: i18nM("material.table.status") },
    {
      prop: "operate",
      label: i18nM("material.table.operation"),
      type: 2,
      width: 2 * 40 + 24 : 0,
    },
  ];
});
const tableData = ref<any[]>([]);
const add = () => {
  info.value = {
    projectId: projectId.value,
  };
  processFlag.value = 1;
};
const saveFn = () => {
  createRef.value.save(() => {
    processFlag.value = 0;
    if (info.value.id) {
      ElMessage({
        type: "success",
        message: i18nM("material.message.editSuccess"),
      });
    } else {
      ElMessage({
        type: "success",
        message: i18nM("material.message.saveSuccess"),
      });
    }
    refreshTable();
  });
};
const back = () => {
  info.value = {};
  processFlag.value = 0;
};
const pageChange = (i: number) => {
  page.value = i - 1;
  refreshTable();
};
const sizeChange = (i: number) => {
  page.value = i;
  refreshTable();
};
//表格编辑事件
const editEvent = (scope: any) => {
  processFlag.value = 1;
  info.value = scope.row;
};
// 表格删除事件
const deleteEvent = (scope: any) => {
  ElMessageBox.confirm(
    i18nM("material.modal.confirmDeleteSupplier"),
    i18nM("material.title.deleteSupplier"),
    {
      confirmButtonText: i18nM("material.button.delete"),
      cancelButtonText: i18nM("material.button.cancel"),
      type: "warning",
    }
  )
    .then(() => {
      supplierInformationDelete({ id: scope.row.id }, (res: any) => {
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

//刷新表格
const refreshTable = () => {
  const params = {
    projectId: projectId.value,
    page: page.value,
    size: pageSize.value,
  };
  if (searchName.value) {
    Object.assign(params, { name: searchName.value });
  }
  if (searchCode.value) {
    Object.assign(params, { supplierNo: searchCode.value });
  }
  supplierInformationFindPage(params, (res: any) => {
    tableData.value = res.data.content;
    total.value = res.data.totalElements;
  });
};
watchDebounced(
  searchName,
  () => {
    refreshTable();
  },
  { debounce: 500, maxWait: 1000 }
);

watchDebounced(
  searchCode,
  () => {
    refreshTable();
  },
  { debounce: 500, maxWait: 1000 }
);
const projectChange = () => {
  refreshTable();
};
onMounted(() => {
  const projectIds = [200001001];
  getNameMapByIds(projectIds, (res: any) => {
    projectIds.forEach((item) => {
      projectOptions.value.push({
        projectId: item,
        projectName: res.data[item],
      });
    });
    projectId.value = projectOptions.value[0].projectId;
    if (tableRef.value) {
      getPageSizeCount(tableRef.value, (count: number) => {
        if (count > pageSize.value) pageSize.value = count;
        const pageCount = getPageCount(total.value, pageSize.value);
        if (page.value > pageCount) page.value = pageCount;
        refreshTable();
      });
    }
  });
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;

.title {
  display: flex;
  align-items: center;
  .title-icon {
    margin-right: zrem(5);
    display: inline-block;
    vertical-align: text-top;
    width: zrem(5);
    height: zrem(18);
    background-color: var(--el-color-primary);
  }
}
</style>
