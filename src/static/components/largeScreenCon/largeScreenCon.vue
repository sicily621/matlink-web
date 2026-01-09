<template>
  <div class="w-full h-full d-flex flex-center">
    <div
      class="w-full h-full relative translate-half-y"
      :style="{
        maxWidth: (maxWidth / maxHeight) * 100 + 'vh',
        maxHeight: (maxHeight / maxWidth) * 100 + 'vw',
      }"
    >
      <!-- 布局模板 -->
      <component :is="groupInfo.groupAliasName" :menuData="groupConfig.subtemplate" />

      <!-- 左右菜单 -->
      <div class="absolute screen-menu-wrap d-flex">
        <div class="flex-1 relative w-full h-full">
          <router-view v-slot="{ Component, route }">
            <!-- <transition
            :name="route.meta.transition ? String(route.meta.transition) : transitionName"
            :mode="route.meta.transition ? 'out-in' : routeTransitionMode[transitionName]"
            > -->
            <!-- <KeepAlive :max="6"> -->
            <component :is="menu.menuAlias" :menuData="config.subtemplate" />
            <!-- </KeepAlive> -->
            <!-- </transition> -->
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch, ref } from "vue";
import { useRouter } from "vue-router";
import useMenuStore from "@static/js/store/menu";
import largeScreenBackTop from "@static/images/largeScreen/large-screen-back-top.png";
import largeScreenTimeBack from "@static/images/largeScreen/large-screen-time-back.png";
import largeScreenBackRight from "@static/images/largeScreen/large-screen-back-right.png";
import largeScreenBackLeft from "@static/images/largeScreen/large-screen-back-left.png";
import largeScreenBackBottom from "@static/images/largeScreen/large-screen-back-bottom.png";
import largeScreenMenuItem from "@static/images/largeScreen/large-screen-menu-item.png";
import largeScreenMenuActive from "@static/images/largeScreen/large-screen-menu-active.png";
import largeScreenMenuChildrenArrow from "@static/images/largeScreen/large-screen-menu-children-arrow.png";
import largeScreenMenu from "./largeScreenMenu.vue";
import { createSubject } from "@static/components/observer/HySubject";
import { SUBSCRIBE_TYPE } from "@static/components/websocket/HySubscribeHeader";
import HyEnumDataType from "@static/components/observer/HyEnumDataType";

const subject = createSubject(SUBSCRIBE_TYPE.DATA, HyEnumDataType.THEME, []);
const menuStore = useMenuStore();
const menus = computed<any>(() => {
  return menuStore.getMenus;
});

const groupInfo = computed<any>(() => {
  console.log("查看groupInfo:", menuStore.getGroupInfo);
  return menuStore.getGroupInfo;
});
const maxWidth = computed(() => (menuStore.getGroupInfo as any)?.width ?? 1920);
const maxHeight = computed(() => (menuStore.getGroupInfo as any)?.height ?? 1080);
const menu = computed<any>(() => {
  return menuStore.getMenu;
});
const config = computed<any>(() => {
  return menuStore.getConfig;
});
const groupConfig = computed<any>(() => {
  return menuStore.getGroupConfig;
});
const router = useRouter();

const sessionStorageKeys = ["current_project", "current_tenant", "groupId", "login_info", "login_token", "permission", "product", "productId", "project_info", "tabs", "tabsMap"];
for (let key of sessionStorageKeys) {
  const value = sessionStorage.getItem(key);
  if (!value) {
    const value2 = localStorage.getItem(key);
    if (value2) {
      sessionStorage.setItem(key, value2);
      localStorage.removeItem(key);
    }
  }
}
const ymd = ref();
const hours = ref();
const minutes = ref();
const seconds = ref();
const formatDate = () => {
  var myDate = new Date();
  var Y = myDate.getFullYear(); //获取当前完整年份
  var M = myDate.getMonth() + 1; //获取当前月份
  var D = myDate.getDate(); //获取当前日1-31
  // var Day = myDate.getDay();
  var H = myDate.getHours(); //获取当前小时
  var i = myDate.getMinutes(); //获取当前分钟
  var s = myDate.getSeconds();
  ymd.value = `${Y}-${M < 10 ? "0" + M : M}-${D < 10 ? "0" + D : D}`;
  hours.value = H + "";
  minutes.value = i + "";
  seconds.value = s + "";
};
formatDate();
setInterval(() => {
  formatDate();
}, 1000);
const targetMenu = (obj: any) => {
  if (obj._path) return router.push(obj._path);
  if (!obj.templateId) {
    if (Array.isArray(obj.children) && obj.children.length) {
      targetMenu(obj.children[0]);
    }
    return;
  }
  let queryObj: any = {
    cid: obj.menuAlias,
    mid: obj.menuId || obj.id,
  };
  router.push({
    path: `/largeScreenCon`,
    query: queryObj,
  });
};
</script>
<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;

.large-screen-con-con {
  width: 100%;
  height: 100%;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  .large-screen-header {
    width: 100%;
    height: zrem(76);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    .large-screen-header-content {
      width: 100%;
      height: zrem(76);
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .large-screen-header-left {
        display: flex;
        align-items: center;
        margin-left: zrem(20);
        width: zrem(422);
        .date-word {
          color: #fff;
          font-size: zrem(16);
        }
        .time-con {
          display: flex;
          align-items: center;
          margin-left: zrem(20);
          .time-item {
            width: zrem(20);
            height: zrem(25);
            margin-right: zrem(6);
            position: relative;
            img {
              width: 100%;
              height: 100%;
            }
            .time-item-content {
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-size: zrem(16);
            }
          }
        }
      }
      .large-screen-header-center {
        font-size: zrem(30);
        font-weight: bold;
        background: linear-gradient(to bottom, #ffffff 0%, #71abd6 99%, #70abd6 100%);
        background-clip: text;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .large-screen-header-right {
        display: flex;
        align-items: center;
        margin-right: zrem(20);
        width: zrem(422);
        justify-content: flex-end;
        .weather-icon {
          width: zrem(36);
          height: zrem(30);
          margin-right: zrem(10);
          img {
            width: 100%;
            height: 100%;
          }
        }
        .date-word {
          color: #fff;
          font-size: zrem(16);
        }
        .date-word2 {
          color: #fff;
          font-size: zrem(16);
          font-weight: bold;
        }
        .date-word3 {
          color: #fff;
          font-size: zrem(16);
          margin-left: zrem(58);
        }
      }
    }
    .large-screen-back-top {
      width: 100%;
      height: zrem(76);
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      justify-content: center;
      img {
        width: 100%;
        height: zrem(76);
      }
    }
  }
  .large-screen-back-content {
    position: absolute;
    left: 0;
    top: zrem(76);
    width: 100%;
    height: calc(100% - zrem(76));
    // z-index: 1;
    background: skyblue;
  }
  .large-screen-footer {
    width: 100%;
    height: zrem(75);
    left: 0;
    bottom: 0;
    position: absolute;
    z-index: 1;
    display: flex;
    justify-content: center;
    img {
      width: zrem(1920);
      height: zrem(75);
    }
  }
  .large-screen-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 50%;
    bottom: zrem(80);
    transform: translateX(-50%);
    z-index: 10;
    .large-screen-menu-item {
      width: zrem(138);
      height: zrem(48);
      position: relative;
      margin: 0 zrem(30);
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
      .large-screen-menu-content {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        position: absolute;
        text-align: center;
        line-height: zrem(46);
        // display: flex;
        // align-items: center;
        // justify-content: center;
        font-family: PangMenZhengDao;
        font-size: zrem(18);
        color: #ffffff;
      }
      .menu-children {
        width: zrem(178);
        // background: red;
        position: absolute;
        left: zrem(-20);
        bottom: zrem(48);
        display: none;
        padding-bottom: zrem(4);
        .menu-children-list-box {
          width: 100%;
          background: rgba(18, 28, 40, 0.72);
          border-radius: zrem(4);
          box-sizing: border-box;
        }
        .menu-children-list {
          width: 100%;
          // height: zrem(200);
          box-sizing: border-box;
          padding: zrem(8) zrem(8) zrem(4) zrem(8);
          .menu-children-item {
            display: flex;
            align-items: center;
            height: zrem(30);
            margin-bottom: zrem(4);
            .menu-children-item-arrow {
              width: zrem(20);
              height: zrem(20);
              margin-right: zrem(4);
              transform: rotate(-90deg);
              img {
                width: 100%;
                height: 100%;
              }
            }
            .menu-children-item-content {
              flex: 1;
              height: 100%;
              border-radius: zrem(4) 0px 0px zrem(4);
              .menu-children-item-word {
                height: 100%;
                line-height: zrem(30);
                box-sizing: border-box;
                width: 100%;
                padding-left: zrem(4);
                color: #fff;
              }
            }
          }
          .menu-children-item-active {
            .menu-children-item-content {
              background: linear-gradient(270deg, rgba(230, 138, 29, 0) 0%, rgba(247, 147, 29, 0.39) 100%);
              .menu-children-item-word {
                background: linear-gradient(to bottom, #ffffff 0%, #ffe282 50%, #f89c2c 100%);
                background-clip: text;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
          }
        }
        .menu-children-arrow {
          width: zrem(66);
          height: zrem(15);
          margin: 0 auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .menu-children:hover {
        display: block;
      }
    }
    .large-screen-menu-item:hover {
      .menu-children {
        display: block;
      }
    }
  }
  .large-screen-back-right {
    top: zrem(60);
    right: 0;
    width: zrem(25);
    height: calc(100% - zrem(60));
    position: absolute;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .large-screen-back-left {
    top: zrem(60);
    left: 0;
    width: zrem(25);
    height: calc(100% - zrem(60));
    position: absolute;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.top-76 {
  position: absolute;
  left: 0;
  top: zrem(76);
}
.screen-menu-wrap {
  width: calc(100% - zrem(64));
  height: calc(100% - zrem(146));
  top: zrem(110);
  left: zrem(32);
  pointer-events: none;
  z-index: 1;
}
.translate-half-y {
  //transform: translate(0, 50%);
}
</style>
