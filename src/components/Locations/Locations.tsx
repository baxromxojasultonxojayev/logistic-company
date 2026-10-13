'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import './style.scss';



export default function Locations() {
  const t = useTranslations();

  return (
    <section id="locations" className="locations-section">
      <div className="container">
        <div className="locations-header">
          <h2 className="title">{t('locations_title')}</h2>
          <p className="subtitle">{t('locations_description')}</p>
        </div>


        <div className="map-wrapper">
          <div className="map-container">
            <Image
              src="/images/services/map.webp"
              alt="World Map"
              fill
              sizes="(max-width: 1248px) 100vw, 1200px"
              className="world-map-img"
              loading="lazy"
            />

          </div>
        </div>
      </div>
    </section>
  );
}
