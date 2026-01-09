<template>
  <div class="zc-drawer-con">
    <div class="drawer-con">
      <el-icon class="set-icon-con" @click="visible = true">
        <component :is="'Setting'" />
      </el-icon>
      <el-drawer v-model="visible" :show-close="false" :close-on-press-escape="true" :size="'20%'">
        <template #header="{ titleId, titleClass }">
          <h4 :id="titleId" :class="titleClass">{{ $t("other.setting") }}</h4>
        </template>
        <div class="flex-column inner-wrap">
          <div class="flex-1">
            <div class="route-transition-title">
              <div class="route-transition-title-item"></div>
              <div class="route-transition-title-content">{{ $t("theme.theme") }}</div>
            </div>
            <div class="themes-con d-flex align-items-center m-b-20">
              <div
                class="themes-box"
                v-for="(theme, key) of themes"
                :class="{ 'active-box': key === currentTheme }"
                :style="{ background: theme.bgColor }"
                @click="switchColor(key as ThemesV)"
              ></div>
            </div>
            <div class="route-transition-title">
              <div class="route-transition-title-item"></div>
              <div class="route-transition-title-content">{{ $t("theme.layout") }}</div>
            </div>
            <div class="themes-con align-items-center m-b-20">
              <ul class="layout-theme">
                <el-tooltip class="item" :content="$t('theme.leftMode')" placement="bottom" popper-class="pure-tooltip">
                  <li :class="layoutTheme === LayoutV.Vertical ? 'is-select' : ''" ref="verticalRef" @click="setLayoutModel(LayoutV.Vertical)">
                    <div />
                  </li>
                </el-tooltip>

                <el-tooltip class="item" :content="$t('theme.topMode')" placement="bottom" popper-class="pure-tooltip">
                  <li :class="layoutTheme === LayoutV.Horizontal ? 'is-select' : ''" ref="horizontalRef" @click="setLayoutModel(LayoutV.Horizontal)">
                    <div />
                  </li>
                </el-tooltip>
              </ul>
            </div>
            <div class="route-transition-title">
              <div class="route-transition-title-item"></div>
              <div class="route-transition-title-content">{{ $t("route.transition") }}</div>
            </div>
            <div class="radios-con">
              <Radios
                ref="routeRef"
                class="radios"
                :radios="[
                  { name: $t('route.default'), key: RouteTransitionV.Default },
                  { name: $t('route.random'), key: RouteTransitionV.Random },
                  { name: $t('route.bounce'), key: RouteTransitionV.Bounce },
                  { name: $t('route.opacity'), key: RouteTransitionV.Opacity },
                  { name: $t('route.rightSwiper'), key: RouteTransitionV.RightSwiper },
                  { name: $t('route.leftSwiper'), key: RouteTransitionV.LeftSwiper },
                  { name: $t('route.topSwiper'), key: RouteTransitionV.TopSwiper },
                  { name: $t('route.bottomSwiper'), key: RouteTransitionV.BottomSwiper },
                  { name: $t('route.scaleRight'), key: RouteTransitionV.ScaleRight },
                  { name: $t('route.scaleLeft'), key: RouteTransitionV.ScaleLeft },
                ]"
                :defaultRadio="defaultRadio"
                @change="updateRouteTransition($event)"
              />
            </div>
            <div class="route-transition-title">
              <div class="route-transition-title-item"></div>
              <div class="route-transition-title-content">{{ $t("style.style") }}</div>
            </div>
            <div class="radios-con">
              <Radios
                ref="styleRef"
                class="radios"
                :radios="[
                  { name: $t('style.default'), key: StyleV.Default },
                  { name: $t('style.test'), key: StyleV.Test },
                ]"
                :defaultRadio="defaultStyle"
                @change="switchStyle($event)"
              />
            </div>
            <div class="route-transition-title">
              <div class="route-transition-title-item"></div>
              <div class="route-transition-title-content">{{ $t("interfaceDisplay.interfaceDisplay") }}</div>
            </div>
            <div class="interface-display-con m-b-30">
              <div class="interface-display d-flex align-items-center justify-content-between">
                <div>{{ $t("interfaceDisplay.greyMode") }}</div>
                <Switch
                  ref="greyRef"
                  :defaultValue="greyModeFlag"
                  :text="{ active: t('common.yes'), inactive: t('common.no') }"
                  :inlinePrompt="true"
                  @value="greyModeSwitch($event)"
                />
              </div>
              <div class="interface-display d-flex align-items-center justify-content-between">
                <div>{{ $t("interfaceDisplay.weakMode") }}</div>
                <Switch
                  ref="weakRef"
                  :defaultValue="weakModeFlag"
                  :text="{ active: t('common.yes'), inactive: t('common.no') }"
                  :inlinePrompt="true"
                  @value="weakModeSwitch($event)"
                />
              </div>
              <div class="interface-display d-flex align-items-center justify-content-between">
                <div>{{ $t("interfaceDisplay.interfaceScale") }}</div>
                <Switch
                  ref="selfRef"
                  :defaultValue="selfFlag"
                  :text="{ active: t('common.yes'), inactive: t('common.no') }"
                  :inlinePrompt="true"
                  @value="switchFontSize($event)"
                />
              </div>
            </div>
            <div class="route-transition-title">
              <div class="route-transition-title-item"></div>
              <div class="route-transition-title-content">{{ $t("voiceAnnouncement.voiceAnnouncement") }}</div>
            </div>
            <div class="interface-display-con">
              <div class="interface-display d-flex align-items-center justify-content-between">
                <div>{{ $t("voiceAnnouncement.voiceAnnouncement") }}</div>
                <Switch
                  ref="voiceRef"
                  :defaultValue="voiceFlag"
                  :text="{ active: t('common.yes'), inactive: t('common.no') }"
                  :inlinePrompt="true"
                  @value="switchVoiceFlag($event)"
                />
              </div>
              <div class="interface-display d-flex align-items-center justify-content-between">
                <div>{{ $t("voiceAnnouncement.speakMenu") }}</div>
                <Switch
                  ref="speakMenuRef"
                  v-model="speakMenu"
                  :text="{ active: t('common.yes'), inactive: t('common.no') }"
                  :inlinePrompt="true"
                  @value="switchSpeakMenuFlag($event)"
                />
              </div>
            </div>
          </div>
          <div class="zc-el-drawer-bottom-button-con d-flex flex-j-between">
            <el-button type="primary" class="flex-1 m-r-15" @click="createConfigMode()">{{ $t("button.generate") }}</el-button>
            <el-button class="flex-1" plain @click="reloadConfig()">{{ $t("button.resetting") }}</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Radios from "@static/elementUI/radioGroup/radioGroup.vue";
import Switch from "@static/elementUI/switch/switch.vue";
import { setRouteTransition, RouteTransitionV } from "@static/js/router/transition";
import { getRouteTransition } from "@static/js/router/transition";
import useRouteTransitionStore from "@static/js/store/routeTransition";
import { Theme, FontSizeV, StyleV, ThemesV, LayoutV } from "@static/js/theme/types";
import { themes } from "@static/js/theme/colors";
import {
  getThemeKey,
  setStyle,
  setTheme,
  getStyleKey,
  getWeakModeStatus,
  weakModeHander,
  getGreyModeStatus,
  greyModeHander,
  getLayout,
  setLayout,
} from "@static/js/theme/themes";
import { ref, computed } from "vue";
import useThemeStore from "@static/js/store/theme";
import { setRemMode, getRemMode } from "@static/js/theme/zrem";
import { createSubject } from "@static/components/observer/HySubject";
import { SUBSCRIBE_TYPE } from "@static/components/websocket/HySubscribeHeader";
import HyEnumDataType from "@static/components/observer/HyEnumDataType";
import useVoiceStore from "@static/js/store/voice";

const { t } = useI18n();
const voiceStore = useVoiceStore();
const voiceRef = ref();
const voiceFlag = computed(() => voiceStore.getCanSpeak);
const switchVoiceFlag = (b: boolean) => {
  if (!b) {
    switchSpeakMenuFlag(b);
  }
  voiceStore.setCanSpeak(b);
};
const speakMenuRef = ref();
const speakMenu = computed({
  get() {
    return voiceStore.getCanSpeakMenu;
  },
  set(val: boolean) {
    return val;
  },
});
const switchSpeakMenuFlag = (b: boolean) => {
  speakMenu.value = b;
  voiceStore.setCanSpeakMenu(b);
};

const subject = createSubject(SUBSCRIBE_TYPE.DATA, HyEnumDataType.THEME, []);
const visible = ref(false);
const currentTheme = ref(getThemeKey()); //当前主题色
const defaultRadio = getRouteTransition("routeTransition"); //当前路由动画
const routeRef = ref();
const defaultStyle = getStyleKey(); //当前风格
const styleRef = ref();
const weakModeFlag = getWeakModeStatus(); //当前是否开启色弱模式
const weakRef = ref();
const greyModeFlag = getGreyModeStatus(); //当前是否开启灰色模式
const greyRef = ref();
const selfFlag = getRemMode() === FontSizeV.SelfAdaption; //当前是否开启响应式缩放界面
const selfRef = ref();
const layoutTheme = ref(getLayout()); //获取当前布局

/**
 * 更改布局风格
 * @param layout
 */
const setLayoutModel = (layout: LayoutV) => {
  setLayout(layout, function (mode: LayoutV) {
    const themeStore = useThemeStore();
    themeStore.setLayout(mode);
  });
  layoutTheme.value = layout;
};

/**
 * 更改路由动画
 * @param key
 */
const updateRouteTransition = (key: RouteTransitionV) =>
  setRouteTransition("routeTransition", key, () => {
    const store = useRouteTransitionStore();
    store.setRouteTransition(key);
  });

/**
 * 更换主题色
 * @param color
 */
const switchColor = (color: ThemesV) => {
  setTheme(color, undefined, (theme: Theme) => {
    const themeStore = useThemeStore();
    themeStore.setTheme(theme);
  });
  subject.notify(color);
  currentTheme.value = color;
};
/**
 * 切换风格
 */
const switchStyle = (style: StyleV) => setStyle(style);
/**
 * 切换色弱模式
 */
const weakModeSwitch = (b: boolean) => weakModeHander(b);
/**
 * 切换灰色模式
 */
const greyModeSwitch = (b: boolean) => greyModeHander(b);
/**
 * 切换响应式
 */
const switchFontSize = (b: boolean) => {
  setRemMode(b ? FontSizeV.SelfAdaption : FontSizeV.Default);
};
/**
 * 获取当前配置json
 */
const createConfigMode = () => {
  const json = {
    theme: getThemeKey(), //当前主题色key
    routerTransition: getRouteTransition("routeTransition"), //当前路由动画key
    styleMode: getStyleKey(),
    weakModeFlag: getWeakModeStatus(),
    greyModeFlag: getGreyModeStatus(),
    remMode: getRemMode(),
  };
  console.log(json);
};
/**
 * 重置配置
 */
const reloadConfig = () => {
  switchColor(ThemesV.Black);
  switchFontSize(false);
  selfRef.value.changeValue(false);
  switchStyle(StyleV.Default);
  styleRef.value.changeValue(StyleV.Default);
  weakModeSwitch(false);
  weakRef.value.changeValue(false);
  greyModeSwitch(false);
  greyRef.value.changeValue(false);
  updateRouteTransition(RouteTransitionV.Default);
  routeRef.value.changeValue(RouteTransitionV.Default);
};
</script>

<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
.drawer-con {
  width: 100%;
  height: 100%;
  .set-icon-con {
    font-size: zrem(18);
    cursor: pointer;
  }
}
.inner-wrap {
  height: 100%;
}
.route-transition-title {
  margin-bottom: zrem(20);
  display: flex;
  align-items: center;
  padding: 0 zrem(8);
  .route-transition-title-item {
    width: zrem(4);
    height: zrem(14);
    background-color: var(--el-color-primary);
  }
  .route-transition-title-content {
    text-align: center;
    font-size: zrem(14);
    margin: 0 zrem(10);
    color: var(--color);
  }
}
.radios-con {
  margin-bottom: zrem(32);
  flex-wrap: wrap;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: zrem(8);
  .radios {
    width: zrem(190);
  }
}
.themes-con {
  padding: 0 zrem(8);
  margin-bottom: zrem(32);
  .themes-box {
    width: zrem(20);
    height: zrem(20);
    margin-right: zrem(16);
    border: zrem(1) solid var(--el-border-color);
    cursor: pointer;
  }
  .active-box {
    border: zrem(1) solid var(--el-color-primary);
  }
}
.interface-display-con {
  width: zrem(180);
  margin-left: zrem(8);
  .interface-display {
    font-size: zrem(14);
  }
}
.zc-el-drawer-bottom-button-con {
  width: 80%;
  margin: 0 zrem(16) zrem(22) zrem(16);
  button:nth-child(2) {
    margin-left: zrem(16);
  }
}
.layout-theme {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 20px;

  li {
    margin-right: zrem(16);
    position: relative;
    width: zrem(32);
    height: zrem(32);
    overflow: hidden;
    cursor: pointer;
    background: #4d6483;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);
    &.is-select {
      border: 1px solid var(--el-color-primary);
    }
    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #0c1f3a;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #0c1f3a;
          box-shadow: 0 0 1px #888;
        }
      }
    }
  }
}
</style>
