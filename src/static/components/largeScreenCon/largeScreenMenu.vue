<template>
    <div class="menu-children-list">
        <div 
            class="menu-children-item" 
            v-for="child of children" >
            <template v-if="Array.isArray(child.children) && child.children.length">
                <div class="menu-children-menu-children">
                    <div class="menu-children-menu">
                        <div 
                            class="menu-children-item-arrow"
                            v-if="Array.isArray(child.children) && child.children.length"
                            :class="{
                                'menu-children-item-arrow-open': (child.menuId || child.id) == menu.parentId || (child.menuId || child.id) == menu.id
                            }"
                        >
                            <img :src="largeScreenMenuChildrenItemArrow" />
                        </div>
                        <div 
                            class="menu-children-item-content" 
                            :class="{
                                'menu-children-active-item-content ': (child.menuId || child.id) == (menu.menuId || menu.id)
                            }"
                            :style="{
                                'paddingLeft': level * 10 + 'px'
                            }"
                            @click.stop="targetMenu(child)"
                        >
                            <div class="menu-children-item-word">{{ child.cnName }}</div>
                        </div>
                    </div>
                    <div 
                        class="menu-children-children" 
                        :class="{'menu-children-children-show': (pids.includes(menu.parentId) || pids.includes(child.menuId || child.id))}"
                    >
                        <largeScreenMenu :children="child.children" :level="level + 1" :pids="pids.concat(child.children.map((res: any) => (res.menuId || res.id)))" />
                    </div>
                </div>
            </template>
            <template v-else>
                <div 
                    class="menu-children-item-content"
                    :class="{
                        'menu-children-active-item-content': (child.menuId || child.id) == (menu.menuId || menu.id)
                    }"
                    :style="{
                        'paddingLeft': level * 10 + 'px'
                    }"
                    @click="targetMenu(child)"
                >
                    <div class="menu-children-item-word">{{ child.cnName }}</div>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import useMenuStore from "@static/js/store/menu";
import largeScreenMenuChildrenItemArrow from '@static/images/largeScreen/large-screen-menu-children-item-arrow.svg';
const props = defineProps<{
   children: any[];
   level: number;
   pids: any[];
}>();
console.log('查看数据：', props.level, ':', props.pids);
defineOptions({
  name: "largeScreenMenu"
});
const menuStore = useMenuStore();
const router = useRouter();
const menu = computed<any>(() => {
    return menuStore.getMenu;
})
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
        mid: (obj.menuId || obj.id),
    };
    console.log('查看obj:', obj);
    router.push({
        path: `/largeScreenCon`,
        query: queryObj,
    });
}
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
@use "@static/css/theme/update-element.scss" as *;
.menu-children-list {
    width: 100%;
    // height: zrem(200);
    box-sizing: border-box;
    padding: zrem(8) zrem(8) zrem(4) zrem(8);
    .menu-children-item {
        display: flex;
        align-items: center;
        // height: zrem(30);
        min-height: zrem(30);
        margin-bottom: zrem(4);
        .menu-children-item-arrow {
            width: zrem(20);
            height: zrem(20);
            margin-right: zrem(4);
            transform: rotate(-90deg);
            transition: .4s;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .menu-children-item-arrow-open {
            transform: rotate(0deg);
        }
        .menu-children-item-content {
            flex: 1;
            height: zrem(30);
            border-radius: zrem(4) 0px 0px zrem(4);
            box-sizing: border-box;
            .menu-children-item-word {
                height: zrem(30);
                line-height: zrem(30);
                box-sizing: border-box;
                width: 100%;
                padding-left: zrem(4);
                color: #FFF;
            }
        }

        .menu-children-active-item-content {
            background: linear-gradient( 270deg, rgba(230,138,29,0) 0%, rgba(247,147,29,0.39) 100%);
            .menu-children-item-word {
                background: linear-gradient(to bottom, #FFFFFF 0%, #FFE282 50%, #F89C2C 100%);
                background-clip: text;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .menu-children-menu-children {
            width: 100%;
            min-height: zrem(30);
            .menu-children-menu {
                display: flex;
                align-items: center;
            }
            .menu-children-children {
                box-sizing: border;
                width: calc(100% - zrem(16));
                padding-left: zrem(16);
                display: none;
            }
            .menu-children-children-show {
                display: block;
            }
        }
    }
}
      
</style>