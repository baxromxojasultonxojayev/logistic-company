'use client';

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

interface LocaleProviderProps {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export default function LocaleProvider({
  children,
  locale,
  messages
}: LocaleProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      {children}
      <Footer />
    </NextIntlClientProvider>
  );
}
