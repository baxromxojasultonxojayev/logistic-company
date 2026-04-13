import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bsm-group.uz';
  const locales = ['uz', 'ru', 'en'];

  return locales.map((locale) => {
    const isDefault = locale === 'uz';
    return {
      url: `${baseUrl}${isDefault ? '' : `/${locale}`}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: isDefault ? 1.0 : 0.8,
    };
  });
}
