import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs';
import { ZcLocalesV } from './index';

export interface ElementLocales {
  zhCn: any,
  en: any
}

export const elementLocales: ElementLocales = {
  [ZcLocalesV.cn]: zhCn,
  [ZcLocalesV.en]: en
};