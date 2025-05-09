import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Zap, PanelBottomOpen } from 'lucide-react';
import { type BattleMove } from '../../contexts/GameContext';

interface BattleControlsProps {
  onExecuteMove: (move: BattleMove) => void;
  isPlayerTurn: boolean;
  loading: boolean;
}

const BattleControls: React.FC<BattleControlsProps> = ({ 
  onExecuteMove, 
  isPlayerTurn,
  loading
}) => {
  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-3 gap-4">
        <ActionButton 
          icon={<Sword className="w-6 h-6" />}
          label="Attack"
          color="from-red-600 to-red-800"
          activeColor="from-red-500 to-red-700"
          onClick={() => onExecuteMove('attack')}
          disabled={!isPlayerTurn || loading}
        />
        
        <ActionButton 
          icon={<Shield className="w-6 h-6" />}
          label="Defend"
          color="from-blue-600 to-blue-800"
          activeColor="from-blue-500 to-blue-700"
          onClick={() => onExecuteMove('defend')}
          disabled={!isPlayerTurn || loading}
        />
        
        <ActionButton 
          icon={<Zap className="w-6 h-6" />}
          label="Special"
          color="from-purple-600 to-purple-800"
          activeColor="from-purple-500 to-purple-700"
          onClick={() => onExecuteMove('special')}
          disabled={!isPlayerTurn || loading}
        />
      </div>
      
      <div className="mt-4">
        <ActionButton 
          icon={<PanelBottomOpen className="w-6 h-6" />}
          label="Use Item"
          color="from-amber-600 to-amber-800"
          activeColor="from-amber-500 to-amber-700"
          onClick={() => onExecuteMove('item')}
          disabled={!isPlayerTurn || loading}
          fullWidth
        />
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  activeColor: string;
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon, 
  label, 
  color, 
  activeColor,
  onClick, 
  disabled = false,
  fullWidth = false
}) => {
  return (
    <motion.button
      className={`flex flex-col items-center justify-center p-4 rounded-lg
                  bg-gradient-to-b ${color} border border-white/10
                  shadow-lg relative overflow-hidden
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gradient-to-b hover:' + activeColor}
                  ${fullWidth ? 'w-full' : ''}`}
      onClick={() => !disabled && onClick()}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
    >
      {/* Animated glow effect */}
      <motion.div 
        className="absolute inset-0 bg-white/20 rounded-lg"
        animate={{ 
          opacity: disabled ? 0 : [0.1, 0.2, 0.1],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative">
        {icon}
        <span className="mt-2 font-medium">{label}</span>
      </div>
    </motion.button>
  );
};

export default BattleControls;