import React from 'react';
import { motion } from 'framer-motion';
import { BatteryCharging, Coins, Sword } from 'lucide-react';
import { type Player } from '../../contexts/GameContext';

interface BattleOpponentSelectorProps {
  opponents: Player[];
  onSelect: (opponentId: string) => void;
  selectedOpponent: string | null;
}

const BattleOpponentSelector: React.FC<BattleOpponentSelectorProps> = ({ 
  opponents, 
  onSelect, 
  selectedOpponent 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Select an Opponent</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opponents.map((opponent) => (
          <OpponentCard 
            key={opponent.id}
            opponent={opponent}
            isSelected={selectedOpponent === opponent.id}
            onSelect={() => onSelect(opponent.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface OpponentCardProps {
  opponent: Player;
  isSelected: boolean;
  onSelect: () => void;
}

const OpponentCard: React.FC<OpponentCardProps> = ({ opponent, isSelected, onSelect }) => {
  return (
    <motion.div
      className={`bg-gradient-to-br ${
        isSelected 
          ? 'from-purple-900/80 to-indigo-900/80 border-purple-500' 
          : 'from-gray-900/50 to-gray-800/50 border-gray-700/50'
      } backdrop-blur-md rounded-lg overflow-hidden border p-4 cursor-pointer relative`}
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div 
          className="absolute inset-0 border-2 border-purple-400 rounded-lg"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
        />
      )}
      
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-600/50">
            <img 
              src={opponent.avatar} 
              alt={opponent.username} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Level badge */}
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full w-8 h-8 flex items-center justify-center border-2 border-yellow-400">
            <span className="text-white font-bold text-xs">{opponent.level}</span>
          </div>
        </div>
        
        {/* Player info */}
        <div className="flex-1">
          <h3 className="font-bold text-lg text-white">{opponent.username}</h3>
          
          <div className="flex items-center space-x-3 mt-2">
            <div className="flex items-center">
              <BatteryCharging className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-300 text-sm">Lvl {opponent.level}</span>
            </div>
            
            <div className="flex items-center">
              <Sword className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-blue-300 text-sm">Rank #{Math.floor(Math.random() * 100) + 1}</span>
            </div>
          </div>
          
          <div className="mt-2 flex items-center">
            <Coins className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-yellow-300 text-sm">{opponent.battleTokens} $BATTLE</span>
          </div>
        </div>
      </div>
      
      {/* Battle button - only show when selected */}
      {isSelected && (
        <motion.div 
          className="mt-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-2 rounded text-center text-white font-medium">
            Ready to Battle
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BattleOpponentSelector;