export interface CryptoPriceData {
  [key: string]: {
    inr: number;
    inr_24h_change?: number;
  };
}

export class CoinGeckoService {
  private static readonly BASE_URL = 'https://api.coingecko.com/api/v3';
  private static readonly CRYPTO_IDS = 'bitcoin,ethereum,litecoin,polygon,solana,dogecoin,binancecoin';
  private static cachedPrices: CryptoPriceData | null = null;
  private static lastFetchTime = 0;
  private static readonly CACHE_DURATION = 30000; // 30 seconds cache

  static async getCryptoPrices(): Promise<CryptoPriceData> {
    const now = Date.now();
    
    // Return cached prices if within cache duration
    if (this.cachedPrices && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      return this.cachedPrices;
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/simple/price?ids=${this.CRYPTO_IDS}&vs_currencies=inr&include_24hr_change=true`
      );
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited, return cached prices if available
          if (this.cachedPrices) {
            console.log('Rate limited, returning cached prices');
            return this.cachedPrices;
          }
          // If no cache available, throw error to inform client
          throw new Error('CoinGecko API rate limited and no cached data available');
        }
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      this.cachedPrices = data;
      this.lastFetchTime = now;
      return data;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      // Return cached prices if available, otherwise throw error
      if (this.cachedPrices) {
        console.log('API error, returning cached prices');
        return this.cachedPrices;
      }
      throw error;
    }
  }



  static async getSingleCryptoPrice(cryptoId: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/simple/price?ids=${cryptoId}&vs_currencies=inr`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data[cryptoId]?.inr || 0;
    } catch (error) {
      console.error(`Error fetching price for ${cryptoId}:`, error);
      throw error;
    }
  }
}
