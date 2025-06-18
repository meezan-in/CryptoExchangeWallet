import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { formatCurrency, formatCrypto } from "@/lib/crypto";
import { SUPPORTED_CRYPTOS, CryptoSymbol } from "@shared/schema";
import { motion } from "framer-motion";

interface TradingInterfaceProps {
  walletId: string;
}

export default function TradingInterface({ walletId }: TradingInterfaceProps) {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [cryptoSymbol, setCryptoSymbol] = useState<CryptoSymbol>("BTC");
  const [amountINR, setAmountINR] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pricesData } = useQuery({
    queryKey: ['/api/crypto/prices'],
    refetchInterval: 5000,
  });

  const tradeMutation = useMutation({
    mutationFn: (data: { walletId: string; type: "buy" | "sell"; cryptoSymbol: string; amountINR: number }) =>
      api.trade(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/wallets/${walletId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/wallets/${walletId}/transactions`] });
      
      const { trade } = data;
      toast({
        title: "Trade Executed Successfully",
        description: `${trade.type === "buy" ? "Bought" : "Sold"} ${formatCrypto(trade.cryptoAmount, trade.cryptoSymbol)} for ${formatCurrency(trade.amountINR)}`,
      });
      setAmountINR("");
    },
    onError: (error: any) => {
      toast({
        title: "Trade Failed",
        description: error.message || "Failed to execute trade",
        variant: "destructive",
      });
    },
  });

  const prices = pricesData?.prices || {};
  const cryptoInfo = SUPPORTED_CRYPTOS.find(c => c.symbol === cryptoSymbol);
  const currentPrice = cryptoInfo ? prices[cryptoInfo.id]?.inr || 0 : 0;
  const amountValue = parseFloat(amountINR) || 0;
  const cryptoAmount = currentPrice > 0 ? amountValue / currentPrice : 0;
  const tradeFee = amountValue * 0.005; // 0.5% fee

  const handleTrade = () => {
    if (amountValue > 0 && currentPrice > 0) {
      tradeMutation.mutate({
        walletId,
        type: tradeType,
        cryptoSymbol,
        amountINR: amountValue,
      });
    }
  };

  return (
    <div className="mb-8">
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
            <ArrowLeftRight className="w-5 h-5 text-primary mr-3" />
            Trade INR ↔ Cryptocurrency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-700">Trade Type</Label>
                <Select value={tradeType} onValueChange={(value: "buy" | "sell") => setTradeType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy Crypto (INR → Crypto)</SelectItem>
                    <SelectItem value="sell">Sell Crypto (Crypto → INR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">Select Cryptocurrency</Label>
                <Select value={cryptoSymbol} onValueChange={(value: CryptoSymbol) => setCryptoSymbol(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CRYPTOS.map((crypto) => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol}>
                        {crypto.name} ({crypto.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">Amount (INR)</Label>
                <Input
                  type="number"
                  value={amountINR}
                  onChange={(e) => setAmountINR(e.target.value)}
                  placeholder="Enter INR amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Card className="bg-slate-50 border border-gray-200">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Trade Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">You Pay:</span>
                      <span className="font-medium text-slate-800">
                        {formatCurrency(amountValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">You Receive:</span>
                      <span className="font-medium text-slate-800">
                        {cryptoAmount > 0 ? formatCrypto(cryptoAmount, cryptoSymbol) : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Exchange Rate:</span>
                      <span className="font-medium text-slate-800">
                        {currentPrice > 0 ? `1 ${cryptoSymbol} = ${formatCurrency(currentPrice)}` : "Loading..."}
                      </span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-700">Transaction Fee:</span>
                      <span className="text-slate-800">{formatCurrency(tradeFee)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleTrade}
                  disabled={!amountValue || currentPrice === 0 || tradeMutation.isPending}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 px-4 transition-all duration-200"
                  size="lg"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {tradeMutation.isPending ? "Executing Trade..." : "Execute Trade"}
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
