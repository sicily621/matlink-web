
import IHyTopic from './IHyTopic'

export interface IHyObserver<T extends IHyTopic, K extends Object> {
    // 更新方法，当主题状态改变时，由发布者调用此方法并传递数据
    getUuid(): string;

    getTopic(): IHyTopic;

    update(topic: T, data: K): void;
}