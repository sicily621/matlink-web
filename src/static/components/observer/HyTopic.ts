
import { IHySubscribeHeader, SUBSCRIBE_TYPE } from "@static/components/websocket/HySubscribeHeader"
import IHyTopic from "@static/components/observer/IHyTopic"
import HyEnumEventType from "@static/components/observer/HyEnumEventType"
import HyEnumDataType from "@static/components/observer/HyEnumDataType"
export default class HyTopic implements IHyTopic {

    public topic: string;

    constructor(public type: HyEnumEventType | HyEnumDataType, public datatype: SUBSCRIBE_TYPE, public param: IHySubscribeHeader, public async: boolean = false) {
        const dataType = this.datatype === SUBSCRIBE_TYPE.DATA ? "data" : "event"
        if (!async) {
            this.topic = this.type.getName();
        } else {
            this.topic = `/topic/${dataType}/${this.type.getName()}?timestamp=${new Date().getTime()}`;
        }
    }

    getKey(): string {
        return this.topic;
    }
    getParam(): IHySubscribeHeader {
        return this.param;
    }
    getType(): HyEnumEventType | HyEnumDataType {
        return this.type;
    }
}