'use client';

import { motion, useMotionValue, animate } from 'framer-motion';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useEffect } from 'react';
import './style.scss';

function Counter({ value }: { value: string }) {
  const numericValue = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    const controls = animate(count, numericValue, { 
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });
    return controls.stop;
  }, [numericValue, count]);

  return (
    <span>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const t = useTranslations('Index.stats');

  const stats = [
    { value: '2016', label: t('since') },
    { value: '50+', label: t('experts') },
    { value: '500+', label: t('clients') },
  ];

  return (
    <section className="stats-section">
      <div className="container stats-inner">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="stat-item"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h2 className="stat-value">
              <Counter value={stat.value} />
            </h2>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
