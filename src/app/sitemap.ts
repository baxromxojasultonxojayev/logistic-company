import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bsm-group.uz';
  const locales = ['uz', 'ru', 'en'];

  return locales.map((locale) => ({
    url: `${baseUrl}${locale === 'uz' ? '' : `/${locale}`}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  }));
}
