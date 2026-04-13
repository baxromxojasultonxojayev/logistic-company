import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { LoadingProvider } from '@/components/LoadingProvider/LoadingProvider';
import { aeonik, neuething } from '@/styles/fonts';
import '@/styles/globals.css';
import { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    metadataBase: new URL('https://bsm-group.uz'),
    title: {
      default: t('meta_title'),
      template: `%s | BSM Logistic`
    },
    description: t('meta_description'),
    keywords: t('meta_keywords'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        uz: '/uz',
        ru: '/ru',
        en: '/en'
      }
    },
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `https://bsm-group.uz/${locale}`,
      siteName: 'BSM Logistic',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}


export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'uz' },
    { locale: 'ru' }
  ];
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Pass locale explicitly to prevent headers() detection
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${aeonik.variable} ${neuething.variable}`} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingProvider>
              {children}
            </LoadingProvider>
          </ThemeProvider>
        </NextIntlClientProvider>

      </body>
    </html>
  );
}
