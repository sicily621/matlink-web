<template>
    <div v-if="props.list.length">
        <NoticeItem v-for="(item, index) in props.list" :noticeItem="item" :key="index" />
    </div>
    <el-empty v-else :description="t('notice.noData')" />
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { useI18n } from 'vue-i18n';
import { ListItem } from "./data";
import NoticeItem from "./noticeItem.vue";

const { t } = useI18n();

const props = defineProps({
    list: {
        type: Array as PropType<Array<ListItem>>,
        default: () => []
    }
});
</script>