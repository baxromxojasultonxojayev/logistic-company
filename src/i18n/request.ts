import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'uz', 'ru'];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as string)) notFound();

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
