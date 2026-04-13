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
      google: 'G-D8X9T9X7X5', // User should replace this with their actual verification code from Search Console
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = routing.defaultLocale;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BSM Group / BSM Consulting and Logistics",
    "alternateName": ["BSM-Group", "BSM Logistic", "BSM Logistics"],
    "url": "https://bsm-group.uz",
    "logo": "https://bsm-group.uz/logo.png",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+998-55-520-02-02",
        "contactType": "customer service",
        "areaServed": "UZ",
        "availableLanguage": ["Uzbek", "Russian", "English"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sodiq Azimov 3-tor ko'chasi, 1A",
      "addressLocality": "Tashkent",
      "addressRegion": "Yashnobod",
      "postalCode": "100000",
      "addressCountry": "UZ"
    },
    "sameAs": [
      "https://www.instagram.com/bsm_consulting/",
      "https://www.linkedin.com/company/bsm-group",
      "https://t.me/bsm_consulting"
    ],
    "description": "BSM Logistic - 2016-yildan buyon Xitoy, Turkiya va Yevropadan yuk tashish, bojxona rasmiylashtiruvi va ombor xizmatlari."
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
