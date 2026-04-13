import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import Stats from '@/components/Stats/Stats';
import Services from '@/components/Services/Services';
import About from '@/components/About/About';
import Blog from '@/components/Blog/Blog';
import Partners from '@/components/Partners/Partners';
import Locations from '@/components/Locations/Locations';
import Feedback from '@/components/Feedback/Feedback';
import Footer from '@/components/Footer/Footer';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import LocaleProvider from './LocaleProvider';

export default async function IndexPage() {
  const locale = routing.defaultLocale;

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <LocaleProvider locale={locale} messages={messages}>
      <main>
        <Hero />
        <Stats />
        <Services />
        <About />
        <Locations />
        <Blog />
        <Partners />
        <Feedback />
      </main>
    </LocaleProvider>
  );
}
