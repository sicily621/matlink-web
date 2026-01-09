import { defineStore } from 'pinia';

const useKeepLiveStore = defineStore('keepLive', {
  state: () => ({
    exclude: []
  }),
  getters: {
    getExclude: (state) => state.exclude
  },
  actions: {
    setExclude(exclude: any) {
      this.exclude = exclude;
    }
  }
});
export default useKeepLiveStore;