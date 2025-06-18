import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, UserPlus } from "lucide-react";
import WalletCreation from "@/components/wallet-creation";
import WalletLogin from "@/components/wallet-login";

export default function Landing() {
  const [showCreation, setShowCreation] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  if (showCreation) {
    return <WalletCreation onBack={() => setShowCreation(false)} />;
  }

  if (showLogin) {
    return <WalletLogin onBack={() => setShowLogin(false)} />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Crypto Wallet Simulator
          </h1>
          <p className="text-slate-600">
            Secure cryptocurrency wallet with real-time trading
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <Button
              onClick={() => setShowCreation(true)}
              className="w-full h-12 text-lg"
              size="lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create New Wallet
            </Button>
            
            <Button
              onClick={() => setShowLogin(true)}
              variant="outline"
              className="w-full h-12 text-lg"
              size="lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Login with Existing Wallet
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-500">
          <p>🔒 Secured with AES-256 encryption</p>
          <p>Protected by BIP39 mnemonic phrases</p>
        </div>
      </div>

      {/* Project Info Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm font-semibold text-slate-800">
            🎓 6th Semester B.E. Project - Computer Science Engineering
          </p>
          <p className="text-xs text-slate-600">
            Developed by RVCE Students | R.V. College of Engineering, Bangalore
          </p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-slate-500">
            <span>🛡️ AES-256</span>
            <span>🔑 BIP39</span>
            <span>🔐 SHA-256</span>
          </div>
        </div>
      </footer>

      {/* Top Right Project Badge */}
      <div className="fixed top-4 right-4 z-10">
        <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
          6th Sem RVCE Project
        </div>
      </div>
    </div>
  );
}
