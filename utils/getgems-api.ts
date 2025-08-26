// GetGems API integration with improved error handling and fallback data
import { NFTCollection, NFTItem } from '../hooks/useNFTCollection';

const GETGEMS_API_URL = 'https://api.getgems.io/graphql';
const API_KEY = process.env.GETGEMS_API_KEY || process.env.NEXT_PUBLIC_GETGEMS_API_KEY || '1756153701179-mainnet-10274134-r-eY11DKHnMng45JUs0EF4MheNLAKubWzapB3CvwkvyzRSDds0';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data for development and fallback
const mockCollectionData: NFTCollection = {
  address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
  name: 'MANETKA Boosts',
  description: 'Exclusive NFT collection that provides passive income boosts in MANETKA WALLET',
  imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
  ownerAddress: 'EQD4FPq-PRDieyQKkarsNWukQ5zZPMgOAbnvnQXiYqjS4NTD',
  items: [
    {
      index: 1,
      name: 'RARE Boost #001',
      description: 'Provides 2% passive income boost',
      imageUrl: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=300&h=300&fit=crop',
      rarity: 'RARE',
      boost: 2,
      address: 'EQBvGAf1QsM-bCmRWfXBXp6mNjgF_EqKLNGKMN8K8lVa1vEG'
    },
    {
      index: 2,
      name: 'EPIC Boost #002',
      description: 'Provides 5% passive income boost',
      imageUrl: 'https://images.unsplash.com/photo-1635186244493-4d94d36c1e8b?w=300&h=300&fit=crop',
      rarity: 'EPIC',
      boost: 5,
      address: 'EQCxGCyZzQN2nnJUvLKw9rPZrMNb4V8MjY4K3oN8hXlM9qTZ'
    },
    {
      index: 3,
      name: 'LEGENDARY Boost #003',
      description: 'Provides 13% passive income boost',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop',
      rarity: 'LEGENDARY',
      boost: 13,
      address: 'EQD4KLnvNB5zG3y2X8pFVWHm7KjP5oQ9rNM3S8dF2vT4l6Y7'
    }
  ],
  totalSupply: 1000,
  floorPrice: '50',
  volumeTraded: '15000'
};

const mockUserNFTs: NFTItem[] = [
  {
    index: 1,
    name: 'RARE Boost #001',
    description: 'Provides 2% passive income boost',
    imageUrl: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=300&h=300&fit=crop',
    rarity: 'RARE',
    boost: 2,
    address: 'EQBvGAf1QsM-bCmRWfXBXp6mNjgF_EqKLNGKMN8K8lVa1vEG'
  },
  {
    index: 5,
    name: 'EPIC Boost #005',
    description: 'Provides 5% passive income boost',
    imageUrl: 'https://images.unsplash.com/photo-1635186244493-4d94d36c1e8b?w=300&h=300&fit=crop',
    rarity: 'EPIC',
    boost: 5,
    address: 'EQCxGCyZzQN2nnJUvLKw9rPZrMNb4V8MjY4K3oN8hXlM9qTZ'
  }
];

// API request helper with timeout and error handling
async function makeAPIRequest(query: string, variables: any = {}, timeout = 10000): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(GETGEMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'User-Agent': 'MANETKA-WALLET/1.0.0',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors && data.errors.length > 0) {
      throw new Error(`GraphQL error: ${data.errors[0].message}`);
    }

    return data.data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('GetGems API request failed:', error);
    throw error;
  }
}

// Updated GraphQL queries for GetGems API v2
const GET_COLLECTION_QUERY = `
  query GetCollection($address: String!) {
    nftCollection(address: $address) {
      address
      name
      description
      image
      owner {
        address
      }
      itemsCount
      floorPrice {
        value
        token {
          symbol
        }
      }
      volume {
        value7d
        token {
          symbol
        }
      }
      items(first: 20) {
        edges {
          node {
            index
            name
            description
            image
            address
            attributes {
              traitType
              value
            }
          }
        }
      }
    }
  }
`;

const GET_USER_NFTS_QUERY = `
  query GetUserNFTs($owner: String!, $collection: String) {
    nftItems(
      filter: {
        ownerAddress: $owner
        collectionAddress: $collection
      }
      first: 50
    ) {
      edges {
        node {
          index
          name
          description
          image
          address
          collection {
            address
            name
          }
          attributes {
            traitType
            value
          }
        }
      }
    }
  }
`;

// Transform GetGems API response to our format
function transformCollectionData(apiData: any): NFTCollection {
  const collection = apiData.nftCollection;
  
  if (!collection) {
    throw new Error('Collection not found in API response');
  }

  const items: NFTItem[] = collection.items?.edges?.map((edge: any) => {
    const node = edge.node;
    
    // Extract boost value from attributes
    const boostAttr = node.attributes?.find((attr: any) => 
      attr.traitType?.toLowerCase() === 'boost' || 
      attr.traitType?.toLowerCase() === 'rarity'
    );
    
    const rarity = boostAttr?.value || 'COMMON';
    const boost = getRarityBoost(rarity);

    return {
      index: node.index || 0,
      name: node.name || `NFT #${node.index}`,
      description: node.description || '',
      imageUrl: node.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop',
      rarity: rarity.toUpperCase(),
      boost,
      address: node.address || '',
    };
  }) || [];

  return {
    address: collection.address,
    name: collection.name || 'Unknown Collection',
    description: collection.description || '',
    imageUrl: collection.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
    ownerAddress: collection.owner?.address || '',
    items,
    totalSupply: collection.itemsCount || items.length,
    floorPrice: collection.floorPrice?.value || '0',
    volumeTraded: collection.volume?.value7d || '0',
  };
}

function transformUserNFTs(apiData: any): NFTItem[] {
  const items = apiData.nftItems?.edges || [];
  
  return items.map((edge: any) => {
    const node = edge.node;
    
    // Extract boost value from attributes
    const boostAttr = node.attributes?.find((attr: any) => 
      attr.traitType?.toLowerCase() === 'boost' || 
      attr.traitType?.toLowerCase() === 'rarity'
    );
    
    const rarity = boostAttr?.value || 'COMMON';
    const boost = getRarityBoost(rarity);

    return {
      index: node.index || 0,
      name: node.name || `NFT #${node.index}`,
      description: node.description || '',
      imageUrl: node.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop',
      rarity: rarity.toUpperCase(),
      boost,
      address: node.address || '',
    };
  });
}

function getRarityBoost(rarity: string): number {
  switch (rarity.toUpperCase()) {
    case 'RARE':
      return 2;
    case 'EPIC':
      return 5;
    case 'LEGENDARY':
      return 13;
    default:
      return 0;
  }
}

// API functions with fallback to mock data
export async function fetchNFTCollection(collectionAddress: string): Promise<NFTCollection> {
  console.log(`Fetching NFT collection: ${collectionAddress}`);
  
  // Use mock data if configured or as fallback
  if (USE_MOCK_DATA) {
    console.log('Using mock collection data (configured)');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return mockCollectionData;
  }

  try {
    const data = await makeAPIRequest(GET_COLLECTION_QUERY, {
      address: collectionAddress,
    });

    const collection = transformCollectionData(data);
    console.log('Successfully fetched collection from GetGems API');
    return collection;
  } catch (error) {
    console.warn('GetGems API failed, using mock data:', error);
    
    // Return mock data as fallback
    return mockCollectionData;
  }
}

export async function fetchUserNFTs(walletAddress: string, collectionAddress?: string): Promise<NFTItem[]> {
  console.log(`Fetching user NFTs for wallet: ${walletAddress}`);
  
  // Use mock data if configured or as fallback
  if (USE_MOCK_DATA) {
    console.log('Using mock user NFTs data (configured)');
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return mockUserNFTs;
  }

  try {
    const data = await makeAPIRequest(GET_USER_NFTS_QUERY, {
      owner: walletAddress,
      collection: collectionAddress,
    });

    const userNFTs = transformUserNFTs(data);
    console.log(`Successfully fetched ${userNFTs.length} NFTs from GetGems API`);
    return userNFTs;
  } catch (error) {
    console.warn('GetGems API failed for user NFTs, using mock data:', error);
    
    // Return mock data as fallback
    return mockUserNFTs;
  }
}

// Test API connection
export async function testAPIConnection(): Promise<{ success: boolean; message: string }> {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      message: 'Using mock data (configured)'
    };
  }

  try {
    const data = await makeAPIRequest(`
      query {
        __schema {
          queryType {
            name
          }
        }
      }
    `);

    return {
      success: true,
      message: 'GetGems API connection successful'
    };
  } catch (error) {
    return {
      success: false,
      message: `GetGems API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Export mock data for development
export { mockCollectionData, mockUserNFTs };