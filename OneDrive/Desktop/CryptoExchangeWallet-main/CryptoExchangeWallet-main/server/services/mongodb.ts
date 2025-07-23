import { MongoClient, Db, Collection } from 'mongodb';
import { Wallet, Transaction } from '@shared/schema';

class MongoDB {
  private client: MongoClient;
  private db!: Db;
  private walletsCollection!: Collection<Wallet>;
  private transactionsCollection!: Collection<Transaction>;

  constructor() {
    const uri = 'mongodb+srv://happyuser:tomato12@cluster0.sx3hjrz.mongodb.net/';
    this.client = new MongoClient(uri);
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db('crypto_wallet_simulator');
    this.walletsCollection = this.db.collection<Wallet>('wallets');
    this.transactionsCollection = this.db.collection<Transaction>('transactions');
    
    // Create indexes for better performance with safe creation
    try {
      await this.walletsCollection.createIndex({ name: 1 }, { unique: true });
    } catch (error: any) {
      // Index might already exist or have conflicts, continue anyway
      if (error.code === 11000) {
        console.log('Wallet name index already exists or has duplicates');
      }
    }
    
    try {
      await this.transactionsCollection.createIndex({ walletId: 1 });
      await this.transactionsCollection.createIndex({ timestamp: -1 });
    } catch (error) {
      // Indexes might already exist, continue anyway
      console.log('Transaction indexes already exist');
    }
  }

  getWalletsCollection() {
    return this.walletsCollection;
  }

  getTransactionsCollection() {
    return this.transactionsCollection;
  }

  async close() {
    await this.client.close();
  }
}

export const mongodb = new MongoDB();
