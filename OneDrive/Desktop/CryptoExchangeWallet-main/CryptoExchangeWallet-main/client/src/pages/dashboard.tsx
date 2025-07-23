import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import TechStackPanel from "@/components/tech-stack-panel";
import WalletInfo from "@/components/wallet-info";
import INRManagement from "@/components/inr-management";
import LivePrices from "@/components/live-prices";
import TradingInterface from "@/components/trading-interface";
import CurrentHoldings from "@/components/current-holdings";
import TransactionHistory from "@/components/transaction-history";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Wallet, LogOut } from "lucide-react";

export default function Dashboard() {
  const { walletId } = useParams<{ walletId: string }>();
  const [, setLocation] = useLocation();
  
  const { data: walletData, isLoading } = useQuery({
    queryKey: [`/api/wallets/${walletId}`],
    enabled: !!walletId,
  });

  const handleLogout = () => {
    localStorage.removeItem('currentWalletId');
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  if (!walletData?.wallet) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Wallet Not Found</h1>
          <p className="text-slate-600">The requested wallet could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">
            <Wallet className="inline-block w-8 h-8 text-primary mr-3" />
            Crypto Wallet Simulator
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Tech Stack Panel */}
      <TechStackPanel />

      {/* Top Right Project Badge */}
    

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Wallet Info Section */}
        <WalletInfo wallet={walletData.wallet} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* INR Management */}
          <div className="lg:col-span-1">
            <INRManagement walletId={walletId!} />
          </div>

          {/* Live Prices */}
          <div className="lg:col-span-2">
            <LivePrices />
          </div>
        </div>

        {/* Trading Section */}
        <TradingInterface walletId={walletId!} />

        {/* Holdings & Transaction History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CurrentHoldings wallet={walletData.wallet} />
          <TransactionHistory walletId={walletId!} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                <span className="text-primary mr-2">🎓</span>
                6th Semester B.E. Project - Computer Science Engineering
              </h3>
              <p className="text-base font-medium text-slate-700 mb-1">
                Developed by RVCE Students
              </p>
              <p className="text-sm text-slate-600">
                R.V. College of Engineering, Bangalore
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-4">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">
                🔐 Cryptographic Security Methods Implemented
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-success text-2xl mb-2">🛡️</div>
                  <h5 className="font-semibold text-slate-800 mb-1">AES-256 Encryption</h5>
                  <p className="text-sm text-slate-600">
                    Military-grade encryption for wallet data protection using password-derived keys
                  </p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-warning text-2xl mb-2">🔑</div>
                  <h5 className="font-semibold text-slate-800 mb-1">BIP39 Mnemonics</h5>
                  <p className="text-sm text-slate-600">
                    Industry-standard 12-word recovery phrases for secure wallet generation
                  </p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-primary text-2xl mb-2">🔐</div>
                  <h5 className="font-semibold text-slate-800 mb-1">SHA-256 Hashing</h5>
                  <p className="text-sm text-slate-600">
                    Cryptographic hashing for transaction integrity and password security
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-semibold text-slate-700 mb-2">Additional Security Features:</h5>
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                    PBKDF2 Key Derivation
                  </span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                    Secure Random Salt Generation
                  </span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                    Real-time Transaction Validation
                  </span>
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                    MongoDB Atlas Cloud Security
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              <p>This project demonstrates practical implementation of cryptographic principles in web applications.</p>
              <p className="mt-1">Built with Node.js, React.js, MongoDB Atlas, and CoinGecko API for educational purposes.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
