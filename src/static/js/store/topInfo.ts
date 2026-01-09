import { defineStore } from 'pinia';
const useTopInfoStore = defineStore('topInfo', {
    state: () => ({
        timer: 0,
    }),
    getters: {
        getTimer: (state) => state.timer,

    },
    actions: {
        setTimer(uuid: any) {
            this.timer = uuid;
        },

    }
});
export default useTopInfoStore;