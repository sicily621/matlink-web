import en from './en';
import cn from './cn';
import { i18n, ZcLocalesV } from '@static/js/locales/index';
i18n.global.mergeLocaleMessage(ZcLocalesV.cn, cn);
i18n.global.mergeLocaleMessage(ZcLocalesV.en, en);

