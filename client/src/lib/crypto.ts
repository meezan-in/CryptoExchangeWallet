export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatCrypto = (amount: number, symbol: string): string => {
  return `${amount.toFixed(8)} ${symbol}`;
};

export const formatPercentage = (change: number): string => {
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
};

export const getCryptoIcon = (symbol: string): string => {
  const icons: Record<string, string> = {
    BTC: '₿',
    ETH: 'Ξ',
    LTC: 'Ł',
    DOGE: 'Đ',
    MATIC: '♦',
    BNB: '◆',
    SOL: '◯',
  };
  return icons[symbol] || '◉';
};

export const getCryptoColor = (symbol: string): string => {
  const colors: Record<string, string> = {
    BTC: 'bg-orange-500',
    ETH: 'bg-blue-600',
    LTC: 'bg-gray-400',
    DOGE: 'bg-yellow-500',
    MATIC: 'bg-purple-500',
    BNB: 'bg-amber-500',
    SOL: 'bg-indigo-500',
  };
  return colors[symbol] || 'bg-slate-500';
};
