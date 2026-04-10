'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Send, Mail } from 'lucide-react';
import './style.scss';

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="footer-site">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              BSM <span>Logistics</span>
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
              <a href="https://www.instagram.com/bsm_consulting?igsh=cXU0NzdnODE2dnl1&utm_source=qr" target="_blank" rel="noopener noreferrer">
                <InstagramIcon size={24} />
              </a>
              <a href="https://t.me/bsmtrade" target="_blank" rel="noopener noreferrer">
                <Send size={24} />
              </a>
              <a href="mailto:bsmconlog@gmail.com" target="_blank" rel="noopener noreferrer">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2016 BSM Logistics.</p>
        </div>
      </div>
    </footer>
  );
}
