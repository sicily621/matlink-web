
import { IHySubscribeHeader, SUBSCRIBE_TYPE } from "../websocket/HySubscribeHeader"
import IHySubscribeTopic from "./IHySubscribeTopic"
import HyEnumEventType from "./HyEnumEventType"
import HyEnumDataType from "./HyEnumDataType"
import HyTopic from "@static/components/observer/HyTopic"

export default class HySubscribeTopic extends HyTopic implements IHySubscribeTopic {
    constructor(public type: HyEnumEventType | HyEnumDataType, public datatype: SUBSCRIBE_TYPE, public param: IHySubscribeHeader, public callback: (message: any) => any) {
        super(type, datatype, param, true);
    }
    getTopic(): string {
        return super.getKey();
    }
    getCallback(): (message: any) => any {
        return this.callback;
    }
    getType(): HyEnumEventType | HyEnumDataType {
        return this.type;
    }
}