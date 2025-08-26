import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';
import { useNFTCollection, getRarityColor } from '../hooks/useNFTCollection';
import { 
  Wallet, 
  TrendingUp, 
  Gift, 
  Settings, 
  Users, 
  Share,
  Coins,
  Zap,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface DashboardProps {
  onProfileClick: () => void;
  onSocialClick: () => void;
  onRefsClick: () => void;
}

const MANETKA_COLLECTION_ADDRESS = 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c';
const MOCK_WALLET_ADDRESS = 'EQD4FPq-PRDieyQKkarsNWukQ5zZPMgOAbnvnQXiYqjS4NTD';

export function Dashboard({ onProfileClick, onSocialClick, onRefsClick }: DashboardProps) {
  const { t } = useLanguage();
  const { userNFTs, isLoading, error, fetchUserNFTs, calculateTotalBoost, clearError, isConnected } = useNFTCollection();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for demonstration
  const [mockData] = useState({
    manetkaBalance: 15420.50,
    usdValue: 15420.50,
    tonRewards: 12.75,
    dailyIncome: 24.50,
    connectedWallets: [
      {
        id: 1,
        name: 'Main Wallet',
        address: 'EQD4FP...4NTD',
        balance: '15,420.50',
        isActive: true,
      },
      {
        id: 2,
        name: 'Secondary',
        address: 'EQBvGA...1vEG',
        balance: '2,850.00',
        isActive: false,
      }
    ]
  });

  // Load user NFTs on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        await fetchUserNFTs(MOCK_WALLET_ADDRESS, MANETKA_COLLECTION_ADDRESS);
      } catch (error) {
        console.error('Failed to load user NFTs:', error);
      }
    };

    loadUserData();
  }, [fetchUserNFTs]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    clearError();
    
    try {
      await fetchUserNFTs(MOCK_WALLET_ADDRESS, MANETKA_COLLECTION_ADDRESS);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUserNFTs, clearError]);

  const totalBoost = calculateTotalBoost();
  const boostedIncome = mockData.dailyIncome * (1 + totalBoost / 100);

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">
            {t('onboarding.welcome')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-10 w-10 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onProfileClick}
            className="h-10 w-10 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* API Status */}
      {!isConnected && (
        <Card className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Демо режим - подключитесь для просмотра реальных данных
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-700 dark:text-red-300"
              >
                ✕
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balance Card */}
      <Card className="mb-6 bg-gradient-to-br from-primary/10 to-amber-100 dark:from-primary/20 dark:to-amber-900/20 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Coins className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{t('dashboard.totalBalance')}</span>
            </div>
            <Badge variant="outline" className="bg-white/50 dark:bg-black/20">
              MANETKA
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">
              {mockData.manetkaBalance.toLocaleString('ru-RU', { 
                minimumFractionDigits: 2 
              })}
            </div>
            <div className="text-lg text-muted-foreground">
              ≈ ${mockData.usdValue.toLocaleString('en-US', { 
                minimumFractionDigits: 2 
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">{t('dashboard.tonRewards')}</span>
            </div>
            <div className="text-xl font-semibold text-green-600 dark:text-green-400">
              +{mockData.tonRewards} TON
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Сегодня
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Дневной доход</span>
            </div>
            <div className="text-xl font-semibold">
              +{boostedIncome.toFixed(2)}
            </div>
            {totalBoost > 0 && (
              <div className="text-xs text-primary mt-1">
                +{totalBoost}% {t('dashboard.boost')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* NFT Boosts Section */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            NFT Бусты
            {userNFTs.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {userNFTs.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">{t('common.loading')}</span>
              </div>
            </div>
          ) : userNFTs.length > 0 ? (
            <div className="space-y-3">
              {userNFTs.map((nft) => (
                <div
                  key={nft.address}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <ImageWithFallback
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{nft.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getRarityColor(nft.rarity)}`}
                      >
                        {nft.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {nft.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      +{nft.boost}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('dashboard.boost')}
                    </div>
                  </div>
                </div>
              ))}
              
              {totalBoost > 0 && (
                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Общий буст</span>
                    <span className="text-lg font-semibold text-primary">+{totalBoost}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Дополнительно в день: +{(boostedIncome - mockData.dailyIncome).toFixed(2)} MANETKA
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                У вас пока нет NFT бустов
              </p>
              <Button variant="outline" size="sm">
                Изучить NFT
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connected Wallets */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-primary" />
            {t('dashboard.connectedWallets')}
            <Badge variant="secondary" className="ml-auto">
              {mockData.connectedWallets.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockData.connectedWallets.map((wallet) => (
            <div
              key={wallet.id}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`w-3 h-3 rounded-full ${
                wallet.isActive ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{wallet.name}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {wallet.address}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {wallet.balance}
                </div>
                <div className="text-xs text-muted-foreground">
                  MANETKA
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-1"
              onClick={onSocialClick}
            >
              <Share className="h-5 w-5" />
              <span className="text-xs">Соцсети</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-1"
              onClick={onRefsClick}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs">Рефералы</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}