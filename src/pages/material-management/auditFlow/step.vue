<template>
  <div class="flex-1 w-full h-full d-flex">
    <div class="left-wrap fill-bg">
      <div class="m-t-16 m-l-20 d-flex align-items-center justify-content-between">
        <div class="zc-header-title">
          <div class="zc-header-icon"></div>
          <div class="zc-header-word">
            {{ i18nM("material.label.processSteps") }}
          </div>
        </div>
        <el-button :type="'primary'" class="m-r-20" @click="create">
          <span>{{ i18nM("material.button.add") }}</span>
        </el-button>
      </div>
      <div class="flow-wrap">
        <OrderFlow ref="vueFlowRef" @node-click="onNodeClick" :nodes="nodes" :edges="edges">
          <template #rectangle>
            <div class="el-card is-always-shadow p-t-10 w-200" v-if="currentNode">
              <div class="d-flex h-30 align-items-center">
                <div class="m-l-16 text-right">{{ i18nM("material.table.department") }}：</div>
                <div class="m-r-16">
                  {{ getDeptName(currentNode.deptId) }}
                </div>
              </div>
              <div class="d-flex h-30 align-items-center">
                <div class="m-l-16 text-right">{{ i18nM("material.label.type") }}：</div>
                <div class="m-r-16">
                  {{ currentNode.userId ? i18nM("material.title.specifyUser") : i18nM("material.title.specifyRole") }}
                </div>
              </div>
              <div class="d-flex h-30 align-items-center">
                <div class="m-l-16 text-right">
                  {{ currentNode.userId ? i18nM("material.title.handler") : i18nM("material.title.disposerRole") }}：
                </div>
                <div class="m-r-16">
                  {{ currentNode.userId ? currentNode.userName : findNodeById(roleOptions, currentNode.roleId as unknown as number)?.name }}
                </div>
              </div>
              <div class="h-40 d-flex align-items-center justify-content-end m-t-20 border-top">
                <el-text class="m-r-16 pointer" type="primary" @click="edit()">{{ i18nM("material.button.edit") }}</el-text>
                <el-text v-if="editIndex === steps.length - 1" class="m-r-16 pointer" type="primary" @click="remove()">{{
                  i18nM("material.button.delete")
                }}</el-text>
              </div>
            </div>
          </template>
        </OrderFlow>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" width="20%">
      <template #header>
        <span>{{ i18nM("material.title.stepConfig") }}</span>
      </template>
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item :label="i18nM('material.table.department')">
          <el-tree-select
            @change="getUserList"
            v-model="form.deptId"
            :placeholder="i18nM('material.placeholder.select')"
            :data="deptOptions"
            check-strictly
            :render-after-expand="true"
            :props="selectProps"
          />
        </el-form-item>
        <div class="m-b-20 m-l-30">
          <el-radio-group v-model="form.isRoleUser" class="m-l-16">
            <el-radio :value="1">{{ i18nM("material.title.specifyUser") }}</el-radio>
            <el-radio :value="0">{{ i18nM("material.title.specifyRole") }}</el-radio>
          </el-radio-group>
        </div>
        <el-form-item :label="i18nM('material.title.role')">
          <el-tree-select
            @change="changeRole"
            v-model="form.roleId"
            :placeholder="i18nM('material.placeholder.role')"
            :data="roleOptions"
            check-strictly
            :render-after-expand="true"
            :props="selectProps"
          />
        </el-form-item>
        <el-form-item v-if="form.isRoleUser === 1" :label="i18nM('material.title.handler')">
          <el-select v-model="form.userId" @change="changeUser" :placeholder="i18nM('material.placeholder.select')">
            <el-option v-for="item of userOption" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirm" type="primary">{{ i18nM("material.button.confirm") }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
const i18nM = window.$i18nM;
import { ref, onMounted, computed, watch } from "vue";
import { Step, saveFlowStep, deleteStepById, getStepsByFlowId } from "@functions/serviceCenter/material-management/api/materialAuditFlowDetail";
import { Flow } from "@functions/serviceCenter/material-management/api/materialAuditFlow";
import { MarkerType } from "@vue-flow/core";
import { roleTree, findUserListByRoleId } from "@functions/product/mopai/api/role";
import { getDeptTreeByCurUserId } from "@functions/userCenter/api/departments";
import { getCssVar } from "@static/js/theme/var";
import OrderFlow from "@static/components/flow/flow.vue";
import useLocaleStore from "@static/js/store/locale";
import { ElMessage, ElMessageBox } from "element-plus";
const localeStore = useLocaleStore();
const lang = computed(() => localeStore.getLang); //获取语言
const props = defineProps<{ data: Flow; projectId: string | number; deptId: string | number; enterpriseId: string | number }>();
const dialogFormVisible = ref(false);
const selectProps = { value: "id", label: "name" };
const vueFlowRef = ref();
const steps = ref<Step[]>([]);
watch(lang, () => {
  steps.value.map((step: Step, i: number) => {
    vueFlowRef.value.updateNode(`node_${i + 1}`, {
      data: {
        label: getOperate(),
      },
    });
  });
});
//表单
const form = ref<Step>({
  projectId: props.projectId,
  flowId: props.data.id as unknown as number,
  resourceType: props.data.resourceType,
  level: 1,
  isRoleUser: 0,
  roleId: "",
  roleName: "",
  userId: "",
  userName: "",
  deptId: "",
});

const editIndex = ref(-1);
const getOperate = () => {
  return i18nM("material.label.approve");
};
const roleOptions = ref<any[]>([]);
const roleMap = ref(new Map());
const deptOptions = ref<any[]>([]);
const getDeptName = (id: number | string) => {
  return findNodeById(deptOptions.value, id as any as number)?.name ?? "";
};
const getDepartment = (cb: Function) => {
  getDeptTreeByCurUserId(
    {
      enterPriseId: props.enterpriseId as any as number,
    },
    (res: any) => {
      deptOptions.value = res.data;
      form.value.deptId = deptOptions.value[0]?.id;
      cb();
    }
  );
};

const findNodeById = (nodes: any[], targetId: number) => {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const foundNode: any = findNodeById(node.children, targetId);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return null;
};
const getRole = () => {
  roleTree(
    {
      projectId: window.$HyGlobal.getCurrentProject()?.projects?.[0]?.projectId as unknown as number,
    },
    (res: any) => {
      roleMap.value.clear();
      const dataList = res.data?.[0].id == 0 ? res.data?.[0].children : res.data;
      roleOptions.value = dataList.map((item: any) => {
        const { id, name } = item;
        roleMap.value.set(id, name);
        return item;
      });
      if (roleOptions.value[0]) {
        form.value.roleId = roleOptions.value[0].id;
        form.value.roleName = roleOptions.value[0].name;
        getUserList();
      }
    }
  );
};
const changeRole = () => {
  form.value.roleName = roleMap.value.get(form.value.roleId) || "";
  getUserList();
};
const userOption = ref<any[]>([]);
const userMap = ref(new Map());
const getUserList = () => {
  const params: any = {
    projectId: props.projectId,
    roleId: form.value.roleId as unknown as number,
  };
  if (form.value.deptId) {
    params.deptId = form.value.deptId;
  }
  findUserListByRoleId(params, (res: any) => {
    userOption.value = res.data.map((item: any) => {
      const { id, name } = item;
      userMap.value.set(id, name);
      return item;
    });
    if (userOption.value?.[0] && form.value.isRoleUser) {
      form.value.userId = userOption.value?.[0].id;
      form.value.userName = userOption.value?.[0].name;
    } else {
      form.value.userId = 0;
      form.value.roleName = "";
      userOption.value = [{ id: 0, name: "无" }];
    }
  });
};
const changeUser = () => {
  form.value.userName = userMap.value.get(form.value.userId) || "";
};

const nodes = ref([
  {
    id: "rect-1",
    type: "rectangle",
    position: { x: 0, y: 0 },
    data: {},
  },
]);

const edges = ref([]);

function create() {
  editIndex.value = -1;
  dialogFormVisible.value = true;
}

const currentNode = ref<null | Step>(null);
const onNodeClick = (node: any, isNode: boolean) => {
  if (!isNode) {
    currentNode.value = null;
    return;
  }
  if (node.type === "diamond") {
    editIndex.value = node.id.split("_")[1] - 1;
    currentNode.value = steps.value[editIndex.value];
    const targetNodeId = "rect-1";
    vueFlowRef.value.updateNode(targetNodeId, {
      position: {
        x: node.computedPosition.x - 50,
        y: 100,
      },
    });
  }
};

const confirm = () => {
  if (form.value.userId == 0 && form.value.isRoleUser === 1) {
    ElMessage({
      type: "error",
      message: i18nM("material.error.handlerCannotBeEmpty"),
    });
    return;
  }
  if (editIndex.value > -1) {
    const params: Step = { ...form.value };
    if (params.isRoleUser === 0) {
      delete params["userId"];
    }
    delete params["isRoleUser"];
    saveFlowStep(params, (res: any) => {
      steps.value[editIndex.value] = res.data;
      currentNode.value = steps.value[editIndex.value];
      dialogFormVisible.value = false;
    });
  } else {
    const len = steps.value.length;
    const newNode = {
      id: `node_${len + 1}`,
      type: "diamond",
      data: {
        label: getOperate(),
      },
      position: { x: 100 + len * 250, y: 300 },
    };
    vueFlowRef.value.addNodes([newNode]);
    if (len > 0) {
      const edges = {
        id: `line_${len}`,
        source: `node_${len}`,
        target: `node_${len + 1}`,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: getCssVar("--el-color-primary"),
        },
        style: {
          stroke: getCssVar("--el-color-primary"), // 边的颜色
          strokeWidth: 2, // 边的宽度
        },
      };
      vueFlowRef.value.addEdges([edges]);
    }

    const params: Step = { ...form.value, level: len + 1 };
    if (params.isRoleUser === 0) {
      delete params["userId"];
    }
    delete params["isRoleUser"];
    saveFlowStep(params, (res: any) => {
      steps.value.push(res.data);
      dialogFormVisible.value = false;
    });
  }
};
const edit = () => {
  form.value = Object.assign(form.value, currentNode.value);
  getUserList();
  dialogFormVisible.value = true;
};
const remove = () => {
  ElMessageBox.confirm(i18nM("material.confirm.deleteStep"), i18nM("material.title.deleteStep"), {
    confirmButtonText: i18nM("material.button.delete"),
    confirmButtonClass: "w-80",
    cancelButtonText: i18nM("material.button.cancel"),
    cancelButtonClass: "message-box-cancel-btn w-80",
    type: "warning",
  })
    .then(() => {
      deleteStepById({ id: currentNode.value?.id as any as string }, (res: any) => {
        if (res.code) {
          ElMessage({
            type: "success",
            message: i18nM("material.message.deleteSuccess"),
          });
          steps.value.splice(editIndex.value, 1);
          vueFlowRef.value.removeNodes([`node_${editIndex.value + 1}`]);
          currentNode.value = null;
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

const querySteps = (cb?: Function) => {
  getStepsByFlowId({ flowId: props.data.id as any as string, projectId: props.projectId }, (res: any) => {
    steps.value = res.data.map((item: any) => {
      item.isRoleUser = item.userId ? 1 : 0;
      return item;
    });
    steps.value.map((step: Step, i: number) => {
      const newNode = {
        id: `node_${i + 1}`,
        type: "diamond",
        data: {
          label: getOperate(),
        },
        position: { x: 100 + i * 250, y: 300 },
      };

      vueFlowRef.value.addNodes([newNode]);
      if (i > 0) {
        const edges = {
          id: `line_${i}`,
          source: `node_${i}`,
          target: `node_${i + 1}`,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: getCssVar("--el-color-primary"),
          },
          style: {
            stroke: getCssVar("--el-color-primary"), // 边的颜色
            strokeWidth: 2, // 边的宽度
          },
        };
        vueFlowRef.value.addEdges([edges]);
      }
    });
    cb && cb();
  });
};
const confirmSave = () => {
  if (steps.value.length === 0) {
    ElMessage({
      type: "error",
      message: i18nM("material.error.stepsCannotBeEmpty"),
    });
    return false;
  }
  return true;
};
onMounted(() => {
  getDepartment(() => {
    getRole();
    querySteps();
  });
});
defineExpose({
  confirmSave,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.left-wrap {
  width: 100%;
  height: 100%;
  border-radius: zrem(8);
}
.right-wrap {
  width: zrem(320);
  height: 100%;
  border-radius: zrem(8);
}
.flow-wrap {
  width: 100%;
  height: calc(100% - zrem(50));
  position: relative;
  border-radius: zrem(8);
  .btn-create {
    position: absolute;
    right: zrem(20);
    top: zrem(10);
    z-index: 1;
  }
}
.text-right {
  text-align: right;
}
.border-top {
  border-top: zrem(1) solid var(--el-border-color);
}
.border {
  border: zrem(1) solid var(--el-border-color);
}
.m-l-100 {
  margin-left: zrem(100);
}
.h-scroll {
  height: calc(100% - zrem(20));
}
</style>
