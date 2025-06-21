# 💸 Crypto Wallet Simulator

A **6th Semester CSE project** from RVCE simulating a secure cryptocurrency wallet and INR-based trading platform. Built using **React.js**, **Node.js**, and **MongoDB Atlas**, the app allows users to manage wallets, securely store mnemonics, and trade live crypto prices.

---

## 🚀 Features

- 🔐 Create & access multiple wallets using password and mnemonic (BIP39)
- 💰 Add/Remove INR balance
- 💱 Trade INR with real-time crypto rates (BTC, ETH, DOGE, MATIC, etc.)
- 📈 Live price updates from CoinGecko (1-second refresh)
- 📜 View full transaction history per wallet
- 🎨 Light-themed, responsive, minimalist UI

---

## 🔒 Cryptographic Methods

- **BIP39**: Secure mnemonic generation
- **AES-256**: Encrypt wallet mnemonic with password
- **SHA-256**: Hash each transaction for integrity

---

## 🧰 Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API**: CoinGecko (for live prices)
- **Security**: BIP39, AES-256, SHA-256

---

## ⚙️ How to Run

1. Clone the repo
2. Run backend (`npm install && npm start`)
3. Run frontend (`npm install && npm start`)
4. Access app at `http://localhost:3000`

---

## 📌 Notes

- No user authentication — wallet-level password only
- Light mode UI only
- Simulated trading — **no real blockchain transactions**

---

## 🎓 Project Info

- **Project**: Crypto Wallet Simulator  
- **Student**: RVCE, 6th Sem CSE  
- **Purpose**: Academic & Educational Use Only

