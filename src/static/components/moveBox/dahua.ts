import { objToQuery } from '@static/js/common/utils';
import axios from 'axios';

interface HttpParams {
    method: string;
    url: string;
    params?: any;
    token?: string;
    cb: Function;
    err: Function;
}

export const dahuaHttp = (obj: HttpParams) => {
    const headers: any = {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
    let http = null;
    if (obj.token) headers['Authorization'] = obj.token;
    if (obj.method == 'GET') http = axios.get(`/dahua` + obj.url + (obj.params ? `?${objToQuery(obj.params)}` : ''), { headers });
    if (obj.method == 'POST') http = axios.post(`/dahua` + obj.url, obj.params, { headers });
    if (!http) return;
    http.then((res: any) => {
        console.log('查看返回数据：', res);
        if (obj.cb) obj.cb(res.data);
    }).catch((err: any) => {
        if (obj.err) obj.err(err);
    })
}