import { Metadata } from 'next';
import { getTranslations, setRequestLocale, getMessages } from 'next-intl/server';
import BlogsClient from '@/components/Blogs/BlogsClient';
import LocaleProvider from '../../LocaleProvider';

const locale = 'ru';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: `${t('nav_blog')} | BSM Logistic`,
    description: t('meta_description'),
  };
}

export default async function RuBlogsPage() {
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <BlogsClient />
    </LocaleProvider>
  );
}
