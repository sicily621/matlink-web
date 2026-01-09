import { defineStore } from 'pinia';
interface notice {
    badgeNumList: number[]
}
const useFooterStore = defineStore('notice', {
    state: (): notice => ({
        badgeNumList: []
    }),
    getters: {
        getBadgeNumList: (state) => state.badgeNumList,
        getBadgeNum: (state) => {
            return (index: number) => state.badgeNumList?.[index] ?? 0;
        },
        getBadgeSum: (state) => state.badgeNumList.reduce((total, cur) => total + cur, 0)
    },
    actions: {
        setBadgeNumList(value: number[]) {
            this.badgeNumList = value;
        },
        setBadgeNum(index: number, value: number) {
            this.badgeNumList[index] = value;
        }
    }
});
export default useFooterStore;