'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { api } from "@/lib/api";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
  excerpt?: string;
  service_type?: string;
  slug: string;
  image?: string;
  images?: BlogPostImage[];
  published_at: string;
  created_at: string;
}

interface PaginatedResponse {
  results: BlogPost[];
  count: number;
  next: string | null;
  previous: string | null;
}

const PAGE_SIZE = 9;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;


const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
} as const;


export default function BlogsClient() {
  const t = useTranslations();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const hasInitialFetched = useRef(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Correctly handle offset based on page and PAGE_SIZE if the API supports it, 
        // or just use ?page=X if it's page-based.
        const response = await api.get<PaginatedResponse>(`/blog/posts/?page=${page}&limit=${PAGE_SIZE}`);
        setPosts(response.results);
        setTotalCount(response.count);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError(t('blog_error_load') || "Ma'lumotlarni yuklab bo'lmadi");
      } finally {
        setLoading(false);
        hasInitialFetched.current = true;
      }
    };

    fetchBlogs();
    
    // Scroll to top when page changes
    if (hasInitialFetched.current) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page, t]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      <Header />
      <main className="blogs-index-page">
        <section className="blogs-hero">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="blogs-hero-content"
            >
              <h1>{t('nav_blog')}</h1>
              <p>{t('nav_footer_desc')}</p>
            </motion.div>
          </div>
        </section>

        <section className="blogs-grid-section">
          <div className="container">
            {loading ? (
              <div className="blogs-loading">
                <Loader2 className="animate-spin text-accent" size={48} />
              </div>
            ) : error ? (
              <div className="blogs-error">
                <p>{error}</p>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={page}
                    className="blogs-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                  >
                    {posts.map((post) => {
                      const displayImage = post.image || (post.images && post.images.length > 0 ? post.images[0].image : null);

                      return (
                        <motion.div key={post.id} variants={itemVariants}>
                          <Link href={`/blog/${post.slug}`} className="blog-card">
                            <div className="card-image">
                              {displayImage ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={displayImage} alt={post.title} />
                              ) : (
                                <div className="placeholder">{t('blog_placeholder')}</div>
                              )}
                              <div className="card-badge">
                                {post.service_type || t('blog_default_category')}
                              </div>
                            </div>
                            <div className="card-content">
                              <span className="card-date">
                                {new Date(post.published_at || post.created_at).toLocaleDateString()}
                              </span>
                              <h3>{post.title}</h3>
                              {post.excerpt && <p>{post.excerpt}</p>}
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <div className="page-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          className={`page-num ${page === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
            
            {!loading && posts.length === 0 && !error && (
              <div className="no-blogs">
                <p>{t('blog_no_posts')}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

