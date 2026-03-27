'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Truck, Plane, Ship, Package, Shield, Clock, ChevronRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import './style.scss';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}

function ServiceCard({ icon, title, description, index, scrollYProgress }: ServiceCardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Progress window for the "spreading" effect (0 to 0.4 of section scroll)
  const spreadStart = 0;
  const spreadEnd = 0.45;

  // Horizontal offset: cards on left move left, cards on right move right
  // On mobile, we only use vertical offsets
  const xMultiplier = isMobile ? 0 : (index % 3 === 0 ? -120 : index % 3 === 2 ? 120 : 0);
  const yMultiplier = isMobile ? (index * 40 - 100) : (index < 3 ? -100 : 100);
  
  // Stacking rotation
  const rotateOffset = isMobile ? (index - 2.5) * 2 : (index - 2.5) * 8;
  const zOffset = (5 - index) * 20; // Bring stack forward

  const x = useTransform(scrollYProgress, [spreadStart, spreadEnd], [xMultiplier, 0]);
  const y = useTransform(scrollYProgress, [spreadStart, spreadEnd], [yMultiplier, 0]);
  const z = useTransform(scrollYProgress, [spreadStart, spreadEnd], [zOffset, 0]);
  const rotate = useTransform(scrollYProgress, [spreadStart, spreadEnd], [rotateOffset, 0]);
  const scale = useTransform(scrollYProgress, [spreadStart, spreadEnd], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [spreadStart, spreadEnd], [0, 1]);

  const springConfig = { stiffness: 80, damping: 15, mass: 0.8 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springZ = useSpring(z, springConfig);
  const springRotate = useSpring(rotate, springConfig);
  const springScale = useSpring(scale, springConfig);
  const springOpacity = useSpring(opacity, springConfig);

  return (
    <motion.div
      style={{ 
        x: springX, 
        y: springY, 
        z: springZ,
        rotate: springRotate, 
        scale: springScale, 
        opacity: springOpacity 
      }}
      className="service-card"
    >
      <div className="service-icon-wrapper">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="service-more-btn">
        Read More <ChevronRight size={18} />
      </div>
    </motion.div>
  );
}

export default function Services() {
  const t = useTranslations('Index.services');
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  const services = [
    { icon: <Truck size={32} />, title: t('road.title'), description: t('road.description') },
    { icon: <Plane size={32} />, title: t('air.title'), description: t('air.description') },
    { icon: <Ship size={32} />, title: t('sea.title'), description: t('sea.description') },
    { icon: <Package size={32} />, title: t('warehouse.title'), description: t('warehouse.description') },
    { icon: <Shield size={32} />, title: t('insurance.title'), description: t('insurance.description') },
    { icon: <Clock size={32} />, title: t('express.title'), description: t('express.description') },
  ];

  return (
    <section id="services" className="services-section" ref={sectionRef}>
      <div className="container">
        <div className="services-title">
          <h2 className="title">{t('title')}</h2>
          <p className="subtitle">{t('description')}</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              index={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
