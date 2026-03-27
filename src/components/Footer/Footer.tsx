'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Globe, Send, Mail } from 'lucide-react';
import './style.scss';

export default function Footer() {
  const t = useTranslations('Navigation');

  return (
    <footer className="footer-site">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              BSM <span>Consulting</span>
            </Link>
            <p>Ваш надежный партнер в мире глобальной логистики и консалтинга.</p>
          </div>

          <div className="footer-links-group">
            <h4>{t('services')}</h4>
            <nav className="footer-links">
              <Link href="/#services">{t('services')}</Link>
              <Link href="/#about">{t('about')}</Link>
              <Link href="/#blog">{t('blog')}</Link>
            </nav>
          </div>

          <div className="footer-social">
            <h4>Sotsial tarmoqlar</h4>
            <div className="footer-icons">
              <a href="#"><Globe size={24} /></a>
              <a href="#"><Send size={24} /></a>
              <a href="#"><Mail size={24} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 BSM Consulting. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
