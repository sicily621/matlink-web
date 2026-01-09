<template>
  <div class="h-full flex-column p-r-20 p-l-20 content-wrap">
    <el-scrollbar class="h-full">
      <div class="m-b-20"><el-text tag="b">{{ t('color.primary') }}</el-text></div>
      <el-row :gutter="12" class="color-wrap">
        <el-col :span="10" :xs="{ span: 12 }">
          <div class="demo-color-box" :style="{ background: `var(${primary})` }">
            Brand Color
            <div class="value" text="xs">{{ getCssVar(primary!).toUpperCase() }}</div>
            <div class="bg-color-sub" :style="{ background: primary }">
              <div
                v-for="level in colorLevel"
                :key="level"
                class="bg-blue-sub-item cursor-pointer hover:shadow"
                :style="{
                  width: `${100 / 10}%`,
                  background: 'var(--el-color-primary-' + level + ')',
                }"
                @click="copyColor(`--el-color-primary-${level}`)"
              />
            </div>
            <div class="bg-color-sub bg-color-sub-opacity">
              <div
                v-for="level in 9"
                :key="level"
                class="bg-secondary-sub-item transition cursor-pointer hover:shadow"
                :style="{
                  width: `${100 / 9}%`,
                  background: `var(--el-primary-opacity-` + level + ')',
                }"
                @click="copyColor(`--el-primary-opacity-${level}`)"
              />
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="m-b-20 m-t-10"><el-text tag="b">{{ t('color.auxiliary') }}</el-text></div>
      <el-row :gutter="12" class="color-wrap">
        <el-col v-for="(type, i) in colorsType" :key="i" :span="6" :xs="{ span: 12 }">
          <div class="demo-color-box" :style="{ background: getCssVar(`--el-color-${type}`) }">
            {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            <div class="value" text="xs">
              {{ getCssVar(`--el-color-${type}`).toUpperCase() }}
            </div>
            <div class="bg-color-sub">
              <div
                v-for="(level, key) in colorLevel"
                :key="key"
                class="bg-secondary-sub-item transition cursor-pointer hover:shadow"
                :style="{
                  width: `${100 / 10}%`,
                  background: `var(--el-color-${type}-` + level + ')',
                }"
                @click="copyColor(`--el-color-${type}-${level}`)"
              />
            </div>
            <div class="bg-color-sub bg-color-sub-opacity">
              <div
                v-for="level in 9"
                :key="level"
                class="bg-secondary-sub-item transition cursor-pointer hover:shadow"
                :style="{
                  width: `${100 / 9}%`,
                  background: `var(--el-` + type + `-opacity-` + level + ')',
                }"
                @click="copyColor(`--el-${type}-opacity-${level}`)"
              />
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="m-b-20 m-t-10"><el-text tag="b">{{ t('color.neutral') }}</el-text></div>
      <el-row :gutter="12" class="color-wrap">
        <el-col :span="6" :xs="{ span: 12 }">
          <div class="demo-color-box-group">
            <div
              v-for="(text, i) in textColors"
              :key="i"
              class="demo-color-box demo-color-box-other"
              :style="{
                color: text.var === '#ffffff' ? 'var(--el-text-color-primary)' : 'var(--el-bg-color)',
                background: text.var,
                border: `1px solid var(--el-border-color-light)`,
              }"
            >
              {{ text.name }}
              <div class="value" text="xs">
                {{ text.var.toUpperCase() }}
              </div>
              <div class="bg-color-sub" v-if="i === 0">
                <div
                  v-for="level in 9"
                  :key="level"
                  class="bg-secondary-sub-item transition cursor-pointer hover:shadow"
                  :style="{
                    width: `${100 / 9}%`,
                    background: `var(--el-text-color-mix-` + level + ')',
                  }"
                  @click="copyColor(`--el-text-color-mix-${level}`)"
                />
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="6" :xs="{ span: 12 }">
          <div class="demo-color-box-group">
            <div
              v-for="(border, i) in borderColors"
              :key="i"
              class="demo-color-box demo-color-box-other demo-color-box-lite"
              :style="{ background: border.var, border: `1px solid var(--el-border-color-light)` }"
            >
              {{ border.name }}
              <div class="value" text="xs">
                {{ border.var.toUpperCase() }}
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="6" :xs="{ span: 12 }">
          <div class="demo-color-box-group">
            <div
              v-for="(fill, i) in fillColors"
              :key="i"
              class="demo-color-box demo-color-box-other demo-color-box-lite"
              :style="{
                background: fill.var,
                border: `1px solid var(--el-border-color-light)`,
              }"
            >
              {{ fill.name }}
              <div class="value" text="xs">
                {{ fill.var.toUpperCase() }}
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="6" :xs="{ span: 12 }">
          <div class="demo-color-box-group">
            <div class="demo-color-box demo-color-box-other" :style="{ background: black }">
              Basic Black
              <div class="value" text="xs">{{ black }}</div>
            </div>
            <div
              class="demo-color-box demo-color-box-other"
              :style="{
                background: white,
                color: '#303133',
                border: `1px solid var(--el-border-color-light)`,
              }"
            >
              Basic White
              <div class="value" text="xs">{{ white }}</div>
            </div>
            <div
              class="demo-color-box demo-color-box-other demo-color-box-lite bg-transparent"
              :style="{
                border: `1px solid var(--el-border-color-light)`,
              }"
            >
              Transparent
              <div class="value" text="xs">Transparent</div>
            </div>

            <div
              v-for="(bg, i) in backgroundColors"
              :key="i"
              class="demo-color-box demo-color-box-other demo-color-box-lite"
              :style="{
                background: bg.var,
                border: `1px solid var(--el-border-color-light)`,
              }"
            >
              {{ bg.name }}
              <div class="value" text="xs">
                {{ bg.var.toUpperCase() }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="m-b-20 m-t-10"><el-text tag="b">{{ t('color.supplementary') }}</el-text></div>
      <el-row :gutter="12" class="color-wrap">
        <el-col :span="4" :xs="{ span: 12 }" class="demo-color-box-group" v-for="i in 9" :key="i">
          <div>
            <div
              class="demo-color-box demo-color-box-other"
              :style="{
                color: 'var(--el-bg-color)',
                background: `${getCssVar(`--el-${supplement}-color-${i}`)}`,
                border: `1px solid var(--el-border-color-light)`,
              }"
            >
              {{ `${supplement}-color-${i}` }}
              <div class="value" text="xs">
                {{ `${getCssVar(`--el-${supplement}-color-${i}`).toUpperCase()}` }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="4" :xs="{ span: 12 }" class="demo-color-box-group" v-for="key in others" :key="key">
          <div>
            <div
              class="demo-color-box demo-color-box-other"
              :style="{
                color: 'var(--el-text-color-primary)',
                background: `${getCssVar(getCssVarName(`${key}`))}`,
                border: `1px solid var(--el-border-color-light)`,
              }"
            >
              {{ `${key}` }}
              <div class="value overflow-spot" text="xs" :title="`${getCssVar(getCssVarName(`${key}`))}`">
                {{ `${getCssVar(getCssVarName(`${key}`))}` }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { useCssVar } from "@vueuse/core";
import { ref, computed, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from 'vue-i18n';
import { getCssVar } from "@static/js/theme/var";
import { createObserver } from "@static/components/observer/HyObserver";
import HyEnumDataType from "@static/components/observer/HyEnumDataType";
import IHyTopic from "@static/components/observer/IHyTopic";

const { t } = useI18n();
const topicManager = window.$HyGlobal.getTopicManager();
const theme = ref("current");
const topic: IHyTopic | undefined = topicManager.getByKey(HyEnumDataType.THEME.getName());
if (topic) {
  const observer = createObserver(topic, (data: any) => {
    theme.value = data;
  });
  const unsubscribe = () => {
    observer && observer.destroy();
  };
  onBeforeUnmount(() => unsubscribe());
}
const primary = computed(() => {
  if (!theme.value) return;
  const result = getCssVarName("color-primary");
  return result;
});
const colorLevel = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `light-${i}`);
colorLevel.unshift("dark-2");
const colorsType = ref(["success", "warning", "danger", "info"]);
const backgroundTypes = ["page", "", "overlay"];

const getCssVarName = (namespace: string, type?: string) => {
  return type ? `--el-${namespace}-${type}` : `--el-${namespace}`;
};
const backgroundColors = computed(() => {
  if (!theme.value) return;
  const result = backgroundTypes.map((type) => {
    return {
      name: type ? `${type[0].toUpperCase() + type.slice(1)} Background` : "Base Background",
      var: getCssVar(getCssVarName("bg-color", type)),
    };
  });
  return result;
});

const borderTypes = ["darker", "dark", "", "light", "lighter", "extra-light"];
const borderColors = computed(() => {
  if (!theme.value) return;
  const result = borderTypes.map((type) => {
    return {
      name: type ? `${type[0].toUpperCase() + type.slice(1)} Border` : "Base Border",
      var: getCssVar(getCssVarName("border-color", type)),
    };
  });
  return result;
});

const fillTypes = ["darker", "dark", "", "light", "lighter", "extra-light", "blank"];
const fillColors = computed(() => {
  if (!theme.value) return;
  const result = fillTypes.map((type) => {
    return {
      name: type ? `${type[0].toUpperCase() + type.slice(1)} Fill` : "Base Fill",
      var: getCssVar(getCssVarName("fill-color", type)),
    };
  });
  return result;
});

const textTypes = ["primary", "regular", "secondary", "placeholder", "disabled"];
const textColors = computed(() => {
  if (!theme.value) return;
  const result = textTypes.map((type) => {
    return {
      name: `${type[0].toUpperCase() + type.slice(1)} Text`,
      var: getCssVar(getCssVarName("text-color", type)),
    };
  });
  return result;
});
const black = "#000000";
const white = "#FFFFFF";

//补充色
const supplement = computed(() => {
  if (!theme.value) return;
  return "supplement";
});
const others = computed(() => {
  if (!theme.value) return;
  const result = ["left-menu-bg", "left-menu-item-bg-level-1", "top-header-bg", "map-bg", "map-grid-color"];
  return result;
});
const copyColor = (colorVar: string) => {
  const color = useCssVar(colorVar);
  if (color) {
    ElMessage({
      type: "success",
      message: `${colorVar} : ${color.value}`,
    });
  }
};
</script>
<style lang="scss" scoped>
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.color-wrap {
  width: calc(100% - zrem(12));
}
h2 {
  color: var(--el-text-color-primary);
}
.demo-color-box {
  position: relative;
  border-radius: zrem(4);
  padding: zrem(20);
  margin: zrem(8) 0;
  height: zrem(100);
  box-sizing: border-box;
  color: var(--el-color-white);
  font-size: zrem(14);

  .bg-color-sub {
    width: 100%;
    height: zrem(20);
    left: 0;
    bottom: 0;
    position: absolute;
    &.bg-color-sub-opacity {
      top: zrem(-20);
    }
    .bg-blue-sub-item {
      height: 100%;
      display: inline-block;
      &:first-child {
        border-radius: 0 0 0 var(--el-border-radius-base);
      }
    }

    .bg-secondary-sub-item {
      height: 100%;
      display: inline-block;
      &:first-child {
        border-radius: 0 0 0 var(--el-border-radius-base);
      }
    }
  }

  .value {
    margin-top: zrem(2);
  }
}

.demo-color-box-lite {
  color: var(--el-text-color-primary);
}
.cursor-pointer {
  margin: 0 !important;
}
</style>
