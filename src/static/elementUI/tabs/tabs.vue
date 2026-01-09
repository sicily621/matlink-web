<template>
  <el-tabs
    v-bind="tabProps"
    v-model:selected="selectedTab"
    @tab-click="handleTabClick"
  >
    <el-tab-pane
      v-for="(tab, index) in tabs"
      :key="index"
      :label="tab.label"
      :name="tab.name"
    >
      <component :is="tab.component" v-bind="tab.props" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const tabProps = ref({});
const tabs = ref<any[]>([]);
const selectedTab = ref("");

const currentTab = computed({
  get: function () {
    return tabs.value.find((tab) => tab.name === selectedTab.value);
  },
  set: function (newVal) {
    selectedTab.value = newVal.name;
  },
});

const handleTabClick = (tab: any) => {
  currentTab.value = tabs.value[tab.index];
};
</script>
