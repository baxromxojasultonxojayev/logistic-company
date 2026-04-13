import { api } from "@/lib/api";
import BlogPostClient, { BlogPost } from "./BlogPostClient";
import { Metadata } from "next";

import { setRequestLocale } from 'next-intl/server';


export async function generateStaticParams() {
  const locales = ['en', 'ru'];
  
  try {
    interface PaginatedResponse {
      results: BlogPost[];
    }
    const data = await api.get<PaginatedResponse>("/blog/posts/", { locale: 'uz' }); 
    
    // Generate paths for non-default locales
    return locales.flatMap((locale) => 
      data.results.map((post) => ({
        locale,
        slug: post.slug
      }))
    );
  } catch (error) {
    console.error("Failed to generate static params for blog posts:", error);
    return [];
  }
}

export const dynamicParams = false;


export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  
  // Enable static rendering for metadata
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

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  return <BlogPostClient slug={slug} />;
}


