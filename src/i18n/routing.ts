import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Include all supported locales
  locales: ['en', 'ru', 'uz'],

  // Uzbek is the default and served at the root without a prefix
  defaultLocale: 'uz',
  
  // Only add prefixes for other languages (ru, en)
  // Since 'uz' is the defaultLocale, it won't get a prefix in 'as-needed' mode
  localePrefix: 'as-needed'
});


// Lightweight wrappers around Next.js navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
