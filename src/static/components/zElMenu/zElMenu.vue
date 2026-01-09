<template>
  <el-row
    class="com-zelmenu-con"
    id="com-zelmenu-con"
    :class="{
      horizontal: layoutTheme === LayoutV.Horizontal,
      vertical: layoutTheme === LayoutV.Vertical,
      'w-80': layoutTheme === LayoutV.Vertical && isCollapse,
      'w-220': layoutTheme === LayoutV.Vertical && !isCollapse,
    }"
  >
    <div class="collapse-handler-con d-flex flex-center pointer" @mousedown.stop="collapseHandler()" v-if="layoutTheme === LayoutV.Vertical">
      <div class="collapse-handler">
        <div class="fold-icon">
          <el-icon v-if="isCollapse"><ArrowRightBold /></el-icon>
          <el-icon v-else><ArrowLeftBold /></el-icon>
        </div>
      </div>
    </div>
    <el-col class="m-s-con w-auto p-l-10">
      <el-scrollbar class="zc-el-scrollbar" @click="intercept($event)">
        <template v-if="groupConfigHtmlIds.includes(htmlID) && isCollapse && groupLen > 1">
          <el-popover placement="bottom-start" :width="400" trigger="click" ref="elPop1">
            <template #reference>
              <div class="switch-group-con2">
                <img :src="switchGroupIcon" />
              </div>
            </template>
            <div class="group-list-con">
              <template v-if="!frameGroupList2.length">
                <div class="group-list-header d-flex align-items-center">
                  <div class="group-list-header-box"></div>
                  <div class="group-list-header-name">工作台</div>
                </div>
                <div class="group-list">
                  <div
                    class="group-item"
                    v-for="item of frameGroupList"
                    @click="switchGroup(item)"
                    :class="{
                      'active-group-item': groupInfo.id == (item.groupId || item.id),
                    }"
                  >
                    <div class="group-item-icon">
                      <img :src="item.icon" alt="" />
                      <!-- <ThemeImg
                      class="m-r-10"
                      :width="20"
                      :height="20"
                      :src="item.icon"
                      :color="groupInfo.id == item.id ? 'var(--el-menu-active-color)' : ''"
                    /> -->
                    </div>
                    <div class="group-item-name">
                      {{ item.aliasName || item.cnName }}
                    </div>
                  </div>
                </div>
                <div class="group-list-header d-flex align-items-center">
                  <div class="group-list-header-box"></div>
                  <div class="group-list-header-name">大屏组</div>
                </div>
                <div class="group-list">
                  <div class="group-item" v-for="item of largeScreeGroupList" @click="switchLargeGroup(item)">
                    <div class="group-item-icon">
                      <!-- <ThemeImg
                      class="m-r-10"
                      :width="20"
                      :height="20"
                      :src="item.icon"
                    /> -->
                      <img :src="item.icon" alt="" />
                    </div>
                    <div class="group-item-name">
                      {{ item.aliasName || item.cnName }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="frameGroupList2.length">
                <div class="group-list-header d-flex align-items-center">
                  <div class="group-list-header-box"></div>
                  <div class="group-list-header-name">工作台</div>
                </div>
                <div class="group-list">
                  <div
                    class="group-item"
                    v-for="item of frameGroupList2"
                    @click="switchGroup(item.groupInfo)"
                    :class="{
                      'active-group-item': groupInfo.id == item.groupInfo.id,
                    }"
                  >
                    <div class="group-item-icon">
                      <!-- <ThemeImg
                      class="m-r-10"
                      :width="20"
                      :height="20"
                      :src="item.groupInfo.icon"
                      :color="groupInfo.id == item.groupInfo.id ? 'var(--el-menu-active-color)' : ''"
                    /> -->
                      <img :src="item.icon" alt="" />
                    </div>
                    <div class="group-item-name">
                      {{ item.groupInfo.aliasName }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </el-popover>
        </template>

        <div style="position: relative">
          <div class="swicth-group-icon-con" v-if="groupConfigHtmlIds.includes(htmlID) && !fastIsCollapse && groupLen > 1">
            <el-popover placement="bottom-start" :width="400" trigger="click" ref="elPop2">
              <template #reference>
                <div class="switch-group-con">
                  <img :src="switchGroupIcon" />
                </div>
              </template>
              <div class="group-list-con">
                <template v-if="!frameGroupList2.length && (frameGroupList?.length || 0) + (largeScreeGroupList?.length || 0) > 1">
                  <template v-if="Array.isArray(frameGroupList) && frameGroupList.length">
                    <div class="group-list-header d-flex align-items-center">
                      <div class="group-list-header-box"></div>
                      <div class="group-list-header-name">工作台</div>
                    </div>
                    <div class="group-list">
                      <div
                        class="group-item"
                        v-for="item of frameGroupList"
                        @click="switchGroup(item)"
                        :class="{
                          'active-group-item': groupInfo.id == (item.groupId || item.id),
                        }"
                      >
                        <div class="group-item-icon">
                          <img :src="item.icon" alt="" />
                        </div>
                        <div class="group-item-name">
                          {{ item.aliasName || item.cnName }}
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-if="Array.isArray(largeScreeGroupList) && largeScreeGroupList.length">
                    <div class="group-list-header d-flex align-items-center">
                      <div class="group-list-header-box"></div>
                      <div class="group-list-header-name">大屏组</div>
                    </div>
                    <div class="group-list">
                      <div class="group-item" v-for="item of largeScreeGroupList" @click="switchLargeGroup(item)">
                        <div class="group-item-icon">
                          <img :src="item.icon" alt="" />
                        </div>
                        <div class="group-item-name">
                          {{ item.aliasName || item.cnName }}
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
                <template v-if="frameGroupList2.length">
                  <div class="group-list-header d-flex align-items-center">
                    <div class="group-list-header-box"></div>
                    <div class="group-list-header-name">工作台</div>
                  </div>
                  <div class="group-list">
                    <div
                      class="group-item"
                      v-for="item of frameGroupList2"
                      @click="switchGroup(item.groupInfo)"
                      :class="{
                        'active-group-item': groupInfo.id == item.groupInfo.id,
                      }"
                    >
                      <div class="group-item-icon">
                        <img :src="item.icon" alt="" />
                      </div>
                      <div class="group-item-name">
                        {{ item.groupInfo.aliasName }}
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="largeScreeGroupList2.length">
                  <div class="group-list-header d-flex align-items-center">
                    <div class="group-list-header-box"></div>
                    <div class="group-list-header-name">大屏组</div>
                  </div>
                  <div class="group-list">
                    <div
                      class="group-item"
                      v-for="item of largeScreeGroupList2"
                      @click="switchLargeGroup(item.groupInfo)"
                      :class="{
                        'active-group-item': groupInfo.id == item.groupInfo.id,
                      }"
                    >
                      <div class="group-item-icon">
                        <img :src="item.icon" alt="" />
                      </div>
                      <div class="group-item-name">
                        {{ item.groupInfo.aliasName }}
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </el-popover>
          </div>
          <el-menu
            class="t-color border-none zc-el-menu"
            :class="{
              'overflow-hidden': layoutTheme === LayoutV.Horizontal,
              'p-t-4': layoutTheme === LayoutV.Horizontal && groupConfigHtmlIds.includes(htmlID) && groupLen > 1,
            }"
            :default-active="index"
            :collapse="isCollapse"
            :router="false"
            :unique-opened="true"
            :mode="layoutTheme"
            ref="menu"
          >
            <zcElSubMenu :arr="sliceMenu" :index="index" :isCollapse="isCollapse" :level="0" :groupLen="groupLen" />
          </el-menu>
        </div>
      </el-scrollbar>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useResizeObserver } from "@vueuse/core";
import { LayoutV, SideBarStatus } from "@static/js/theme/types";
import { ref, watch, computed } from "vue";
import zcElSubMenu from "./zElSubMenu.vue";
import { useRouter } from "vue-router";
import useThemeStore from "@static/js/store/theme";
import moreIcon from "@static/images/more-icon.png";
import useMenuStore from "@static/js/store/menu";
import useStyleStore from "@static/js/store/style";
import switchGroupIcon from "@static/images/switch-group.svg";
import { SmartAppConfig, IotAppConfig, MopaiAppConfig, MasterAppConfig } from "@static/js/configs/AppConfig";
import { htmlID } from "@static/js/common/id";
import { xwfuGet } from "@static/js/http/http";

const groupConfigHtmlIds = [SmartAppConfig.HTMLID, IotAppConfig.HTMLID, MopaiAppConfig.HTMLID, MasterAppConfig.HTMLID];
interface largeScreeGroupListItem {
  cnName: string | number;
  aliasName: string | number;
  icon: string;
}

const groupLen = ref(0);
const themeStore = useThemeStore();
const layoutTheme = computed<any>(() => themeStore.getLayout); //获取当前布局
const menuStore: any = useMenuStore();
const menuListValue = computed(() => {
  console.log('查看当前菜单;', menuStore.getMenus);
  return menuStore.getMenus;
});
const styleStore: any = useStyleStore();
const menu = ref(null);
const frameGroupList = ref<any[]>([]);
const largeScreeGroupList = ref<largeScreeGroupListItem[]>([]);
const frameGroupList2 = ref<any[]>([]);
const largeScreeGroupList2 = ref<any[]>([]);
const largeScreenWindowObj = ref<any>({});
const groupInfo = computed<any>(() => {
  return menuStore.getGroupInfo;
});
if (SmartAppConfig.HTMLID === htmlID) {
  const _groupList = menuStore.getGroupList;
  const _largeGroupList = menuStore.getLargeGroupList;
  if (!_groupList || !Array.isArray(_groupList) || !_groupList.length) {
    const projectInfo = window.$HyGlobal.getProjectInfo() || {};
    xwfuGet(
      `/smart/main/api/frame/getSmartUserGroupList`,
      {
        projectId: projectInfo.id || null,
        functionPermissionId: window.$HyGlobal.getFunctionPermissionId(),
      },
      (res: any) => {
        console.log("hhhhhh:", res.data);
        frameGroupList.value = res.data.frameGroupList || [];
        largeScreeGroupList.value = res.data.largeScreeGroupList || [];
        groupLen.value = frameGroupList.value.length + largeScreeGroupList.value.length;
      }
    );
  } else {
    frameGroupList2.value = _groupList || [];
    largeScreeGroupList2.value = _largeGroupList || [];
    groupLen.value = frameGroupList2.value.length;
  }
}
if (IotAppConfig.HTMLID === htmlID) {
  const _groupList = menuStore.getGroupList;
  if (!_groupList || !Array.isArray(_groupList) || !_groupList.length) {
    const projectInfo = window.$HyGlobal.getProjectInfo() || {};
    xwfuGet(
      `/iot/main/api/frame/getIotUserGroupList`,
      {
        projectId: projectInfo.id || null,
        functionPermissionId: window.$HyGlobal.getFunctionPermissionId(),
      },
      (res: any) => {
        frameGroupList.value = res.data.frameGroupList || [];
        largeScreeGroupList.value = res.data.largeScreeGroupList || [];
        groupLen.value = frameGroupList.value.length + largeScreeGroupList.value.length;
      }
    );
  } else {
    frameGroupList2.value = _groupList || [];
    groupLen.value = frameGroupList2.value.length;
  }
}
if (MopaiAppConfig.HTMLID === htmlID) {
  const _groupList = menuStore.getGroupList;
  if (!_groupList || !Array.isArray(_groupList) || !_groupList.length) {
    xwfuGet(
      `/mopai/main/api/frame/getMopaiUserGroupList`,
      {
        projectId: window.$HyGlobal.getCurrentProject()?.projects?.[0]?.projectId,
        functionPermissionId: window.$HyGlobal.getFunctionPermissionId(),
      },
      (res: any) => {
        frameGroupList.value = res.data || [];
        groupLen.value = frameGroupList.value.length + largeScreeGroupList.value.length;
        // largeScreeGroupList.value = res.data.largeScreeGroupList;
      }
    );
  } else {
    frameGroupList2.value = _groupList || [];
    groupLen.value = frameGroupList2.value.length;
  }
}
if (MasterAppConfig.HTMLID === htmlID) {
  const _groupList = menuStore.getGroupList;
  if (!_groupList || !Array.isArray(_groupList) || !_groupList.length) {
    xwfuGet(
      `/master/main/api/frame/getMasterUserGroupList`,
      {
        projectId: window.$HyGlobal.getCurrentProject()?.projects?.[0]?.projectId,
        functionPermissionId: window.$HyGlobal.getFunctionPermissionId(),
      },
      (res: any) => {
        frameGroupList.value = res.data;
        groupLen.value = frameGroupList.value.length + largeScreeGroupList.value.length;
        // largeScreeGroupList.value = res.data.largeScreeGroupList;
      }
    );
  } else {
    frameGroupList2.value = _groupList || [];
    groupLen.value = frameGroupList2.value.length;
  }
}
const elPop1 = ref();
const elPop2 = ref();
const switchGroup = (obj: any) => {
  if (elPop1.value) elPop1.value.hide();
  if (elPop2.value) elPop2.value.hide();
  router.push({
    path: "/",
    query: {
      groupId: obj.groupId || obj.id,
      timeStamp: Number(new Date().getTime()),
    },
  });
};
const switchLargeGroup = (obj: any) => {
  if (elPop1.value) elPop1.value.hide();
  if (elPop2.value) elPop2.value.hide();
  // if (largeScreenWindowObj.value[obj.id]) {
  //   largeScreenWindowObj.value[obj.id].focus();
  //   return;
  // }
  const sessionStorageKeys = [
    "current_project",
    "current_tenant",
    "groupId",
    "login_info",
    "login_token",
    "permission",
    "product",
    "productId",
    "project_info",
    "tabs",
    "tabsMap",
  ];
  for (let key of sessionStorageKeys) {
    const value = sessionStorage.getItem(key);
    localStorage.setItem(key, value || "");
  }
  const newWindow = window.open(
    location.origin + `/largeScreenCon/?groupId=${obj.groupId || obj.id}&timeStamp=${Number(new Date().getTime())}`,
    "_blank"
  );
  largeScreenWindowObj.value[obj.id] = newWindow;
};
const calcSliceIndex = (menu: any) => {
  if (!menu) return -1;
  if (layoutTheme.value === LayoutV.Vertical) return -1;
  const items = Array.from(menu?.childNodes ?? []).filter(
    (item) => (item as any).nodeName !== "#comment" && ((item as any).nodeName !== "#text" || (item as any).nodeValue)
  ) as HTMLElement[];
  const moreItemWidth = 108;
  const paddingLeft = 0;
  const paddingRight = 0;
  const menuWidth = menu!.clientWidth - paddingLeft - paddingRight;
  let calcWidth = 0;
  let sliceIndex = 0;
  items.forEach((item, index) => {
    calcWidth += item.offsetWidth || 0;
    if (calcWidth <= menuWidth - moreItemWidth) {
      sliceIndex = index + 1;
    }
  });
  return sliceIndex === items.length ? -1 : sliceIndex;
};
const intercept = (e: any) => {
  e.stopImmediatePropagation();
};
const sliceIndex = ref(-1);

useResizeObserver(menu, (entries) => {
  const entry = entries[0];
  sliceIndex.value = calcSliceIndex(entry.target);
  if (layoutTheme.value !== LayoutV.Vertical && sliceIndex.value === -1) {
    setTimeout(() => {
      sliceIndex.value = calcSliceIndex(entry.target);
    }, 300);
  }
});

const sliceMenu = computed(() => {
  const more = {
    icon: moreIcon,
    path: moreIcon,
    children: menuListValue.value.slice(sliceIndex.value),
    id: "more",
  };
  return sliceIndex.value > -1 ? [...menuListValue.value.slice(0, sliceIndex.value), more] : [...menuListValue.value];
});
const router = useRouter();
const index = ref("/");
//computed(() => {
//return menuStore.getMenu.id;
//}); //当前active 选中的目标
// /**
//  * 获取主题色
//  */
// const theme: any = computed(() => themeStore.getTheme);
/**
 * menu样式开关
 */
const sidebarStatus = computed(() => themeStore.getSidebarStatus);
const isCollapse = computed(() => layoutTheme.value === LayoutV.Vertical && sidebarStatus.value === SideBarStatus.Closed);
styleStore.setMenuWidth(isCollapse.value ? 80 : 220);
const fastIsCollapse = ref(isCollapse.value);
/**
 * collapse处理
 */
const collapseHandler = () => {
  if (fastIsCollapse.value) {
    fastIsCollapse.value = false;
  } else {
    fastIsCollapse.value = true;
  }
  if (isCollapse.value) {
    themeStore.setSidebarStatus(SideBarStatus.Opened);
    styleStore.setMenuWidth(220);
  } else {
    styleStore.setMenuWidth(80);
    themeStore.setSidebarStatus(SideBarStatus.Closed);
  }
};

/**
 * 监听路由变化 更改active
 */
watch(
  () => router.currentRoute.value,
  (nv) => {
    index.value = (nv.query.mid as string) || menuStore.getMenu.menuId || menuStore.getMenu.id || "home";
  },
  { immediate: true }
);
// watch(index, () => {
//   console.log('查看最新的index.value:', index.value);
// })
// /**
//  * 判断屏幕尺寸是否缩小menu 用onresize方法一直判断屏幕尺寸 太消耗性能
//  */
// window.onresize = () => document.body.clientWidth > 1200 ? (isCollapse.value === true ? isCollapse.value = false : null) : (isCollapse.value === false ? isCollapse.value = true : null);
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.w-220 {
  width: zrem(220);
}
.w-260 {
  width: zrem(260);
}
.com-zelmenu-con {
  // width: auto;
  position: relative;
  background-color: transparent;
  &.vertical {
    max-width: zrem(256);
    min-width: zrem(80);
  }
  &.horizontal {
    height: zrem(40) !important;
  }

  .overflow-hidden {
    overflow: hidden;
  }

  //overflow: hidden;
  transition: width 0.4s;
  height: calc(100% - zrem(20));
  margin: zrem(10) 0;
  .collapse-handler-con {
    width: zrem(32);
    height: zrem(32);
    border-radius: 50%;
    position: absolute;
    right: zrem(-32);
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    .fold-icon {
      width: zrem(14);
      height: zrem(14);
    }
  }
  .swicth-group-icon-con {
    position: absolute;
    top: zrem(4);
    left: zrem(-2);
    width: zrem(36);
    height: zrem(36);
    z-index: 4;
  }
  .switch-group-icon {
    width: zrem(30);
    height: zrem(30);
    font-size: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .switch-group-con {
    width: zrem(36);
    height: zrem(36);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .switch-group-con2 {
    width: zrem(36);
    height: zrem(36);
    margin-left: zrem(10);
    margin-bottom: zrem(10);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .zc-el-menu {
    width: 100%;
  }
  .p-t-4 {
    padding-top: zrem(4);
  }

  .m-s-con {
    width: zrem(220) !important;
    height: calc(100%);

    .zc-el-scrollbar {
      height: 100%;
    }
  }
}
html.white {
  .collapse-handler-con {
    background: var(--el-fill-color);
    box-shadow: 0 0 zrem(6) zrem(1) #c4c4c4;
  }
}
html.black {
  .collapse-handler-con {
    background: var(--el-fill-color-light);
    box-shadow: 0 0 zrem(6) zrem(1) #000000;
  }
}
.group-list-con {
  width: 100%;
  box-sizing: border-box;
  padding: zrem(20) zrem(20) zrem(20);
  min-height: zrem(200);
  .group-list-header {
    margin-bottom: zrem(20);
    .group-list-header-box {
      width: zrem(4);
      height: zrem(16);
      border-radius: zrem(2);
      background: var(--el-menu-active-color);
    }
    .group-list-header-name {
      height: zrem(20);
      line-height: zrem(20);
      margin-left: zrem(10);
    }
  }
  .group-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .group-item {
      width: zrem(70);
      height: zrem(66);
      margin: 0 zrem(10) zrem(20);
      cursor: pointer;
      .group-item-icon {
        width: zrem(36);
        height: zrem(36);
        margin: 0 auto zrem(10);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .group-item-name {
        height: zrem(20);
        line-height: zrem(20);
        font-size: zrem(14);
        text-align: center;
      }
    }
    .active-group-item {
      .group-item-name {
        color: var(--el-menu-active-color);
      }
    }
  }
}
</style>
