import Hero from '@/components/Hero/Hero';
import Stats from '@/components/Stats/Stats';
import Services from '@/components/Services/Services';
import About from '@/components/About/About';
import Blog from '@/components/Blog/Blog';
import Partners from '@/components/Partners/Partners';
import Locations from '@/components/Locations/Locations';
import Feedback from '@/components/Feedback/Feedback';

export default function HomeContent() {
  return (
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
  );
}
