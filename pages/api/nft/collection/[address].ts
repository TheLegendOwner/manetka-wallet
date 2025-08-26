import { NextApiRequest, NextApiResponse } from 'next';
import { cors } from '../../../../utils/cors';
import { fetchNFTCollection } from '../../../../utils/getgems-api';

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

  const { address } = req.query;

  // Validate address parameter
  if (!address || typeof address !== 'string') {
    return res.status(400).json({
      error: 'Invalid address',
      message: 'Collection address is required and must be a string'
    });
  }

  try {
    console.log(`API: Fetching collection for address: ${address}`);
    
    const collection = await fetchNFTCollection(address);
    
    // Set caching headers
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    
    return res.status(200).json({
      success: true,
      data: collection,
      timestamp: new Date().toISOString(),
      cached: false
    });
  } catch (error) {
    console.error('API: Error fetching collection:', error);
    
    return res.status(500).json({
      error: 'Failed to fetch collection',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}