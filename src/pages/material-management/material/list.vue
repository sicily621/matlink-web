<template>
  <div class="d-flex h-full w-full">
    <div class="flex-1 d-flex h-full w-full" v-if="!processFlag">
      <div class="left h-full">
        <div class="flex1 flex-column h-full">
          <div class="flex-1">
            <tree
              :data="enterTreeData"
              ref="enterTreeRef"
              :expandedKeys="materialExpandedKeys"
              :currentNodeKey="materialCurrentNodeKey"
              @changeNode="enterChange($event)"
              @changeFilter="enterFilter($event)"
              :placeholder="
                i18nM('material.placeholder.inputClassificationName')
              "
            >
            </tree>
          </div>
        </div>
      </div>
      <div class="right flex-1 flex-column h-full">
        <div
          class="zc-header d-flex align-items-center justify-content-between"
        >
          <!-- <div class="title d-flex w-200">
            <div class="titleIcon"></div>
            <span>{{ i18nM("material.label.disposalFlow") }}</span>
          </div> -->
          <div class="d-flex flex-1 align-items-center justify-content-between">
            <div>
              <template v-if="Array.isArray(projects)">
                <span class="m-r-8">{{ i18nM("material.label.project") }}</span>
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
              <span class="m-r-8 m-l-10">{{
                i18nM("material.label.name")
              }}</span>
              <el-input
                v-model="name"
                :placeholder="i18nM('material.placeholder.name')"
                class="w-200"
                @input="nameInputFunc"
              >
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>

              <span class="m-r-8 m-l-10">{{
                i18nM("material.label.code")
              }}</span>
              <el-input
                v-model="code"
                :placeholder="i18nM('material.placeholder.inputCode')"
                class="w-200"
                @input="codeInputFunc"
              >
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <span class="m-r-8 m-l-10">{{
                i18nM("material.label.brand")
              }}</span>
              <el-input
                v-model="brand"
                :placeholder="i18nM('material.placeholder.inputBrand')"
                class="w-200"
                @input="brandInputFunc"
              >
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
              <span class="m-r-8 m-l-10">{{
                i18nM("material.label.specifications")
              }}</span>
              <el-input
                v-model="specification"
                :placeholder="i18nM('material.placeholder.inputSpecifications')"
                class="w-200"
                @input="specificationInputFunc"
              >
                <template #append>
                  <el-button :icon="Search" />
                </template>
              </el-input>
            </div>
            <div>
              <el-button
                class="m-r-20"
                :type="'primary'"
                @click="create"
                v-if="hasPermission(PermissionType.Create, permissions)"
              >
                <img :src="AddIcon" width="16" height="16" class="el-icon" />
                <span>{{ i18nM("material.button.add") }}</span>
              </el-button>
            </div>
          </div>
        </div>
        <div class="zc-base p-r-20 p-l-20 flex-column flex-1">
          <div ref="tableRef" class="flex-1 table-wrap">
            <baseTable
              :columns="columns"
              :table-data="tableData"
              :indexMethod="indexMethod(currentPage, pageSize)"
            >
              <template #deptId="scope">
                {{ getDepartment(scope.scope.row.deptId) }}
              </template>
              <template #resourceId="scope">
                {{ findNameById(sourceOptions, scope.scope.row.resourceId) }}
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

              <template #imageUrls="scope">
                <!-- <div class="thumbnail-img-con">
                  <thumbnail
                    :src="formatImageSrc(scope.scope.row.imageDtos[0].imagePath
)"
                    :tableRefTop="tableRefTop"
                  />
                </div> -->
                <div class="icons-con">
                  <div class="icon-con">
                    <img
                      v-if="
                        formatImageSrc(scope.scope.row?.imageDtos[0]?.imagePath)
                      "
                      :src="
                        formatImageSrc(scope.scope.row?.imageDtos[0]?.imagePath)
                      "
                      alt=""
                      width="20"
                    />
                  </div>
                  <div class="icon-con">
                    <img
                      v-if="
                        formatImageSrc(scope.scope.row?.imageDtos[1]?.imagePath)
                      "
                      :src="
                        formatImageSrc(scope.scope.row?.imageDtos[1]?.imagePath)
                      "
                      alt=""
                      width="20"
                    />
                  </div>

                  <div class="icon-con">
                    <img
                      v-if="
                        formatImageSrc(scope.scope.row?.imageDtos[2]?.imagePath)
                      "
                      :src="
                        formatImageSrc(scope.scope.row?.imageDtos[2]?.imagePath)
                      "
                      alt=""
                      width="20"
                    />
                  </div>
                </div>
              </template>
              <template #operate="scope">
                <el-icon
                  class="fz20 m-r-20 pointer"
                  @click="edit(scope.scope.row)"
                  v-if="hasPermission(PermissionType.Update, permissions)"
                >
                  <Edit />
                </el-icon>
                <el-icon
                  class="fz20 pointer"
                  text
                  @click="deleteFunc(scope.scope.row)"
                  v-if="hasPermission(PermissionType.Delete, permissions)"
                >
                  <Delete />
                </el-icon>
              </template>
            </baseTable>
          </div>
          <div
            class="zc-footer d-flex align-items-center justify-content-end"
            v-if="totalItems > 0"
          >
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
    <div
      class="flex-1 flex-column h-full create-wrap"
      :class="{ 'fill-bg': processFlag != 2 }"
      v-if="processFlag"
    >
      <Create
        ref="createRef"
        :data="currentData"
        :deptId="departmentCurrentNodeKey"
        :projectId="projectId"
        :classificationId="classificationId"
        v-if="processFlag === 1"
      >
      </Create>

      <div
        class="zc-footer p-r-20 p-l-20 d-flex align-items-center"
        style="justify-content: flex-end"
      >
        <div>
          <el-button :type="'primary'" class="m-r-16 w-80" @click="save()">{{
            i18nM("material.button.save")
          }}</el-button>

          <el-button class="w-80" plain @click="back()">{{
            i18nM("material.button.back")
          }}</el-button>
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
import { defaultImg, defaultImgKey } from "@static/js/common/defaultImg";
import baseTable from "@static/table/baseTable/baseTable.vue";
import pagination from "@static/elementUI/pagination/pagination.vue";
import { getPageSizeCount, getPageCount } from "@static/js/page/utils";
import { PermissionType, hasPermission } from "@static/js/page/permission";
import { getNameMapByIds } from "@functions/serviceCenter/tenant-management/api/projects";
import { findTreeByCondition } from "@functions/serviceCenter/material-management/api/classCatalog";
import {
  materialPage,
  materialDelete,
} from "@functions/serviceCenter/material-management/api/material";
import { nameToLabel } from "@static/js/page/data";
import { Search } from "@element-plus/icons-vue";
import Create from "@functions/serviceCenter/material-management/material/create.vue";
const i18nM = window.$i18nM;
const tableRef = ref();
const stepRef = ref();
const title = ref("");
const createRef = ref();
const classificationId = ref();
const processFlag = ref(0);
const menuStore = useMenuStore();
const props = defineProps<ComponentPropsType>();
const permissions = computed(() =>
  menuStore.getComponentPermissions(props.configData?.operateTypes)
);
const specification = ref();
const name = ref();
const tableRefTop = ref(0);
const code = ref();
const brand = ref();
const currentData = ref<any>(null);
const addDataFlag = ref(false);
const tableData = ref([]);
const enterTreeRef = ref();
const enterTreeData = ref<any>([]);
const sourceOptions = ref<any[]>([]);

//物料搜索
let materialSearch = "";
//默认展开物料
const materialExpandedKeys = ref<Array<number | string>>([0]);
//当前选中物料
const materialCurrentNodeKey = ref<any>(0);

//编辑时选中的对象
const info = ref<any>({});
const formatImageSrc = (imagePath: any) => {
  return imagePath;
};

/**
 * 更改物料数据闭包事件
 * @param data
 * @param id
 */
let enterChangeFunc = (data: any, id?: number) => {
  enterTreeData.value = data;
  if (id) materialCurrentNodeKey.value = id;
  refreshTable(true);
};

/**
 * 获取物料列表
 * @param rightListFlag
 */
const getEnterpriseList = (changeFlag: boolean) => {
  findTreeByCondition(
    {
      projectId: projectId.value,
      name: materialSearch,
    },
    (res: any) => {
      enterTreeData.value = res.data.content;

      if (changeFlag)
        enterChangeFunc(nameToLabel(res.data, "name"), res.data?.[0]?.id);
      refreshTable();
    }
  );
};

/**
 * 点击物料事件
 */
const enterChange = (material: any) => {
  materialCurrentNodeKey.value = material.id;
  refreshTable(true);
};

/**
 * 左侧物料搜索
 * @param val
 */
const enterFilter = (val: string) => {
  materialSearch = val;
  if (!val) materialCurrentNodeKey.value = 0;
  else materialCurrentNodeKey.value = null;
  enterChangeFunc = (data: any, id?: number) => {
    enterTreeData.value = data;
    if (id) materialCurrentNodeKey.value = id;
  };
  getEnterpriseList(true);
};

const columns = computed(() => [
  {
    prop: "index",
    label: i18nM("material.table.index"),
    type: 1,
    width: "100%",
  },
  {
    prop: "name",
    label: i18nM("material.table.name"),
    type: 2,
  },
  {
    prop: "simpleName",
    label: i18nM("material.table.abbreviation"),
    type: 2,
  },
  { prop: "code", label: i18nM("material.table.code") },

  { prop: "tradeTypeName", label: i18nM("material.table.category"), type: 2 },
  { prop: "brand", label: i18nM("material.table.brand") },
  { prop: "modelNo", label: i18nM("material.table.model") },
  { prop: "specification", label: i18nM("material.table.specifications") },
  { prop: "safeCountLimit", label: i18nM("material.table.safetyQuantity") },

  { prop: "minCountLimit", label: i18nM("material.table.minimumStock") },

  { prop: "unitName", label: i18nM("material.table.unit") },

  { prop: "imageUrls", label: i18nM("material.table.picture"), type: 2 },

  {
    prop: "operate",
    type: 2,
    label: i18nM("material.table.operate"),
    width: 100,
  },
]);

const projects = ref(window.$HyGlobal.getCurrentProject()?.projects);
const projectId = ref(
  window.$HyGlobal.getCurrentProject()?.projects?.[0]?.projectId || 0
);
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

// const changeStatus = (row: any) => {
//   if (row.id) {
//     editFlowEnable(
//       {
//         enable: row.enable,
//         id: row.id,
//       },
//       (res: any) => {
//         if (res.code) {
//           ElMessage({
//             type: "success",
//             message: i18nM("material.message.editSuccess"),
//           });
//           refreshTable();
//         }
//       }
//     );
//   }
// };
const projectChange = (val: any) => {
  projectId.value = val;
  getEnterpriseList(true);
};
//分页
const pageSize = ref(10);
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
  const params = {
    projectId: projectId.value,
    page: currentPage.value,
    size: pageSize.value,
    name: name.value,
    code: code.value,
    specification: specification.value,
    brand: brand.value,
    tradeTypeId: materialCurrentNodeKey.value,
  };
  // if (title.value.length) params.title = title.value;

  materialPage(params, (res: any) => {
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
const specificationInputFunc = () => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};
const codeInputFunc = () => {
  clearTimeout(nameTimer);
  nameTimer = setTimeout(() => {
    refreshTable();
  }, 400);
};
const brandInputFunc = () => {
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
    createRef.value.confirmSave((data: any) => {
      currentData.value = data;
      processFlag.value = 0;
      getEnterpriseList(true);
    });
  }
};

const edit = (row: any) => {
  currentData.value = row;
  processFlag.value = 1;
};
const create = () => {
  currentData.value = null;
  processFlag.value = 1;
  classificationId.value = materialCurrentNodeKey.value;
};
const back = () => {
  if (processFlag.value == 2) {
    const valid = stepRef.value.confirmSave();
    if (!valid) return;
    getEnterpriseList(true);
  }
  processFlag.value = 0;
  currentData.value = null;
  getEnterpriseList(true);
};
const deleteFunc = (row: any) => {
  ElMessageBox.confirm(
    i18nM("material.modal.confirmDeleteMaterial"),
    i18nM("material.title.deleteMaterial"),
    {
      confirmButtonText: i18nM("material.button.delete"),
      confirmButtonClass: "w-80",
      cancelButtonText: i18nM("material.button.cancel"),
      cancelButtonClass: "message-box-cancel-btn w-80",
      type: "warning",
    }
  )
    .then(() => {
      materialDelete({ id: row.id }, (res: any) => {
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
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: i18nM("material.message.cancelDelete"),
      });
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
onMounted(() => {
  getEnterpriseList(true);
  tableRefTop.value = tableRef.value.getBoundingClientRect().top;
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
.icons-con {
  display: flex;
  height: zrem(20);
  .icon-con {
    width: zrem(20);
    height: zrem(20);
    // border: zrem(1) solid var(--el-border-color);
    margin: 0 zrem(5);
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
