
<template>
    <div class="flex-column h-full">
        <div class="flex-1 flex-column h-full" @click="handleTableClick">
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
                    <el-button :type="'primary'" @click="openCreateModal" v-if="hasPermission(PermissionType.Create, permissions)">
                        <img :src="AddIcon" width="16" height="16" class="el-icon" /> <span>{{ i18nM("material.button.add") }}</span>
                    </el-button>
                </div>
            </div>
            <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
                <div class="flex-1 table-wrap" ref="tableOutRef">
                    <multiSelectTreeTable :columns="columns" :table-data="currentPageData"  ref="tableRef" :height="'100%'"
                    @rowClick="select"
                    :indexMethod="indexMethod(page,pageSize)">
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
            <div class="zc-footer d-flex align-items-center justify-content-end" v-if="total > 0">
                <pagination 
                :total="total" 
                :page-size="pageSize" 
                :current-page="page + 1" 
                @pageChange="pageChange($event)"
                @sizeChange="sizeChange($event)"
                ></pagination>
            </div>
        </div>
        <zModel ref="classificationRef" :customModelTitle="i18nM('material.title.unitConfig')"
        @confirm="classificationConfirm()" :style="{ width: zrem(570), paddingBottom: zrem(20) }">
            <el-form label-position="right"
            label-width="90px"
            :model="form"
            :rules="rules"
            ref="formRef"
            class="m-t-20">
            <el-form-item
                :label="i18nM('material.label.name')"
                required
                prop="cnname"
            >
            <el-input
                :placeholder="i18nM('material.placeholder.name')"
                class="w-296"
                v-model="form.cnname"
                maxlength="16"
            ></el-input>
            </el-form-item>
            <el-form-item
            :label="i18nM('material.label.enname')"
            prop="enname"
            >
            <el-input
                :placeholder="i18nM('material.placeholder.englishName')"
                class="w-296"
                v-model="form.enname"
                maxlength="16"
            ></el-input>
            </el-form-item>

 

             <el-form-item
            :label="i18nM('material.label.description')"
            prop="description"
            >
            <el-input
                :placeholder="i18nM('material.placeholder.notes')"
                class="w-296"
                v-model="form.description"
                maxlength="64"
            ></el-input>
            </el-form-item>

        </el-form>
        </zModel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from 'vue';
import { zrem } from "@static/js/theme/zrem";
import useMenuStore from "@static/js/store/menu";
import { ComponentPropsType } from "@static/js/page/props";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { PermissionType, hasPermission, getPermissionCount } from "@static/js/page/permission";
import AddIcon from "@static/images/add.png";
import zModel from "@static/components/zModel/zModel.vue";
import { indexMethod } from "@static/js/common/utils";
import { 
    materialUnitFindPage,
    materialUnitSave,
    materialUnitGetById,
    materialUnitDelete
 } from "@functions/serviceCenter/material-management/api/materialUnit";
import { getPageCount, getPageSizeCount } from "@static/js/page/utils";
import multiSelectTreeTable from "@static/table/multiSelectTreeTable/multiSelectTreeTable.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getNameMapByIds } from "@functions/serviceCenter/tenant-management/api/projects";


const i18nM = window.$i18nM;
const tableOutRef = ref();
const total = ref(0);
const page = ref(0);
const menuStore = useMenuStore();
const props = defineProps<ComponentPropsType>();
const permissions = computed(() => menuStore.getComponentPermissions(props.configData?.operateTypes));
const permissionCount = getPermissionCount([PermissionType.Update, PermissionType.Delete], permissions.value);

const classificationRef = ref();
const projectOptions = ref<{ projectId: number; projectName: string }[]>([]);
const projectId = ref(0);
const pageSize = ref(0)
const currentPageData = ref<any[]>([]);
const tableRef = ref();
const columns  = computed(() => { 
    return [
        { prop: "index", label: i18nM('material.table.index'), width: 100, type: 1 },
        { prop: "cnname", label: i18nM('material.table.name') },
        { prop: "enname", label: i18nM('material.table.english') },
   //     { prop: "unitSymbol", label: i18nM('material.table.conversionScale') },
        { prop: "description", label: i18nM('material.table.notes') },
        { prop: "operate", label: i18nM('material.table.operation'), type: 2, width: permissionCount ? permissionCount * 40 + 24 : 0, },
    ] 
});

const pageChange = (i: number) => {
  page.value = i - 1;
  refreshTable();
};
const sizeChange = (i: number) => {
  page.value = i;
  refreshTable();
};
const refreshTable = () => {
    materialUnitFindPage({
        page: page.value,
        size: pageSize.value,
        projectId: projectId.value
    },(res:any) => {
        if(res.data.content.length > 0){
            currentPageData.value = res.data.content;
        }
        else{
            currentPageData.value = [];
        }
        total.value = res.data.totalElements;
    })
}
const formRef = ref();
const form = reactive<any>({
    parentId: 0,
    parentName:'',
    cnname: '',
    enname: '',
    unitSymbol: '1',
    description: ''
})
const rules = ref<any>({
  cnname: [{ required: true, message: i18nM("material.placeholder.name") }],
  enname: [{ required: true, message: i18nM("material.placeholder.englishName") }],
  unitSymbol: [{ required: true, message: i18nM("material.placeholder.unitSymbol") }],
  description: [{ required: true, message: i18nM("material.placeholder.notes") }],
});
const isAdd = ref(false);
const currentData = ref<any>(null);
const parentRow = ref<any>({});
const select = (e:any) => {
  //parentRow.value = e;先不创建二级
}
const handleTableClick = (event:any) => {
  // 判断点击的是否是表格行
  const isRowClick = event.target.closest('.el-table__row');
  // 如果不是行点击，且当前有选中行，则触发外部点击逻辑
  if (!isRowClick && parentRow.value && !isAdd.value) {
    handleClickOutsideRow();
  }
  else{
    isAdd.value = false;
  }
};

const handleClickOutsideRow = () => {
  // 这里可以执行你想要的操作，例如取消选中行
  parentRow.value = null;
  tableRef.value.setCurrentRow()
};
const openCreateModal = () => {
  isAdd.value = true;
  form.cnname = '';
  form.enname = '';
  form.unitSymbol = '';
  form.description = '';
  form.parentName = '';
  form.parentId = '';
  currentData.value = {};
    if(parentRow.value?.id){
      form.parentName = parentRow.value.cnname;
      form.parentId = parentRow.value.id;
    }
    classificationRef.value.openCustomModel();
};
const deleteEvent = (scope:any) => {
    ElMessageBox.confirm(i18nM("material.modal.confirmDeleteClassification"), i18nM("material.title.deleteClassification"), {
        confirmButtonText: i18nM("material.button.delete"),
        cancelButtonText: i18nM("material.button.cancel"),
        type: "warning",
    })
    .then(() => {
        materialUnitDelete({id: scope.row.id},(res:any) => {
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
}
const editEvent = (scope:any) => {
    form.parentId = '';
    form.parentName = '';
    currentData.value = scope.row;
    if(scope.row.parentId){
      materialUnitGetById({id:scope.row.parentId},(res:any) => {
          if(res.data){
            form.parentName = res.data.cnname;
            form.parentId = res.data.id;
          }
          
      })
    }
    form.cnname = scope.row.cnname;
    form.enname = scope.row.enname;
    form.unitSymbol = scope.row.unitSymbol;
    form.description = scope.row.description;
    classificationRef.value.openCustomModel();
}
const classificationConfirm = () => {
    const params = {
        projectId: projectId.value,
        parentId:parentRow.value?.id || 0,
        cnname: form.cnname,
        enname: form.enname,
        unitSymbol: form.unitSymbol||1,
        description: form.description,
    }
    if(currentData.value?.id){
      Object.assign(params,{id:currentData.value.id, parentId: form.parentId});
    }
    formRef.value.validate((valid:boolean) => {
        if(valid){
            materialUnitSave(params,(res:any) => {
                if(res.code){
                    ElMessage({
                        type:"success",
                        message: currentData.value?.id ? i18nM("material.message.editSuccess") : i18nM("material.message.saveSuccess")
                    })
                    tableRef.value.setCurrentRow()
                    parentRow.value = {};
                    currentData.value = {};
                    form.cnname = '';
                    form.enname = '';
                    form.unitSymbol = '';
                    form.description = '';
                    form.parentName = '';
                    form.parentId = '';
                    classificationRef.value.closeCustomModel();
                    refreshTable();
                }
            })
        }
        else{
            ElMessage({
                type: "error",
                message: i18nM("material.message.complete")
            })
        }
    })
    
}
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
        if (tableRef.value) {
            getPageSizeCount(tableOutRef.value, (count: number) => {
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
</style>
