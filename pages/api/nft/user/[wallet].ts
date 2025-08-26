import { NextApiRequest, NextApiResponse } from 'next';
import { cors } from '../../../../utils/cors';
import { fetchUserNFTs } from '../../../../utils/getgems-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await cors(req, res);

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are supported'
    });
  }

  const { wallet } = req.query;
  const { collection } = req.query; // Optional collection filter

  // Validate wallet parameter
  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({
      error: 'Invalid wallet',
      message: 'Wallet address is required and must be a string'
    });
  }

  try {
    console.log(`API: Fetching NFTs for wallet: ${wallet}`);
    
    const collectionAddress = typeof collection === 'string' ? collection : undefined;
    const userNFTs = await fetchUserNFTs(wallet, collectionAddress);
    
    // Set caching headers
    res.setHeader('Cache-Control', 'public, max-age=180, stale-while-revalidate=360');
    
    return res.status(200).json({
      success: true,
      data: userNFTs,
      count: userNFTs.length,
      wallet,
      collection: collectionAddress || null,
      timestamp: new Date().toISOString(),
      cached: false
    });
  } catch (error) {
    console.error('API: Error fetching user NFTs:', error);
    
    return res.status(500).json({
      error: 'Failed to fetch user NFTs',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false,
      wallet,
      timestamp: new Date().toISOString()
    });
  }
}