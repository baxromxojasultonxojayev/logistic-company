'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import './style.scss';

export default function About() {
  const t = useTranslations();

  const warehouses = [
    { city: 'Guanchjou', image: '/new-image/truck-convoy.webp' },
    { city: 'Ivu', image: '/images/aboutus/plane-train.webp' },
    { city: 'Lyanyungan', image: '/new-image/port-container.webp' },
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
            <h2 className="title">{t('about_title')}</h2>
            <p className="subtitle">{t('about_description')}</p>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={wh.image}
                width={900}
                height={506}
                loading="lazy"
                decoding="async"
                alt={`${t('about_warehouse_label')} ${wh.city}`}
                className="card-img"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

