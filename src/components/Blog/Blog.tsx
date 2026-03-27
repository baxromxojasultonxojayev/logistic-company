'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import './style.scss';

export default function Blog() {
  const t = useTranslations('Navigation');

  const posts = [
    { title: 'Logistikaga oid foydali maqolalar', date: '20.03.2024', category: 'News' },
    { title: 'Xalqaro yuk tashish qoidalari', date: '15.03.2024', category: 'Guide' },
    { title: 'Xitoydan yuk keltirish sirlari', date: '10.03.2024', category: 'Tips' },
  ];

  return (
    <section id="blog" className="blog-section">
      <div className="container">
        <div className="blog-title">
          <h2 className="title">{t('blog')}</h2>
        </div>
        <div className="blog-grid">
          {posts.map((post, index) => (
            <motion.article 
              key={index}
              className="blog-post"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="blog-image-placeholder">Logistics Map</div>
              <div className="blog-content">
                <span className="blog-category">{post.category}</span>
                <h3>{post.title}</h3>
                <p className="blog-date">{post.date}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
