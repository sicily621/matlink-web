<template>
 <el-scrollbar :height="'100%'">
    <div class="file-table-con">
        <div class="file-table-item" v-for="item of list" :class="{'h-170': !modelNameMap || !tagNameMap}">
            <div class="file-table-item-title">
                <div class="file-table-item-title-content">{{item.name}}</div>
                <div class="file-table-item-title-back"></div>
            </div>
            <div class="file-table-item-model-tag d-flex align-items-center justify-content-between" v-if="modelNameMap && tagNameMap">
                <div class="file-table-item-model d-flex align-items-center">
                    <div class="file-table-item-model-word">模型</div>
                    <div class="file-table-item-model-content">{{ item.alarmModelName || item.faultModelName}}</div>
                </div>
                <div class="file-table-item-model d-flex align-items-center">
                    <div class="file-table-item-model-word" v-if="item.alarmTagId">报警点</div>
                    <div class="file-table-item-model-word" v-if="item.faultTagId">故障点</div>

                    <div class="file-table-item-model-content">{{ tagNameMap[item.alarmTagId] || tagNameMap[item.faultTagId] || '-' }}</div>
                </div>
            </div>
            <div class="file-table-item-info d-flex align-items-center">
                <div class="file-table-item-info-word ">描述</div>
                <div class="file-table-item-model-word">{{ item.discription}}</div>
            </div>
            <div class="file-table-item-operate d-flex align-items-center justify-content-end">    
                <slot :scope="item"></slot>
            </div>
        </div>
    </div>
</el-scrollbar>
</template>
<script setup lang="ts">
defineProps<{
    list: any[],
    modelNameMap?: any, 
    tagNameMap?: any,
    docTypeNameMap: any
}>();
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
                background: linear-gradient( 270deg, rgba(2,113,227,0) 0%, #0271E3 100%);
            }
            .file-table-item-title-content {
                position: relative;
                z-index: 2;
                color: var(--el-text-color);
            }
        }
        .file-table-item-model-tag {
            width: 100%;
            box-sizing: border-box;
            padding: 0 zrem(20);
            margin-bottom: zrem(20);
            height: zrem(20);
            .file-table-item-model {
                .file-table-item-model-word {
                    width: zrem(45);
                    color: var(--el-text-color);
                }
                .file-table-item-model-content {
                    color: var(--el-text-color);
                    width: zrem(100);
                }
            }
        }
        .file-table-item-info {
            .file-table-item-info-word {
                margin-left: zrem(20);
                margin-right: zrem(26);
                color: var(--el-text-color);
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
                color: var(--el-text-color);
            }
        }
        .file-table-item-operate {
            margin-top: zrem(20);
            height: zrem(40);
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