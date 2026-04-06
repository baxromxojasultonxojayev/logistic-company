'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLoading } from '@/components/LoadingProvider/LoadingProvider';
import { api } from '@/lib/api';
import './style.scss';

export default function Feedback() {
  const t = useTranslations();
  const { setIsLoading } = useLoading();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    let res = '+998';

    if (digits.length > 3) {
      const part1 = digits.slice(3, 5);
      if (part1) res += ` (${part1}`;
      if (digits.length > 5) {
        res += `) ${digits.slice(5, 8)}`;
      }
      if (digits.length > 8) {
        res += `-${digits.slice(8, 10)}`;
      }
      if (digits.length > 10) {
        res += `-${digits.slice(10, 12)}`;
      }
    }
    return res;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawPhone = '+' + phone.replace(/\D/g, '');

    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(rawPhone)) {
      setErrorMessage(t('blog_error_title'));
      setStatus('error');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('idle');
      setErrorMessage('');

      await api.post("/contacts/", {
        name,
        phone: rawPhone,
        message
      });

      setStatus('success');
      setName('');
      setPhone('+998 ');
      setMessage('');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Xatolik yuz berdi';
      setErrorMessage(msg);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };




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
            <h2 className="title">{t('feedback_title')}</h2>
            <p className="subtitle">{t('feedback_description')}</p>

            <div className="feedback-details">
              <div className="detail-item">
                <strong>{t('feedback_address_label')}:</strong>
                <p>{t('feedback_address_value')}</p>
              </div>
              <div className="detail-item">
                <strong>{t('feedback_phone_label')}:</strong>
                <p>+998 (55) 520 02 02</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="feedback-form"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
          >
            <div className="input-group">
              <label>{t('feedback_name')}</label>
              <input
                type="text"
                placeholder={t('feedback_name_placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>{t('feedback_phone')}</label>
              <input
                type="tel"
                placeholder="+998 (90) 123-45-67"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length < 4) {
                    setPhone('+998 ');
                    return;
                  }
                  setPhone(formatPhone(val));
                }}


                required
              />
            </div>

            <div className="input-group">
              <label>{t('feedback_message')}</label>
              <textarea
                placeholder={t('feedback_message_placeholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>



            {status === 'success' && (
              <p className="status-message success">Xabaringiz yuborildi!</p>
            )}
            {status === 'error' && (
              <p className="status-message error">{errorMessage || "Xatolik yuz berdi. Qaytadan urinib ko'ring."}</p>
            )}



            <button type="submit" className="feedback-submit-btn">
              <span>{t('feedback_submit')}</span>
              <div className="btn-glow"></div>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
