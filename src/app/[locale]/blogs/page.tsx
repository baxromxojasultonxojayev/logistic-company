import { api } from "@/lib/api";
import BlogsClient from "./BlogsClient";
import { setRequestLocale } from 'next-intl/server';


interface BlogPost {
  id: number;
  title: string;
  excerpt?: string;
  service_type?: string;
  slug: string;
  image?: string;
  published_at: string;
  created_at: string;
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ru' }
  ];
}

export const dynamicParams = false;

export default async function BlogsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  return <BlogsClient />;
}
