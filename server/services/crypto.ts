import crypto from 'crypto';
import * as bip39 from 'bip39';

export class CryptoService {
  // Generate BIP39 mnemonic
  static generateMnemonic(): string {
    return bip39.generateMnemonic();
  }

  // Validate BIP39 mnemonic
  static validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
  }

  // Generate password hash using SHA-256
  static hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // Derive AES key from password
  static deriveKey(password: string, salt: string): Buffer {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  }

  // Encrypt data using AES-256
  static encrypt(data: string, password: string): string {
    const salt = crypto.randomBytes(16);
    const key = this.deriveKey(password, salt.toString('hex'));
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;
  }

  // Decrypt data using AES-256
  static decrypt(encryptedData: string, password: string): string {
    const parts = encryptedData.split(':');
    const salt = Buffer.from(parts[0], 'hex');
    const iv = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const key = this.deriveKey(password, salt.toString('hex'));
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Generate SHA-256 hash for transactions
  static generateTransactionHash(data: any): string {
    const dataString = JSON.stringify(data) + Date.now();
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }
}
