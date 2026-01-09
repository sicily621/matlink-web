import { defineStore } from 'pinia';
import { ZcLocalesV, getLocale } from '../locales/index';
const useLocaleStore = defineStore('locale', {
  state: () => ({
    lang: getLocale(),
  }),
  getters: {
    getLang: (state) => state.lang,
  },
  actions: {
    setLang(lang: ZcLocalesV) {
      this.lang = lang;
    }
  }
});
export default useLocaleStore;