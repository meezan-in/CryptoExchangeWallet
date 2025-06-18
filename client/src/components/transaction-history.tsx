import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ArrowUp, Plus, ArrowRightLeft, ArrowRight } from "lucide-react";
import { formatCurrency, formatCrypto } from "@/lib/crypto";
import { Transaction } from "@shared/schema";

interface TransactionHistoryProps {
  walletId: string;
}

export default function TransactionHistory({ walletId }: TransactionHistoryProps) {
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: [`/api/wallets/${walletId}/transactions`],
  });

  const transactions = transactionsData?.transactions || [];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "add":
        return <Plus className="w-4 h-4" />;
      case "remove":
        return <ArrowUp className="w-4 h-4 rotate-180" />;
      case "trade":
        return <ArrowRightLeft className="w-4 h-4" />;
      default:
        return <ArrowRightLeft className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "add":
        return "bg-primary";
      case "remove":
        return "bg-destructive";
      case "trade":
        return "bg-warning";
      default:
        return "bg-slate-500";
    }
  };

  const getTransactionTitle = (transaction: Transaction) => {
    switch (transaction.type) {
      case "add":
        return "Add INR";
      case "remove":
        return "Remove INR";
      case "trade":
        return `Trade ${transaction.crypto?.symbol || "Crypto"}`;
      default:
        return "Transaction";
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return "1 day ago";
    } else {
      return `${diffDays} days ago`;
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <History className="w-5 h-5 text-primary mr-3" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                    <div>
                      <div className="w-24 h-4 bg-slate-300 rounded mb-1"></div>
                      <div className="w-32 h-3 bg-slate-300 rounded mb-1"></div>
                      <div className="w-16 h-3 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-20 h-4 bg-slate-300 rounded mb-1"></div>
                    <div className="w-16 h-3 bg-slate-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Your transaction history will appear here</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getTransactionColor(transaction.type)} rounded-full flex items-center justify-center text-white`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {getTransactionTitle(transaction)}
                      </p>
                      <p className="text-sm text-slate-600 font-mono">
                        SHA256: {transaction.txnHash.substring(0, 12)}...
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatTimestamp(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {transaction.type === "add" && "+"}
                      {transaction.type === "remove" && "-"}
                      {formatCurrency(transaction.amountINR)}
                    </p>
                    {transaction.crypto && (
                      <p className="text-sm text-slate-600">
                        {formatCrypto(transaction.crypto.amount, transaction.crypto.symbol)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {transactions.length > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full text-primary hover:text-blue-700 font-medium text-sm py-2 transition-colors duration-200"
                >
                  View All Transactions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
