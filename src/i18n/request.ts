import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './i18n';

export default getRequestConfig(async () => {
  return {
    locale: defaultLocale,
  };
});
