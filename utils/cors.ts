import { NextApiRequest, NextApiResponse } from 'next';

interface CorsOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const defaultOptions: CorsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://manetka-wallet.vercel.app',
        'https://manetka-wallet.com',
        'https://www.manetka-wallet.com'
      ]
    : true, // В режиме разработки разрешаем все origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-CSRF-Token'
  ],
  credentials: false,
  maxAge: 86400, // 24 часа
};

function isOriginAllowed(origin: string | undefined, allowedOrigin: string | string[] | boolean): boolean {
  if (allowedOrigin === true) {
    return true;
  }
  
  if (allowedOrigin === false || !origin) {
    return false;
  }
  
  if (typeof allowedOrigin === 'string') {
    return origin === allowedOrigin;
  }
  
  if (Array.isArray(allowedOrigin)) {
    return allowedOrigin.includes(origin);
  }
  
  return false;
}

export async function cors(
  req: NextApiRequest, 
  res: NextApiResponse, 
  options: CorsOptions = {}
): Promise<void> {
  const opts = { ...defaultOptions, ...options };
  
  // Получаем origin из заголовков
  const origin = req.headers.origin;
  
  // Проверяем разрешен ли origin
  if (isOriginAllowed(origin, opts.origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  // Устанавливаем остальные CORS заголовки
  if (opts.credentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  if (opts.methods && opts.methods.length > 0) {
    res.setHeader('Access-Control-Allow-Methods', opts.methods.join(', '));
  }
  
  if (opts.allowedHeaders && opts.allowedHeaders.length > 0) {
    res.setHeader('Access-Control-Allow-Headers', opts.allowedHeaders.join(', '));
  }
  
  if (opts.maxAge) {
    res.setHeader('Access-Control-Max-Age', opts.maxAge.toString());
  }
  
  // Обрабатываем preflight запросы
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
}

// Middleware функция для упрощения использования
export function corsMiddleware(options?: CorsOptions) {
  return async (req: NextApiRequest, res: NextApiResponse, next?: () => void) => {
    await cors(req, res, options);
    if (next) {
      next();
    }
  };
}

// Предустановленные конфигурации для разных случаев
export const corsConfigs = {
  // Для публичных API
  public: {
    origin: true,
    credentials: false,
  },
  
  // Для защищенных API
  protected: {
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'https://manetka-wallet.vercel.app',
          'https://manetka-wallet.com'
        ]
      : true,
    credentials: true,
  },
  
  // Только для разработки
  development: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  },
  
  // Строгий режим для продакшн
  strict: {
    origin: [
      'https://manetka-wallet.vercel.app',
      'https://manetka-wallet.com'
    ],
    credentials: false,
    methods: ['GET', 'POST'],
  },
};

export default cors;