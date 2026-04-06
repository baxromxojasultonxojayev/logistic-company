'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Link } from "@/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslations } from "next-intl";
import "./style.scss";

interface BlogPostImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

interface BlogPost {
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

export default function BlogPostPage() {
  const t = useTranslations();
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await api.get<BlogPost>(`/blog/posts/${slug}/`);
        setPost(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('blog_error_fetch');
        console.error('Failed to fetch blog post:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug, t]);

  const postContent = post?.content || post?.description;

  if (loading) {
    return (
      <>
        <Header />
        <div className="blog-detail-loading">
          <div className="container">
            <div className="skeleton-image animate-pulse"></div>
            <div className="skeleton-title animate-pulse"></div>
            <div className="skeleton-text animate-pulse"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="blog-detail-error">
          <div className="container">
            <h2>{t('blog_error_title')}</h2>
            <p>{error || t('blog_not_found')}</p>
            <Link href="/" className="back-link">
              <ArrowLeft size={20} />
              {t('blog_return_home')}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
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
            <Link href="/" className="back-link">
              <ArrowLeft size={20} />
              {t('blog_back')}
            </Link>
            
            <div className="post-meta">
              <span className="post-category">
                <Tag size={16} />
                {post.service_type || t('blog_default_category')}
              </span>
              <span className="post-date">
                <Calendar size={16} />
                {new Date(post.published_at || post.created_at).toLocaleDateString()}
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
      <Footer />
    </>
  );
}
