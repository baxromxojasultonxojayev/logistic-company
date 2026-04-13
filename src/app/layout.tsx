import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { LoadingProvider } from '@/components/LoadingProvider/LoadingProvider';
import { aeonik, neuething } from '@/styles/fonts';
import '@/styles/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const locale = routing.defaultLocale;
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
      canonical: '/',
      languages: {
        uz: 'https://bsm-group.uz/',
        ru: 'https://bsm-group.uz/ru',
        en: 'https://bsm-group.uz/en'
      }
    },
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: 'https://bsm-group.uz',
      siteName: 'BSM Logistic',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg', // User should provide this eventually
          width: 1200,
          height: 630,
          alt: 'BSM Logistic',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
      images: ['/og-image.jpg'],
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
    verification: {
      google: 'google-site-verification-id', // User should replace this
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We use the default locale for the base layout
  // individual pages can specify their lang in their own layouts if needed
  // but for bsm-group.uz, uz is the primary.
  const locale = routing.defaultLocale;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BSM Group / BSM Consulting and Logistics",
    "url": "https://bsm-group.uz",
    "logo": "https://bsm-group.uz/logo.png",
    "sameAs": [
      "https://www.instagram.com/bsm_consulting/",
      "https://www.linkedin.com/company/bsm-group"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+998-55-520-02-02",
      "contactType": "customer service",
      "areaServed": "UZ",
      "availableLanguage": ["Uzbek", "Russian", "English"]
    },
    "description": "Professional logistics and consulting services from China, Turkey, and Europe to Uzbekistan since 2016."
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${aeonik.variable} ${neuething.variable}`} suppressHydrationWarning>
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
      </body>
    </html>
  );
}
