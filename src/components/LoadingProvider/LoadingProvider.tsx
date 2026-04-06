'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface LoadingContextType {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Separate component for searchParams logic to allow Suspense wrapping
function LoadingParamsHandler({ isLoading, setIsLoading }: { isLoading: boolean; setIsLoading: (loading: boolean) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => setIsLoading(false), 0);
    }
    document.body.classList.remove('loading-cursor');
  }, [pathname, searchParams, isLoading, setIsLoading]);

  return null;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.href && !anchor.target && !e.metaKey && !e.ctrlKey) {
        const url = new URL(anchor.href);
        if (url.origin === window.origin) {
          setIsLoading(true);
          document.body.classList.add('loading-cursor');
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('loading-cursor');
    } else {
      document.body.classList.remove('loading-cursor');
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <Suspense fallback={null}>
        <LoadingParamsHandler isLoading={isLoading} setIsLoading={setIsLoading} />
      </Suspense>
      {children}
    </LoadingContext.Provider>
  );
}


export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
