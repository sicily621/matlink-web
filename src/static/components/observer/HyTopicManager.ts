import HyWebsocket from "../websocket/HyWebSocket"
import IHySubscribeTopic from "./IHySubscribeTopic";
import IHyTopic from "./IHyTopic"
import { watch } from "vue"

export class HyTopicManager {

    private static instance: HyTopicManager | null = null;

    private topicMap: Map<string, IHyTopic | IHySubscribeTopic> = new Map();
    private pendingTopics: Set<IHyTopic | IHySubscribeTopic> = new Set();

    private constructor() {

    }

    public static getInstance(): HyTopicManager {
        if (!HyTopicManager.instance) {
            HyTopicManager.instance = new HyTopicManager();
            watch(HyWebsocket.getConnectStatus(), (connectStatus) => {
                if (connectStatus && HyTopicManager.instance) {
                    const pendingTopics = HyTopicManager.instance.pendingTopics;
                    pendingTopics.forEach((topic: IHyTopic | IHySubscribeTopic) => {
                        'getCallback' in topic && HyWebsocket.getInstance()?.subscribe(topic);
                    });
                    pendingTopics.clear()
                }

            })
        }
        return HyTopicManager.instance;
    }

    public add(topic: IHyTopic | IHySubscribeTopic) {
        const connectStatus = HyWebsocket.getConnectStatus()
        if (topic && !this.topicMap.has(topic.getKey())) {
            this.topicMap.set(topic.getKey(), topic);
            if (connectStatus.value && 'getCallback' in topic) {
                HyWebsocket.getInstance()?.subscribe(topic);
            } else {
                this.pendingTopics.add(topic)
            }
        }
    }

    public remove(key: string): void {
        const connectStatus = HyWebsocket.getConnectStatus()
        if (this.topicMap.has(key)) {
            this.topicMap.delete(key);
            if (connectStatus.value) {
                HyWebsocket.getInstance()?.unsubscribe(key);
            }
        }
    }
    public getAll(): Array<IHyTopic | IHySubscribeTopic> | undefined {
        return Array.from(this.topicMap.values());
    }

    public getByKey(key: string): IHyTopic | IHySubscribeTopic | undefined {
        return this.topicMap.get(key);
    }
}