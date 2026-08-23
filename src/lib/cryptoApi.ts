export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: { price: number[] };
  last_updated: string;
}

const COIN_IDS = [
  'bitcoin',
  'ethereum',
  'ripple',
  'solana',
  'binancecoin',
  'cardano',
  'dogecoin',
  'avalanche-2',
];

const CG_BASE = 'https://api.coingecko.com/api/v3';

/**
 * Fetch live crypto prices from CoinGecko's public API.
 * Falls back to null on error so the UI can show a graceful state.
 */
export async function fetchCryptoPrices(): Promise<CryptoCoin[] | null> {
  const url =
    `${CG_BASE}/coins/markets?vs_currency=usd&ids=${COIN_IDS.join(',')}` +
    `&order=market_cap_desc&sparkline=true&price_change_percentage=24h`;

  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as CryptoCoin[];
    if (!Array.isArray(data) || data.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}
