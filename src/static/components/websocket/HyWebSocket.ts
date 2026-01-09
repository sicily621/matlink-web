import IHySubscribeTopic from "@static/components/observer/IHySubscribeTopic";
import { ref } from "vue"

export default class HyWebsocket {

    private static instance: HyWebsocket | null = null;
    private static isConnected = ref<boolean>(false);
    private url: string;
    private socket: WebSocket;
    private stompClient;
    private headers: { Authorization: string; type: string, param: string } = { Authorization: '', type: '', param: "" };

    private constructor(url?: string) {
        this.url = url || '/api/service/center/event/center/websocket';
        this.headers.Authorization = window.$HyGlobal?.getToken();
        this.socket = new SockJS(this.url, null, { transports: ["eventsource"] });
        this.stompClient = Stomp.over(this.socket);
    }

    public static getInstance(url?: string): HyWebsocket {
        if (!HyWebsocket.instance) {
            HyWebsocket.instance = new HyWebsocket(url);
            HyWebsocket.instance.connect();
        }
        return HyWebsocket.instance;
    }

    public static getConnectStatus() {
        return HyWebsocket.isConnected;
    }

    destructor(callbackHandler: () => any): void {
        // 在析构函数中执行资源清理操作
        this.disconnect(callbackHandler);
        HyWebsocket.instance = null;
    }

    public connect(callbackHandler?: () => any): void {
        if (this.headers.Authorization === '') return;
        const callback = () => {
            HyWebsocket.isConnected.value = true;
            if (callbackHandler) callbackHandler();
        }
        this.stompClient.connect(this.headers, callback);
        window.addEventListener('beforeunload', () => {
            HyWebsocket.instance?.disconnect(() => {
                HyWebsocket.isConnected.value = false;
            })
        });
    }

    public setToken(token: string) {
        this.headers.Authorization = token;
    }

    public reconnect() {
        HyWebsocket.instance = new HyWebsocket();
        HyWebsocket.instance.connect();
    }

    public subscribe(topic: IHySubscribeTopic) {
        if (!topic || !this.headers.Authorization) return;
        const header = Object.assign({}, this.headers, {
            param: JSON.stringify(topic.getParam()),
            type: topic.getType().getName()
        })
        console.log('查看stompClient:', this.stompClient);
        this.stompClient.subscribe(topic.getTopic(), topic.getCallback(), header);
    }

    public unsubscribe(topic: string) {
        if (!topic || !this.headers.Authorization) return;
        const header = Object.assign({}, this.headers, {
            type: /([A-Z]([a-z]|[A-Z])*)/.exec(topic)?.[0] ?? ""
        })
        this.stompClient.unsubscribe(topic, header);
    }

    public sendMessage(topic: string, token: string, message?: string, callbackHandler?: Function) {
        if (!topic || !token) return;
        this.headers.Authorization = token;
        const ret: object = this.stompClient.send(topic, this.headers, message)
        if (callbackHandler) {
            callbackHandler(topic, this.headers, ret);
        }
    }

    public disconnect(callbackHandler: () => any) {
        if (!this.headers.Authorization) return;
        this.stompClient.disconnect(callbackHandler, this.headers);
    }
}