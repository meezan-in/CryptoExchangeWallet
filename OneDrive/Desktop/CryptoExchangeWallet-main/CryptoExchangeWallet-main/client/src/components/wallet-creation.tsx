import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Copy, CheckCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { WalletCreation as WalletCreationType } from "@shared/schema";

interface WalletCreationProps {
  onBack: () => void;
}

export default function WalletCreation({ onBack }: WalletCreationProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<WalletCreationType>({
    name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [mnemonicCopied, setMnemonicCopied] = useState(false);
  const [step, setStep] = useState<"form" | "mnemonic" | "complete">("form");

  const createWalletMutation = useMutation({
    mutationFn: api.createWallet,
    onSuccess: (data) => {
      setMnemonic(data.mnemonic);
      setStep("mnemonic");
      // Store wallet ID for navigation
      localStorage.setItem('currentWalletId', data.wallet._id);
      toast({
        title: "Wallet Created Successfully",
        description: "Your wallet has been created with strong encryption.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create wallet",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWalletMutation.mutate(formData);
  };

  const copyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    setMnemonicCopied(true);
    toast({
      title: "Mnemonic Copied",
      description: "Your recovery phrase has been copied to clipboard.",
    });
    setTimeout(() => setMnemonicCopied(false), 3000);
  };

  const proceedToDashboard = () => {
    setStep("complete");
    // We'll navigate after the user acknowledges the completion
  };

  if (step === "complete") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Wallet Setup Complete!
            </h2>
            <p className="text-slate-600 mb-6">
              Your wallet has been created and secured with military-grade encryption.
            </p>
            <Button
              onClick={() => {
                const walletId = localStorage.getItem('currentWalletId');
                if (walletId) {
                  setLocation(`/dashboard/${walletId}`);
                } else {
                  setLocation("/");
                }
              }}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "mnemonic") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800">
              <Shield className="w-5 h-5 mr-2 text-success" />
              Your Recovery Phrase (BIP39)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border-2 border-dashed border-slate-300">
              <p className="text-sm text-slate-600 mb-3">
                This is your 12-word recovery phrase. Store it safely - you'll need it to recover your wallet.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {mnemonic.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded border text-center text-sm font-mono"
                  >
                    <span className="text-slate-500 text-xs">{index + 1}.</span>{" "}
                    {word}
                  </div>
                ))}
              </div>
              <Button
                onClick={copyMnemonic}
                variant="outline"
                className="w-full"
                disabled={mnemonicCopied}
              >
                {mnemonicCopied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Recovery Phrase
                  </>
                )}
              </Button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">⚠️ Important Security Notice</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Never share your recovery phrase with anyone</li>
                <li>• Store it in a secure, offline location</li>
                <li>• This phrase can restore your wallet if you lose access</li>
                <li>• We cannot recover your wallet without this phrase</li>
              </ul>
            </div>

            <Button
              onClick={proceedToDashboard}
              className="w-full"
              size="lg"
            >
              I've Saved My Recovery Phrase
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {/* Top Right Project Badge */}
      <div className="fixed top-4 right-4 z-10">
        <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
          6th Sem RVCE Project
        </div>
      </div>

      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-slate-800">Create New Wallet</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Wallet Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter wallet name"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Wallet Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter secure password"
                  minLength={6}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Minimum 6 characters. Used for AES-256 encryption.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createWalletMutation.isPending}
            >
              {createWalletMutation.isPending ? "Creating Wallet..." : "Create Wallet"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <p className="flex items-center justify-center">
              <Shield className="w-4 h-4 mr-1" />
              Secured with BIP39 + AES-256
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Project Info Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs font-semibold text-slate-700">
            🎓 6th Semester B.E. Project - Computer Science Engineering
          </p>
          <p className="text-xs text-slate-600">
            Developed by RVCE Students | R.V. College of Engineering, Bangalore
          </p>
        </div>
      </div>
    </div>
  );
}
