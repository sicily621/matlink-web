import { defineStore } from 'pinia';
import { Socket, SocketUrl, createSocket } from '../socket/socketio';
const useSocketStore = defineStore('socketio', {
  state: (): {
    [propname: string]: Socket
  } => createSocket(SocketUrl.main, new Set(['/', '/users'])),
  getters: {
    getSocket(state) { //获取主频道socket
      return state['/'];
    },
    getUserSocket(state) { //获取用户频道socket
      return state['/users'];
    },
    getKeySocket(state) { //获取对应key频道
      return (key: string) => { 
        return state[key];
      }
    }
  },
  actions: {
    mounteSocket(obj: {[k: string]: Socket}) { //socket挂载到pinia上
      for (let k in obj) this[k] = obj[k];
    }
  }
});
export default useSocketStore;