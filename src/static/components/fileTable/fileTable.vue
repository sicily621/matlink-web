<template>
    <el-scrollbar :height="'100%'">
        <div class="file-table-con">
            <div class="file-table-item" v-for="item of list" :class="{ 'h-170': !brandNameMap || !modelNameMap }"
                :style="{ height: height }">
                <div class="file-table-item-title">
                    <div class="file-table-item-title-content">{{ titleKey ? item[titleKey] : item.fileName }}</div>
                    <div class="file-table-item-title-back"></div>
                </div>
                <div class="file-table-item-brand-model d-flex align-items-center justify-content-between"
                    v-if="brandNameMap && modelNameMap">
                    <div class="file-table-item-brand d-flex align-items-center">
                        <div class="file-table-item-brand-word">{{ t('fileTable.brand') }}</div>
                        <div class="file-table-item-brand-content">{{ brandNameMap[item.brandNo] || '-' }}</div>
                    </div>
                    <div class="file-table-item-brand d-flex align-items-center">
                        <div class="file-table-item-brand-word">{{ t('fileTable.model') }}</div>
                        <div class="file-table-item-brand-content">{{ modelNameMap[item.modelNo] || '-' }}</div>
                    </div>
                </div>
                <div class="file-table-item-info d-flex align-items-center" v-if="!type">
                    <div class="file-table-item-info-word">{{ t('fileTable.fileFormat') }}</div>
                    <div class="file-table-item-info-icon">
                        <img :src="pdfIcon" />
                    </div>
                    <div class="file-table-item-info-name">{{ item.fileName }}.{{ docTypeNameMap[item.fileTypeId] ||
                        docTypeNameMap[item.typeId] }}</div>
                </div>
                <div class="switch-temperature-status" v-if="type == 1">
                    <div class="switch-temperature d-flex align-items-center">
                        <template v-if="writeTagMap[item.id]?.[0]">
                            <span>{{ writeTagMap[item.id]?.[0]?.name }}</span>
                            <template
                                v-if="Array.isArray(tagMap?.[writeTagMap[item?.id]?.[0]?.tagModelId]) && tagMap?.[writeTagMap[item?.id]?.[0]?.tagModelId].length">
                                <el-select class="w-100 m-r-10" v-model="item._tagId" :placeholder="t('fileTable.pleaseSelect')"
                                    @change="switchChange">
                                    <el-option v-for="child of tagMap?.[writeTagMap[item?.id]?.[0]?.tagModelId]"
                                        :key="child.id" :value="child.id" :label="child.name"></el-option>
                                </el-select>
                            </template>
                            <template v-else>
                                <el-input class="w-100 m-r-10" :placeholder="t('fileTable.pleaseInput')" v-model="item._tagId"></el-input>
                            </template>
                            <span>{{ writeTagMap[item.id]?.[0]?.unit }}</span>
                            <el-button class="m-r-20" type="primary"
                                @click="writeFunc(item.id, item._tagId)">{{ t('fileTable.execute') }}</el-button>
                        </template>
                        <template v-if="readTagMap[item.id]?.[0]">
                            <span>{{ readTagMap[item.id]?.[0]?.name }}</span>
                            <span>
                                {{
                                    readTagMap[item.id]?.[0]?.thresholdMap?.[tagRealTimeMap?.[readTagMap[item.id]?.[0]?.id]?.value]
                                    ||
                                    tagRealTimeMap?.[readTagMap[item.id]?.[0]?.id]?.value ||
                                    readTagMap[item.id]?.[0]?.thresholdMap[readTagMap[item.id]?.[0]?.defaultValue] ||
                                    readTagMap[item.id]?.[0]?.currentValueName ||
                                    readTagMap[item.id]?.[0]?.defaultValue
                                }}
                            </span>
                            <span>{{ readTagMap[item.id]?.[0]?.unit }}</span>
                        </template>
                    </div>
                    <div class="status d-flex align-items-center">
                        <span class="m-r-10">{{ t('fileTable.status') }}</span>
                        <div class="status-icon" v-if="deviceStatusRealTimeMap?.[item?.id]?._status">
                          <img :src="getDeviceUrlByStatus(item?.smallClassId, deviceStatusRealTimeMap?.[item?.id]?._status)" alt="">
                        </div>
                        <div class="status-icon" v-else>
                            <img :src="iconMap[item?.smallClassId]?.offlineIcon == defaultImgKey.defaultOfflineIcon ? defaultImg.defaultOfflineIcon : iconMap[item?.smallClassId]?.offlineIcon"
                                alt="">
                        </div>
                    </div>
                </div>
                <div class="switch-temperature-status" v-if="type == 2">
                    <div class="switch-temperature d-flex align-items-center">
                        {{ tagIdsMap[item.tagId] }}：{{ tagRealTimeMap?.[item.tagId]?.value || -1 }}{{ unit }}
                    </div>
                    <div class="status d-flex align-items-center">
                        <span class="m-r-10">{{ t('fileTable.status') }}</span>
                        <div class="status-icon" v-if="deviceStatusRealTimeMap?.[item?.id]?._status">
                          <img :src="getDeviceUrlByStatus(item?.smallClassId, item?.status)" alt="">
                        </div>
                        <div class="status-icon" v-else>
                            <img :src="iconMap[item?.smallClassId]?.offlineIcon == defaultImgKey.defaultOfflineIcon ? defaultImg.defaultOfflineIcon : iconMap[item?.smallClassId]?.offlineIcon"
                                alt="">
                        </div>
                    </div>
                </div>
                <div class="file-table-item-operate d-flex align-items-center justify-content-between">
                    <div class="m-l-20" v-if="type == 1" @click="deviceDetail(item)">{{ t('fileTable.view') }}</div>
                    <div v-else></div>
                    <slot :scope="item"></slot>
                </div>
            </div>
        </div>
    </el-scrollbar>
</template>
<script setup lang="ts">
import pdfIcon from '../../images/pdf-icon.svg';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { defaultImg, defaultImgKey } from '@static/js/common/defaultImg';
import defaultRunIcon from "@static/images/defaultRunIcon.gif";
import defaultStopIcon from "@static/images/defaultStopIcon.gif";
import defaultAlarmIcon from "@static/images/defaultAlarmIcon.gif";
import defaultFaultIcon from "@static/images/defaultFaultIcon.gif";
import defaultOfflineIcon from "@static/images/defaultOfflineIcon.gif";

const { t } = useI18n();
const props = defineProps<{
    list: any[],
    brandNameMap?: any,
    modelNameMap?: any,
    docTypeNameMap?: any,
    type?: number //0 文件 1设备实时 2能源设备实时
    titleKey?: string;
    height?: string;
    writeTagMap?: any;
    readTagMap?: any;
    tagMap?: any;
    tagIdsMap?: any;
    iconMap?: any;
    deviceStatusRealTimeMap?: any;
    tagRealTimeMap?: any;
    unit?: any;
}>();
const emits = defineEmits(['deviceDetail', 'writeFunc'])
const switchValue = ref();
const switchOptions = ref([]);
const switchChange = () => {
    console.log('查看状态', switchValue.value);
}
const writeFunc = (id:any, value:any) => emits('writeFunc', { id, value });
const deviceDetail = (e: any) => {
    emits('deviceDetail', e);
}
const getDeviceUrlByStatus = (smallClassId:any,status: number) => {
  const runIcon = defaultImg.defaultRunIcon,
      alarmIcon = defaultImg.defaultAlarmIcon,
      faultIcon = defaultImg.defaultFaultIcon,
      offlineIcon = defaultImg.defaultOfflineIcon,
      stopIcon = defaultImg.defaultStopIcon;
  const result = {
    url: runIcon === "defaultRunIcon" ? defaultRunIcon : runIcon,
  };
  //0位（1运行0停止）1位（1报警0无报警）2位（1故障0无故障）3位（0离线1在线）
  if ((status & 1) == 0) {
    result.url = stopIcon === "defaultStopIcon" ? defaultStopIcon : stopIcon;
  }
  if ((status & 2) == 2) {
    result.url = alarmIcon === "defaultAlarmIcon" ? defaultAlarmIcon : alarmIcon;
  }
  if ((status & 4) == 4) {
    result.url = faultIcon === "defaultFaultIcon" ? defaultFaultIcon : faultIcon;
  }
  if ((status & 8) != 8) {
    result.url = offlineIcon === "defaultOfflineIcon" ? defaultOfflineIcon : offlineIcon;
  }
  return result.url;
};
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;

.file-table-con {
    width: 100%;
    height: 100%;
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;

    .file-table-item {
        width: 32%;
        height: zrem(210);
        background: var(--el-fill-color-light);
        margin: 0 zrem(6);
        margin-bottom: zrem(12);
        box-shadow: var(--el-box-shadow-light);
        border-radius: zrem(8);
        .file-table-item-title {
            margin-left: zrem(20);
            margin-top: zrem(20);
            position: relative;
            width: calc(100% - zrem(40));
            height: zrem(24);
            font-size: zrem(16);
            line-height: zrem(24);
            margin-bottom: zrem(30);

            .file-table-item-title-back {
                position: absolute;
                left: 0;
                bottom: zrem(-2);
                width: zrem(78);
                height: zrem(10);
                background: linear-gradient(270deg, rgba(2, 113, 227, 0) 0%, #0271E3 100%);
            }

            .file-table-item-title-content {
                position: relative;
                z-index: 2;
                color: var(--el-text-color-regular);
            }
        }

        .file-table-item-brand-model {
            width: 100%;
            box-sizing: border-box;
            padding: 0 zrem(20);
            margin-bottom: zrem(20);
            height: zrem(20);

            .file-table-item-brand {
                .file-table-item-brand-word {
                    width: zrem(40);
                    color: var(--el-text-color-primary);
                }

                .file-table-item-brand-content {
                    color: var(--el-text-color-primary);
                    width: zrem(100);
                }
            }
        }

        .file-table-item-info {
            .file-table-item-info-word {
                margin-left: zrem(20);
                margin-right: zrem(26);
                color: var(--el-text-color-primary);
            }

            .file-table-item-info-icon {
                width: zrem(30);
                height: zrem(30);
                margin-right: zrem(10);

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .file-table-item-info-name {
                color: var(--el-text-color-regular);
            }
        }

        .switch-temperature-status {
            width: 100%;
            box-sizing: border-box;
            padding-left: zrem(20);

            .switch-temperature {
                margin-bottom: zrem(10);
                height: zrem(32);

                span {
                    margin-right: zrem(10);
                }
            }

            .status {
                .status-icon {
                    width: zrem(20);
                    height: zrem(20);

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }

        .file-table-item-operate {
            margin-top: zrem(20);
            height: zrem(40);
            width: 100%;
            box-sizing: border-box;
            padding-right: zrem(20);
            border-top: zrem(1) solid var(--el-border-color);
        }
    }

    .h-170 {
        height: zrem(170);
    }
}
</style>
