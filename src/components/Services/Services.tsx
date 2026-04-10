'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import './style.scss';

interface ServiceRowProps {
  title: string;
  description: string;
  image: string;
  index: number;
}

function ServiceRow({ title, description, image, index }: ServiceRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"]
  });

  // Balanced focus: Peeks at center, remains at 100% on top.
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.4, 1, 1]);
  const rawImageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const rawContentX = useTransform(scrollYProgress, [0, 0.5, 1], [isEven ? -100 : 100, 0, 0]);

  const springOptions = { stiffness: 100, damping: 20, mass: 1 };
  const scale = useSpring(rawScale, springOptions);
  const opacity = useSpring(rawOpacity, springOptions);
  const imageY = useSpring(rawImageY, springOptions);
  const contentX = useSpring(rawContentX, springOptions);

  return (
    <motion.div
      ref={rowRef}
      style={{ scale, opacity }}
      className="service-row"
    >
      <div className="service-image-container">
        <motion.div
          style={{ y: imageY }}
          className="image-wrapper"
        >
          <img src={image} alt={title} />
          <div className="image-overlay" />
        </motion.div>
      </div>

      <motion.div
        style={{ x: contentX }}
        className="service-content"
      >
        <div className="service-index">0{index + 1}</div>
        <h3 className="service-title">{title}</h3>
        <p className="service-desc">{description}</p>
        {/* <button className="service-btn">
          Explore Solution <ChevronRight size={20} />
        </button> */}
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const t = useTranslations();

  const services = [
    {
      title: t('service_road_title'),
      description: t('service_road_desc'),
      image: '/images/services/road-truck.jpg'
    },
    {
      title: t('service_rail_title'),
      description: t('service_rail_desc'),
      image: '/images/services/rail-transport.jpg'
    },
    {
      title: t('service_air_title'),
      description: t('service_air_desc'),
      image: '/images/services/air-freight.jpg'
    },
    // {
    //   title: t('service_customs_title'),
    //   description: t('service_customs_desc'),
    //   image: '/images/services/customs-brokerage.jpg'
    // },
    {
      title: t('service_consulting_title'),
      description: t('service_consulting_desc'),
      image: '/images/services/logistics-consulting.jpg'
    },
    {
      title: t('service_sea_title'),
      description: t('service_sea_desc'),
      image: '/images/services/customs-brokerage.jpg'
    },
    {
      title: t('service_warehouse_title'),
      description: t('service_warehouse_desc'),
      image: '/images/services/warehouse-storage.jpg'
    },
    {
      title: t('service_express_title'),
      description: t('service_express_desc'),
      image: '/images/services/domestic-logistics.jpg'
    },
    {
      title: t('service_china_title'),
      description: t('service_china_desc'),
      image: '/images/services/china-internal-logistics.jpg'
    },
    // {
    //   title: t('service_insurance_title'),
    //   description: t('service_insurance_desc'),
    //   image: '/images/services/china-logistics-map.jpg'
    // },
  ];



  return (
    <section id="services" className="services-section">
      <div className="container">
        <header className="services-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="title"
          >
            {t('services_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="subtitle"
          >
            {t('services_description')}
          </motion.p>
        </header>

        <div className="services-list">
          {services.map((service, index) => (
            <ServiceRow
              key={index}
              index={index}
              title={service.title}
              description={service.description}
              image={service.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
