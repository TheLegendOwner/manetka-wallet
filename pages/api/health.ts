import { NextApiRequest, NextApiResponse } from 'next';
import { cors } from '../../utils/cors';

interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
  services: {
    [key: string]: {
      status: 'ok' | 'error' | 'degraded';
      responseTime?: number;
      lastCheck: string;
      message?: string;
    };
  };
  system: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    node: string;
    platform: string;
  };
}

// Кэш для результатов проверок
const healthCache = new Map<string, any>();
const CACHE_TTL = 30000; // 30 секунд

async function checkGetGemsAPI(): Promise<{ status: 'ok' | 'error'; responseTime: number; message?: string }> {
  const start = Date.now();
  
  try {
    const response = await fetch('https://api.getgems.io/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GETGEMS_API_KEY}`,
      },
      body: JSON.stringify({
        query: '{ __schema { queryType { name } } }',
      }),
      signal: AbortSignal.timeout(5000), // 5 секунд таймаут
    });

    if (response.ok) {
      return {
        status: 'ok',
        responseTime: Date.now() - start,
      };
    } else {
      return {
        status: 'error',
        responseTime: Date.now() - start,
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      responseTime: Date.now() - start,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function checkTONAPI(): Promise<{ status: 'ok' | 'error'; responseTime: number; message?: string }> {
  const start = Date.now();
  
  try {
    const response = await fetch('https://tonapi.io/v2/status', {
      signal: AbortSignal.timeout(5000), // 5 секунд таймаут
    });

    if (response.ok) {
      return {
        status: 'ok',
        responseTime: Date.now() - start,
      };
    } else {
      return {
        status: 'error',
        responseTime: Date.now() - start,
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      responseTime: Date.now() - start,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function getSystemInfo() {
  const memUsage = process.memoryUsage();
  
  return {
    memory: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
    },
    node: process.version,
    platform: process.platform,
  };
}

async function performHealthCheck(): Promise<HealthResponse> {
  const cacheKey = 'health-check';
  const cached = healthCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const startTime = Date.now();
  
  // Проверяем внешние сервисы параллельно
  const [getGemsCheck, tonApiCheck] = await Promise.all([
    checkGetGemsAPI(),
    checkTONAPI(),
  ]);

  const services = {
    getgems: {
      status: getGemsCheck.status,
      responseTime: getGemsCheck.responseTime,
      lastCheck: new Date().toISOString(),
      message: getGemsCheck.message,
    },
    tonapi: {
      status: tonApiCheck.status,
      responseTime: tonApiCheck.responseTime,
      lastCheck: new Date().toISOString(),
      message: tonApiCheck.message,
    },
    database: {
      status: 'ok' as const, // Пока используем mock данные
      lastCheck: new Date().toISOString(),
      message: 'Using mock data',
    },
  };

  // Определяем общий статус
  const hasErrors = Object.values(services).some(service => service.status === 'error');
  const overallStatus = hasErrors ? 'error' : 'ok';

  const healthData: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    services,
    system: getSystemInfo(),
  };

  // Кэшируем результат
  healthCache.set(cacheKey, {
    data: healthData,
    timestamp: Date.now(),
  });

  return healthData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<HealthResponse>) {
  // Применяем CORS
  await cors(req, res);

  // Поддерживаем только GET запросы
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: 0,
      environment: 'unknown',
      services: {},
      system: {
        memory: { used: 0, total: 0, percentage: 0 },
        node: '',
        platform: '',
      },
    } as HealthResponse);
  }

  try {
    const healthData = await performHealthCheck();
    
    // Устанавливаем соответствующий статус HTTP
    const httpStatus = healthData.status === 'ok' ? 200 : 503;
    
    // Устанавливаем заголовки кэширования
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(httpStatus).json(healthData);
  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse: HealthResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      services: {
        system: {
          status: 'error',
          lastCheck: new Date().toISOString(),
          message: error instanceof Error ? error.message : 'System error',
        },
      },
      system: getSystemInfo(),
    };

    return res.status(503).json(errorResponse);
  }
}