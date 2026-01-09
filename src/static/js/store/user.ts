import { defineStore } from 'pinia';
import { HyGlobal } from '../../components/observer/HyGlobal';
const useUserStore = defineStore('user', {
  state: (): any => ({
    user: window.$HyGlobal.getUserInfo(),
  }),
  getters: {
    getUser: (state) => state.user,
  },
  actions: {
    setUser(user: any) {
      this.user = user;
    }
  }
});
export default useUserStore;