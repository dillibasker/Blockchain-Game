import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Zap, PanelBottomOpen, Loader, Trophy, X } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import BattleOpponentSelector from '../components/battle/BattleOpponentSelector';
import BattleArena from '../components/battle/BattleArena';
import BattleControls from '../components/battle/BattleControls';
import BattleLog from '../components/battle/BattleLog';
import BattleResult from '../components/battle/BattleResult';
import { type BattleMove } from '../contexts/GameContext';

const BattlePage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useWeb3();
  const { player, leaderboard, createBattle, battle, makeBattleMove, loading, error } = useGame();
  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [showBattleLog, setShowBattleLog] = useState(false);
  const [showBattleResult, setShowBattleResult] = useState(false);
  const [lastMoveType, setLastMoveType] = useState<BattleMove | undefined>(undefined);

  // Automatically show battle log after battle starts
  useEffect(() => {
    if (battleStarted) {
      setShowBattleLog(true);
    }
  }, [battleStarted]);

  // Check if battle is complete
  useEffect(() => {
    if (battle?.status === 'completed' && battle.winner) {
      // Add some delay before showing results
      setTimeout(() => {
        setShowBattleResult(true);
      }, 1500);
    }
  }, [battle]);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  // Determine if the player is player1 or player2 in the battle
  const playerIsPlayer1 = battle ? player?.id === battle.player1.id : true;

  // Current player's turn?
  const isPlayerTurn = battle ? 
    (playerIsPlayer1 && battle.currentTurn === 'player1') || 
    (!playerIsPlayer1 && battle.currentTurn === 'player2') : 
    false;

  const startBattle = async () => {
    if (!selectedOpponent) return;
    
    try {
      await createBattle(selectedOpponent);
      setBattleStarted(true);
      setBattleLog([`Battle against ${leaderboard.find(p => p.id === selectedOpponent)?.username} has begun!`]);
    } catch (error) {
      console.error("Error starting battle:", error);
    }
  };

  const executeMove = async (move: BattleMove) => {
    if (!battle || loading) return;
    
    try {
      setLastMoveType(move);
      
      // Update battle log based on the move
      let logMessage = '';
      switch (move) {
        case 'attack':
          logMessage = `You perform a basic attack!`;
          break;
        case 'defend':
          logMessage = `You take a defensive stance.`;
          break;
        case 'special':
          logMessage = `You unleash a special attack!`;
          break;
        case 'item':
          logMessage = `You use an item from your inventory.`;
          break;
      }
      
      setBattleLog(prev => [...prev, logMessage]);
      
      // Execute the move
      await makeBattleMove(move);
      
      // Add opponent's move to log if it was AI's turn
      if (battle.moves && battle.moves.length > 0) {
        const lastMove = battle.moves[battle.moves.length - 1];
        const opponentName = playerIsPlayer1 ? battle.player2.username : battle.player1.username;
        
        if ((playerIsPlayer1 && lastMove.player === 'player2') || (!playerIsPlayer1 && lastMove.player === 'player1')) {
          let opponentMoveMessage = '';
          
          switch (lastMove.move) {
            case 'attack':
              opponentMoveMessage = `${opponentName} attacks for ${lastMove.damage || 0} damage!`;
              break;
            case 'defend':
              opponentMoveMessage = `${opponentName} takes a defensive stance.`;
              break;
            case 'special':
              opponentMoveMessage = `${opponentName} unleashes a special attack for ${lastMove.damage || 0} damage!`;
              break;
            case 'item':
              opponentMoveMessage = `${opponentName} uses an item.`;
              break;
          }
          
          setBattleLog(prev => [...prev, opponentMoveMessage]);
        }
      }
    } catch (error) {
      console.error("Error executing move:", error);
    }
  };

  const resetBattle = () => {
    setBattleStarted(false);
    setSelectedOpponent(null);
    setShowBattleResult(false);
    setBattleLog([]);
    setLastMoveType(undefined);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
          Battle Arena
        </h1>
        <p className="mt-2 text-gray-300 max-w-2xl mx-auto">
          Challenge opponents in strategic turn-based battles. Win to earn $BATTLE tokens and climb the leaderboard!
        </p>
      </header>

      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-purple-900/30 p-6 shadow-xl">
        {!battleStarted ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="opponent-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BattleOpponentSelector 
                opponents={leaderboard}
                onSelect={setSelectedOpponent}
                selectedOpponent={selectedOpponent}
              />
              
              {selectedOpponent && (
                <motion.div 
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    onClick={startBattle}
                    className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Initializing Battle...
                      </>
                    ) : (
                      <>
                        <Sword className="w-5 h-5 mr-2" />
                        Start Battle
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            {battle && (
              <motion.div
                key="battle-arena"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Battle info header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    {playerIsPlayer1 ? (
                      <span>{player?.username} vs {battle.player2.username}</span>
                    ) : (
                      <span>{player?.username} vs {battle.player1.username}</span>
                    )}
                  </h2>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-sm bg-purple-900/40 px-3 py-1 rounded-full border border-purple-500/30">
                      Round {battle.roundNumber}
                    </div>
                    
                    <div className="text-sm bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/30">
                      {isPlayerTurn ? 'Your Turn' : 'Opponent\'s Turn'}
                    </div>
                  </div>
                </div>
                
                {/* 3D Battle Arena */}
                <BattleArena 
                  battle={battle}
                  playerIsPlayer1={playerIsPlayer1}
                  onExecuteMove={executeMove}
                  lastMoveType={lastMoveType}
                />
                
                {/* Battle Controls */}
                <BattleControls
                  onExecuteMove={executeMove}
                  isPlayerTurn={isPlayerTurn}
                  loading={loading}
                />
                
                {/* Battle Log */}
                <BattleLog 
                  messages={battleLog}
                  isVisible={showBattleLog}
                  error={error}
                />
                
                {/* Battle Result Modal */}
                <AnimatePresence>
                  {showBattleResult && (
                    <BattleResult 
                      battle={battle}
                      playerIsPlayer1={playerIsPlayer1}
                      onPlayAgain={resetBattle}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default BattlePage;