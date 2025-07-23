import { ObjectId } from 'mongodb';
import { mongodb } from './services/mongodb';
import { Wallet, Transaction, InsertWallet, InsertTransaction } from '@shared/schema';

export interface IStorage {
  // Wallet operations
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  getWalletByName(name: string): Promise<Wallet | null>;
  getWalletById(id: string): Promise<Wallet | null>;
  updateWallet(id: string, updates: Partial<Wallet>): Promise<Wallet | null>;
  getAllWallets(): Promise<Wallet[]>;

  // Transaction operations
  createTransaction(transaction: InsertTransaction & { txnHash: string }): Promise<Transaction>;
  getTransactionsByWalletId(walletId: string): Promise<Transaction[]>;
  getRecentTransactions(walletId: string, limit: number): Promise<Transaction[]>;
}

export class MongoStorage implements IStorage {
  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const walletsCollection = mongodb.getWalletsCollection();
    const result = await walletsCollection.insertOne({
      ...wallet,
      _id: new ObjectId().toString(),
      createdAt: new Date(),
    });
    
    const createdWallet = await walletsCollection.findOne({ _id: result.insertedId });
    if (!createdWallet) {
      throw new Error('Failed to create wallet');
    }
    
    return createdWallet;
  }

  async getWalletByName(name: string): Promise<Wallet | null> {
    const walletsCollection = mongodb.getWalletsCollection();
    return await walletsCollection.findOne({ name });
  }

  async getWalletById(id: string): Promise<Wallet | null> {
    const walletsCollection = mongodb.getWalletsCollection();
    return await walletsCollection.findOne({ _id: id });
  }

  async updateWallet(id: string, updates: Partial<Wallet>): Promise<Wallet | null> {
    const walletsCollection = mongodb.getWalletsCollection();
    const result = await walletsCollection.findOneAndUpdate(
      { _id: id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    return result || null;
  }

  async getAllWallets(): Promise<Wallet[]> {
    const walletsCollection = mongodb.getWalletsCollection();
    return await walletsCollection.find({}).toArray();
  }

  async createTransaction(transaction: InsertTransaction & { txnHash: string }): Promise<Transaction> {
    const transactionsCollection = mongodb.getTransactionsCollection();
    const result = await transactionsCollection.insertOne({
      ...transaction,
      _id: new ObjectId().toString(),
      timestamp: new Date(),
    });
    
    const createdTransaction = await transactionsCollection.findOne({ _id: result.insertedId });
    if (!createdTransaction) {
      throw new Error('Failed to create transaction');
    }
    
    return createdTransaction;
  }

  async getTransactionsByWalletId(walletId: string): Promise<Transaction[]> {
    const transactionsCollection = mongodb.getTransactionsCollection();
    return await transactionsCollection
      .find({ walletId })
      .sort({ timestamp: -1 })
      .toArray();
  }

  async getRecentTransactions(walletId: string, limit: number = 10): Promise<Transaction[]> {
    const transactionsCollection = mongodb.getTransactionsCollection();
    return await transactionsCollection
      .find({ walletId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }
}

export const storage = new MongoStorage();
