import localFont from 'next/font/local';

// Only the Black weight is used (titles, logo, partners heading)
export const aeonik = localFont({
  src: [
    {
      path: '../../public/fonts/aeonik/AeonikPro-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-aeonik',
  display: 'swap',
});

export const neuething = localFont({
  src: [
    {
      path: '../../public/fonts/neuething/NeuethingSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/neuething/NeuethingSans-Meduim.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/neuething/NeuethingSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/neuething/NeuethingSans-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-neuething',
  display: 'swap',
});
