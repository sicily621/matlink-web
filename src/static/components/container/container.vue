<template>
  <div class="container-con">
    <el-header class="header-con" :style="{ opacity: isFullContent ? 0 : 1 }" v-if="!isFullContent">
      <ZcHeader />
    </el-header>
    <el-container class="m-c-f-con" :class="{'h-full': isFullContent}">
      <div class="menu left-menu-bg" :style="{ opacity: isFullContent ? 0 : 1 }" v-if="layoutTheme === LayoutV.Vertical">
        <ZcElMenu />
      </div>
      <el-container class="flex-column h-full" :class="{ 'full-content': isFullContent }">
        <Tags @fullContent="fullContent($event)" />
        <el-main class="-router-con position-relative">
          <router-view v-slot="{ Component, route }">
            <transition
              :name="route.meta.transition ? String(route.meta.transition) : transitionName"
              :mode="route.meta.transition ? 'out-in' : routeTransitionMode[transitionName]"
            >
              <!-- <KeepAlive :max="6"> -->
              <component :is="(menu.menuAlias as string) || Component" :menuData="config.subtemplate" />
              <!-- </KeepAlive> -->
            </transition>
          </router-view>
          <Tool />
        </el-main>
        <Footer />
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, ref } from "vue";
import { LayoutV } from "@static/js/theme/types";
import useThemeStore from "@static/js/store/theme";
import ZcHeader from "../header/header.vue";
import ZcElMenu from "../zElMenu/zElMenu.vue";
import Tags from "../tags/tags.vue";
import Footer from "../footer/footer.vue";
import Tool from "../tool/tool.vue";
import useRouteTransitionStore from "@static/js/store/routeTransition";
import { routeTransitionMode, RouteTransitionV, getRandomRouteTransition } from "@static/js/router/transition";
import { useRouter } from "vue-router";
import useMenuStore from "@static/js/store/menu";
const router = useRouter();
const themeStore = useThemeStore();
const layoutTheme = computed(() => themeStore.getLayout); //获取当前布局
const store = useRouteTransitionStore();
const transitionName = ref<RouteTransitionV>(store.getRouteTransition);
const isFullContent = ref(false);
const menuStore = useMenuStore();
const menu = computed<any>(() => {
  return menuStore.getMenu;
})
const config = computed<any>(() => {
  return menuStore.getConfig;
});

watch(
  () => store.getRouteTransition,
  (v) => {
    transitionName.value = v;
  }
);
watch(
  () => router.currentRoute.value,
  () => {
    const transitionV = store.getRouteTransition;
    if (transitionV === RouteTransitionV.Random) transitionName.value = getRandomRouteTransition();
  }
);

const fullContent = (b: boolean) => {
  isFullContent.value = b;
};
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;

.container-con {
  width: 100%;
  height: 100%;
  z-index: 0;
  //background: url(../../assets/images/blue-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  
  .header-con {
    width: 100%;
    padding: 0;
  }

  .m-c-f-con {
    //flex: 1;
    height: calc(100% - zrem(72));
    position: relative;
    z-index: 0;
    .menu {
      height: 100%;
      //@include leftMenuBackground;
    }
  }

  .-router-con {
    width: calc(100% - zrem(24));
    height: calc(100% - zrem(152));
    margin: zrem(12);
    max-width: 100%;
    overflow: hidden;
    padding: 0;
  }

  .position-relative {
    position: relative;
  }
  .full-content {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    .-router-con {
      height: calc(100% - zrem(80));
    }
  }
}
</style>
