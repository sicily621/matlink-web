import axios from 'axios';
import CryptoJS from 'crypto-js';


class JSPlugin {
  constructor(param: { szId: string; szBasePath: string }) {
  }
}

export class HaikangVideo {
  public url: string;
  public szId: string;
  private myPlugin: any;
  public curIndex: number = 0;
  constructor(szId: string, url: string) {
    this.szId = szId;
    this.url = url;
  }

  //初始化
  init() {
    this.myPlugin = new JSPlugin({
      szId: this.szId, //需要英文字母开头 必填
      szBasePath: '/haikang', // 必填,引用H5player.min.js的js相对路径

      // 当容器div#play_window有固定宽高时，可不传iWidth和iHeight，窗口大小将自适应容器宽高
      // iWidth: 600,
      // iHeight: 400,

      // 分屏播放，默认最大分屏4*4
      // iMaxSplit: 4,
      // iCurrentSplit: 1,

      // 样式
      // oStyle: {
      //   border: "#343434",
      //   borderSelect: "#FFCC00",
      //   background: "#000"
      // }
    })
  }

  //播放
  play() {
    this.myPlugin.JS_Play(
      this.url,
      {
        playURL: this.url, // 流媒体播放时必传
        mode: 0, // 解码类型：0=普通模式; 1=高级模式 默认为0
        // 设置直连时的认证参数等
        // ...
      },
      this.curIndex, //当前窗口下标
    ).then(
      () => {
        console.info('JS_Play success');
        // do you want...
      },
      (err: any) => {
        console.info('JS_Play failed:', err);
        // do you want...
      }
    );
  }
  //停止选中
  stop() {
    this.myPlugin.JS_Stop(this.curIndex).then(
      () => {
        console.info('JS_Stop success');
        // do you want...
      },
      (err: any) => {
        console.info('JS_Stop failed:', err);
        // do you want...
      }
    );
  }
  //停止所有
  stopAll() {
    this.myPlugin.JS_StopRealPlayAll().then(
      () => {
        console.info('JS_StopRealPlayAll success');
        // do you want...
      },
      (err: any) => {
        console.info('JS_StopRealPlayAll failed', err);
        // do you want...
      }
    );
  }

  capturePicture() {
    let fileName = 'img';
    let fileType = 'JPEG';
    //下载到本地
    this.myPlugin.JS_CapturePicture(this.curIndex, fileName, fileType).then(
      () => {
        console.info('JS_CapturePicture success');
        // do you want...
      },
      (err: any) => {
        console.info('JS_CapturePicture failed', err);
        // do you want...
      }
    );
  }

  //回放
  //回放开始结束时间，格式类型：2021-06-29T00:00:00Z
  playback(startTime: string, endTime: string) {
    this.myPlugin.JS_Play(
      this.url,
      {
        playURL: this.url, // 流媒体播放时必传
        mode: 0, // 解码类型：0=普通模式; 1=高级模式 默认为0
        // 设置直连时的认证参数等
        // ...
      },
      this.curIndex, //当前窗口下标

      // 回放参数
      startTime,
      endTime,
    ).then(
      () => {
        console.info('JS_Play success');
        // do you want...
      },
      (err: any) => {
        console.info('JS_Play failed:', err);
        // do you want...
      }
    );
  }
  //暂停回放
  pause() {
    this.myPlugin.JS_Pause(this.curIndex).then(
      () => {
        console.info('JS_Pause success');
        // do you want...
      },
      (err: any) => {
        console.info('JS_Pause failed', err);
        // do you want...
      }
    );
  }
  //恢复回放
  resume() {
    this.myPlugin.JS_Resume(this.curIndex).then(
      () => {
        console.info('JS_Resume success');
        // do you want...
      },
      (err: any) => {
        console.info('JS_Resume failed', err);
        // do you want...
      }
    );
  }
  //回放定位
  seek(zStartDate: string, szEndDate: string) {
    this.myPlugin.JS_Seek(this.curIndex, zStartDate, szEndDate).then(
      () => {
        console.info('JS_Seek success');
        // do you want...
      },
      (err: any) => {
        console.info('JS_Seek failed', err);
        // do you want...
      }
    );
  }

  arrangeWindow(splitNum: number) {
    this.myPlugin.JS_ArrangeWindow(splitNum).then(
      () => {
        console.info('JS_ArrangeWindow success');
        // do you want...
      },
      (err: any) => {
        console.info('JS_ArrangeWindow failed', err);
        // do you want...
      }
    );
  }

};


function generateSignature(appSecret: string, method: string, path: string, params: any, appKey: string) {
  // 1. 将参数按字典序排序并拼接
  // const sortedParams = Object.keys(params)
  //   .sort()
  //   .map((key) => `${key}=${params[key]}`)
  //   .join('&');

  // 2. 拼接签名字符串（不包含 x-ca-timestamp）
  const stringToSign = `${method}\n` + // HTTP 方法
    `*/*\n` + // Accept
    `application/json\n` + // Content-Type
    `x-ca-key:${appKey}\n` + // Header: x-ca-key
    `${path}`; // 路径和排序后的参数
  // 3. 使用 HMAC-SHA256 加密并转换为 Base64
  const signature = CryptoJS.HmacSHA256(stringToSign, appSecret);
  return CryptoJS.enc.Base64.stringify(signature);
}

interface HttpParams {
  method: string;
  url: string;
  params: any;
  appKey: string;
  appSecret: string;
  cb: Function;
  err: Function;
}
// randomString(32)
export const haikangHttp = (obj: HttpParams) => {
  const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'x-ca-key': obj.appKey,
    'x-ca-signature-headers': 'x-ca-key',
    'x-ca-signature': '',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
  const hmac = generateSignature(obj.appSecret, 'POST', obj.url.replace('/haikang', '/artemis/api'), obj.params, obj.appKey);
  headers['x-ca-signature'] = hmac;
  let http = null;
  if (obj.method == 'POST') http = axios.post(obj.url, obj.params, { headers });
  if (!http) return;
  http.then((res: any) => {
    console.log('查看返回数据：', res);
    if (obj.cb) obj.cb(res.data);
  }).catch((err: any) => {
    if (obj.err) obj.err(err);
  })

}



