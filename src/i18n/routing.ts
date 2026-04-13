import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'uz', 'ru'],

  // Used when no locale matches
  defaultLocale: 'uz',
  
  // Every locale needs a prefix (e.g. /uz, /en), which is
  // highly recommended for Static Export reliability.
  localePrefix: 'as-needed'
});


// Lightweight wrappers around Next.js navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
