import { createI18n } from 'vue-i18n';
import cn from './cn';
import en from './en';


export const commonCn = cn;
export const commonEn = en;

export const i18nTsFunc = (key: string) => {
  const locale = getLocale();
  let obj: any = {};
  if (locale == 'cn') obj = commonCn;
  if (locale == 'en') obj = commonEn;
  // console.log();
  const keys = key.split('.');
  let value = null;
  for (let item of keys) {
    if (!value && obj[item]) value = obj[item];
    else if (value && value[item]) value = value[item];
  }
  if (value) return value;
  else return key;
}



export enum ZcLocalesV {
  cn = 'cn',
  en = 'en'
}

export interface NavigatorLocales {
  'zh-cn': string,
  'en': string,
}

export const navigatorLocales: NavigatorLocales = {
  'zh-cn': ZcLocalesV.cn,
  'en': ZcLocalesV.en
};

/**
 * 获取用户浏览器默认语言
 * @returns
 */
export const getNavigatorLocale = (): string => {
  const n: any = navigator;
  let locales = '';
  if (n.language) locales = n.language;
  else if (n.browserLanguage) locales = n.browserLanguage;
  locales = locales.toLocaleLowerCase();
  if (locales in navigatorLocales) return navigatorLocales[locales as keyof typeof navigatorLocales];
  return '';
}

/**
 * 获取当前语言类型
 * @returns {string}
 */
export const getLocale = (): string => {
  return localStorage.getItem('lang') || getNavigatorLocale() || ZcLocalesV.cn;
}

/**
 * 获取当前语言内容
 * @param lang 当前语言类型
 * @param obj 包含语言内容的数据对象
 * @param keyObj 语言类对应的key
 * @returns
 */
export const getLocaleValue = (lang: string, obj: any, keyObj: { cnNameKey?: string, enNameKey?: string }): string => {
  if (lang === ZcLocalesV.cn && keyObj.cnNameKey) {
    return obj[keyObj.cnNameKey];
  }
  if (lang === ZcLocalesV.en && keyObj.enNameKey) {
    return obj[keyObj.enNameKey];
  }
  return '-';
}

//创建 i18n
export const i18n = createI18n({
  legacy: false,
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: getLocale(),
  messages: {
    [ZcLocalesV.en]: en,
    [ZcLocalesV.cn]: cn
  },
  cache: false
})
