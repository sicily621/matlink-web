<template>
  <template v-for="(item, menuIndex) of arr">
    <template v-if="isChildren(item) || (isCollapse && level == 0)">
      <el-sub-menu
        expand-close-icon="CaretRight"
        expand-open-icon="CaretBottom"
        :popper-offset="24"
        :index="item.menuId || item.id"
        class="zc-hover-sub-menu"
        :class="{
          'zc-active-sub-menu': isCollapse && isIncludes(item.childrenPath, index),
          'is-active': level == 0 && index == (item.menuId || item.id),
          'home-sub-menu': item._path == '/',
          'level0-menu0':
            groupConfigHtmlIds.includes(htmlID) && level == 0 && menuIndex == 0 && !isCollapse && layoutTheme === LayoutV.Vertical && groupLen > 1,
          'level0-menu0-2':
            groupConfigHtmlIds.includes(htmlID) && level == 0 && menuIndex == 0 && !isCollapse && layoutTheme === LayoutV.Horizontal && groupLen > 1,
          'level-large-0': level > 0,
          more: (item.menuId || item.id) === 'more',
        }"
        :popper-class="layoutTheme === LayoutV.Horizontal && level === 0 ? 'top-menu-popper' : ''"
        @click.stop="customClickParent(item)"
      >
        <!--    :popper-class="{
          'top-menu-popper': layoutTheme === LayoutV.Horizontal && level == 0,
        }" -->
        <template #title>
          <div class="flex-center mode-icon" v-if="item.icon" :class="{ 'level-large-0-2': level > 0 }">
            <template v-if="level != 0 || menuIndex != 0 || !groupConfigHtmlIds.includes(htmlID) || isCollapse || groupLen <= 1">
              <el-icon class="mode-el-icon" v-if="item._path == '/'">
                <img :src="item.icon" width="20" height="20" />
              </el-icon>
              <el-icon class="mode-el-icon" v-else>
                <ThemeImg
                  :color="layoutTheme === LayoutV.Horizontal && level == 0 ? 'var(--el-top-header-color)' : ''"
                  :width="isCollapse && level == 0 ? 20 : 12"
                  :height="isCollapse && level == 0 ? 20 : 12"
                  :src="item.icon"
                />
              </el-icon>
            </template>
          </div>
          <template v-else>
            <div v-if="layoutTheme === LayoutV.Vertical" class="icon-wh"></div>
          </template>

          <span>{{
            getLocaleValue(lang, item, {
              cnNameKey: "cnName",
              enNameKey: "enName",
            })
          }}</span>
        </template>
        <zcElSubMenu
          :arr="isCollapse ? [{ ...item, children: [], icon: '', isParent: true }, ...(item?.children ?? [])] : item.children"
          :index="index"
          :isCollapse="isCollapse"
          :level="level + 1"
          :groupLen="(item?.children?.length ?? 0) + 1"
        />
      </el-sub-menu>
    </template>
    <template v-else>
      <el-menu-item
        :id="item.menuId || item.id"
        :index="item.menuId || item.id"
        :class="{
          'zc-active-el-menu-item': (item.menuId || item.id) == index,
          'title-level-1': Array.isArray(item.children),
          'is-active': item._path == '/' ? index === 'home' : (item.menuId || item.id) == index,
          'level0-menu0':
            groupConfigHtmlIds.includes(htmlID) && level == 0 && menuIndex == 0 && !isCollapse && layoutTheme === LayoutV.Vertical && groupLen > 1,
          'level0-menu0-3':
            groupConfigHtmlIds.includes(htmlID) && level == 0 && menuIndex == 0 && !isCollapse && layoutTheme === LayoutV.Horizontal && groupLen > 1,
        }"
        class="zc-hover-el-menu-item"
      >
        <div
          class="d-flex custom-click-con"
          @click.stop="customClickParent(item)"
          :class="{
            'custom-click-horizontal': layoutTheme === LayoutV.Horizontal,
          }"
        >
          <div class="flex-center mode-icon" v-if="item.icon">
            <template v-if="level != 0 || menuIndex != 0 || !groupConfigHtmlIds.includes(htmlID) || isCollapse || groupLen <= 1">
              <el-icon class="mode-el-icon" v-if="item._path == '/'">
                <img :src="item.icon" width="20" height="20" />
              </el-icon>
              <el-icon class="mode-el-icon" v-else>
                <ThemeImg
                  :width="isCollapse && level == 0 ? 20 : 12"
                  :color="
                    layoutTheme === LayoutV.Horizontal && level === 0
                      ? 'var(--el-top-header-color)'
                      : index == (item.menuId || item.id) && layoutTheme === LayoutV.Vertical
                      ? 'var(--el-left-menu-hover-color)'
                      : ''
                  "
                  :height="isCollapse && level == 0 ? 20 : 12"
                  :src="item.icon"
                />
              </el-icon>
            </template>
          </div>
          <div class="zc-el-menu-item-content flex1" :class="{ fz15: item._path == '/' }" v-if="!isCollapse || level !== 0">
            {{
              getLocaleValue(lang, item, {
                cnNameKey: "cnName",
                enNameKey: "enName",
              })
            }}
          </div>
        </div>
      </el-menu-item>
    </template>
  </template>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import ThemeImg from "@static/components/themeImg/themeImg.vue";
import useLocaleStore from "@static/js/store/locale";
import { computed } from "vue";
import { getLocaleValue } from "@static/js/locales/index";
import { AdminAppConfig, MakeAppConfig, SmartAppConfig, IotAppConfig, MopaiAppConfig, MasterAppConfig } from "@static/js/configs/AppConfig";
import { htmlID } from "@static/js/common/id";
import { post } from "@static/js/http/http";
import useThemeStore from "@static/js/store/theme";
import { LayoutV } from "@static/js/theme/types";
import useVoiceStore from "@static/js/store/voice";

const groupConfigHtmlIds = [SmartAppConfig.HTMLID, IotAppConfig.HTMLID, MopaiAppConfig.HTMLID, MasterAppConfig.HTMLID];

defineProps<{
  arr: any[];
  index: string;
  isCollapse: boolean;
  level: number;
  groupLen: number;
}>();
const voiceStore = useVoiceStore();
const localeStore = useLocaleStore();
const lang = computed(() => localeStore.getLang);
const themeStore = useThemeStore();
const layoutTheme = computed<any>(() => themeStore.getLayout); //获取当前布局
defineOptions({
  name: "zcElSubMenu",
});
const route = useRoute();
const router = useRouter();
const speakMenu = computed(() => voiceStore.getCanSpeakMenu);

/**
 * 判断item是否有子集
 * @param item
 */
const isChildren = (item: any): boolean => item.children && Array.isArray(item.children) && !!item.children.length;

/**
 * 判断子集是否处以active状态 如果是 那么父级高亮
 * @param arr 父级的childrenPath
 * @param i 当前选中的path
 * @returns {boolean}
 */
const isIncludes = (arr: any[], path: string): boolean => {
  if (!arr || !Array.isArray(arr)) return false;
  return arr.includes(path);
};

const customClickParent = (obj: any) => {
  if (obj.id === "more" || obj.menuId == "more") return;
  if (obj._path) return router.push(obj._path);
  if (!obj.templateId) {
    if (Array.isArray(obj.children) && obj.children.length) {
      customClickParent(obj.children[0]);
    }
    return;
  }
  if (speakMenu.value) voiceStore.play(obj.cnName);
  let queryObj: any = {
    cid: obj.menuAlias,
    mid: obj.menuId || obj.id,
  };
  if (route.query.groupId) queryObj.groupId = route.query.groupId;
  if (AdminAppConfig.HTMLID === htmlID) {
    const userInfo = window.$HyGlobal.getUserInfo();
    if (userInfo) {
      post("/admin/main/api/admin/function/save", {
        menuId: obj.id,
        userId: userInfo.userId,
        menuName: obj.cnName,
        parentMenuId: obj.parentId,
      });
    }
  }
  if (MakeAppConfig.HTMLID === htmlID) {
    const userInfo = window.$HyGlobal.getUserInfo();
    if (userInfo) {
      post("/make/main/api/make/function/save", {
        menuId: obj.id,
        userId: userInfo.userId,
        menuName: obj.cnName,
        parentMenuId: obj.parentId,
        menuGroupId: obj.groupId,
      });
    }
  }
  if (SmartAppConfig.HTMLID === htmlID) {
    const userInfo = window.$HyGlobal.getUserInfo();
    if (userInfo) {
      post("/smart/main/api/smart/function/save", {
        menuId: obj.menuId || obj.id,
        userId: userInfo.userId,
        menuName: obj.cnName,
        parentMenuId: obj.parentId,
        menuGroupId: obj.groupId,
        projectId: window.$HyGlobal.getProjectInfo().id,
      });
    }
  }
  if (IotAppConfig.HTMLID === htmlID) {
    const userInfo = window.$HyGlobal.getUserInfo();
    if (userInfo) {
      post("/iot/main/api/iot/function/save", {
        menuId: obj.menuId || obj.id,
        userId: userInfo.userId,
        menuName: obj.cnName,
        parentMenuId: obj.parentId,
        menuGroupId: obj.groupId,
        projectId: window.$HyGlobal.getProjectInfo().id,
      });
    }
  }
  if (MopaiAppConfig.HTMLID === htmlID) {
    const userInfo = window.$HyGlobal.getUserInfo();

    if (userInfo) {
      post("/mopai/main/api/mopai/function/save", {
        menuId: obj.id,
        userId: String(userInfo.userId),
        menuName: obj.cnName,
        parentMenuId: obj.parentId,
        menuGroupId: obj.groupId,
        tenantId: String(window.$HyGlobal?.getCurrentTenant()?.tenantId),
      });
    }
  }
  if (MasterAppConfig.HTMLID === htmlID) {
    const userInfo = window.$HyGlobal.getUserInfo();
    if (userInfo) {
      post("/master/main/api/function/save", {
        menuId: obj.id,
        userId: String(userInfo.userId),
        menuName: obj.cnName,
        parentMenuId: obj.parentId,
        menuGroupId: obj.groupId,
        tenantId: String(window.$HyGlobal?.getCurrentTenant()?.tenantId),
      });
    }
  }
  router.push({
    path: `/`,
    query: queryObj,
  });
};
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.custom-click-con {
  padding-left: calc(var(--el-menu-base-level-padding) + var(--el-menu-level) * var(--el-menu-level-padding));
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.custom-click-smart-con {
  padding-left: 0;
}
.custom-click-horizontal {
  position: relative;
  padding-left: 0;
  // margin-top: zrem(10);
}
.level0-menu0 {
  width: 78%;
  // margin-left: zrem(34);
  left: zrem(34);
}
.level0-menu0-2 {
  margin-left: zrem(32) !important;
}
.level0-menu0-3 {
  margin-left: zrem(40) !important;
}
.h-44 {
  height: zrem(44) !important;
}
.icon-wh {
  width: zrem(12);
  height: zrem(12);
}
.m-l-12 {
  // margin-left: zrem(12);
}
.zc-hover-el-menu-item {
  // margin-left: 0;
}
.zc-hover-sub-menu {
  // margin-right:
}
.level-large-0 {
  margin-right: 0;
}
.level-large-0-2 {
  margin-left: zrem(10);
}
</style>
