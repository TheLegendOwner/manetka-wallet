import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { ExternalLink, Filter, ArrowUpDown, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';
import { useNFTCollection, type NFTItem } from '../hooks/useNFTCollection';
import { NFTUtils, MANETKA_COLLECTION_ADDRESS } from '../utils/getgems-api';

export function NFT() {
  const { t, language } = useLanguage();
  
  const {
    collection,
    myNFTs,
    marketNFTs,
    isLoading,
    error,
    rarityFilter,
    sortType,
    setRarityFilter,
    setSortType,
    refresh,
    totalBoost,
    maxPossibleBoost,
    isUsingMockData
  } = useNFTCollection(MANETKA_COLLECTION_ADDRESS);

  const [activeTab, setActiveTab] = useState('my-collection');
  const [isOnline, setIsOnline] = useState(true);

  // Отслеживаем состояние сети
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // NFT Card Component
  const NFTCard = ({ nft, showPrice = false }: { nft: NFTItem; showPrice?: boolean; }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageWithFallback
          src={nft.image}
          alt={nft.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={NFTUtils.getRarityColor(nft.rarity)}>
            {NFTUtils.getRarityDisplayName(nft.rarity, language as 'en' | 'ru')}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="bg-black/70 text-white border-0">
            {language === 'ru' ? `+${nft.boost}% Буст` : `+${nft.boost}% Boost`}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 truncate">{nft.name}</h3>
        
        <div className="flex justify-between items-center mb-3">
          {showPrice && nft.price !== '0 TON' ? (
            <span className="font-semibold text-primary">
              {NFTUtils.formatPrice(nft.price)}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {nft.owned ? t('nft.owned') : t('nft.notOwned')}
            </span>
          )}
          
          <div className="flex items-center gap-1">
            {nft.owned && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                {t('nft.active')}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {nft.forSale && !nft.owned && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(`https://getgems.io/item/${nft.address}`, '_blank')}
            >
              <ExternalLink size={14} className="mr-1" />
              {language === 'ru' ? 'Купить' : 'Buy'}
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(`https://getgems.io/item/${nft.address}`, '_blank')}
          >
            <ExternalLink size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="w-full h-48" />
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div className="text-center py-12">
      <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{t('nft.error')}</h3>
      <p className="text-muted-foreground mb-6">
        {error || (language === 'ru' ? 'Не удалось загрузить NFT' : 'Failed to load NFTs')}
      </p>
      <Button onClick={refresh} variant="outline">
        <RefreshCw size={16} className="mr-2" />
        {t('nft.retry')}
      </Button>
    </div>
  );

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="flex items-center gap-2 text-xs">
      {isOnline ? (
        <>
          <Wifi size={12} className="text-green-500" />
          <span className="text-green-600">
            {language === 'ru' ? 'Онлайн' : 'Online'}
          </span>
        </>
      ) : (
        <>
          <WifiOff size={12} className="text-red-500" />
          <span className="text-red-600">
            {language === 'ru' ? 'Офлайн' : 'Offline'}
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{t('nft.title')}</h1>
            <ConnectionStatus />
          </div>
          <Button 
            onClick={refresh} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </div>

        {/* Collection Info */}
        {collection && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <ImageWithFallback
                  src={collection.image}
                  alt={collection.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{collection.name}</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    {collection.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {language === 'ru' ? 'Предметов:' : 'Items:'}
                      </span>
                      <span className="ml-2 font-semibold">
                        {collection.items_count.toLocaleString()}
                      </span>
                    </div>
                    
                    {collection.floor_price && (
                      <div>
                        <span className="text-muted-foreground">
                          {language === 'ru' ? 'Мин. цена:' : 'Floor:'}
                        </span>
                        <span className="ml-2 font-semibold text-primary">
                          {collection.floor_price.value} {collection.floor_price.token_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-primary">{myNFTs.length}</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'ru' ? 'В коллекции' : 'Owned NFTs'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-primary">+{totalBoost}%</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'ru' ? 'Общий буст' : 'Total Boost'}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>{language === 'ru' ? 'Прогресс буста' : 'Boost Progress'}</span>
                <span>{totalBoost}% / {maxPossibleBoost}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((totalBoost / maxPossibleBoost) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Status Notice */}
        {isUsingMockData && (
          <Card className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">
                  {language === 'ru' 
                    ? 'Демо режим - данные получены через Node.js API с fallback на тестовые данные' 
                    : 'Demo mode - data fetched via Node.js API with fallback to test data'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="my-collection">{t('nft.myCollection')}</TabsTrigger>
            <TabsTrigger value="marketplace">{t('nft.marketplace')}</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter size={16} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'ru' ? 'Все' : 'All'}
                </SelectItem>
                <SelectItem value="LEGENDARY">{t('nft.rarity.legendary')}</SelectItem>
                <SelectItem value="EPIC">{t('nft.rarity.epic')}</SelectItem>
                <SelectItem value="RARE">{t('nft.rarity.rare')}</SelectItem>
                <SelectItem value="COMMON">{t('nft.rarity.common')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortType} onValueChange={setSortType}>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown size={16} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">
                  {language === 'ru' ? 'Цена ↑' : 'Price ↑'}
                </SelectItem>
                <SelectItem value="price-desc">
                  {language === 'ru' ? 'Цена ↓' : 'Price ↓'}
                </SelectItem>
                <SelectItem value="rarity-desc">
                  {language === 'ru' ? 'Редкость ↓' : 'Rarity ↓'}
                </SelectItem>
                <SelectItem value="rarity-asc">
                  {language === 'ru' ? 'Редкость ↑' : 'Rarity ↑'}
                </SelectItem>
                <SelectItem value="name-asc">
                  {language === 'ru' ? 'Имя ↑' : 'Name ↑'}
                </SelectItem>
                <SelectItem value="name-desc">
                  {language === 'ru' ? 'Имя ↓' : 'Name ↓'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <TabsContent value="my-collection">
            {error ? (
              <ErrorComponent />
            ) : isLoading ? (
              <LoadingSkeleton />
            ) : myNFTs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🖼️</div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'ru' ? 'Коллекция пуста' : 'No NFTs in collection'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'ru' 
                    ? 'Купите первый NFT чтобы начать получать бусты!' 
                    : 'Buy your first NFT to start earning boosts!'}
                </p>
                <Button 
                  onClick={() => setActiveTab('marketplace')}
                  variant="outline"
                >
                  {language === 'ru' ? 'Перейти к покупкам' : 'Browse Marketplace'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {myNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="marketplace">
            {error ? (
              <ErrorComponent />
            ) : isLoading ? (
              <LoadingSkeleton />
            ) : marketNFTs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'ru' ? 'Нет доступных NFT' : 'No NFTs available'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'ru' 
                    ? 'Попробуйте изменить фильтры или обновить страницу' 
                    : 'Try changing filters or refresh the page'}
                </p>
                <Button onClick={refresh} variant="outline">
                  <RefreshCw size={16} className="mr-2" />
                  {language === 'ru' ? 'Обновить' : 'Refresh'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {marketNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} showPrice />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default NFT;