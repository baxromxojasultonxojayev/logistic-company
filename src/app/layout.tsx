import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { LoadingProvider } from '@/components/LoadingProvider/LoadingProvider';
import { aeonik, neuething } from '@/styles/fonts';
import { Suspense } from 'react';
import GoogleAnalytics from '@/components/Analytics/GoogleAnalytics';
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
      canonical: 'https://bsm-group.uz',
      languages: {
        'uz': 'https://bsm-group.uz/',
        'ru': 'https://bsm-group.uz/ru',
        'en': 'https://bsm-group.uz/en',
        'x-default': 'https://bsm-group.uz/',
      }
    },
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: 'https://bsm-group.uz',
      siteName: 'BSM Group',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'BSM Logistic - Xalqaro yuk tashish va Kargo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
      images: ['/images/og-image.jpg'],
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
      google: 'googlec95373def05d377d',
    },
    other: {
      'apple-mobile-web-app-title': 'BSM Group',
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = routing.defaultLocale;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BSM Group",
    "url": "https://bsm-group.uz",
    "logo": "https://bsm-group.uz/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+998-55-520-02-02",
      "contactType": "customer service"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://bsm-group.uz"
      }
    ]
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LogisticsCenter",
    "name": "BSM Logistic & Consulting",
    "image": "https://bsm-group.uz/images/aboutus/fura.jpg",
    "@id": "https://bsm-group.uz",
    "url": "https://bsm-group.uz",
    "telephone": "+998555200202",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sodiq Azimov 3-tor ko'chasi, 1A",
      "addressLocality": "Tashkent",
      "postalCode": "100000",
      "addressCountry": "UZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.311081,
      "longitude": 69.240562
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
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
            <Suspense fallback={null}>
              <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
            </Suspense>
            {children}
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
