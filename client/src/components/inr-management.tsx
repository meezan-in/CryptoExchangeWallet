import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

interface INRManagementProps {
  walletId: string;
}

export default function INRManagement({ walletId }: INRManagementProps) {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addINRMutation = useMutation({
    mutationFn: (amount: number) => api.addINR({ walletId, amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wallets/${walletId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/wallets/${walletId}/transactions`] });
      toast({
        title: "INR Added Successfully",
        description: `₹${amount} has been added to your wallet.`,
      });
      setAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add INR",
        variant: "destructive",
      });
    },
  });

  const removeINRMutation = useMutation({
    mutationFn: (amount: number) => api.removeINR({ walletId, amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wallets/${walletId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/wallets/${walletId}/transactions`] });
      toast({
        title: "INR Removed Successfully",
        description: `₹${amount} has been removed from your wallet.`,
      });
      setAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove INR",
        variant: "destructive",
      });
    },
  });

  const handleAddINR = () => {
    const value = parseFloat(amount);
    if (value > 0) {
      addINRMutation.mutate(value);
    }
  };

  const handleRemoveINR = () => {
    const value = parseFloat(amount);
    if (value > 0) {
      removeINRMutation.mutate(value);
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <Coins className="w-5 h-5 text-warning mr-3" />
          Manage INR
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount" className="text-sm font-medium text-slate-700">
            Amount (INR)
          </Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleAddINR}
              disabled={!amount || parseFloat(amount) <= 0 || addINRMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              {addINRMutation.isPending ? "Adding..." : "Add INR"}
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleRemoveINR}
              disabled={!amount || parseFloat(amount) <= 0 || removeINRMutation.isPending}
              className="w-full bg-destructive hover:bg-red-600 text-white font-medium py-2 px-4 transition-colors duration-200"
            >
              <Minus className="w-4 h-4 mr-2" />
              {removeINRMutation.isPending ? "Removing..." : "Remove INR"}
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
