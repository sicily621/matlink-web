import { HyTopicManager } from "./HyTopicManager"
import HyEnumEventType from "./HyEnumEventType"
import HyEnumDataType from "./HyEnumDataType"
import { HySubscribeHeader, SUBSCRIBE_TYPE, HySubscribeParam } from "@static/components/websocket/HySubscribeHeader"
import HySubscribeTopic from "./HySubscribeTopic"
import IHySubscribeTopic from "./IHySubscribeTopic"
export default class HySubscribeUtil {

    public static createSubscriber(dataType: SUBSCRIBE_TYPE, type: HyEnumEventType | HyEnumDataType, param: HySubscribeParam, callback: (message: any) => any): string {
        const topicManager = HyTopicManager.getInstance();
        let key: string = "";
        const subscribeHeader: HySubscribeHeader = new HySubscribeHeader(param);
        const completeHeader = subscribeHeader.getParam()
        const topic: IHySubscribeTopic = new HySubscribeTopic(type, dataType, completeHeader, callback);
        key = topic.getTopic();
        topic && topicManager.add(topic)
        return key;
    }

    public static destroy(topicKey: string) {
        const topicManager = HyTopicManager.getInstance();
        topicManager.remove(topicKey)
    }
}