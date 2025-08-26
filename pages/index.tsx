import { useState, useEffect } from 'react';
import { Toaster } from '../components/ui/sonner';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Onboarding } from '../components/Onboarding';
import { Dashboard } from '../components/Dashboard';
import { Navigation } from '../components/Navigation';
import { Wallet } from '../components/Wallet';
import { Apps } from '../components/Apps';
import { Refs } from '../components/Refs';
import { Social } from '../components/Social';
import { NFT } from '../components/NFT';
import { Profile } from '../components/Profile';
import { DatePickerDemo } from '../components/DatePickerDemo';

type Screen = 'onboarding' | 'dashboard' | 'wallet' | 'apps' | 'refs' | 'social' | 'nft' | 'profile' | 'datepicker';

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      // Load theme from localStorage
      const savedTheme = localStorage?.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }

      // Check if onboarding was completed
      const onboardingCompleted = localStorage?.getItem('onboarding-completed');
      const isCompleted = onboardingCompleted === 'true';
      setIsOnboardingCompleted(isCompleted);

      // Handle URL parameters for direct navigation
      const urlParams = new URLSearchParams(window.location.search);
      const screenParam = urlParams.get('screen') as Screen;
      
      // If there's a screen parameter and onboarding is completed, navigate to that screen
      if (screenParam && isCompleted && ['dashboard', 'wallet', 'apps', 'refs', 'social', 'nft', 'profile', 'datepicker'].includes(screenParam)) {
        setCurrentScreen(screenParam);
        if (['dashboard', 'wallet', 'apps', 'refs', 'social', 'nft'].includes(screenParam)) {
          setActiveTab(screenParam);
        }
      } else if (isCompleted) {
        // If onboarding is completed but no specific screen, go to dashboard
        setCurrentScreen('dashboard');
        setActiveTab('dashboard');
      } else {
        // If onboarding is not completed, show onboarding
        setCurrentScreen('onboarding');
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Error during app initialization:', error);
      setIsInitialized(true); // Still allow the app to render
    }
  }, []);

  // Update URL when screen changes
  const updateURL = (screen: Screen) => {
    try {
      const newURL = screen === 'onboarding' ? '/' : `/?screen=${screen}`;
      window.history.pushState({ screen }, '', newURL);
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  };

  const toggleTheme = () => {
    try {
      const newIsDarkMode = !isDarkMode;
      setIsDarkMode(newIsDarkMode);
      
      if (newIsDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage?.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage?.setItem('theme', 'light');
      }
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const handleConnect = () => {
    try {
      // Mark onboarding as completed
      localStorage?.setItem('onboarding-completed', 'true');
      setIsOnboardingCompleted(true);
      
      setCurrentScreen('dashboard');
      setActiveTab('dashboard');
      updateURL('dashboard');
    } catch (error) {
      console.error('Error handling connect:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    try {
      setActiveTab(tab);
      const screen = tab as Screen;
      setCurrentScreen(screen);
      updateURL(screen);
    } catch (error) {
      console.error('Error changing tab:', error);
    }
  };

  const handleProfileClick = () => {
    try {
      setCurrentScreen('profile');
      updateURL('profile');
    } catch (error) {
      console.error('Error opening profile:', error);
    }
  };

  const handleProfileClose = () => {
    try {
      setCurrentScreen('dashboard');
      setActiveTab('dashboard');
      updateURL('dashboard');
    } catch (error) {
      console.error('Error closing profile:', error);
    }
  };

  const handleSocialAccess = () => {
    try {
      setCurrentScreen('social');
      updateURL('social');
    } catch (error) {
      console.error('Error accessing social:', error);
    }
  };

  const handleRefsAccess = () => {
    try {
      setCurrentScreen('refs');
      setActiveTab('refs');
      updateURL('refs');
    } catch (error) {
      console.error('Error accessing refs:', error);
    }
  };

  const handleDatePickerDemo = () => {
    try {
      setCurrentScreen('datepicker');
      updateURL('datepicker');
    } catch (error) {
      console.error('Error opening date picker demo:', error);
    }
  };

  // Reset onboarding (for development/testing purposes)
  const handleResetOnboarding = () => {
    try {
      localStorage?.removeItem('onboarding-completed');
      setIsOnboardingCompleted(false);
      setCurrentScreen('onboarding');
      updateURL('onboarding');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      try {
        if (!isOnboardingCompleted) {
          // If onboarding is not completed, always show onboarding
          setCurrentScreen('onboarding');
          return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const screenParam = urlParams.get('screen') as Screen;
        
        if (screenParam && ['dashboard', 'wallet', 'apps', 'refs', 'social', 'nft', 'profile', 'datepicker'].includes(screenParam)) {
          setCurrentScreen(screenParam);
          if (['dashboard', 'wallet', 'apps', 'refs', 'social', 'nft'].includes(screenParam)) {
            setActiveTab(screenParam);
          }
        } else {
          setCurrentScreen('dashboard');
          setActiveTab('dashboard');
        }
      } catch (error) {
        console.error('Error handling popstate:', error);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOnboardingCompleted]);

  const renderScreen = () => {
    try {
      switch (currentScreen) {
        case 'onboarding':
          return <Onboarding onConnect={handleConnect} />;
        case 'dashboard':
          return (
            <Dashboard 
              onProfileClick={handleProfileClick} 
              onSocialClick={handleSocialAccess}
              onRefsClick={handleRefsAccess}
            />
          );
        case 'wallet':
          return <Wallet />;
        case 'apps':
          return <Apps onDatePickerDemo={handleDatePickerDemo} />;
        case 'refs':
          return <Refs />;
        case 'social':
          return <Social />;
        case 'nft':
          return <NFT />;
        case 'profile':
          return (
            <Profile 
              onClose={handleProfileClose} 
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
              onResetOnboarding={handleResetOnboarding}
            />
          );
        case 'datepicker':
          return <DatePickerDemo />;
        default:
          return isOnboardingCompleted ? (
            <Dashboard 
              onProfileClick={handleProfileClick} 
              onSocialClick={handleSocialAccess}
              onRefsClick={handleRefsAccess}
            />
          ) : (
            <Onboarding onConnect={handleConnect} />
          );
      }
    } catch (error) {
      console.error('Error rendering screen:', error);
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold mb-2">Ошибка загрузки экрана</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }
  };

  const showNavigation = currentScreen !== 'onboarding' && currentScreen !== 'profile' && currentScreen !== 'datepicker';

  // Don't render anything until initialization is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto relative flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <div className="min-h-screen bg-background max-w-md mx-auto relative">
          {renderScreen()}
          {showNavigation && (
            <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
          )}
          <Toaster />
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
}