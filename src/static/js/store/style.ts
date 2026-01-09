import { defineStore } from 'pinia';
const useStyleStore = defineStore('style', {
  state: (): any => ({
    menuWidth: 220
  }),
  getters: {
    getMenuWidth: (state) => state.menuWidth,
  },
  actions: {
    setMenuWidth(width: any) {
      this.menuWidth = width;
    }
  }
});
export default useStyleStore;