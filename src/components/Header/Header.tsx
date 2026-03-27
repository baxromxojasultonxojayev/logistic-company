'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import './style.scss';

export default function Header() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const navItems = [
    { name: t('home'), href: '/' },
    { name: t('services'), href: '/#services' },
    { name: t('blog'), href: '/#blog' },
    { name: t('about'), href: '/#about' },
  ];

  if (!mounted) return null;

  return (
    <header className="header-site">
      <div className="container header-inner">
        <Link href="/" className="header-logo">
          BSM <span>Consulting</span>
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
          <div className="header-locale-switcher">
            <Globe size={18} />
            <select 
              value={locale} 
              onChange={(e) => switchLocale(e.target.value)}
              className="header-select"
            >
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
          </div>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="header-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="header-cta-button">
            {t('contact')}
          </button>

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
