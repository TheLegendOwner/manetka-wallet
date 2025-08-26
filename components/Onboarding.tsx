import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useLanguage } from '../contexts/LanguageContext';

interface OnboardingProps {
  onConnect: () => void;
}

export function Onboarding({ onConnect }: OnboardingProps) {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="text-6xl mb-4">💎</div>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-semibold text-foreground">{t('onboarding.welcome')}</h1>
          </div>
          <h1 className="text-3xl font-semibold text-primary">MANETKA</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('onboarding.subtitle')}
          </p>
        </div>

        {/* Connect Button */}
        <Button 
          onClick={onConnect}
          className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
        >
          {t('onboarding.connectWallet')}
        </Button>

        {/* Info Dialog */}
        <Dialog>
          <DialogTrigger className="text-primary hover:text-primary/80 transition-colors cursor-pointer">
            {language === 'ru' ? 'Что такое MANETKA? 📖' : 'What is MANETKA? 📖'}
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>
                {language === 'ru' ? 'Что такое MANETKA?' : 'What is MANETKA?'}
              </DialogTitle>
              <DialogDescription>
                {t('onboarding.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <p>
                {language === 'ru'
                  ? 'MANETKA - это инновационный стейблкоин в экосистеме TON, который приносит пассивный доход.'
                  : 'MANETKA is an innovative stablecoin in the TON ecosystem that generates passive income.'
                }
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {language === 'ru' ? 'Особенности:' : 'Features:'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t('onboarding.features.defiDesc')}</li>
                  <li>{t('onboarding.features.nftDesc')}</li>
                  <li>{language === 'ru' ? 'Реферальная система' : 'Referral system'}</li>
                  <li>{t('onboarding.features.secureDesc')}</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}