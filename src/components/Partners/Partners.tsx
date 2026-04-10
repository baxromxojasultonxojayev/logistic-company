'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import './style.scss';

const partners = [
  { name: 'AKFA', logo: 'AKFA' },
  { name: 'Xiaomi', logo: 'Xiaomi' },
  { name: 'Enter Engineering', logo: 'ENTER' },
  { name: 'Artel', logo: 'Artel' },
  { name: 'Texnopark', logo: 'Texnopark' },
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
