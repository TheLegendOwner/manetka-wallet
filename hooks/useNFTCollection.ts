import { useState, useEffect, useCallback } from 'react';

export interface NFTItem {
  index: number;
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  boost: number;
  address: string;
}

export interface NFTCollection {
  address: string;
  name: string;
  description: string;
  imageUrl: string;
  ownerAddress: string;
  items: NFTItem[];
  totalSupply: number;
  floorPrice: string;
  volumeTraded: string;
}

interface UseNFTCollectionState {
  collection: NFTCollection | null;
  userNFTs: NFTItem[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

interface UseNFTCollectionReturn extends UseNFTCollectionState {
  fetchCollection: (address: string) => Promise<void>;
  fetchUserNFTs: (walletAddress: string, collectionAddress?: string) => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  calculateTotalBoost: () => number;
}

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function for caching
function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// API call helper with better error handling
async function apiCall<T>(endpoint: string, errorContext: string): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error(`${errorContext}:`, error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error - please check your connection');
      }
      throw error;
    }
    
    throw new Error(`Failed to ${errorContext.toLowerCase()}`);
  }
}

export function useNFTCollection(): UseNFTCollectionReturn {
  const [state, setState] = useState<UseNFTCollectionState>({
    collection: null,
    userNFTs: [],
    isLoading: false,
    error: null,
    isConnected: false,
  });

  // Test API connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/health', {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
        
        if (response.ok) {
          const data = await response.json();
          const isConnected = data.services?.getgems?.status === 'ok' || 
                             data.status === 'ok';
          
          setState(prev => ({ ...prev, isConnected }));
          
          if (!isConnected) {
            console.warn('API connection test failed, might use fallback data');
          }
        }
      } catch (error) {
        console.warn('Could not test API connection:', error);
        setState(prev => ({ ...prev, isConnected: false }));
      }
    };

    testConnection();
  }, []);

  const fetchCollection = useCallback(async (address: string): Promise<void> => {
    const cacheKey = `collection_${address}`;
    const cachedCollection = getCachedData<NFTCollection>(cacheKey);

    if (cachedCollection) {
      setState(prev => ({
        ...prev,
        collection: cachedCollection,
        error: null,
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const collection = await apiCall<NFTCollection>(
        `/api/nft/collection/${encodeURIComponent(address)}`,
        'Error fetching collection'
      );

      setCachedData(cacheKey, collection);
      
      setState(prev => ({
        ...prev,
        collection,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load collection';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: `Failed to load collection: ${errorMessage}`,
      }));
      
      console.error('Error loading collection:', error);
    }
  }, []);

  const fetchUserNFTs = useCallback(async (
    walletAddress: string, 
    collectionAddress?: string
  ): Promise<void> => {
    const cacheKey = `user_nfts_${walletAddress}_${collectionAddress || 'all'}`;
    const cachedNFTs = getCachedData<NFTItem[]>(cacheKey);

    if (cachedNFTs) {
      setState(prev => ({
        ...prev,
        userNFTs: cachedNFTs,
        error: null,
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const endpoint = `/api/nft/user/${encodeURIComponent(walletAddress)}${
        collectionAddress ? `?collection=${encodeURIComponent(collectionAddress)}` : ''
      }`;

      const userNFTs = await apiCall<NFTItem[]>(
        endpoint,
        'Error fetching user NFTs'
      );

      setCachedData(cacheKey, userNFTs);
      
      setState(prev => ({
        ...prev,
        userNFTs,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user NFTs';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: `Error fetching user NFTs: ${errorMessage}`,
      }));
      
      console.error('Error fetching user NFTs:', error);
    }
  }, []);

  const refreshData = useCallback(async (): Promise<void> => {
    // Clear cache
    cache.clear();
    
    // Refresh collection if we have one
    if (state.collection) {
      await fetchCollection(state.collection.address);
    }

    // Refresh user NFTs if we have wallet data
    // This would typically come from a wallet context
    // For now, we'll just clear the error state
    setState(prev => ({ ...prev, error: null }));
  }, [state.collection, fetchCollection]);

  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const calculateTotalBoost = useCallback((): number => {
    return state.userNFTs.reduce((total, nft) => total + nft.boost, 0);
  }, [state.userNFTs]);

  return {
    ...state,
    fetchCollection,
    fetchUserNFTs,
    refreshData,
    clearError,
    calculateTotalBoost,
  };
}

// Helper function to get rarity color
export function getRarityColor(rarity: NFTItem['rarity']): string {
  switch (rarity) {
    case 'RARE':
      return 'text-blue-500 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800';
    case 'EPIC':
      return 'text-purple-500 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-950 dark:border-purple-800';
    case 'LEGENDARY':
      return 'text-amber-500 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800';
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950 dark:border-gray-800';
  }
}

// Helper function to get boost percentage text
export function getBoostText(boost: number): string {
  if (boost === 0) return 'No boost';
  return `+${boost}% boost`;
}

export default useNFTCollection;