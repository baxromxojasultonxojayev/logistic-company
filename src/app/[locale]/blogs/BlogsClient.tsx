'use client';

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
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


export default function BlogsClient({ posts, error }: { posts: BlogPost[], error: string | null }) {
  const t = useTranslations();

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
            {error ? (
              <div className="blogs-error">
                <p>{error}</p>
              </div>
            ) : (
              <motion.div 
                className="blogs-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
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
            )}
            {posts.length === 0 && !error && (
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
