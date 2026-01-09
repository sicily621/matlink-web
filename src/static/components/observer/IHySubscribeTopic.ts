import { IHySubscribeHeader } from "../websocket/HySubscribeHeader"
import HyEnumEventType from "./HyEnumEventType"
import HyEnumDataType from "./HyEnumDataType"
import IHyTopic from "./IHyTopic";

export default interface IHySubscribeTopic extends IHyTopic {

    getTopic(): string;

    getParam(): IHySubscribeHeader;

    getType(): HyEnumEventType | HyEnumDataType;

    getCallback(): (message: any) => any;

}