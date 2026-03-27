'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import './style.scss';

export default function About() {
  const t = useTranslations('Index.about');

  const warehouses = [
    { city: 'Guanchjou', image: '/images/wh-gz.png' },
    { city: 'Ivu', image: '/images/wh-iwu.png' },
    { city: 'Lyanyungan', image: '/images/wh-ly.png' },
    { city: 'Xorgos', image: '/images/wh-xh.png' },
  ];

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="about-content"
          >
            <h2 className="title">{t('title')}</h2>
            <p className="subtitle">{t('description')}</p>
          </motion.div>
        </div>

        <div className="warehouse-grid">
          {warehouses.map((wh, index) => (
            <motion.div
              key={wh.city}
              className="warehouse-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="image-overlay">
                <h3>{wh.city}</h3>
              </div>
              <div className="placeholder-img">
                <span>{t('warehouse_label')} {wh.city}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
