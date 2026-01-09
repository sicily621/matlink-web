<template>
  <div class="footer flex-center fill-bg relative">
    <div class="w-full h-full d-flex flex-center fill-bg badge-wrap" v-if="!show">
      <a href="https://www.zchg.cc" target="_blank" rel="nofollow"><span><!-- 北京中创慧谷数据科技有限公司 --></span></a>
      <span style="margin-left: 3px">Copyright &copy; 2017-2025 {{ t('footer.copyright') }}</span>
      <img :src="badge" width="12" height="12" />
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="nofollow">
        <span>{{ t('footer.icp') }}</span>
      </a>
      <img :src="badge" width="12" height="12" />
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502054779" target="_blank">
        <span style="margin-left: 2px">{{ t('footer.publicSecurity') }}</span>
      </a>
    </div>
    <div class="w-full h-full d-flex flex-center footer-item-wrap fill-bg" v-else :class="{ shadow: activeIndex > -1 }">
      <div v-for="(item, index) in footers" :key="item.id" @click="open(index)"
        class="d-flex flex-center m-r-30 pointer item" :class="{ 'is-active': activeIndex === index }">
        <img :src="item.icon" width="36" class="icon" />
        <el-text :type="activeIndex === index ? 'primary' : ''" class="fz18"><span>{{ getLocaleValue(lang, item, {
          cnNameKey: "cnName", enNameKey: "enName" }) }}</span>
          <span class="num">{{ footerBadgeNumList?.[index] ?? 0 }}</span></el-text>
        <!--        <img :src="arrowRight" width="24" height="24" class="arrow" />-->
      </div>
    </div>

    <div class="drawer" :class="{
      full: footerStatus === FooterStatus.OpenAll,
      slideUp: footerStatus !== FooterStatus.Close,
      slideDown: footerStatus === FooterStatus.Close,
    }">
      <div class="drawer-header d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center" v-if="activeIndex > -1">
          <img :src="footers[activeIndex]?.icon" width="36" class="icon" />
          <el-text class="fz14 m-r-8">{{ getLocaleValue(lang, footers?.[activeIndex], {
            cnNameKey: "cnName", enNameKey:
            "enName" }) }}</el-text>
          <span class="badge">{{ footerBadgeNumList?.[activeIndex] ?? 0 }}</span>
        </div>
        <div class="flex-center">
          <el-icon class="fz20 m-r-30 pointer"
            :class="{ 'tran-rotate-90': footerStatus === FooterStatus.OpenHalf, 'tran-rotate-270': footerStatus === FooterStatus.OpenAll }"
            @click="toggleState">
            <DArrowLeft />
          </el-icon>

          <el-icon class="fz20 pointer" @click="close">
            <Close />
          </el-icon>
        </div>
      </div>
      <div class="drawer-body">
        <template v-for="(footer, index) of footers" class="w-full flex1">
          <div v-show="index === activeIndex" class="w-full h-full">
            <component :is="footer.configAlias" :configData="footer" :configType="index" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useI18n } from 'vue-i18n';
import useMenuStore from "@static/js/store/menu";
import userFooterStore from "@static/js/store/footer";
import arrowRight from "@static/images/icon-arrow-right.png";
import useLocaleStore from "@static/js/store/locale";
import { getLocaleValue } from "@static/js/locales/index";
import badge from "@static/images/badge.png";

const { t } = useI18n();
const localeStore = useLocaleStore();
const menuStore = useMenuStore();
const footerStore: any = userFooterStore();
const lang = computed(() => localeStore.getLang);
const footers = computed(() => {
  if (Array.isArray(menuStore.getConfig.footer) && menuStore.getConfig.footer.length) {
    return menuStore.getConfig.footer;
  } else {
    return menuStore.getFirstFooter || [];
  }
});
const show = computed(() => footers.value.length > 0);
const activeIndex = computed(() => footerStore.getActiveFooterIndex);
enum FooterStatus {
  Close,
  OpenHalf,
  OpenAll,
}
const footerStatus = ref<FooterStatus>(FooterStatus.Close); //抽屉状态 0关闭 1打开一半 2升高至内容区
const footerBadgeNumList = computed<number[]>(() => footerStore.getBadgeNumList);
watchEffect(() => {
  //升起footer
  if (footerStore.getActiveFooterIndex > -1) {
    footerStatus.value = FooterStatus.OpenHalf;
  }
});

//footer状态切换
const toggleState = () => {
  footerStatus.value = footerStatus.value === FooterStatus.OpenHalf ? FooterStatus.OpenAll : FooterStatus.OpenHalf;
};

const open = (index: number) => {
  footerStore.setActiveFooterIndex(index);
};

let timer: any = null;
const close = () => {
  footerStatus.value = FooterStatus.Close;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    footerStore.setActiveFooterIndex(-1);
  }, 500);
};
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;

.footer {
  height: zrem(36);
  margin: 0 zrem(12) 0 zrem(12);
  border-top-right-radius: zrem(8);
  border-top-left-radius: zrem(8);

  .footer-item-wrap {
    position: relative;
    z-index: 11;
    border-top-right-radius: zrem(8);
    border-top-left-radius: zrem(8);

    .item {
      margin-right: zrem(130);

      &:last-child {
        margin-right: 0;
      }
    }

    .icon {
      margin-right: zrem(15);
    }

    .num {
      margin-left: zrem(12);
      color: var(--el-text-color);
    }

    .arrow {
      margin-left: zrem(6);
    }
  }

  .badge-wrap {
    font-size: zrem(14);
    line-height: zrem(22);
    border-top-right-radius: zrem(8);
    border-top-left-radius: zrem(8);

    span,
    a {
      color: var(--el-text-color-mix-4);
    }

    img {
      margin-left: zrem(10);
      margin-right: zrem(5);
    }
  }

  .drawer {
    position: absolute;
    width: 100%;
    left: 0;
    transition: all 0.5s;
    z-index: 10;
    border-radius: zrem(8) zrem(8) zrem(0) zrem(0);

    &.slideUp {
      height: zrem(350);
      top: zrem(-355);
    }

    &.slideDown {
      height: zrem(350);
      top: zrem(64);
    }

    .drawer-header {
      height: zrem(72);
      margin: 0 zrem(20);

      .badge {
        background: var(--el-color-danger);
        color: var(--el-color-white);
        border-radius: zrem(8);
        padding: 0 zrem(5);
        height: zrem(16);
        line-height: zrem(16);
        font-size: zrem(12);
      }

      .icon {
        margin-right: zrem(15);
      }
    }

    .drawer-body {
      height: calc(100% - zrem(72));
      padding: 0 zrem(20);
    }

    &.full {
      height: calc(100vh - zrem(156));
      top: calc(zrem(151) - 100vh);
    }
  }
}

html.black,
html.blue {
  .footer {
    .footer-item-wrap {
      &.shadow {
        border-radius: 0;
        box-shadow: inset 0 zrem(12) zrem(24) 0 rgba(0, 0, 0, 0.5);
      }
    }

    .drawer {
      background: var(--el-fill-color-light);
      box-shadow: 0px 12px 24px 0px rgba(0, 0, 0, 0.5);
    }
  }
}

html.white {
  .footer {
    .drawer {
      background: var(--el-fill-color-blank);
      box-shadow: 0px -2px 7px 0px rgba(193, 193, 193, 0.91);
    }
  }
}
</style>
