<template>
  <div class="flex flex-col el-card p-l-5 p-r-5">
    <div class="w-full h-full">
      <div class="flex justify-between align-items-center h-15">
        <div class="zc-header-title">
          <div class="zc-header-icon"></div>
          <div class="zc-header-word">流程步骤</div>
        </div>
        <el-button :type="'primary'" @click="create">
          <span>新增</span>
        </el-button>
      </div>
      <el-divider class="m-0" />
      <div class="flow-wrap">
        <OrderFlow
          ref="vueFlowRef"
          @node-click="onNodeClick"
          :nodes="nodes"
          :edges="edges"
        >
          <template #rectangle>
            <div
              class="el-card is-always-shadow p-t-3 width-200"
              v-if="currentNode"
            >
              <div class="flex h-30 align-items-center">
                <div class="m-l-3 text-right">部门：</div>
                <div class="m-r-3">
                  {{ getDeptName(currentNode.deptId) }}
                </div>
              </div>
              <div class="flex h-30 align-items-center">
                <div class="m-l-3 text-right">类型：</div>
                <div class="m-r-3">
                  {{ currentNode.userId ? "指定人" : "指定角色" }}
                </div>
              </div>
              <div class="flex h-30 align-items-center">
                <div class="m-l-3 text-right">
                  {{ currentNode.userId ? "处置人" : "处置角色" }}：
                </div>
                <div class="m-r-3">
                  {{
                    currentNode.userId
                      ? currentNode.userName
                      : findNodeById(
                          roleOptions,
                          currentNode.roleId as unknown as number
                        )?.name
                  }}
                </div>
              </div>
              <div
                class="h-40 flex align-items-center justify-content-end m-t-3 border-top"
              >
                <el-text class="m-r-3 pointer" type="primary" @click="edit()"
                  >编辑</el-text
                >
                <el-text
                  v-if="editIndex === steps.length - 1"
                  class="m-r-3 pointer"
                  type="primary"
                  @click="remove()"
                  >删除</el-text
                >
              </div>
            </div>
          </template>
        </OrderFlow>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" width="20%">
      <template #header>
        <span>步骤设置</span>
      </template>
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="部门">
          <el-tree-select
            @change="getUserList"
            v-model="form.deptId"
            placeholder="请选择部门"
            :data="deptOptions"
            check-strictly
            :render-after-expand="true"
            :props="selectProps"
          />
        </el-form-item>
        <div class="d-flex">
          <el-radio-group
            v-model="form.isRoleUser"
            class="m-l-10 m-b-5"
            @change="changeIsRoleUser"
          >
            <el-radio :value="1">指定人</el-radio>
            <el-radio :value="0">指定角色</el-radio>
          </el-radio-group>
        </div>
        <el-form-item label="角色">
          <el-tree-select
            @change="changeRole"
            v-model="form.roleId"
            placeholder="请选择角色"
            :data="roleOptions"
            check-strictly
            :render-after-expand="true"
            :props="selectProps"
          />
        </el-form-item>
        <el-form-item v-if="form.isRoleUser === 1" label="处置人">
          <el-select
            v-model="form.userId"
            @change="changeUser"
            placeholder="请选择处置人"
          >
            <el-option
              v-for="item of userOption"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirm" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  Step,
  getStepList,
  createStep,
  editStep,
  deleteStep,
} from "../api/auditFlowDetail";
import { AuditFlow } from "../api/auditFlow";
import OrderFlow from "@static/components/flow/flow.vue";
import { getEmployeeList } from "@/pages/employeeManagement/api/employee";
import { getRoleList } from "@/pages/employeeManagement/api/role";
import {
  getDepartmentList,
  Department,
} from "@pages/employeeManagement/api/department";
import { MarkerType } from "@vue-flow/core";
import { getCssVar } from "@static/js/theme/var";
const props = defineProps<{ data: AuditFlow; deptId: string | number }>();
const vueFlowRef = ref();
const editIndex = ref(-1);
const dialogFormVisible = ref(false);
const steps = ref<Step[]>([]);
const nodes = ref([
  {
    id: "rect-1",
    type: "rectangle",
    position: { x: 0, y: 0 },
    data: {},
  },
]);
const selectProps = { value: "id", label: "name" };
const edges = ref([]);
//表单
const form = ref<Step>({
  flowId: props.data.id as unknown as number,
  type: props.data.type,
  level: 1,
  isRoleUser: 0,
  roleId: "",
  roleName: "",
  userId: "",
  userName: "",
  deptId: "",
});
const create = () => {
  editIndex.value = -1;
  delete form.value["id"];
  dialogFormVisible.value = true;
};

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
const edit = async () => {
  form.value = Object.assign(form.value, currentNode.value);
  await getUserList();
  dialogFormVisible.value = true;
};
const remove = () => {
  ElMessageBox.confirm("确定要删除步骤吗", "删除步骤", {
    confirmButtonText: "删除",
    confirmButtonClass: "w-80",
    cancelButtonText: "取消",
    cancelButtonClass: "message-box-cancel-btn w-80",
    type: "warning",
  })
    .then(async () => {
      const res: any = await deleteStep(currentNode.value?.id as any as string);
      if (res.code) {
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        steps.value.splice(editIndex.value, 1);
        vueFlowRef.value.removeNodes([`node_${editIndex.value + 1}`]);
        currentNode.value = null;
      } else {
        ElMessage({
          type: "info",
          message: "删除失败",
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
const confirm = async () => {
  if (form.value.userId == 0 && form.value.isRoleUser === 1) {
    ElMessage({
      type: "error",
      message: "处置人不能为空",
    });
    return;
  }
  if (editIndex.value > -1) {
    const params: Step = { ...form.value };
    params.roleName = roleMap.value.get(params.roleId) || "";
    if (params.isRoleUser === 0) {
      params.userId = 0;
      params.userName = "";
    }
    delete params["isRoleUser"];
    const api = params?.id ? editStep : createStep;
    const res: any = await api(params);
    steps.value[editIndex.value] = res.data;
    currentNode.value = steps.value[editIndex.value];
    dialogFormVisible.value = false;
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
      params.userId = 0;
      params.userName = "";
    }
    params.roleName = roleMap.value.get(params.roleId) || "";
    delete params["isRoleUser"];
    const api = params?.id ? editStep : createStep;
    const res: any = await api(params);
    steps.value.push(res.data);
    dialogFormVisible.value = false;
  }
};
const departmentMap = new Map();
const getDeptName = (id: number | string) => {
  return findNodeById(deptOptions.value, id as any as number)?.name ?? "";
};
function buildDepartmentTree(departments: Department[]) {
  // 第一步：创建所有分类的映射并初始化children
  departments.forEach((dept: Department) => {
    departmentMap.set(dept.id, {
      ...dept,
      children: [],
    });
  });

  // 第二步：建立所有层级的父子关系
  departments.forEach((dept: Department) => {
    const current = departmentMap.get(dept.id);
    if (dept.parentId !== 0) {
      const parent = departmentMap.get(dept.parentId);
      if (parent) {
        parent.children.push(current);
      }
    }
  });

  // 第三步：收集顶级分类
  return departments
    .filter((dept: Department) => dept.parentId === 0)
    .map((dept: Department) => departmentMap.get(dept.id));
}
const getDepartment = async () => {
  const res = await getDepartmentList();
  if ((res as any)?.data?.length) {
    deptOptions.value = buildDepartmentTree((res as any)?.data || []);
    form.value.deptId = deptOptions.value[0]?.id;
  }
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
const getOperate = () => {
  return "审批";
};
const roleOptions = ref<any[]>([]);
const roleMap = ref(new Map());
const deptOptions = ref<any[]>([]);
const changeRole = () => {
  form.value.roleName = roleMap.value.get(form.value.roleId) || "";
  getUserList();
};
const changeIsRoleUser = () => {
  if (!form.value.isRoleUser) {
    form.value.userId = 0;
    form.value.userName = "";
    form.value.roleName = "";
  }
};
const getRole = async () => {
  const res: any = await getRoleList();
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
};
const userOption = ref<any[]>([]);
const userMap = ref(new Map());
const getUserList = async () => {
  const params: any = {};
  if (form.value.deptId) {
    params.departmentId = form.value.deptId;
  }
  if (form.value.roleId) {
    params.roleId = form.value.roleId;
  }
  const res: any = await getEmployeeList(params);
  if (res.data.length) {
    userOption.value = res.data.map((item: any) => {
      const { id, realName: name } = item;
      userMap.value.set(id, name);
      return { id, name };
    });
  } else {
    userOption.value = [{ id: 0, name: "无" }];
  }
  if (userOption.value?.[0] && form.value.isRoleUser) {
    form.value.userId = userOption.value?.[0].id;
    form.value.userName = userOption.value?.[0].name;
    form.value.roleName = roleMap.value.get(form.value.roleId);
  } else {
    form.value.userId = 0;
    form.value.userName = "";
    form.value.roleName = "";
  }
};
const changeUser = () => {
  form.value.userName = userMap.value.get(form.value.userId) || "";
};
const querySteps = async () => {
  const res: any = await getStepList({
    flowId: props.data.id as any as string,
  });

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
};
onMounted(async () => {
  await getDepartment();
  await getRole();
  await querySteps();
});
</script>
<style lang="scss" scoped>
@use "@@/assets/styles/size.scss" as *;

.flow-wrap {
  width: 100%;
  height: calc(100% - zrem(80));
  position: relative;
  border-radius: zrem(8);
  .btn-create {
    position: absolute;
    right: zrem(20);
    top: zrem(10);
    z-index: 1;
  }
}
.h-30 {
  height: zrem(30) !important;
}
.h-40 {
  height: zrem(40) !important;
}
.text-right {
  text-align: right;
}
.border-top {
  border-top: zrem(1) solid var(--el-border-color);
}
.pointer {
  cursor: pointer;
}
</style>
