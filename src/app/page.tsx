import { setRequestLocale, getMessages } from 'next-intl/server';
import { Metadata } from 'next';
import LocaleProvider from './LocaleProvider';
import HomeContent from '@/components/Home/HomeContent';

export async function generateMetadata(): Promise<Metadata> {
  const locale = 'uz';

  // Enable static rendering
  setRequestLocale(locale);

  return {
    title: 'Home',
  };
}

export default async function IndexPage() {
  const locale = 'uz';

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <HomeContent />
    </LocaleProvider>
  );
}
