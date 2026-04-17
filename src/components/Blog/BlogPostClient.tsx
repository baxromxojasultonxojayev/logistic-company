'use client';

import { motion } from "framer-motion";
import { ArrowLeft, Tag, Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import "./BlogPostClient.scss";

export interface BlogPostImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface BlogPost {
  id: number;
  title: string;
  content?: string;
  excerpt?: string;
  service_type?: string;
  slug: string;
  image?: string;
  images?: BlogPostImage[];
  published_at: string;
  created_at: string;
  description?: string;
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await api.get<BlogPost>(`/blog/posts/${slug}/`);
        if (isMounted) {
          setPost(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch blog post:", err);
          setError(t('blog_error_fetch') || "Ma'lumotni yuklab bo'lmadi");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchPost();
    }

    return () => {
      isMounted = false;
    };
  }, [slug, locale, t]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    router.back();
  };

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="container">
          <Loader2 className="animate-spin text-accent" size={48} />
          <div className="skeleton-image animate-pulse mt-8" />
          <div className="skeleton-title animate-pulse" />
          <div className="skeleton-text animate-pulse" />
          <div className="skeleton-text animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-detail-error">
        <div className="container">
          <h2>{error || t('blog_not_found')}</h2>
          <button onClick={handleBack} className="back-link !border-none !bg-transparent !cursor-pointer">
            <ArrowLeft size={20} />
            {t('blog_back')}
          </button>
        </div>
      </div>
    );
  }

  const postContent = post?.content || post?.description || "";

  return (
    <main className="blog-detail-page">
      <div className="container">
        {/* Images Slider at the top */}
        <motion.div
          className="post-slider-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {post.images && post.images.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={post.images.length > 1}
              className="post-main-slider"
            >
              {post.images.map((img, idx) => (
                <SwiperSlide key={img.id || idx}>
                  <div className="slide-image-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image} alt={img.caption || post.title} className="main-image" />
                    {img.caption && <div className="slide-caption">{img.caption}</div>}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : post.image ? (
            <div className="single-image-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.title} className="main-image" />
            </div>
          ) : (
            <div className="image-placeholder">{t('blog_placeholder')}</div>
          )}
        </motion.div>

        <motion.div
          className="blog-detail-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={handleBack}
            className="back-link !border-none !bg-transparent !cursor-pointer !p-0 !text-accent font-semibold hover:-translate-x-1 transition-transform"
          >
            <ArrowLeft size={20} />
            {t('blog_back')}
          </button>

          <div className="post-meta">
            <span className="post-category">
              <Tag size={16} />
              {post.service_type}
            </span>
          </div>

          <h1>{post.title}</h1>
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
        </motion.div>

        <motion.div
          className="blog-detail-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="post-body">
            {postContent ? (
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: postContent }}
              />
            ) : (
              <p className="no-content">{t('blog_no_content')}</p>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
