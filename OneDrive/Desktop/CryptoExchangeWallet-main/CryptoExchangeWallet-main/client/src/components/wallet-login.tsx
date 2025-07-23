import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { WalletLogin as WalletLoginType } from "@shared/schema";

interface WalletLoginProps {
  onBack: () => void;
}

export default function WalletLogin({ onBack }: WalletLoginProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<WalletLoginType>({
    name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: api.loginWallet,
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "Welcome back to your wallet!",
      });
      setLocation(`/dashboard/${data.wallet._id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid wallet name or password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

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
            <CardTitle className="text-slate-800">Login to Wallet</CardTitle>
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
                placeholder="Enter your wallet name"
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
                  placeholder="Enter your password"
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
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login to Wallet
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <p>🔒 Your wallet is encrypted with AES-256</p>
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
