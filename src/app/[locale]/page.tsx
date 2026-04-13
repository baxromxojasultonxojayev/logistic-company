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
import { setRequestLocale } from 'next-intl/server';


export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'uz' },
    { locale: 'ru' }
  ];
}

export const dynamicParams = false;

export default async function IndexPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
}
