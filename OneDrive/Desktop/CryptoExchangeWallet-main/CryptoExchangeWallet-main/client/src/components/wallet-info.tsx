import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Shield, TrendingUp, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/lib/crypto";
import { Wallet } from "@shared/schema";

interface WalletInfoProps {
  wallet: Pick<Wallet, '_id' | 'name' | 'balanceINR' | 'holdings'>;
}

export default function WalletInfo({ wallet }: WalletInfoProps) {
  // Calculate total portfolio value (simplified - would need current prices)
  const portfolioValue = wallet.balanceINR; // TODO: Add crypto holdings value
  const change24h = 0; // TODO: Calculate from price changes

  return (
    <div className="mb-8">
      <Card className="bg-slate-50 border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <UserCircle className="w-6 h-6 text-primary mr-3" />
              {wallet.name}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Shield className="w-4 h-4 text-success" />
              <span>🔒 Secured with AES-256</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">INR Balance</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {formatCurrency(wallet.balanceINR)}
                    </p>
                  </div>
                  <div className="text-primary">
                    <IndianRupee className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Portfolio</p>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(portfolioValue)}
                    </p>
                  </div>
                  <div className="text-success">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">24h Change</p>
                    <p className={`text-2xl font-bold ${change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {change24h >= 0 ? '+' : ''}{formatCurrency(change24h)}
                    </p>
                  </div>
                  <div className={change24h >= 0 ? 'text-success' : 'text-destructive'}>
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
