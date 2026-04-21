import { pinyin } from 'pinyin-pro'

export const hanziToFullPinyin = (val:any) => {
    const result = pinyin(val,{ toneType: "none" ,pattern: 'pinyin'});
    return result.split(/[\t\r\f\n\s]*/g).join('');
}

