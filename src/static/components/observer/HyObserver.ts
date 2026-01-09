import IHyTopic from './IHyTopic';
import { IHyObserver } from "@static/components/observer/IHyObserver"
import { IHySubjectManager } from "@static/components/observer/IHySubjectManager";

export class HyObserver<T extends IHyTopic, K extends Object> implements IHyObserver<T, K> {
    private uuid: string;
    private topic: T;
    private deps: Set<HyObserver<IHyTopic, K>> = new Set();
    constructor(topic: T, private callback: Function | null = null) {
        this.uuid = `${new Date().getTime()}`;
        this.topic = topic;
    }

    // 获取观察者的唯一标识符  
    getUuid(): string {
        return this.uuid;
    }
    //获取主题 
    getTopic(): T {
        return this.topic;
    }

    // 当主题状态改变时，由发布者调用此方法并传递数据  
    update(topic: T, data: K) {
        this.callback && this.callback(data, topic);
    }
    destroy() {
        if (this.deps.size > 0) {
            this.deps.delete(this)
        }
    }
}
export function createObserver(topic: IHyTopic, callback: Function) {
    const subjectManager = IHySubjectManager.getInstance();
    const subject = subjectManager.getSubjectByTopicKey(topic.getKey())
    const observer = new HyObserver(topic, callback)
    subject && subject.attach(observer);
    return observer;
}