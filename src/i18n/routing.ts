import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'uz', 'ru'],

  // Used when no locale matches
  defaultLocale: 'uz',
  
  // The default locale does not have a prefix (e.g. /), 
  // while other locales have (e.g. /en).
  localePrefix: 'as-needed'
});

// Lightweight wrappers around Next.js navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
