import BlogsClient from "../[locale]/blogs/BlogsClient";
import { setRequestLocale, getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import LocaleProvider from '../LocaleProvider';

export default async function BlogsPage() {
  const locale = routing.defaultLocale;
  
  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <BlogsClient />
    </LocaleProvider>
  );
}
