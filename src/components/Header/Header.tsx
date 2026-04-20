'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/navigation';
import { useTheme } from 'next-themes';
import { useLoading } from '@/components/LoadingProvider/LoadingProvider';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Globe, Sun, Moon, Menu, X } from 'lucide-react';
import './style.scss';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { setIsLoading } = useLoading();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const switchLocale = (newLocale: string) => {
    setIsLoading(true);
    setIsLangOpen(false);

    if (newLocale === 'uz') {
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `NEXT_LOCALE=uz; path=/; max-age=31536000; SameSite=Lax`;

      window.location.assign(pathname);
      return;
    }

    router.replace(pathname, { locale: newLocale });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const navItems = [
    { name: t('nav_home'), href: '/' },
    { name: t('nav_services'), href: '/#services' },
    { name: t('nav_blog'), href: '/#blog' },
    { name: t('nav_about'), href: '/#about' },
  ];


  if (!mounted) return null;

  return (
    <header className="header-site">
      <div className="container header-inner">
        <Link href="/" className="header-logo">
          BSM <span>Logistics</span>
        </Link>

        <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="header-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="header-locale-switcher" ref={langRef}>
            <button
              className={`lang-toggle ${isLangOpen ? 'active' : ''}`}
              onClick={() => setIsLangOpen(!isLangOpen)}
            >
              <Globe size={18} />
              <span>{locale.toUpperCase()}</span>
              <ChevronDown size={14} className={`chevron-icon ${isLangOpen ? 'rotate' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  className="lang-dropdown"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {['uz', 'ru', 'en'].map((lang) => (
                    <button
                      key={lang}
                      className={`lang-option ${locale === lang ? 'active' : ''}`}
                      onClick={() => switchLocale(lang)}
                    >
                      <span className="lang-text">{lang.toUpperCase()}</span>
                      {locale === lang && <Check size={14} className="check-icon" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="header-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link href="/#feedback" className="header-cta-button">
            {t('nav_contact')}
          </Link>


          <button
            className="header-mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
