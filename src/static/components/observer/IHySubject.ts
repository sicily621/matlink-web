
import IHyTopic from "./IHyTopic";
import { IHyObserver } from "./IHyObserver";
export interface IHySubject<T extends IHyTopic, K extends Object> {
  // 添加观察者
  attach(observer: IHyObserver<T, K>): void;

  // 移除观察者
  detach(observer: IHyObserver<T, K>): void;

  // detach(topic : T) : void;

  // detach(key : string) : void;

  // 获取主题
  getTopic(): T;

  // 通知所有观察者，并传递数据
  notify(data: K): void;
}