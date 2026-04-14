'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    ReactGA.initialize(measurementId);
  }, [measurementId]);

  useEffect(() => {
    const url = pathname + searchParams.toString();
    
    ReactGA.send({
      hitType: 'pageview',
      page: url,
      title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
