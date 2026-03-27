'use client';

import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import Stats from '@/components/Stats/Stats';
import Services from '@/components/Services/Services';
import About from '@/components/About/About';
import Blog from '@/components/Blog/Blog';
import Partners from '@/components/Partners/Partners';
import Feedback from '@/components/Feedback/Feedback';
import Footer from '@/components/Footer/Footer';
import * as React from 'react';

export default function IndexPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  React.use(params);
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <About />
        <Blog />
        <Partners />
        <Feedback />
      </main>
      <Footer />
    </>
  );
}
