import { defineStore } from 'pinia';
interface FooterState {
    activeName: string;
    activeIndex: number;
    badgeNumList: number[];
}

const useFooterStore = defineStore<'footer', FooterState>('footer', {
    state: (): FooterState => ({
        activeName: "",
        activeIndex: -1,
        badgeNumList: []
    }),
    getters: {
        getActiveFooterName: (state) => state.activeName,
        getActiveFooterIndex: (state) => state.activeIndex,
        getBadgeNumList: (state) => state.badgeNumList,
        getBadgeNum: (state) => {
            return (index: number) => state.badgeNumList?.[index] ?? 0;
        }
    },
    actions: {
        setActiveFooterName(name: string) {
            this.activeName = name;
        },
        setActiveFooterIndex(index: number) {
            this.activeIndex = index;
        },
        setBadgeNumList(value: number[]) {
            this.badgeNumList = value;
        },
        setBadgeNum(index: number, value: number) {
            this.badgeNumList[index] = value;
        }
    }
});
export default useFooterStore;