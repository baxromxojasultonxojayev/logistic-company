'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import './style.scss';

const locations = [
  { id: 1, name: 'North America', top: '36%', left: '20%' },
  { id: 2, name: 'South America', top: '73%', left: '33%' },
  { id: 3, name: 'Europe', top: '20%', left: '50.5%' },
  { id: 4, name: 'Africa', top: '53%', left: '52%' },
  { id: 5, name: 'Central Asia', top: '38%', left: '54%' },
  { id: 6, name: 'East Asia', top: '43%', left: '73%' },
  { id: 7, name: 'Australia', top: '69%', left: '80%' },
];

export default function Locations() {
  const t = useTranslations('Index.locations');

  return (
    <section id="locations" className="locations-section">
      <div className="container">
        <div className="locations-header">
          <h2 className="title">{t('title')}</h2>
          <p className="subtitle">{t('description')}</p>
        </div>

        <div className="map-wrapper">
          <div className="map-container">
            <Image
              src="/images/world-map.svg"
              alt="World Map"
              fill
              className="world-map-img"
              priority
            />
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="map-dot-wrapper"
                style={{ top: loc.top, left: loc.left }}
              >
                <motion.div
                  className="map-dot"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: loc.id * 0.3
                  }}
                />
                <div className="map-dot-inner" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
