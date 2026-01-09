import loadMore from "./loadMore";
const directives: any = {
  loadMore
}
export default {
  install(Vue: any) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    })
  }
}