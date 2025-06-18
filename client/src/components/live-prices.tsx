import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { formatCurrency, formatPercentage, getCryptoIcon, getCryptoColor } from "@/lib/crypto";
import { SUPPORTED_CRYPTOS } from "@shared/schema";
import { api } from "@/lib/api";

export default function LivePrices() {
  const { data: pricesData, isLoading } = useQuery({
    queryKey: ['/api/crypto/prices'],
    refetchInterval: 5000, // Refresh every 5 seconds to avoid rate limiting
  });

  const prices = pricesData?.prices || {};

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
            <BarChart3 className="w-5 h-5 text-primary mr-3" />
            Live Cryptocurrency Prices
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Live • Updates every 5s</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                    <div>
                      <div className="w-16 h-4 bg-slate-300 rounded mb-1"></div>
                      <div className="w-8 h-3 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-20 h-4 bg-slate-300 rounded mb-1"></div>
                    <div className="w-12 h-3 bg-slate-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUPPORTED_CRYPTOS.map((crypto) => {
              const priceData = prices[crypto.id];
              const price = priceData?.inr || 0;
              const change = priceData?.inr_24h_change || 0;
              
              return (
                <div
                  key={crypto.symbol}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-gray-200 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getCryptoColor(crypto.symbol)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {getCryptoIcon(crypto.symbol)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{crypto.name}</p>
                      <p className="text-sm text-slate-600">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {price > 0 ? formatCurrency(price) : "Loading..."}
                    </p>
                    {change !== 0 && (
                      <p className={`text-sm ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatPercentage(change)}
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
