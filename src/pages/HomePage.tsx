import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Sword, Coins, ArrowRight, BatteryCharging } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { useGame } from '../contexts/GameContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useWeb3();
  const { player, leaderboard } = useGame();

  // Hero section animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Card hover animation
  const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.03, 
      y: -5,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  // 3D Card tilt effect (simulated with transforms)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 px-6 py-16 md:py-24 text-center shadow-2xl border border-purple-500/30"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute w-64 h-64 rounded-full bg-blue-600/20 blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ top: '10%', left: '10%' }}
          />
          <motion.div 
            className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
            animate={{ 
              x: [0, -50, 0],
              y: [0, 100, 0],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{ top: '30%', right: '15%' }}
          />
        </div>

        <div className="relative">
          <motion.div variants={itemVariants} className="mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-400">
                Battle, Collect, Earn & Trade 
              </span>
              <br />
              <span className="text-white">on the Blockchain</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-purple-100/80 max-w-2xl mx-auto">
              Join thousands of players in BlockBattle, a decentralized play-to-earn 
              strategy game where every character, weapon, and battle is secured by blockchain technology.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10">
            {isConnected ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/battle')}
                  className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg flex items-center transition-all"
                >
                  <Sword className="w-5 h-5 mr-2" />
                  Start Battle
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/marketplace')}
                  className="px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-800 to-blue-800 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-lg shadow-lg flex items-center border border-indigo-500/30 transition-all"
                >
                  Visit Marketplace
                </motion.button>
              </div>
            ) : (
              <motion.p
                className="text-xl text-purple-200 bg-purple-800/30 px-6 py-4 rounded-lg border border-purple-500/30 inline-block"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Connect your wallet to start playing!
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Game Features Section */}
      <section className="py-8">
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-bold"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Game Features
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-xl"
            whileHover="hover"
            initial="rest"
            variants={cardHover}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Sword className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Strategic Battles</h3>
            <p className="text-gray-300">
              Engage in turn-based strategy battles with unique abilities, tactical planning, and blockchain verification for fairness.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-xl"
            whileHover="hover"
            initial="rest"
            variants={cardHover}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">NFT Characters & Items</h3>
            <p className="text-gray-300">
              Collect, upgrade, and trade unique NFT characters, weapons, and items with verifiable ownership and rarity.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-xl"
            whileHover="hover"
            initial="rest"
            variants={cardHover}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
              <Coins className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Play-to-Earn</h3>
            <p className="text-gray-300">
              Earn $BATTLE tokens through victories, quest completion, and marketplace trading that can be used in-game or exchanged.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      {player && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="py-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Top Players</h2>
            <button 
              onClick={() => navigate('/leaderboard')}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-800/30 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              {leaderboard.slice(0, 3).map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center p-4 rounded-lg bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-700/50"
                >
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                      <img 
                        src={player.avatar} 
                        alt={player.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-lg text-white">{player.username}</h3>
                    <div className="flex items-center mt-1">
                      <BatteryCharging className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-gray-300 text-sm">Lvl {player.level}</span>
                      <span className="mx-2 text-gray-500">•</span>
                      <Coins className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-300 text-sm">{player.battleTokens}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-gradient-to-r from-blue-900/70 to-purple-900/70 rounded-xl py-12 px-6 text-center border border-blue-500/30 shadow-2xl backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join the Battle?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Connect your wallet now and start your journey to become the ultimate BlockBattle champion!
          </p>
          
          {!isConnected && (
            <motion.button
              onClick={() => navigate('/battle')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg"
            >
              Connect Wallet to Start
            </motion.button>
          )}
          
          {isConnected && (
            <motion.button
              onClick={() => navigate('/battle')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg flex items-center mx-auto"
            >
              <Sword className="w-5 h-5 mr-2" />
              Enter Battle Arena
            </motion.button>
          )}
        </motion.div>
      </motion.section>
    </div>
  );
};

export default HomePage;