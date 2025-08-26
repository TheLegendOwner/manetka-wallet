import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ExternalLink, MessageCircle, Instagram, Play, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Social() {
  const { t, language } = useLanguage();
  
  const socialLinks = [
    {
      name: language === 'ru' ? 'Telegram Чат' : 'Telegram Chat',
      description: language === 'ru' ? 'Открыть чат' : 'Open chat',
      icon: MessageCircle,
      url: 'https://t.me/manetka_chat',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
      members: '2.3K'
    },
    {
      name: 'Instagram',
      description: language === 'ru' ? 'Следить за новостями' : 'Follow news',
      icon: Instagram,
      url: 'https://instagram.com/manetka_official',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300',
      members: '1.8K'
    },
    {
      name: 'YouTube',
      description: language === 'ru' ? 'Смотреть видео' : 'Watch videos',
      icon: Play,
      url: 'https://youtube.com/manetka',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
      members: '950'
    },
    {
      name: language === 'ru' ? 'VK Группа' : 'VK Group',
      description: language === 'ru' ? 'Русское сообщество' : 'Russian community',
      icon: MessageCircle,
      url: 'https://vk.com/manetka_official',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
      members: '1.2K'
    }
  ];

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">{t('social.title')}</h1>

        {/* Raid Alert */}
        <Card className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 dark:from-orange-900/20 dark:to-red-900/20 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
              <Zap size={20} />
              {language === 'ru' ? 'Рейды' : 'Raids'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 dark:text-orange-300 mb-4">
              {language === 'ru' 
                ? 'Участвуйте в рейдах и получайте дополнительные награды!'
                : 'Participate in raids and earn additional rewards!'
              }
            </p>
            <Button 
              onClick={() => handleLinkClick('https://t.me/manetka_raids')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {language === 'ru' ? 'Присоединиться к рейдам' : 'Join raids'} 🚀
            </Button>
          </CardContent>
        </Card>

        {/* Social Links */}
        <div className="space-y-4">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${social.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{social.name}</h3>
                        <Button 
                          size="sm"
                          className="text-xs px-2 py-1 h-5 rounded-full bg-green-100 text-green-700 hover:bg-green-100 cursor-default pointer-events-none dark:bg-green-900/30 dark:text-green-300"
                        >
                          {social.members}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{social.description}</p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleLinkClick(social.url)}
                      className="shrink-0"
                    >
                      {t('common.open')}
                      <ExternalLink size={14} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Community Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{language === 'ru' ? 'Статистика сообщества' : 'Community Stats'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-semibold text-blue-600">6.2K</div>
                <div className="text-sm text-muted-foreground">{language === 'ru' ? 'Всего участников' : 'Total members'}</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-semibold text-green-600">24/7</div>
                <div className="text-sm text-muted-foreground">{language === 'ru' ? 'Поддержка сообщества' : 'Community support'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter */}
        <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 dark:from-purple-900/20 dark:to-blue-900/20 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-800 dark:text-purple-200">
              📧 {language === 'ru' ? 'Новостная рассылка' : 'Newsletter'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700 dark:text-purple-300 mb-4">
              {language === 'ru' 
                ? 'Подпишитесь на нашу рассылку и получайте последние новости!'
                : 'Subscribe to our newsletter and get the latest news!'
              }
            </p>
            <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950">
              {language === 'ru' ? 'Подписаться' : 'Subscribe'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}