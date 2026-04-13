import { getTranslations, setRequestLocale, getMessages } from 'next-intl/server';
import { Metadata } from 'next';
import HomeContent from '@/components/Home/HomeContent';
import LocaleProvider from '../LocaleProvider';

const locale = 'en';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    alternates: {
      canonical: `/${locale}`,
    }
  };
}

export default async function EnHomePage() {
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <HomeContent />
    </LocaleProvider>
  );
}
