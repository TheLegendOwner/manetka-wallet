import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Инициализация приложения
    console.log('MANETKA WALLET v1.0.0 initialized');
    
    // Регистрация Service Worker для PWA функциональности
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Предотвращение zoom на iOS
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }

    // Отключение контекстного меню на продакшн
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('selectstart', (e) => e.preventDefault());
      document.addEventListener('dragstart', (e) => e.preventDefault());
    }
  }, []);

  return (
    <>
      <Head>
        <title>MANETKA WALLET - Crypto Wallet for MANETKA Stablecoin</title>
        <meta name="description" content="MANETKA WALLET - Secure crypto wallet for MANETKA stablecoin with TON Connect integration, passive income, NFT boosts, and referral rewards." />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        
        {/* Theme colors */}
        <meta name="theme-color" content="#f59e0b" />
        <meta name="msapplication-TileColor" content="#f59e0b" />
        
        {/* Apple specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MANETKA WALLET" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="MANETKA WALLET" />
        <meta property="og:title" content="MANETKA WALLET - Crypto Wallet" />
        <meta property="og:description" content="Secure crypto wallet for MANETKA stablecoin with TON Connect integration" />
        <meta property="og:image" content="/favicon.svg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="MANETKA WALLET" />
        <meta name="twitter:description" content="Secure crypto wallet for MANETKA stablecoin" />
        
        {/* Security */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Preconnect для внешних ресурсов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="//api.getgems.io" />
        <link rel="dns-prefetch" href="//tonapi.io" />
      </Head>
      
      <Component {...pageProps} />
    </>
  );
}