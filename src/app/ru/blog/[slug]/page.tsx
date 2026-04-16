import { Metadata } from 'next';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { api } from "@/lib/api";
import BlogPostClient, { BlogPost } from "@/components/Blog/BlogPostClient";
import LocaleProvider from "../../../LocaleProvider";

const locale = 'ru';

export async function generateStaticParams() {
  try {
    interface PaginatedResponse {
      results: BlogPost[];
    }
    const data = await api.get<PaginatedResponse>("/blog/posts/");
    return data.results.map((post) => ({
      slug: post.slug
    }));
  } catch (error) {
    console.error(`Failed to generate static params for RU blog posts:`, error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
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

export default async function RuBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <BlogPostClient slug={slug} />
    </LocaleProvider>
  );
}
