import { apiRequest } from './queryClient';
import { WalletCreation, WalletLogin, AddINR, RemoveINR, Trade } from '@shared/schema';

export const api = {
  // Wallet operations
  createWallet: async (data: WalletCreation) => {
    const response = await apiRequest('POST', '/api/wallets/create', data);
    return response.json();
  },

  loginWallet: async (data: WalletLogin) => {
    const response = await apiRequest('POST', '/api/wallets/login', data);
    return response.json();
  },

  getWallet: async (id: string) => {
    const response = await apiRequest('GET', `/api/wallets/${id}`);
    return response.json();
  },

  addINR: async (data: AddINR) => {
    const response = await apiRequest('POST', '/api/wallets/add-inr', data);
    return response.json();
  },

  removeINR: async (data: RemoveINR) => {
    const response = await apiRequest('POST', '/api/wallets/remove-inr', data);
    return response.json();
  },

  trade: async (data: Trade) => {
    const response = await apiRequest('POST', '/api/wallets/trade', data);
    return response.json();
  },

  getTransactions: async (walletId: string) => {
    const response = await apiRequest('GET', `/api/wallets/${walletId}/transactions`);
    return response.json();
  },

  getCryptoPrices: async () => {
    const response = await apiRequest('GET', '/api/crypto/prices');
    return response.json();
  },
};
