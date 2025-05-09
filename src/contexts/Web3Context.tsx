import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface Web3ContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  balance: string;
  chainId: number | null;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
  balance: '0',
  chainId: null,
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('0');

  const isConnected = !!account;

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      // Try to connect if user was previously connected
      checkConnection();
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkConnection = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        updateChainId();
        updateBalance(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setBalance('0');
    } else {
      setAccount(accounts[0]);
      updateBalance(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const updateChainId = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chainId, 16));
    } catch (error) {
      console.error("Error updating chain ID:", error);
    }
  };

  const updateBalance = async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      // Convert from wei to ether
      const etherBalance = parseInt(balance, 16) / 10**18;
      setBalance(etherBalance.toFixed(4));
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this app!');
        return;
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      updateChainId();
      updateBalance(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
  };

  return (
    <Web3Context.Provider value={{
      account,
      connectWallet,
      disconnectWallet,
      isConnected,
      balance,
      chainId
    }}>
      {children}
    </Web3Context.Provider>
  );
};