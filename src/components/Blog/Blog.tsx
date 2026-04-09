'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { api } from '@/lib/api';
import { Link } from '@/navigation';
import { ChevronRight } from 'lucide-react';
import './style.scss';

interface BlogPostImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt?: string;
  service_type?: string;
  slug: string;
  image?: string;
  images?: BlogPostImage[];
  published_at: string;
  created_at: string;
}

export default function Blog() {
  const t = useTranslations();
  const locale = useLocale();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        interface PaginatedResponse {
          results: BlogPost[];
        }
        const data = await api.get<PaginatedResponse>("/blog/posts/", { locale });
        // Only show first 3 posts on home page
        setPosts(data.results.slice(0, 3));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading blog posts';
        console.error('Failed to fetch blog posts:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section id="blog" className="blog-section">
        <div className="container">
          <div className="blog-header">
            <h2 className="title">{t('nav_blog')}</h2>
          </div>
          <div className="blog-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="blog-post loading-skeleton">
                <div className="blog-image-placeholder animate-pulse">Loading...</div>
                <div className="blog-content">
                  <div className="skeleton-line pulse"></div>
                  <div className="skeleton-line pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="blog-section">
        <div className="container">
          <div className="blog-header">
            <h2 className="title">{t('nav_blog')}</h2>
          </div>
          <p className="error-message">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="blog-section">
      <div className="container">
        <div className="blog-header">
          <h2 className="title">{t('nav_blog')}</h2>
          <Link href="/blogs" className="more-link">
            {t('nav_more')} <ChevronRight size={20} />
          </Link>
        </div>
        <div className="blog-grid">
          {posts.map((post, index) => {
            const displayImage = post.image || (post.images && post.images.length > 0 ? post.images[0].image : null);
            
            return (
              <motion.article 
                key={post.id || index}
                className="blog-post"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="blog-link-wrapper">
                  <div className="blog-image-placeholder">
                    {displayImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={displayImage} alt={post.title} className="blog-img" />
                    ) : (
                      t('blog_placeholder')
                    )}
                  </div>
                  <div className="blog-content">
                    <span className="blog-category">
                      {post.service_type || t('blog_default_category')}
                    </span>
                    <h3>{post.title}</h3>
                    <p className="blog-date">
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              </motion.article>
            );
          })}
          {posts.length === 0 && (
            <p className="no-posts">{t('blog_no_posts')}</p>
          )}
        </div>
      </div>
    </section>
  );
}
