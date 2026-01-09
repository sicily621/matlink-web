import { RouteTransitionV, getRouteTransition } from '../router/transition';
import { defineStore } from 'pinia';
const useRouteTransitionStore = defineStore('routeTransition', {
  state: () => ({
    routeTransitionV: getRouteTransition('routeTransition')
  }),
  getters: {
    getRouteTransition(state) {
      return state.routeTransitionV
    }
  },
  actions: {
   setRouteTransition(routeTransitionV: RouteTransitionV) {
    this.routeTransitionV = routeTransitionV;
   }
  }
});
export default useRouteTransitionStore;