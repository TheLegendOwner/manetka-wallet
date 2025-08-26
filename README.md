# MANETKA WALLET

Криптокошелёк для стейблкоина MANETKA с интеграцией TON Connect.

## ✅ Миграция завершена!

Проект успешно мигрирован с Vite на Next.js. Все конфликтующие файлы удалены.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшн
npm run build

# Запуск продакшн версии
npm start
```

Приложение будет доступно на `http://localhost:3000`

## 📁 Структура проекта

```
├── pages/                  # Страницы Next.js
│   ├── _app.tsx            # Корневой компонент приложения
│   ├── _document.tsx       # HTML документ
│   ├── index.tsx           # Главная страница
│   └── api/                # API маршруты
├── components/             # React компоненты
│   ├── ui/                 # UI компоненты (ShadCN)
│   └── figma/              # Figma специфичные компоненты
├── contexts/               # React контексты
├── hooks/                  # Пользовательские хуки
├── styles/                 # Стили (Tailwind CSS)
├── locales/                # Локализация
└── utils/                  # Утилиты
```

## 🔧 Технологии

- **Framework**: Next.js 14+ (Pages Router)
- **UI**: React 18+ + TypeScript
- **Styling**: Tailwind CSS v4 + ShadCN/UI
- **Icons**: Lucide React
- **Blockchain**: TON Connect
- **API**: GetGems GraphQL
- **PWA**: Service Worker + Manifest
- **Deployment**: Vercel ready

## 🌍 Локализация

Приложение поддерживает русский и английский языки с автоматическим сохранением выбранного языка.

## 🎨 Функции

- ✅ Онбординг с подключением TON кошелька
- ✅ Дашборд с балансом и пассивным доходом  
- ✅ NFT галерея с бустами разной редкости
- ✅ Реферальная система с наградами в TON
- ✅ Управление подключенными кошельками
- ✅ Темная/светлая тема
- ✅ Mobile-first дизайн
- ✅ PWA функциональность

## 🔗 API интеграции

- **GetGems API**: Загрузка NFT коллекций
- **TON Connect**: Подключение кошельков
- **Mock данные**: Fallback при недоступности API

## 📱 PWA

Приложение работает как PWA с поддержкой:
- Service Worker
- Оффлайн режим
- Установка на домашний экран
- Push уведомления (в разработке)

## 🚀 Деплой

```bash
# Деплой на Vercel
npm run build
# или
vercel deploy
```

## 🛠 Разработка

### Навигация по экранам

Добавьте параметр `screen` к URL для навигации:
- `/` - Онбординг (если не завершен)
- `/?screen=dashboard` - Главный экран
- `/?screen=wallet` - Кошелек
- `/?screen=apps` - Приложения
- `/?screen=refs` - Рефералы
- `/?screen=social` - Социальные сети
- `/?screen=nft` - NFT галерея
- `/?screen=profile` - Профиль

### Переменные окружения

Создайте файл `.env.local` на основе `.env.local.example`:

```bash
cp .env.local.example .env.local
```

### Сброс онбординга

В профиле пользователя есть кнопка "Сбросить онбординг" для разработки.

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

---

**MANETKA WALLET** - Ваш надежный криптокошелек для TON экосистемы 🚀