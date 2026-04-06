'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Globe, Send, Mail } from 'lucide-react';
import './style.scss';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="footer-site">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              BSM <span>Consulting</span>
            </Link>
            <p>{t('nav_footer_desc')}</p>
          </div>

          <div className="footer-links-group">
            <h4>{t('nav_services')}</h4>
            <nav className="footer-links">
              <Link href="/#services">{t('nav_services')}</Link>
              <Link href="/#about">{t('nav_about')}</Link>
              <Link href="/#blog">{t('nav_blog')}</Link>
            </nav>
          </div>

          <div className="footer-social">
            <h4>{t('nav_social_label')}</h4>
            <div className="footer-icons">
              <a href="#"><Globe size={24} /></a>
              <a href="#"><Send size={24} /></a>
              <a href="#"><Mail size={24} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 BSM Consulting.</p>
        </div>
      </div>
    </footer>
  );
}

