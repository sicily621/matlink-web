import { randomString } from "../common/utils";
/**
 * 观察者模式
 */

//发布者
export class Publisher {

  public subscribers: {             //订阅者列表
    [propname: string]: Subscriber
  };
  public data: any;                 //数据
  public myData: any;

  constructor() {
    this.subscribers = {};
    this.data = {};
    this.myData = {};
  }
  /**
   * 增加订阅者
   * @param subscriber 
   */
  addSubscribers(subscriber: Subscriber) {
    this.data[subscriber.id] = null;
    this.subscribers[subscriber.id] = subscriber;
    subscriber.update(null, null, this.myData);
  }
  /**
   * 删除指定订阅者
   * @param subscriber 
   * @returns 
   */
  removeSubscribers(subscriber: Subscriber) {
    if (this.subscribers[subscriber.id]) {
      delete this.subscribers[subscriber.id]
      delete this.data[subscriber.id];
      return true;
    } else {
      return false;
    }
  }
  /**
   * 通知所有订阅者
   */
  notifySubscribers(id?: string) {
    for (let key in this.subscribers) {
      if (!id || key != id) this.subscribers[key].update(this.data[key], this.data, this.myData);
    }
  }
  /**
   * 更新数据
   */
  update(id: number, data: any) {
    this.data[id] = data;
  }

  /**
   * 更新菜单
   */
  updateMydata(myData: any) {
    this.myData = myData;
    this.notifySubscribers();
  }

}
/**
 * 发布者实例 给壳使用
 */
export const publisher = new Publisher();

//订阅者
export abstract class Subscriber {

  public id: number;        //订阅者id
  abstract data: any;         //订阅者需要的数据

  constructor(id: any) {
    this.id = id;
  }
  /**
   * 更新数据 执行订阅者逻辑函数
   * @param data 
   */
  abstract update(data: any, commonData: any, parentData: any): any

  notifyPublisher() {
    publisher.update(this.id, this.data);
  }

  notifyPublisherNotify() {
    publisher.notifySubscribers(String(this.id));
  }
}

export const createSubscriber = <T>(cb: (data: T, commonData?: any, parentData?: any) => void) => {
  const id = randomString(16);

  class CommonSubscriber extends Subscriber {
    data!: T;
    update(data: T, commonData: any, parentData: any) {
      this.data = data;
      cb(data, commonData, parentData);
    }
  }
  const commonSubscriber = new CommonSubscriber(id);
  publisher.addSubscribers(commonSubscriber);
  return commonSubscriber;
}