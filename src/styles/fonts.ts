import localFont from 'next/font/local';

export const aeonik = localFont({
  src: [
    {
      path: '../../public/fonts/aeonik/AeonikPro-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/aeonik/AeonikPro-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/aeonik/AeonikPro-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/aeonik/AeonikPro-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-aeonik',
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
});
