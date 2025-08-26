/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация для продакшн
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Статический экспорт для лучшей производительности
  output: 'standalone',
  
  // Настройки изображений
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: true
  },

  // Конфигурация для API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  },

  // Headers для безопасности
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Webpack конфигурация
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Игнорировать предупреждения Node.js модулей в браузере
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // Переменные окружения
  env: {
    NEXT_PUBLIC_APP_NAME: 'MANETKA WALLET',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    NEXT_PUBLIC_GETGEMS_API_KEY: process.env.GETGEMS_API_KEY || '1756153701179-mainnet-10274134-r-eY11DKHnMng45JUs0EF4MheNLAKubWzapB3CvwkvyzRSDds0'
  },

  // Экспериментальные функции
  experimental: {
    appDir: false, // Используем Pages Router
    optimizeCss: true,
    scrollRestoration: true
  },

  // Настройки TypeScript
  typescript: {
    ignoreBuildErrors: false
  },

  // Настройки ESLint
  eslint: {
    ignoreDuringBuilds: false
  }
};

module.exports = nextConfig;