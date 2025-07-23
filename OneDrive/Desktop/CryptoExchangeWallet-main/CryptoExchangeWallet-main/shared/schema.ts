import { z } from "zod";

// Wallet schema
export const walletSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Wallet name is required"),
  passwordHash: z.string(),
  mnemonicEncrypted: z.string(),
  balanceINR: z.number().default(0),
  holdings: z.record(z.number()).default({}),
  createdAt: z.date().default(() => new Date()),
});

export const insertWalletSchema = walletSchema.omit({ _id: true, createdAt: true });
export const walletLoginSchema = z.object({
  name: z.string().min(1, "Wallet name is required"),
  password: z.string().min(1, "Password is required"),
});

export const walletCreationSchema = z.object({
  name: z.string().min(1, "Wallet name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Transaction schema
export const transactionSchema = z.object({
  _id: z.string().optional(),
  walletId: z.string(),
  type: z.enum(["add", "remove", "trade"]),
  amountINR: z.number(),
  crypto: z.object({
    symbol: z.string(),
    amount: z.number(),
  }).optional(),
  timestamp: z.date().default(() => new Date()),
  txnHash: z.string(),
});

export const insertTransactionSchema = transactionSchema.omit({ _id: true, timestamp: true, txnHash: true });

// API schemas
export const addINRSchema = z.object({
  walletId: z.string(),
  amount: z.number().positive("Amount must be positive"),
});

export const removeINRSchema = z.object({
  walletId: z.string(),
  amount: z.number().positive("Amount must be positive"),
});

export const tradeSchema = z.object({
  walletId: z.string(),
  type: z.enum(["buy", "sell"]),
  cryptoSymbol: z.string(),
  amountINR: z.number().positive("Amount must be positive"),
});

// Types
export type Wallet = z.infer<typeof walletSchema>;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type WalletLogin = z.infer<typeof walletLoginSchema>;
export type WalletCreation = z.infer<typeof walletCreationSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type AddINR = z.infer<typeof addINRSchema>;
export type RemoveINR = z.infer<typeof removeINRSchema>;
export type Trade = z.infer<typeof tradeSchema>;

// Supported cryptocurrencies
export const SUPPORTED_CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin' },
  { symbol: 'ETH', name: 'Ethereum', id: 'ethereum' },
  { symbol: 'LTC', name: 'Litecoin', id: 'litecoin' },
  { symbol: 'DOGE', name: 'Dogecoin', id: 'dogecoin' },
  { symbol: 'MATIC', name: 'Polygon', id: 'polygon' },
  { symbol: 'BNB', name: 'Binance Coin', id: 'binancecoin' },
  { symbol: 'SOL', name: 'Solana', id: 'solana' },
] as const;

export type CryptoSymbol = typeof SUPPORTED_CRYPTOS[number]['symbol'];
