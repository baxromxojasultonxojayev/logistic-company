'use client';

import { motion } from 'framer-motion';
import './style.scss';

const partners = [
  { name: 'AKFA', logo: 'AKFA' },
  { name: 'Xiaomi', logo: 'Xiaomi' },
  { name: 'Enter Engineering', logo: 'ENTER' },
  { name: 'Artel', logo: 'Artel' },
  { name: 'Texnopark', logo: 'Texnopark' },
];

export default function Partners() {
  return (
    <section className="partners-section">
      <div className="container">
        <div className="partners-marquee">
          <motion.div 
            className="partners-track"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {[...partners, ...partners].map((partner, index) => (
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
