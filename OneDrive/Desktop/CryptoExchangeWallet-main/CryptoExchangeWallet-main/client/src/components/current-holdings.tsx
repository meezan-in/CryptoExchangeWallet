import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { formatCurrency, formatCrypto, formatPercentage, getCryptoIcon, getCryptoColor } from "@/lib/crypto";
import { SUPPORTED_CRYPTOS, Wallet } from "@shared/schema";
import { api } from "@/lib/api";

interface CurrentHoldingsProps {
  wallet: Pick<Wallet, '_id' | 'name' | 'balanceINR' | 'holdings'>;
}

export default function CurrentHoldings({ wallet }: CurrentHoldingsProps) {
  type PricesData = {
    prices: Record<string, {
      inr: number;
      inr_24h_change: number;
    }>;
  };

  const { data: pricesData } = useQuery<PricesData>({
    queryKey: ['/api/crypto/prices'],
    refetchInterval: 5000,
  });

  const prices = pricesData?.prices || {};
  const holdings = Object.entries(wallet.holdings || {}).filter(([, amount]) => amount > 0);

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <Briefcase className="w-5 h-5 text-primary mr-3" />
          Current Holdings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No cryptocurrency holdings yet</p>
            <p className="text-sm">Start trading to build your portfolio</p>
          </div>
        ) : (
          <div className="space-y-3">
            {holdings.map(([symbol, amount]) => {
              const cryptoInfo = SUPPORTED_CRYPTOS.find(c => c.symbol === symbol);
              const priceData = cryptoInfo ? prices[cryptoInfo.id] : null;
              const currentPrice = priceData?.inr || 0;
              const value = currentPrice * amount;
              const change24h = priceData?.inr_24h_change || 0;

              return (
                <div
                  key={symbol}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${getCryptoColor(symbol)} rounded-full flex items-center justify-center text-white font-bold`}>
                      {getCryptoIcon(symbol)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {cryptoInfo?.name || symbol}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatCrypto(amount, symbol)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {formatCurrency(value)}
                    </p>
                    {change24h !== 0 && (
                      <p className={`text-sm ${change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatPercentage(change24h)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
