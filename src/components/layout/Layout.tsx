import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Coins, Sword, ShoppingBag, LayoutGrid, Trophy, Menu, X } from 'lucide-react';
import { useWeb3 } from '../../contexts/Web3Context';
import { useGame } from '../../contexts/GameContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { account, connectWallet, disconnectWallet, isConnected, balance } = useWeb3();
  const { player, setPlayer } = useGame();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConnectAnimation, setShowConnectAnimation] = useState(false);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Create player profile when wallet is connected
  useEffect(() => {
    if (isConnected && account && !player) {
      // This would normally fetch player data from the blockchain
      // For now, we'll create a mock player
      setPlayer({
        id: `player-${Date.now()}`,
        address: account,
        username: `Player${account.substring(0, 4)}`,
        avatar: 'https://images.pexels.com/photos/15217119/pexels-photo-15217119/free-photo-of-shiny-metallic-mask-in-neon-light.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        level: 1,
        experience: 0,
        battleTokens: 1000
      });
    }
  }, [isConnected, account, player, setPlayer]);

  const handleConnectWallet = async () => {
    setShowConnectAnimation(true);
    await connectWallet();
    setTimeout(() => setShowConnectAnimation(false), 1500);
  };

  const navigationItems = [
    { name: 'Home', path: '/', icon: <LayoutGrid className="w-6 h-6" /> },
    { name: 'Battle', path: '/battle', icon: <Sword className="w-6 h-6" /> },
    { name: 'Marketplace', path: '/marketplace', icon: <ShoppingBag className="w-6 h-6" /> },
    { name: 'Inventory', path: '/inventory', icon: <Coins className="w-6 h-6" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="w-6 h-6" /> }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Desktop Navigation Bar */}
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-900/50 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sword className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              BlockBattle
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all ${
                  isActive(item.path)
                    ? 'bg-purple-700/30 text-purple-300 border border-purple-600/50'
                    : 'hover:bg-purple-800/20 hover:text-purple-300'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected && player ? (
              <div className="flex items-center">
                <div className="mr-4 px-3 py-1 bg-purple-900/50 rounded-md border border-purple-600/30">
                  <div className="flex items-center">
                    <Coins className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-300">{player.battleTokens} $BATTLE</span>
                  </div>
                </div>

                <motion.button
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 border border-purple-500/30 shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">
                    {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                  </span>
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={handleConnectWallet}
                className="flex items-center space-x-2 px-6 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 shadow-xl border border-blue-500/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={showConnectAnimation ? { 
                  scale: [1, 1.1, 1],
                  boxShadow: ["0 0 0 0 rgba(168, 85, 247, 0.4)", "0 0 0 15px rgba(168, 85, 247, 0)", "0 0 0 0 rgba(168, 85, 247, 0)"]
                } : {}}
                transition={{ duration: 1.5 }}
              >
                <Wallet className="w-5 h-5" />
                <span className="font-medium">Connect Wallet</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-200 hover:bg-purple-800/20"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/90 backdrop-blur-md border-b border-purple-900/30"
          >
            <nav className="flex flex-col p-4">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md mb-2 transition-all ${
                    isActive(item.path)
                      ? 'bg-purple-800/40 text-purple-300 border border-purple-600/50'
                      : 'hover:bg-purple-800/20 hover:text-purple-300'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}

              {/* Mobile Wallet Connection */}
              {isConnected && player ? (
                <div className="mt-2 space-y-3">
                  <div className="px-4 py-3 bg-purple-900/40 rounded-md border border-purple-600/30 flex items-center justify-between">
                    <div className="flex items-center">
                      <Coins className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-yellow-300 font-medium">{player.battleTokens} $BATTLE</span>
                    </div>
                    <span className="text-sm text-gray-300">
                      Level {player.level} • {player.experience} XP
                    </span>
                  </div>

                  <motion.button
                    onClick={disconnectWallet}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-md bg-gradient-to-r from-purple-700 to-indigo-800 border border-purple-500/30 shadow-lg"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Wallet className="w-5 h-5" />
                    <span>
                      {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                    </span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={handleConnectWallet}
                  className="mt-3 w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-md bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg border border-blue-500/30"
                  whileTap={{ scale: 0.95 }}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Connect Wallet</span>
                </motion.button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 min-h-[calc(100vh-64px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-purple-900/30 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sword className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              BlockBattle
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 BlockBattle. All NFT assets are owned by their respective holders.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;