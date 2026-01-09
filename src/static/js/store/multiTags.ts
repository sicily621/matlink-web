import { store } from "./index";
import { defineStore } from 'pinia';
import { getTabs, setTabs, getTabsMap, setTabsMap } from '../router/routes';
const useMultiTagsStore = defineStore('multiTags', {
  state: () => ({
    multiTagsMap: getTabsMap(),
    multiTags: getTabs()
  }),
  getters: {
    getMultiTags:(state) => state.multiTags
  },
  actions: {
    tagsCache(multiTags: any) {
      setTabs(multiTags)
    },
    tagsMapCache(multiTagsMap: any) {
      setTabsMap(multiTagsMap);
    },
    handleTags(mode: any, value: any, position?: any, currentGroupId?: string) {
      const groupId = currentGroupId || 'init';
      if (!this.multiTagsMap[groupId]) this.multiTagsMap[groupId] = [];
        switch (mode) {
            case "push":
              {
                const tagVal = value;
                const tagPath = tagVal.path;
                // 判断tag是否已存在
                // const tagHasExits = this.multiTags.some((tag: any) => {
                //   return tag.path === tagPath;
                // });
                // console.log('查看tagHasExits：', tagHasExits);
                const tagHas = this.multiTagsMap[groupId].some((tag: any) => {
                  return tag.id === tagVal.id;
                })
                console.log('查看tagHas：', tagHas);
                // if (tagHasExits) return;
                if (tagHas) return;
                this.multiTags.push(value);
                this.multiTagsMap[groupId].push(value);
                for (let key in this.multiTagsMap) {
                  if (key !== groupId) {
                    this.multiTagsMap[key] = [];
                  }
                }
                this.tagsCache(this.multiTags);
                this.tagsMapCache(this.multiTagsMap);
              }
              break;
            case "splice":
              if (!position) {
                const index = this.multiTags.findIndex((v: any) => v.path === value);
                const index2 = this.multiTagsMap[groupId].findIndex((v: any) => v.path === value);
                if (index === -1) return;
                this.multiTags.splice(index, 1);
                this.multiTagsMap[groupId].splice(index2, 1);
              } else {
                this.multiTags.splice(position?.startIndex, position?.length);
                this.multiTagsMap[groupId].splice(position?.startIndex, position?.length);
              }
              this.tagsCache(this.multiTags);
              this.tagsMapCache(this.multiTagsMap);
              return this.multiTags;
            case "slice":
              this.multiTagsMap[groupId].slice(-1);
              return this.multiTags.slice(-1);
          }
    }
  }
});
export function useMultiTagsStoreHook() {
    return useMultiTagsStore(store);
}