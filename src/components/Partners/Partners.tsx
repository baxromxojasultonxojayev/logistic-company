'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import './style.scss';

const partners = [
  { name: 'AKFA', logo: 'AKFA' },
  { name: 'Afex', logo: 'Afex' },
  { name: 'Mexmash', logo: 'Mexmash' },
  { name: 'Xiaomi', logo: 'Xiaomi' },
  { name: 'Atlant Fortuna', logo: 'Atlant Fortuna' },
  { name: 'Goodwell Service Centre', logo: 'Goodwell' },
  { name: 'Alutex', logo: 'Alutex' },
];

export default function Partners() {
  const t = useTranslations();

  return (
    <section className="partners-section">
      <div className="container">
        <h2 className="partners-title">{t('clients_title')}</h2>
        <div className="partners-marquee">
          <motion.div
            className="partners-track"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
              <div key={index} className="partner-logo">
                {partner.logo}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
