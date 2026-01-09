
import { io } from 'socket.io-client';

export enum SocketUrl {
  main = 'ws://192.168.0.114:3000'
};

interface SocketParams {
  path?: string; //后端传值或和后端规定好
  token?: string; //后端传值或和后端规定好
  query?: any;
  reconnectionDelayMax?: number;
}

export class Socket {
  public socket; //存放io
  public readonly host; //域名
  public params;

  constructor(host:string, route: string = '/', params: SocketParams = {}) {
    this.host = host;
    this.params = params;
    this.socket = io(host + route, {
      transports: ["websocket", "polling"], //优先使用websocket 其次是长轮询
      reconnectionDelayMax: params.reconnectionDelayMax || 10000,  //连接失败重连次数默认为一万次
      query: params.query,
      auth: {
        token: params.token
      },
      path: params.path
    })
  }

  on(key: string, cb: (...v: any[]) => void) {
    this.socket.on(key, cb);
  }

  emit(key: string, ...values: any[]) {
    this.socket.emit(key, ...values);
  }
}
/**
 * 创建多个不同频道的socket
 * @param host
 * @param routes 
 * @param params 
 * @returns 
 */
export const createSocket = (host: string, routes: Set<string>, params?: SocketParams): {[propname: string]: Socket} => {
  let socketObj: {[propname: string]: Socket} = {};
  for (let route of routes.keys()) {
    socketObj[route] = new Socket(host, route, params || {});
  }
  return socketObj;
}


