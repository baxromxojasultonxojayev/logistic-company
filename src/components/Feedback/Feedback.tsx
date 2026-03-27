'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import './style.scss';

export default function Feedback() {
  const t = useTranslations('Index.feedback');

  return (
    <section id="feedback" className="feedback-section">
      <div className="container">
        <div className="feedback-grid">
          <motion.div
            className="feedback-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="title">{t('title')}</h2>
            <p className="subtitle">{t('description')}</p>

            <div className="feedback-details">
              <div className="detail-item">
                <strong>{t('address_label')}:</strong>
                <p>г. Ташкент, ул. Садыka Азимова, 1,2.</p>
              </div>
              <div className="detail-item">
                <strong>{t('phone_label')}:</strong>
                <p>+998 (55) 520 02 02</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="feedback-form"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="input-group">
              <label>{t('name')}</label>
              <input type="text" placeholder={t('name_placeholder')} />
            </div>
            <div className="input-group">
              <label>{t('phone')}</label>
              <input type="tel" placeholder="+998" />
            </div>
            <div className="input-group">
              <label>{t('message')}</label>
              <textarea placeholder={t('message_placeholder')}></textarea>
            </div>
            <button type="submit" className="btn-primary">
              {t('submit')}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
