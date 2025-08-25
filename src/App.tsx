import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider } from './contexts/LanguageContext';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { Wallet } from './components/Wallet';
import { Apps } from './components/Apps';
import { Refs } from './components/Refs';
import { Social } from './components/Social';
import { NFT } from './components/NFT';
import { Profile } from './components/Profile';
import { DatePickerDemo } from './components/DatePickerDemo';

type Screen = 'onboarding' | 'dashboard' | 'wallet' | 'apps' | 'refs' | 'social' | 'nft' | 'profile' | 'datepicker';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Check if onboarding was completed
    const onboardingCompleted = localStorage.getItem('onboarding-completed');
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
  }, []);

  // Update URL when screen changes
  const updateURL = (screen: Screen) => {
    const newURL = screen === 'onboarding' ? '/' : `/?screen=${screen}`;
    window.history.pushState({ screen }, '', newURL);
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleConnect = () => {
    // Mark onboarding as completed
    localStorage.setItem('onboarding-completed', 'true');
    setIsOnboardingCompleted(true);
    
    setCurrentScreen('dashboard');
    setActiveTab('dashboard');
    updateURL('dashboard');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const screen = tab as Screen;
    setCurrentScreen(screen);
    updateURL(screen);
  };

  const handleProfileClick = () => {
    setCurrentScreen('profile');
    updateURL('profile');
  };

  const handleProfileClose = () => {
    setCurrentScreen('dashboard');
    setActiveTab('dashboard');
    updateURL('dashboard');
  };

  const handleSocialAccess = () => {
    setCurrentScreen('social');
    updateURL('social');
  };

  const handleRefsAccess = () => {
    setCurrentScreen('refs');
    setActiveTab('refs');
    updateURL('refs');
  };

  const handleDatePickerDemo = () => {
    setCurrentScreen('datepicker');
    updateURL('datepicker');
  };

  // Reset onboarding (for development/testing purposes)
  const handleResetOnboarding = () => {
    localStorage.removeItem('onboarding-completed');
    setIsOnboardingCompleted(false);
    setCurrentScreen('onboarding');
    updateURL('onboarding');
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
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
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOnboardingCompleted]);

  const renderScreen = () => {
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
    <LanguageProvider>
      <div className="min-h-screen bg-background max-w-md mx-auto relative">
        {renderScreen()}
        {showNavigation && (
          <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
        )}
        <Toaster />
      </div>
    </LanguageProvider>
  );
}