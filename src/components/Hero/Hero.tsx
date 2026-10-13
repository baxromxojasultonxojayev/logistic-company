'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';

import './style.scss';

export default function Hero() {
  const t = useTranslations();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="hero-section">
      {/* Hero background is the LCP element: start fetching it before CSS is parsed.
          Media queries mirror the breakpoints in style.scss so only one file is downloaded. */}
      <link rel="preload" as="image" type="image/webp" href="/new-image/hero-mobile.webp" media="(max-width: 828px)" fetchPriority="high" />
      <link rel="preload" as="image" type="image/webp" href="/new-image/hero.webp" media="(min-width: 829px)" fetchPriority="high" />
      <div className="container hero-inner">
        <motion.div
          className="hero-content"
          style={{ opacity }}
        >
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-subtitle">{t('hero_subtitle')}</p>
          {/* <div className="hero-cta-group">
            <button className="btn-primary">{t('feedback_submit')}</button>
            <button className="btn-secondary">{t('about_title')}</button>
          </div> */}
        </motion.div>

      </div>

      <div className="hero-scroll-indicator" aria-hidden="true">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="hero-dot"
        />
      </div>
    </section>
  );
}
