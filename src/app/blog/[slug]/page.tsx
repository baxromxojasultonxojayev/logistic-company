import { api } from "@/lib/api";
import BlogPostClient, { BlogPost } from "../../[locale]/blog/[slug]/BlogPostClient";
import { Metadata } from "next";
import { setRequestLocale, getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import LocaleProvider from '../../LocaleProvider';

export async function generateStaticParams() {
  const locale = routing.defaultLocale;
  
  try {
    interface PaginatedResponse {
      results: BlogPost[];
    }
    const data = await api.get<PaginatedResponse>("/blog/posts/", { locale });
    
    return data.results.map((post) => ({
      slug: post.slug
    }));
  } catch (error) {
    console.error("Failed to generate static params for root blog posts:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = routing.defaultLocale;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  try {
    const post = await api.get<BlogPost>(`/blog/posts/${slug}/`, { locale });
    return {
      title: post.title,
      description: post.excerpt || post.description
    };
  } catch {
    return { title: 'BSM Consulting Blog' };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = routing.defaultLocale;
  
  // Enable static rendering
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <BlogPostClient slug={slug} />
    </LocaleProvider>
  );
}
