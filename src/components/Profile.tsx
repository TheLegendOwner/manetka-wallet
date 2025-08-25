import { ArrowLeft, Moon, Sun, Settings, User, Wallet, Shield, HelpCircle, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileProps {
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onResetOnboarding?: () => void;
}

export function Profile({ onClose, isDarkMode, onToggleTheme, onResetOnboarding }: ProfileProps) {
  const { language, toggleLanguage, t } = useLanguage();

  const mockUser = {
    name: 'CryptoUser',
    username: '@cryptouser',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-medium">{t('profile.title')}</h1>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="font-medium text-lg">{mockUser.name}</h2>
            <p className="text-muted-foreground">{mockUser.username}</p>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-1">
          <h3 className="font-medium mb-3">{t('profile.settings')}</h3>
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <span>{t('profile.darkMode')}</span>
            </div>
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={onToggleTheme}
            />
          </div>

          <Separator />

          {/* Language Toggle */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span>{t('profile.language')}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-primary"
            >
              {language === 'en' ? 'Русский' : 'English'}
            </Button>
          </div>

          <Separator />

          {/* Account Settings */}
          <div className="space-y-1 mt-6">
            <Button
              variant="ghost"
              className="w-full justify-start h-12"
            >
              <Wallet className="w-5 h-5 mr-3 text-muted-foreground" />
              {t('profile.walletSettings')}
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start h-12"
            >
              <Shield className="w-5 h-5 mr-3 text-muted-foreground" />
              {t('profile.security')}
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start h-12"
            >
              <HelpCircle className="w-5 h-5 mr-3 text-muted-foreground" />
              {t('profile.help')}
            </Button>

            <Separator className="my-4" />

            {/* Development/Testing Options */}
            {onResetOnboarding && (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-amber-600 dark:text-amber-400"
                  onClick={onResetOnboarding}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Reset Onboarding
                </Button>
                <Separator className="my-4" />
              </>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-destructive"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {t('profile.logout')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}