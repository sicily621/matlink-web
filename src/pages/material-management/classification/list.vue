<template>
  <div class="flex-column h-full">
    <div class="flex-1 flex-column h-full"  @click="handleTableClick">
      <div class="zc-header d-flex align-items-center justify-content-between">
        <div class="d-flex">
          <div class="title">
              <span class="title-icon"></span>{{ i18nM('material.label.materialClassification') }}
          </div>
          <div class="d-flex align-items-center m-50">
            <el-text default class="m-r-8 m-l-16">{{ i18nM('material.label.project') }}</el-text>
            <el-select class="w-200 m-r-10" v-model="projectId" :placeholder="i18nM('material.placeholder.selectProject')" @change="projectChange">
              <el-option v-for="item in projectOptions" :key="item.projectId" :value="item.projectId" :label="item.projectName"></el-option>
            </el-select>
          </div>
        </div>
       
        <div class="m-r-20">
          <el-button :type="'primary'" @click="openCreateModal" v-if="hasPermission(PermissionType.Create, permissions)"
            ><img :src="AddIcon" width="16" height="16" class="el-icon" /> <span>{{ i18nM("material.button.add") }}</span></el-button
          >
        </div>
      </div>
      <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
        <div class="flex-1 table-wrap">
          <multiSelectTreeTable 
          :columns="columns" 
          :table-data="tableData"
          @rowClick="select"
           ref="tableRef"
          >
          <template #userCode="scope">
            {{ scope.scope.row.userCode ? scope.scope.row.userCode : scope.scope.row.code }}
          </template>
            <template #operate="scope">
              <el-icon class="fz20 m-r-20 pointer" v-if="hasPermission(PermissionType.Update, permissions)" @click.native.stop="editEvent(scope.scope)">
                <Edit />
              </el-icon>
              <el-icon class="fz20 pointer" v-if="hasPermission(PermissionType.Delete, permissions)" @click.native.stop="deleteEvent(scope.scope)">
                <Delete />
              </el-icon> 
            </template>
          </multiSelectTreeTable>
        </div>
      </div>
    </div>
    <zModel ref="classificationRef" :customModelTitle="i18nM('material.label.typeConfig')"
    @confirm="classificationConfirm()" :style="{ width: zrem(570), paddingBottom: zrem(20) }">
        <el-form label-position="right"
        label-width="90px"
        :model="form"
        :rules="rules"
        ref="formRef"
        class="m-t-20">
        <el-form-item
          :label="i18nM('material.label.parentType')"
          prop="parentName"
        >
        <div class="w-296 parentName">{{ form.parentName }}</div>
        </el-form-item>
        <el-form-item
          :label="i18nM('material.label.name')"
          required
          prop="name"
        >
          <el-input
            :placeholder="i18nM('material.placeholder.name')"
            class="w-296"
            v-model="form.name"
            maxlength="32"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="i18nM('material.label.code')"
          prop="code"
        >
          <el-input
            :placeholder="i18nM('material.placeholder.code')"
            class="w-296"
            v-model="form.code"
            maxlength="16"
          ></el-input>
        </el-form-item>
    </el-form>
    </zModel>
  </div>
</template>
<script setup lang="ts">
const i18nM = window.$i18nM;
import { ref, onMounted, computed, reactive } from "vue";
import { zrem } from "@static/js/theme/zrem";
import useMenuStore from "@static/js/store/menu";
import { ComponentPropsType } from "@static/js/page/props";
import { getNameMapByIds } from "@functions/serviceCenter/tenant-management/api/projects";

import multiSelectTreeTable from "@static/table/multiSelectTreeTable/multiSelectTreeTable.vue";
import { 
    findTree, 
    saveClassCatalog,
    classCatalogGetById, 
    classCatalogDelete 
 } from "@functions/serviceCenter/material-management/api/classCatalog";
import { ElMessage, ElMessageBox } from "element-plus";
import { PermissionType, hasPermission, getPermissionCount } from "@static/js/page/permission";
import AddIcon from "@static/images/add.png";
import zModel from "@static/components/zModel/zModel.vue";

const menuStore = useMenuStore();
const props = defineProps<ComponentPropsType>();
const permissions = computed(() => menuStore.getComponentPermissions(props.configData?.operateTypes));
const permissionCount = getPermissionCount([PermissionType.Update, PermissionType.Delete], permissions.value);

const tableRef = ref();
const formRef = ref();
const projectOptions = ref<{ projectId: number; projectName: string }[]>([]);
const projectId = ref(0);
const currentData = ref<any>(null);
const isAdd = ref(false);
const columns  = computed(() => { 
  return [
  { prop: "index", label: i18nM('material.table.index'), width: 100, type: 1 },
  { prop: "name", label: i18nM('material.table.name') },
  { prop: "userCode", label: i18nM('material.table.code') },
  { prop: "operate", label: i18nM('material.table.operation'), type: 2, width: permissionCount ? permissionCount * 40 + 24 : 0, },
] 
});
const tableData = ref<any[]>([]);

const form = reactive({
    name:'',
    code:'',
    parentName:'',
    parentId:''
});
const rules = ref<any>({
  name: [
    { required: true, message: i18nM("material.placeholder.name") }
  ],
  code:[
    { pattern: /^\d+$/, message: i18nM('material.message.enterNumbers'), trigger: 'blur' }
  ]
});
const classificationRef = ref();
const parentRow = ref<any>({});

const select = (e:any) => { 
  parentRow.value = e; 
}

const classificationConfirm = () => {
    const params = {
      projectId: projectId.value,
      parentId:parentRow.value?.id || 0,
      name: form.name,
      userCode: form.code
    }
    if(currentData.value?.id){
      Object.assign(params,{id:currentData.value.id, parentId: form.parentId});
    }
    formRef.value.validate((valid:boolean) => {
      if(valid){
        saveClassCatalog(params,(res:any) => {
          if(res.code){
              ElMessage({
                type:"success",
                message: currentData.value?.id ? i18nM("material.message.editSuccess") : i18nM("material.message.saveSuccess")
              })
            tableRef.value.setCurrentRow()
              parentRow.value = {};
              currentData.value = {};
              form.name = '';
              form.code = '';
              form.parentId = '';
              form.parentName = '';
              currentData.value = {};
              classificationRef.value.closeCustomModel();
              refreshTable();
          }
        })
      }
      else{
        ElMessage({
          type: "error",
          message: i18nM('material.message.complete')
        })
      }
    })
    
}

const handleTableClick = (event:any) => {
  // 判断点击的是否是表格行
  const isRowClick = event.target.closest('.el-table__row');
  // 如果不是行点击，且当前有选中行，则触发外部点击
  if (!isRowClick && parentRow.value && !isAdd.value) {
    handleClickOutsideRow();
  }
  else{
    isAdd.value = false;
  }
};

const handleClickOutsideRow = () => {
  parentRow.value = null;
  tableRef.value.setCurrentRow()
};

//新增
const openCreateModal = () => {
  isAdd.value = true;
  form.name = '';
  form.code = '';
  form.parentName = '';
  form.parentId = '';
  currentData.value = {};
  if(parentRow.value?.id){
    form.parentName = parentRow.value.name;
    form.parentId = parentRow.value.id;
  }
  classificationRef.value.openCustomModel();
};

//表格编辑事件
const editEvent = (scope: any) => {
  form.parentId = '';
  form.parentName = '';
  currentData.value = scope.row;
    if(scope.row.parentId){
      classCatalogGetById({id:scope.row.parentId},(res:any) => {
          if(res.data){
            form.parentName = res.data.name;
            form.parentId = res.data.id;
          }
          
      })
    }
    form.name = scope.row.name;
    form.code = scope.row.userCode ? scope.row.userCode : scope.row.code;
    classificationRef.value.openCustomModel();
};
// 表格删除事件
const deleteEvent = (scope: any) => {
  ElMessageBox.confirm(i18nM("material.modal.confirmDeleteClassification"), i18nM("material.title.deleteClassification"), {
    confirmButtonText: i18nM("material.button.delete"),
    cancelButtonText: i18nM("material.button.cancel"),
    type: "warning",
  })
    .then(() => {
        classCatalogDelete({id: scope.row.id},(res:any) => {
            if(res.code){
                ElMessage({
                    type: "success",
                    message: i18nM("material.message.deleteSuccess"),
                });
                parentRow.value = {};
                tableRef.value.setCurrentRow();
                refreshTable();
            }
            else{
                ElMessage({
                    type: "info",
                    message: i18nM("material.message.cancelDelete"),
                });
            }
        })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: i18nM("material.message.cancelDelete"),
      });
    })
};

//刷新表格
const refreshTable = () => {
  findTree({
    projectId: projectId.value
  }, (res: any) => {
    tableData.value = res.data;
  });
};
const projectChange = () => {
  refreshTable();
}
onMounted(() => {
  const projects = window.$HyGlobal.getCurrentProject()?.projects;
  const projectIds = projects?.map((item) => item.projectId) || [];
    getNameMapByIds(projectIds, (res: any) => {
      projectIds.forEach((item) => {
        projectOptions.value.push({ projectId: item, projectName: res.data[item] });
      });
      projectId.value = projectOptions.value[0].projectId;
      refreshTable();
    });
  
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.title {
    display:flex;
    align-items:center;
    .title-icon {
        margin-right: zrem(5);
        display: inline-block;
        vertical-align: text-top;
        width: zrem(5);
        height: zrem(18);
        background-color: var(--el-color-primary);
    }
}
::v-deep .el-form--label-right .el-form-item{
  height: auto;
}
::v-deep .el-form--label-right .el-form-item__content{
  height: auto;
}
.parentName{
  line-height:zrem(28); 
}

</style>
