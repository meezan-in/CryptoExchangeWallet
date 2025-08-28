# 💸 Secure Crypto Wallet & Trading System

A **6th Semester CSE project** from RVCE simulating a secure cryptocurrency wallet and INR-based trading platform. Built using **React.js**, **Node.js**, and **MongoDB Atlas**, the app allows users to manage wallets, securely store mnemonics, and trade live crypto prices.

> **This project is developed for the Cryptography and Network Security course.**

---

## 🚀 Features

- 🔐 Create & access multiple wallets using password and mnemonic (BIP39)
- 💰 Add/Remove INR balance
- 💱 Trade INR with real-time crypto rates (BTC, ETH, DOGE, MATIC, etc.)
- 📈 Live price updates from CoinGecko (1-second refresh)
- 📜 View full transaction history per wallet
- 🎨 Light-themed, responsive, minimalist UI

---

## 🧰 Tech Stack

### Frontend
- **React.js**: UI library for building interactive interfaces ([client/src/](client/src/))
- **TypeScript**: Type safety for React components and logic
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible React UI primitives
- **TanStack React Query**: Data fetching and caching

### Backend
- **Node.js**: JavaScript runtime for server-side logic ([server/](server/))
- **Express.js**: Web framework for API endpoints
- **MongoDB Atlas**: Cloud database for wallet and transaction storage
- **CoinGecko API**: Real-time cryptocurrency price data

### Security & Cryptography
- **BIP39**: Mnemonic phrase generation for wallet recovery ([server/services/crypto.ts](server/services/crypto.ts))
- **PBKDF2**: Key derivation for generating strong encryption keys from user passwords
- **AES-256**: Symmetric encryption for securing mnemonics with user password
- **SHA-256**: Hashing for password storage and transaction integrity

---

## 🔒 Cryptographic Methods & Security

### 1. BIP39 Mnemonic Generation
- **Purpose**: Generates a human-readable recovery phrase for wallets.
- **How it works**: Uses the `bip39` library to create a 12-word mnemonic, which can be used to deterministically derive wallet keys.
- **Security**: The mnemonic is never stored in plaintext; it is always encrypted with AES-256 before being saved.

### 2. PBKDF2 Key Derivation
- **Purpose**: Securely derives strong encryption keys from user passwords.
- **How it works**: 
  - When a user sets a password, PBKDF2 (Password-Based Key Derivation Function 2) combines the password with a random salt and applies thousands of hash iterations (e.g., using SHA-256).
  - The resulting key is used for AES-256 encryption of sensitive data (like mnemonics).
- **Security**: PBKDF2 makes brute-force and dictionary attacks much harder by increasing the computational effort required to guess passwords.

### 3. AES-256 Encryption
- **Purpose**: Encrypts sensitive data (mnemonic phrases) using a password.
- **How it works**: 
  - User provides a password (minimum 6 characters).
  - A salt is generated and used with the password to derive a 256-bit key (via PBKDF2).
  - The mnemonic is encrypted using AES-256 and stored in the database.
- **Security**: Only the user’s password can decrypt the mnemonic. The backend never stores or transmits the password in plaintext.

### 4. SHA-256 Hashing
- **Purpose**: 
  - Hashes user passwords for secure storage.
  - Generates transaction hashes for integrity.
- **How it works**: 
  - Passwords are hashed using SHA-256 before being stored.
  - Each transaction is hashed to prevent tampering.
- **Security**: SHA-256 is a one-way hash function, making it infeasible to reverse-engineer the original password or transaction data.

---

## 🏗️ Project Architecture & Block Diagram

```
[User (Browser)]
        |
        v
[React Frontend (client/)]
        |
        v
[Express Backend (server/)]
   |         |         |
   v         v         v
[CoinGecko] [MongoDB] [CryptoService: BIP39, PBKDF2, AES-256, SHA-256]
```

### Flow Description
1. **User** interacts with the React frontend to create or access wallets, trade, and view balances.
2. **Frontend** sends API requests to the Express backend for wallet creation, login, trading, and fetching live prices.
3. **Backend**:
    - Handles authentication and wallet management.
    - Uses [`CryptoService`](server/services/crypto.ts) for all cryptographic operations (mnemonic generation, PBKDF2 key derivation, encryption, hashing).
    - Fetches live crypto prices from CoinGecko.
    - Stores encrypted wallet data and transactions in MongoDB.
4. **Security**:
    - All sensitive data is encrypted before storage.
    - Passwords and mnemonics are never stored or transmitted in plaintext.
    - Transaction hashes ensure data integrity.

---

## ⚙️ How to Run

1. **Clone the repo**
2. **Backend**:  
   ```sh
   cd server
   npm install
   npm start
   ```
3. **Frontend**:  
   ```sh
   cd client
   npm install
   npm start
   ```
4. **Access app** at [http://localhost:3000](http://localhost:3000)

---

## 📌 Notes

- No user authentication — wallet-level password only
- Light mode UI only
- Simulated trading — **no real blockchain transactions**

---

## 🎓 Project Info

- **Project**: Secure Crypto Wallet & Trading System  
- **Student**: RVCE, 6th Sem CSE  
- **Course**: Cryptography and Network Security  
- **Purpose**: Academic

