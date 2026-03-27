'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import './style.scss';

export default function Hero() {
  const t = useTranslations('Index');
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="hero-section">
      <div className="container hero-inner">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ opacity }}
        >
          <h1 className="hero-title">{t('hero.title')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <div className="hero-cta-group">
            <button className="btn-primary">{t('feedback.submit')}</button>
            <button className="btn-secondary">{t('about.title')}</button>
          </div>
        </motion.div>

        <motion.div
          className="hero-image-wrapper"
          style={{ opacity }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* <div className="hero-image-container">
            <Image 
              src="/images/hero.png" 
              alt="Logistics Collage" 
              fill
              priority
              className="hero-image"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div> */}
          {/* <motion.div
            className="hero-floating-card"
          >
            <h3>2016</h3>
            <p>{t('stats.since')}</p>
          </motion.div> */}
        </motion.div>
      </div>

      <div className="hero-scroll-indicator">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="hero-dot"
        />
      </div>
    </section>
  );
}
