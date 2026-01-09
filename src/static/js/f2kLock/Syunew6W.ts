declare const MozWebSocket: any;

interface WebSocketMessage {
    type: string;
    order: number;
    LastError: number;
    return_value?: any;
    data?: any;
}

interface Command {
    FunName: string;
    [key: string]: any;
}

export default class SoftKey6W {
    static Socket_UK: any;
    static url: string;
    static LastError: number = 0;
    static bConnect: number = 0;

    constructor() {
        this.initializeWebSocket();
    }

    private initializeWebSocket(): void {
        const isIE11 = navigator.userAgent.indexOf("Trident") > -1 && navigator.userAgent.indexOf("rv:11.0") > -1;
        const isEDGE = navigator.userAgent.indexOf("Edge") > -1;
        const u = document.URL;

        if (u.substring(0, 5) === "https") {
            if (isIE11 || isEDGE) {
                SoftKey6W.url = isIE11 ? "wss://127.0.0.1:4007/xxx" : "ws://127.0.0.1:4007/xxx";
            } else {
                SoftKey6W.url = "ws://localhost:4007/xxx";
            }
        } else {
            SoftKey6W.url = "ws://127.0.0.1:4007/xxx";
        }

        SoftKey6W.Socket_UK = typeof MozWebSocket !== "undefined"
            ? new MozWebSocket(SoftKey6W.url, "usbkey-protocol")
            : new WebSocket(SoftKey6W.url, "usbkey-protocol");

        SoftKey6W.Socket_UK.onerror = this.handleWebSocketError.bind(this);
        SoftKey6W.LastError = 0;
    }

    private handleWebSocketError(): void {
        const userAgent = navigator.userAgent.toLowerCase();
        let downloadUrl: string | null = null;
        if (userAgent.includes("win"))
            downloadUrl = "/static/zip/windows.zip";
        else if (userAgent.includes("mac"))
            downloadUrl = "/static/zip/mac.zip";
        else if (userAgent.includes("linux"))
            downloadUrl = "/static/zip/linux.zip";
        else
            console.log("其他系统");
        if (downloadUrl) {
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "lockFile.zip";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        alert("未能连接服务程序，请确定服务程序是否安装。");
    }

    private createWebSocket(): any {
        return typeof MozWebSocket !== "undefined"
            ? new MozWebSocket(SoftKey6W.url, "usbkey-protocol")
            : new WebSocket(SoftKey6W.url, "usbkey-protocol");
    }

    private async sendCmdAndWait(
        IsReturnErr: boolean,
        fun: (UK: any, ...args: any[]) => void,
        ...params: any[]
    ): Promise<any> {
        const UK = this.createWebSocket();
        return new Promise((resolve) => {
            UK.onopen = () => SoftKey6W.ResetOrder(UK);
            UK.onmessage = (Msg: MessageEvent) => {
                const UK_Data: WebSocketMessage = JSON.parse(Msg.data);
                let returnValue;
                if (UK_Data.type !== "Process")
                    return;
                switch (UK_Data.order) {
                    case 0:
                        fun(UK, ...params);
                        break;
                    case 1:
                        SoftKey6W.LastError = UK_Data.LastError;
                        returnValue = UK_Data.return_value;
                        if (SoftKey6W.LastError !== 0 && IsReturnErr) {
                            returnValue = SoftKey6W.LastError;
                        }
                        UK.close();
                        resolve(returnValue);
                        break;
                }
            };

            UK.onclose = () => { };
            UK.onerror = this.handleWebSocketError.bind(this);
        }).catch((e: Error) => {
            alert(`${e.name}: ${e.message}`);
            return false;
        });
    }

    private _FindPort = (UK: any, start: number) => {
        let msg = {
            FunName: "FindPort",
            start: start,
        };
        UK.send(JSON.stringify(msg));
    };

    private _GetID_1 = (UK: any, Path: string) => {
        let msg = {
            FunName: "GetID_1",
            Path: Path,
        };
        UK.send(JSON.stringify(msg));
    };

    private _YReadString = (UK: any, Address: number, len: number, HKey: string, LKey: string, Path: string) => {
        let msg = {
            FunName: "YReadString",
            Address: Address,
            len: len,
            HKey: HKey,
            LKey: LKey,
            Path: Path,
        };
        UK.send(JSON.stringify(msg));
    };

    private _YWriteString = (UK: any, InString: string, Address: number, HKey: string, LKey: string, Path: string) => {
        let msg = {
            FunName: "YWriteString",
            InString: InString,
            Address: Address,
            HKey: HKey,
            LKey: LKey,
            Path: Path,
        };
        UK.send(JSON.stringify(msg));
    };

    private _SetWritePassword = (UK: any, W_Hkey: string, W_Lkey: string, new_Hkey: string, new_Lkey: string, Path: string) => {
        let msg = {
            FunName: "SetWritePassword",
            W_Hkey: W_Hkey,
            W_Lkey: W_Lkey,
            new_Hkey: new_Hkey,
            new_Lkey: new_Lkey,
            Path: Path,
        };
        UK.send(JSON.stringify(msg));
    };

    private _SetReadPassword = (UK: any, W_Hkey: string, W_Lkey: string, new_Hkey: string, new_Lkey: string, Path: string) => {
        let msg = {
            FunName: "SetReadPassword",
            W_Hkey: W_Hkey,
            W_Lkey: W_Lkey,
            new_Hkey: new_Hkey,
            new_Lkey: new_Lkey,
            Path: Path,
        };
        UK.send(JSON.stringify(msg));
    };

    private _ReSet = (UK: any, Path: string) => {
        let msg = {
            FunName: "ReSet",
            Path: Path,
        };
        UK.send(JSON.stringify(msg));
    };

    static _GetBuf = (UK: any, pos: number) => {
        let msg = {
            FunName: "GetBuf",
            pos: pos,
        };
        UK.send(JSON.stringify(msg));
    };

    static ResetOrder = (UK: any) => {
        let msg = {
            FunName: "ResetOrder",
        };
        UK.send(JSON.stringify(msg));
    };

    public GetLastError = () => {
        return SoftKey6W.LastError;
    };

    public FindPort = (start: number): Promise<any> => {
        return this.sendCmdAndWait(false, this._FindPort, start);
    };

    public GetID = (KeyPath: string): Promise<any> => {
        return this.sendCmdAndWait(false, this._GetID_1, KeyPath);
    };

    public SetWritePassword = (W_HKey: string, W_LKey: string, new_HKey: string, new_LKey: string, KeyPath: string): Promise<any> => {
        return this.sendCmdAndWait(
            true,
            this._SetWritePassword,
            W_HKey,
            W_LKey,
            new_HKey,
            new_LKey,
            KeyPath
        );
    };

    public SetReadPassword = (W_HKey: string, W_LKey: string, new_HKey: string, new_LKey: string, KeyPath: string): Promise<any> => {
        return this.sendCmdAndWait(
            true,
            this._SetReadPassword,
            W_HKey,
            W_LKey,
            new_HKey,
            new_LKey,
            KeyPath
        );
    };

    public YWriteString = (InString: string, Address: number, HKey: string, LKey: string, KeyPath: string): Promise<any> => {
        return this.sendCmdAndWait(
            true,
            this._YWriteString,
            InString,
            Address,
            HKey,
            LKey,
            KeyPath
        );
    };

    public YReadString = (Address: number, nlen: number, HKey: string, LKey: string, KeyPath: string): Promise<any> => {
        return this.sendCmdAndWait(
            false,
            this._YReadString,
            Address,
            nlen,
            HKey,
            LKey,
            KeyPath
        );
    };

    public ReSet = (KeyPath: string): Promise<any> => {
        return this.sendCmdAndWait(true, this._ReSet, KeyPath);
    };

    public SimpleEncrypt = (num: number) => {
        // 加密过程: 对数字进行移位操作
        let encryptedNum = num + 5;
        // 转换成字符串，并确保字符串长度为4位
        let encryptedStr = encryptedNum.toString().padStart(4, "0");
        // 确保结果为4个字符
        if (encryptedStr.length > 4) {
            // 如果超过了4个字符，取最后4个字符
            encryptedStr = encryptedStr.slice(-4);
        }
        return encryptedStr;
    };

    public SimpleDecrypt = (str: string) => {
        // 确保输入字符串为4个字符
        if (str.length !== 4) {
            throw new Error("Encrypted string must be exactly 4 characters long.");
        }
        // 将加密后的字符串转换为数字
        let encryptedNum = parseInt(str, 10);
        // 解密过程: 对数字进行反向移位操作
        let decryptedNum = encryptedNum - 5;
        // 返回解密后的数字
        return decryptedNum;
    };
}
