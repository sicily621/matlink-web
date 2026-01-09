<template>
  <el-dropdown trigger="click" placement="bottom-start" v-if="show">
    <span class="dropdown-badge navbar-bg-hover select-none">
      <el-badge :value="noticeBadgeTotal">
        <span class="header-notice-icon">
          <el-icon class="fz18">
            <Bell />
          </el-icon>
        </span>
      </el-badge>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs v-model="activeName" :stretch="true" class="dropdown-tabs notice-tabs p-r-20 p-l-20" @tab-click="handleClick">
          <template v-for="(item, index) in topInfos" :key="item.id">
            <el-tab-pane
              :label="`${getLocaleValue(lang, topInfos?.[index], { cnNameKey: 'cnName', enNameKey: 'enName' })}(${noticeBadgeNumList?.[index] ?? 0})`"
              :name="index"
            >
              <div class="event-wrap">
                <!-- <template v-if="index === activeIndex && show2"> -->
                  <component :is="(item as any).configAlias" :configData="item" :configType="index" />
                <!-- </template> -->
              </div>
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import useMenuStore from "@static/js/store/menu";
import { getLocaleValue } from "@static/js/locales/index";
import useLocaleStore from "@static/js/store/locale";
import userNoticeStore from "@static/js/store/notice";
const noticeStore = userNoticeStore();
const noticeBadgeNumList = computed<number[]>(() => noticeStore.getBadgeNumList);
const localeStore = useLocaleStore();
const lang = computed(() => localeStore.getLang);
const menuStore = useMenuStore();
const topInfos = computed(() => menuStore.getConfig.topinfo ?? []);
const show = computed(() => topInfos.value.length > 0);
const show2 = ref(false);
const activeIndex = ref(0);
const activeName = ref(0);
const noticeBadgeTotal = computed(() => noticeStore.getBadgeSum);
const handleClick = (tab: any) => {
  activeIndex.value = +tab!.index;
};
setTimeout(() => {
  show2.value = true;
});
</script>
<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;

.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: zrem(40);
  height: zrem(48);
  margin-right: zrem(10);
  cursor: pointer;

  .header-notice-icon {
    font-size: zrem(18);
  }
}

.dropdown-tabs {
  width: 30vw;
  height: zrem(330);
}

.event-wrap {
  height: zrem(275);
}
</style>
