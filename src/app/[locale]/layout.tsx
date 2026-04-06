import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { LoadingProvider } from '@/components/LoadingProvider/LoadingProvider';
import '@/styles/globals.css';


export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
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
