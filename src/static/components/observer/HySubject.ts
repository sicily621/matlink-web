import IHyTopic from '@static/components/observer/IHyTopic';
import { HyTopicManager } from "@static/components/observer/HyTopicManager";
import { IHySubject } from "@static/components/observer/IHySubject";
import { IHyObserver } from "@static/components/observer/IHyObserver"
import { IHySubjectManager } from "@static/components/observer/IHySubjectManager";
import HyEnumEventType from "@static/components/observer/HyEnumEventType";
import HyEnumDataType from "@static/components/observer/HyEnumDataType";
import { HySubscribeHeader, SUBSCRIBE_TYPE, HySubscribeParam } from "@static/components/websocket/HySubscribeHeader"
import HyTopic from "@static/components/observer/HyTopic"
export class HySubject<T extends IHyTopic, K extends Object> implements IHySubject<T, K> {
    private observers: Set<IHyObserver<T, K>> = new Set();
    private topic: T;

    constructor(topic: T) {
        this.topic = topic;
    }

    // 添加观察者  
    attach(observer: IHyObserver<T, K>): void {
        (observer as any).deps = this.observers;
        this.observers.add(observer)
    }

    // 移除观察者（根据观察者实例）  
    detach(value: IHyObserver<T, K>): void {
        const has = this.observers.has(value);
        if (has) {
            this.observers.delete(value);
        }
    }

    // 获取主题  
    getTopic(): T {
        return this.topic;
    }

    // 通知所有观察者，并传递数据  
    notify(data: K): void {
        this.observers.forEach(observer => {
            observer.update(this.topic, data);
        });
    }
}
export function createSubject(dataType: SUBSCRIBE_TYPE, type: HyEnumEventType | HyEnumDataType, param: HySubscribeParam, async: boolean = false) {
    const subjectManager = IHySubjectManager.getInstance()
    const subscribeHeader: HySubscribeHeader = new HySubscribeHeader(param);
    const completeHeader = subscribeHeader.getParam()
    const topic: IHyTopic = new HyTopic(type, dataType, completeHeader, async);
    const topicManager = HyTopicManager.getInstance()
    const subject = subjectManager.getSubjectByTopicKey(topic.getKey()) ?? new HySubject(topic)
    topicManager.add(topic)
    subject && subjectManager.addSubject(subject)
    return subject;
}