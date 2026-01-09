<template>
  <div ref="containerDom" class="d-flex zc-el-tabs align-items-center">
    <div class="flex-1 d-flex tabs-outer-wrap" ref="tabsRef" id="tabsID">
      <div v-for="(item, index) in multiTagsMap[currentGroupId]" :key="index" class="d-flex pointer tabs-inner-wrap">
        <div
          class="custom-tabs-label"
          :class="{ 'custom-tabs-label-active': index === activeIndex }"
          :id="index === activeIndex ? 'tabsActiveLabel' : ''"
          @click="handleClick({ index })"
        >
          <span>{{ getLocaleValue(lang, item, { cnNameKey: "cnName", enNameKey: "enName" }) }}</span>
          <el-icon class="label-close" @click.stop="removeTab(index)" v-if="index > 0">
            <Close />
          </el-icon>
          <div class="label-close-width" v-if="index == 0"></div>
          <div class="label-bottom-line"></div>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center right-arrows">
      <div class="m-r-20 tran-rotate-90" v-if="overflowList.length">
        <el-icon class="arrow-down pointer" v-popover="popoverRef3">
          <MoreFilled />
        </el-icon>
        <el-popover ref="popoverRef3" trigger="click" virtual-triggering persistent :width="120">
          <div class="tabs-right-popover-content">
            <el-scrollbar :height="300">
              <div
                v-for="item of overflowList"
                :class="{ active: item.index === activeIndex }"
                class="tabs-right-popover-item tabs-right-popover-item2"
                @click="tabsMenuClick(item)"
              >
                <div class="tabs-right-o-i-title">
                  {{ getLocaleValue(lang, item, { cnNameKey: "cnName", enNameKey: "enName" }) }}
                </div>
                <el-icon class="tabs-right-o-i-icon" @click.stop="closeCurrent()">
                  <Close />
                </el-icon>
              </div>
            </el-scrollbar>
          </div>
        </el-popover>
      </div>
      <div class="m-r-20">
        <!-- <el-text class="pointer" @click="tabsRightClick({ title: '重新加载', icon: 'RefreshLeft', type: 'reload' })">
          
        </el-text> -->
        <!-- <el-text>{{ t("common.abcdef") }}</el-text> -->
        <div class="pointer" @click="tabsRightClick({ title: '重新加载', icon: 'RefreshLeft', type: 'reload' })">
          {{ t("common.refresh") }}
        </div>
      </div>
      <div class="split-line m-r-20"></div>
      <div class="m-r-20">
        <el-text class="pointer" v-popover="popoverRef2">{{ t("common.fullScreen") }}</el-text>
        <el-popover ref="popoverRef2" trigger="click" virtual-triggering persistent :width="180">
          <div class="tabs-right-popover-content">
            <div v-for="item of rightOpeList2" class="tabs-right-popover-item" :class="{ 'active-line': item.line }" @click="tabsRightClick(item)">
              <div class="tabs-right-o-i-icon m-r-10 d-flex">
                <img :width="15" :height="item.h || 15" :src="item.image" />
              </div>
              <div class="tabs-right-o-i-title">{{ item.title }}</div>
            </div>
          </div>
        </el-popover>
      </div>
      <div class="split-line m-r-20" v-if="multiTagsMap[currentGroupId].length"></div>
      <div class="m-r-20" v-if="multiTagsMap[currentGroupId].length">
        <el-text class="pointer" v-popover="popoverRef">{{ t("common.close") }}</el-text>
        <el-popover ref="popoverRef" trigger="click" virtual-triggering persistent :width="80">
          <div class="tabs-right-popover-content">
            <div
              v-for="(item, index) of rightOpeList"
              class="tabs-right-popover-item"
              :class="{ 'active-line': item.line, 'tabs-disabled': item.disabled }"
              @click="tabsRightClick(item)"
              @mouseenter="tabMouseenter(index)"
              @mouseleave="tabMouseleave()"
            >
              <div class="tabs-right-o-i-img">
                <ThemeImg
                  v-if="item.disabled"
                  :width="15"
                  :height="item.h || 15"
                  :src="item.image"
                  :color="item.disabled ? '#ccc' : tabMouseFlag === index ? theme.textColorSecondary : `rgb(${theme.colorPrimaryRgb})`"
                />
                <img v-else :width="15" :height="15" :src="item.image" />
              </div>
              <div class="tabs-right-o-i-title">{{ item.title }}</div>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useMultiTagsStoreHook } from "@static/js/store/multiTags";
import { useRouter, useRoute } from "vue-router";
import ThemeImg from "@static/components/themeImg/themeImg.vue";
import CloseAll from "@static/images/close_all.png";
import CloseCurrent from "@static/images/close_current.png";
import CloseLeft from "@static/images/close_left.png";
import CloseRight from "@static/images/close_right.png";
import CloseOther from "@static/images/close_other.png";
import FullScreen from "@static/images/full_screen.png";
import FullContentScreen from "@static/images/full_content_screen.png";
import useThemeStore from "@static/js/store/theme";
import { ResizeKey, setMember, startResize } from "@static/js/page/dom";
import useMenuStore from "@static/js/store/menu";
import { getLocaleValue } from "@static/js/locales";
import useLocaleStore from "@static/js/store/locale";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import useVoiceStore from "@static/js/store/voice";
import { useFullscreen } from "@vueuse/core";
const { t } = useI18n();
const voiceStore = useVoiceStore();
const menuStore = useMenuStore();
// const menus = computed<any>(() => menuStore.getMenus);
const localeStore = useLocaleStore();
const lang = computed(() => localeStore.getLang);
const emits = defineEmits(["fullContent"]);
const rightOpeList2 = ref<any[]>([
  { title: t("common.fullScreen"), image: FullScreen, type: "fullScreen", line: true },
  { title: t("common.fullContentScreen"), image: FullContentScreen, type: "fullContent", line: true },
]);
let isFullContent = false;
const popoverRef = ref();
const popoverRef2 = ref();
const popoverRef3 = ref();
const overflowList = ref<any[]>([]);
const tabsBoxRect = ref();
const themeStore = useThemeStore();
const theme: any = computed(() => themeStore.getTheme);
const sidebarStatus = computed(() => themeStore.getSidebarStatus);
const layout = computed(() => themeStore.getLayout);
const tabMouseFlag = ref(-1);
const currentGroupId = ref("init");
const multiTags = computed(() => {
  return useMultiTagsStoreHook().multiTags;
});
const multiTagsMap = computed(() => {
  const map = useMultiTagsStoreHook().multiTagsMap;
  return map;
});
const activeIndex = ref(0);
const router = useRouter();
const route = useRoute();
const { isFullscreen: fullScreenFlag } = useFullscreen();
const isFullScreen = computed({
  set(val) {
    return val;
  },
  get() {
    return fullScreenFlag.value;
  },
});
watch(fullScreenFlag, (newVal) => {
  if (!newVal) {
    rightOpeList2.value[0] = { title: t("common.fullScreen"), image: FullScreen, type: "fullScreen", line: true };
  } else {
    rightOpeList2.value[0] = { title: t("common.cancelFullScreen"), image: FullScreen, type: "cancelFullScreen", line: true };
  }
});
const rightOpeList: any = ref([
  { title: t("common.closeCurrent"), image: CloseCurrent, line: true, type: "closeCurrent", disabled: computed(() => activeIndex.value === -1) },
  { title: t("common.closeLeft"), image: CloseRight, type: "closeLeft", disabled: computed(() => activeIndex.value <= 0) },
  {
    title: t("common.closeRight"),
    image: CloseLeft,
    line: true,
    type: "closeRight",
    disabled: computed(() => activeIndex.value === multiTagsMap.value[currentGroupId.value].length - 1),
  },
  {
    title: t("common.closeOther"),
    image: CloseOther,
    type: "closeOther",
    disabled: computed(() => multiTagsMap.value[currentGroupId.value].length === 1),
  },
  {
    title: t("common.closeAll"),
    image: CloseAll,
    type: "closeAll",
    h: 3,
    disabled: computed(() => multiTagsMap.value[currentGroupId.value].length === 0),
  },
]);

/**
 * 判断溢出的tab
 */
const isOverflow = () => {
  const tabsBox = document.getElementById("tabsID");
  if (!tabsBox) return;
  tabsBoxRect.value = tabsBox.getBoundingClientRect();
  const arr: any = document.getElementsByClassName("custom-tabs-label");
  const arr2: any[] = [];
  overflowList.value = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const rect = item.getBoundingClientRect();
    if (rect.left < tabsBoxRect.value.left || rect.right > tabsBoxRect.value.right)
      arr2.push({ ...multiTagsMap.value[currentGroupId.value][i], index: i });
  }
  overflowList.value = arr2;
};

setMember(ResizeKey.Tag, isOverflow);
setMember(ResizeKey.FullScreen, () => {
  if (window.outerHeight != screen.availHeight) {
    isFullScreen.value = true;
  } else {
    isFullScreen.value = false;
  }
});
startResize();
const tagChanged = () => {
  const current = router.currentRoute.value;
  const index = multiTagsMap.value[currentGroupId.value].findIndex((item: any) => {
    return item.path === current.fullPath;
  });
  if (index === -1) {
    activeIndex.value = 0;
  } else {
    activeIndex.value = index;
  }
  setTimeout(() => {
    isOverflow();
  }, 500);
};
watch(
  [router.currentRoute, lang, sidebarStatus, layout],
  () => {
    if (route.query.groupId) {
      if (Array.isArray(route.query.groupId) && route.query.groupId.length) {
        const groupId = route.query.groupId[route.query.groupId.length - 1] as string;
        currentGroupId.value = groupId;
      } else {
        currentGroupId.value = route.query.groupId as string;
      }
    } else {
      currentGroupId.value = "init";
    }
    tagChanged();
  },
  { immediate: true }
);

const handleClick = (tab: any) => {
  var to = multiTagsMap.value[currentGroupId.value][tab.index];
  router.push(to.path);
  voiceStore.play(to.cnName);
};
const tabsMenuClick = (to: any) => {
  router.push(to.path);
  voiceStore.play(to.cnName);
};
/**
 * 关闭标签页
 * @param index 标签页下标
 */
const removeTab = (index: number) => {
  var to = multiTagsMap.value[currentGroupId.value][index];
  useMultiTagsStoreHook().handleTags("splice", to.path, null, currentGroupId.value);
  if (!multiTagsMap.value[currentGroupId.value].length) return targetHome();
  if (multiTagsMap.value[currentGroupId.value].length - 1 < activeIndex.value) activeIndex.value = multiTags.value.length - 1;
  var to2 = multiTagsMap.value[currentGroupId.value][activeIndex.value];
  router.push(to2.path);
  voiceStore.play(to2.cnName);
};
/**
 * 关闭所有标签页
 */
const closeAll = () => {
  useMultiTagsStoreHook().handleTags(
    "splice",
    "",
    {
      startIndex: 0,
      length: multiTagsMap.value[currentGroupId.value].length,
    },
    currentGroupId.value
  );
  targetHome();
};
/**
 * 关闭其他标签页
 */
const closeOther = () => {
  useMultiTagsStoreHook().handleTags("splice", "", { startIndex: 0, length: activeIndex.value }, currentGroupId.value);
  useMultiTagsStoreHook().handleTags("splice", "", { startIndex: 1, length: multiTagsMap.value[currentGroupId.value].length }, currentGroupId.value);
  activeIndex.value = 0;
};
/**
 * 关闭左侧所有标签
 */
const closeLeft = () => {
  useMultiTagsStoreHook().handleTags("splice", "", { startIndex: 0, length: activeIndex.value }, currentGroupId.value);
  activeIndex.value = 0;
};
/**
 * 关闭右侧所有标签
 */
const closeRight = () => {
  useMultiTagsStoreHook().handleTags("splice", "", { startIndex: activeIndex.value + 1, length: activeIndex.value }, currentGroupId.value);
};
/**
 * 关闭当前标签页
 */
const closeCurrent = () => removeTab(activeIndex.value);
const targetHome = () => {
  if (route.query.groupId) {
    router.push({
      path: "/",
      query: {
        groupId: route.query.groupId,
        timeStamp: Number(new Date().getTime()),
      },
    });
  } else {
    router.push("/");
  }
};

/**
 * 全屏处理
 */
const screenHandler = () => {
  if (isFullScreen.value) exitScreen();
  else fullScreen();
};

/**
 * 全屏
 */
const fullScreen = () => {
  document
    .querySelector("html")
    ?.requestFullscreen()
    .then(() => {
      isFullScreen.value = true;
    });
};

/**
 * 退出全屏
 */
const exitScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    ElMessage({ type: "error", message: t("common.pressF11") });
  }
};
/**
 * 全屏
 */
const fullContent = () => {
  isFullContent = !isFullContent;
  emits("fullContent", isFullContent);
};
/**
 * 局部刷新
 */
const reload = () => {
  const historyMenu = JSON.parse(JSON.stringify(menuStore.getMenu));
  menuStore.setHistoryMenu(historyMenu);
  menuStore.setMenu({
    id: "_redirect_",
    menuAlias: "redirectVue",
  });
};
/**
 * 处理点击事件
 * @param item 点击目标
 */
const tabsRightClick = (item: any) => {
  switch (item.type) {
    case "closeAll":
      closeAll();
      break;
    case "closeOther":
      closeOther();
      break;
    case "closeLeft":
      closeLeft();
      break;
    case "closeRight":
      closeRight();
      break;
    case "closeCurrent":
      closeCurrent();
      break;
    case "reload":
      reload();
      break;
    case "fullScreen":
      rightOpeList2.value[0] = { title: t("common.cancelFullScreen"), image: FullScreen, type: "cancelFullScreen", line: true };
      screenHandler();
      popoverRef2.value.hide();
      break;
    case "fullContent":
      rightOpeList2.value[1] = { title: t("common.cancelFullContentScreen"), image: FullContentScreen, type: "cancelFullContent", line: true };
      fullContent();
      popoverRef2.value.hide();
      break;
    case "cancelFullContent":
      rightOpeList2.value[1] = { title: t("common.fullContentScreen"), image: FullContentScreen, type: "fullContent", line: true };
      fullContent();
      popoverRef2.value.hide();
      break;
    case "cancelFullScreen":
      rightOpeList2.value[0] = { title: t("common.fullScreen"), image: FullScreen, type: "fullScreen", line: true };
      screenHandler();
      popoverRef2.value.hide();
      break;
  }
};

const tabMouseenter = (i: number) => (tabMouseFlag.value = i);
const tabMouseleave = () => (tabMouseFlag.value = -1);
</script>
<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;

.zc-el-tabs {
  height: zrem(36);
  padding-left: zrem(12);

  .tabs-outer-wrap {
    height: 25px;
    overflow: hidden;
  }

  .tabs-inner-wrap {
    flex-shrink: 0;
    position: relative;

    &::before {
      position: absolute;
      display: inline-block;
      content: "";
      width: 1px;
      height: 10px;
      top: 6px;
      right: 1px;
    }
  }
}

.right-arrows {
  height: zrem(20);
  margin: 0 zrem(10) zrem(5) zrem(35);
}

.tabs-menu-list {
  max-height: zrem(300);
}

.tabs-right-popover-content {
  padding: zrem(4) 0;

  .tabs-right-popover-item {
    padding: 0 zrem(16);
    height: zrem(32);
    display: flex;
    align-items: center;
    cursor: pointer;
    //padding: 0 zrem(20);
    position: relative;
    color: var(--el-text-color-primary);

    .tabs-right-o-i-img {
      font-size: 0;
      margin-right: zrem(10);
      // width: zrem(20);
      // height: zrem(20);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:hover,
    &.active {
      color: var(--el-color-primary);
      background: var(--el-fill-color-light);
    }
  }

  .tabs-disabled {
    color: #ccc;

    &:hover {
      cursor: not-allowed;
      color: #ccc;
    }
  }

  .tabs-right-popover-item2 {
    justify-content: space-between;

    .tabs-right-o-i-icon {
      margin: 0;
      font-size: zrem(16);
    }
  }

  .active-line::after {
    // border-bottom: 1px solid #ccc;
    content: "";
    position: absolute;
    width: 50%;
    height: calc(1 / var(--fontSize, 16) * 1rem);
    bottom: 0;
    left: calc(10 / var(--fontSize, 16) * 1rem);
    background: linear-gradient(90deg, rgba(var(--colorPrimaryRgb), 1), rgba(var(--colorPrimaryRgb), 0));
  }
}

.arrow-down-con {
  display: flex;
  align-items: center;
  // background: var(--bgColor);
  border-left: zrem(2) solid var(--el-border-color-light);
  height: zrem(20);
  margin-top: zrem(10);
  padding-left: zrem(10);
  cursor: pointer;

  .arrow-down {
    color: var(--el-text-color-primary);
  }
}

.custom-tabs-label {
  //border: zrem(1) solid rgb(var(--colorPrimaryRgb));
  padding: 0 zrem(17);
  //border-radius: zrem(4) zrem(4) 0 0;
  display: flex;
  align-items: center;
  position: relative;
  font-size: zrem(14);

  .label-close {
    font-size: zrem(12);
    margin-top: zrem(2);
    margin-left: zrem(6);
    width: 0;
    overflow: hidden;
    opacity: 0;
    transition: 0.4s;
    color: var(--el-text-color-primary);
  }
  .label-close-width {
    width: zrem(18);
  }

  .label-bottom-line {
    position: absolute;
    left: 10%;
    bottom: zrem(-5);
    background: var(--el-text-color-primary);
    width: 0;
    height: zrem(2);
    transition: 0.4s;
  }
}

.custom-tabs-label-active {
  //color: var(--el-text-color-secondary);
  //border-color: var(--el-text-color-secondary);
  .label-close {
    width: zrem(12);
    opacity: 1;
    border-radius: 50%;
  }

  /* .label-close:hover {
      width: zrem(16);
      font-size: zrem(16);
      background: var(--el-text-color-secondary);
      color: #fff;
    } */
  .label-bottom-line {
    width: 65%;
  }
}
</style>
