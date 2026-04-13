import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bsm-group.uz';
  const locales = ['uz', 'ru', 'en'];
  const pages = ['', '/blogs']; // Add more static routes here if they exist

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    const isDefault = locale === 'uz';
    const localePrefix = isDefault ? '' : `/${locale}`;

    pages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}${localePrefix}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? (isDefault ? 1.0 : 0.8) : 0.6,
      });
    });
  });

  return sitemapEntries;
}
