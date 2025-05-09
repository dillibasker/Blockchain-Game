import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, XCircle, Coins, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type Battle } from '../../contexts/GameContext';

interface BattleResultProps {
  battle: Battle;
  playerIsPlayer1: boolean;
  onPlayAgain: () => void;
}

const BattleResult: React.FC<BattleResultProps> = ({ 
  battle, 
  playerIsPlayer1, 
  onPlayAgain 
}) => {
  const navigate = useNavigate();
  const isWinner = (playerIsPlayer1 && battle.winner === 'player1') ||
                  (!playerIsPlayer1 && battle.winner === 'player2');
  
  const winner = battle.winner === 'player1' ? battle.player1 : battle.player2;
  const winnerCharacter = battle.winner === 'player1' ? battle.player1Character : battle.player2Character;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      
      <motion.div 
        className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl border border-purple-500/30 shadow-2xl overflow-hidden max-w-lg w-full"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', bounce: 0.4 }}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className={`absolute w-64 h-64 rounded-full ${isWinner ? 'bg-purple-600/10' : 'bg-red-600/10'} blur-3xl`}
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
        </div>
        
        <div className="relative p-6 text-center">
          {/* Result header */}
          <div className="flex justify-center mb-4">
            {isWinner ? (
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-1">
            {isWinner ? 'Victory!' : 'Defeat'}
          </h2>
          
          <motion.p 
            className="text-gray-300 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isWinner 
              ? 'Congratulations! You won the battle and earned rewards!' 
              : `${winner.username} has defeated you in battle.`}
          </motion.p>
          
          {/* Battle stats */}
          <div className="bg-black/30 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400">Winner</div>
                <div className="font-medium text-white mt-1">{winner.username}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">Using</div>
                <div className="font-medium text-white mt-1">{winnerCharacter.name}</div>
              </div>
              
              {isWinner && (
                <>
                  <div className="text-center col-span-2">
                    <div className="text-sm text-gray-400">Reward</div>
                    <div className="font-medium text-yellow-400 flex items-center justify-center mt-1">
                      <Coins className="w-4 h-4 mr-2" />
                      {battle.tokenReward} $BATTLE
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayAgain}
            >
              Play Again
            </motion.button>
            
            <motion.button 
              className="bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-600 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/marketplace')}
            >
              Marketplace
              <ArrowRight className="ml-2 w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BattleResult;