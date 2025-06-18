import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mongodb } from "./services/mongodb";
import { CryptoService } from "./services/crypto";
import { CoinGeckoService } from "./services/coingecko";
import { 
  walletCreationSchema, 
  walletLoginSchema, 
  addINRSchema, 
  removeINRSchema, 
  tradeSchema,
  SUPPORTED_CRYPTOS 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize MongoDB connection
  await mongodb.connect();

  // Create wallet
  app.post("/api/wallets/create", async (req, res) => {
    try {
      const { name, password } = walletCreationSchema.parse(req.body);
      
      // Check if wallet name already exists
      const existingWallet = await storage.getWalletByName(name);
      if (existingWallet) {
        return res.status(400).json({ message: "Wallet name already exists" });
      }

      // Generate mnemonic and encrypt it
      const mnemonic = CryptoService.generateMnemonic();
      const passwordHash = CryptoService.hashPassword(password);
      const mnemonicEncrypted = CryptoService.encrypt(mnemonic, password);

      const wallet = await storage.createWallet({
        name,
        passwordHash,
        mnemonicEncrypted,
        balanceINR: 0,
        holdings: {},
      });

      res.json({ 
        wallet: { 
          _id: wallet._id, 
          name: wallet.name, 
          balanceINR: wallet.balanceINR, 
          holdings: wallet.holdings 
        }, 
        mnemonic 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Login to wallet
  app.post("/api/wallets/login", async (req, res) => {
    try {
      const { name, password } = walletLoginSchema.parse(req.body);
      
      const wallet = await storage.getWalletByName(name);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const passwordHash = CryptoService.hashPassword(password);
      if (wallet.passwordHash !== passwordHash) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Decrypt mnemonic to verify password
      try {
        CryptoService.decrypt(wallet.mnemonicEncrypted, password);
      } catch {
        return res.status(401).json({ message: "Invalid password" });
      }

      res.json({ 
        wallet: { 
          _id: wallet._id, 
          name: wallet.name, 
          balanceINR: wallet.balanceINR, 
          holdings: wallet.holdings 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get wallet details
  app.get("/api/wallets/:id", async (req, res) => {
    try {
      const wallet = await storage.getWalletById(req.params.id);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      res.json({ 
        wallet: { 
          _id: wallet._id, 
          name: wallet.name, 
          balanceINR: wallet.balanceINR, 
          holdings: wallet.holdings 
        } 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Add INR to wallet
  app.post("/api/wallets/add-inr", async (req, res) => {
    try {
      const { walletId, amount } = addINRSchema.parse(req.body);
      
      const wallet = await storage.getWalletById(walletId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const newBalance = wallet.balanceINR + amount;
      const updatedWallet = await storage.updateWallet(walletId, { balanceINR: newBalance });

      // Create transaction record
      const transactionData = {
        walletId,
        type: "add" as const,
        amountINR: amount,
      };
      const txnHash = CryptoService.generateTransactionHash(transactionData);
      
      await storage.createTransaction({
        ...transactionData,
        txnHash,
      });

      res.json({ 
        wallet: { 
          _id: updatedWallet!._id, 
          name: updatedWallet!.name, 
          balanceINR: updatedWallet!.balanceINR, 
          holdings: updatedWallet!.holdings 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Remove INR from wallet
  app.post("/api/wallets/remove-inr", async (req, res) => {
    try {
      const { walletId, amount } = removeINRSchema.parse(req.body);
      
      const wallet = await storage.getWalletById(walletId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      if (wallet.balanceINR < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const newBalance = wallet.balanceINR - amount;
      const updatedWallet = await storage.updateWallet(walletId, { balanceINR: newBalance });

      // Create transaction record
      const transactionData = {
        walletId,
        type: "remove" as const,
        amountINR: amount,
      };
      const txnHash = CryptoService.generateTransactionHash(transactionData);
      
      await storage.createTransaction({
        ...transactionData,
        txnHash,
      });

      res.json({ 
        wallet: { 
          _id: updatedWallet!._id, 
          name: updatedWallet!.name, 
          balanceINR: updatedWallet!.balanceINR, 
          holdings: updatedWallet!.holdings 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Trade cryptocurrency
  app.post("/api/wallets/trade", async (req, res) => {
    try {
      const { walletId, type, cryptoSymbol, amountINR } = tradeSchema.parse(req.body);
      
      const wallet = await storage.getWalletById(walletId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      // Find crypto info
      const cryptoInfo = SUPPORTED_CRYPTOS.find(c => c.symbol === cryptoSymbol);
      if (!cryptoInfo) {
        return res.status(400).json({ message: "Unsupported cryptocurrency" });
      }

      // Get current crypto price
      const currentPrice = await CoinGeckoService.getSingleCryptoPrice(cryptoInfo.id);
      if (!currentPrice) {
        return res.status(500).json({ message: "Unable to fetch current price" });
      }

      let newBalance = wallet.balanceINR;
      let newHoldings = { ...wallet.holdings };
      let cryptoAmount = 0;

      if (type === "buy") {
        // Buy crypto with INR
        if (wallet.balanceINR < amountINR) {
          return res.status(400).json({ message: "Insufficient INR balance" });
        }
        
        cryptoAmount = amountINR / currentPrice;
        newBalance -= amountINR;
        newHoldings[cryptoSymbol] = (newHoldings[cryptoSymbol] || 0) + cryptoAmount;
      } else {
        // Sell crypto for INR
        cryptoAmount = amountINR / currentPrice;
        const currentHolding = newHoldings[cryptoSymbol] || 0;
        
        if (currentHolding < cryptoAmount) {
          return res.status(400).json({ message: `Insufficient ${cryptoSymbol} balance` });
        }
        
        newBalance += amountINR;
        newHoldings[cryptoSymbol] = currentHolding - cryptoAmount;
        
        // Remove if holding becomes zero
        if (newHoldings[cryptoSymbol] <= 0) {
          delete newHoldings[cryptoSymbol];
        }
      }

      const updatedWallet = await storage.updateWallet(walletId, { 
        balanceINR: newBalance, 
        holdings: newHoldings 
      });

      // Create transaction record
      const transactionData = {
        walletId,
        type: "trade" as const,
        amountINR,
        crypto: {
          symbol: cryptoSymbol,
          amount: cryptoAmount,
        },
      };
      const txnHash = CryptoService.generateTransactionHash(transactionData);
      
      await storage.createTransaction({
        ...transactionData,
        txnHash,
      });

      res.json({ 
        wallet: { 
          _id: updatedWallet!._id, 
          name: updatedWallet!.name, 
          balanceINR: updatedWallet!.balanceINR, 
          holdings: updatedWallet!.holdings 
        },
        trade: {
          type,
          cryptoSymbol,
          cryptoAmount,
          amountINR,
          price: currentPrice,
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get transaction history
  app.get("/api/wallets/:id/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByWalletId(req.params.id);
      res.json({ transactions });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get cryptocurrency prices
  app.get("/api/crypto/prices", async (req, res) => {
    try {
      const prices = await CoinGeckoService.getCryptoPrices();
      res.json({ prices });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
