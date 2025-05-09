import React, { createContext, useState, useContext, ReactNode } from 'react';

// Types
interface Player {
  id: string;
  address: string;
  username: string;
  avatar: string;
  level: number;
  experience: number;
  battleTokens: number;
}

interface Character {
  id: string;
  name: string;
  type: 'warrior' | 'mage' | 'archer' | 'tank' | 'healer';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  attack: number;
  defense: number;
  health: number;
  speed: number;
  special: string;
  image: string;
  isNFT: boolean;
  tokenId?: string;
}

interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stat: 'attack' | 'defense' | 'health' | 'speed' | 'special';
  bonus: number;
  description: string;
  image: string;
  isNFT: boolean;
  tokenId?: string;
}

export type BattleMove = 'attack' | 'defend' | 'special' | 'item';

interface Battle {
  id: string;
  player1: Player;
  player2: Player;
  player1Character: Character;
  player2Character: Character;
  player1Health: number;
  player2Health: number;
  currentTurn: 'player1' | 'player2';
  roundNumber: number;
  status: 'waiting' | 'active' | 'completed';
  winner?: 'player1' | 'player2';
  tokenReward: number;
  moves: {
    round: number;
    player: 'player1' | 'player2';
    move: BattleMove;
    damage?: number;
  }[];
}

interface GameContextType {
  player: Player | null;
  setPlayer: (player: Player) => void;
  characters: Character[];
  items: Item[];
  inventory: {
    characters: Character[];
    items: Item[];
  };
  battle: Battle | null;
  addCharacterToInventory: (character: Character) => void;
  addItemToInventory: (item: Item) => void;
  createBattle: (opponentId: string) => Promise<void>;
  joinBattle: (battleId: string) => Promise<void>;
  makeBattleMove: (move: BattleMove, itemId?: string) => Promise<void>;
  leaderboard: Player[];
  marketplace: {
    characters: Character[];
    items: Item[];
  };
  buyNFT: (type: 'character' | 'item', id: string) => Promise<void>;
  sellNFT: (type: 'character' | 'item', id: string, price: number) => Promise<void>;
  quests: {
    id: string;
    name: string;
    description: string;
    reward: number;
    completed: boolean;
  }[];
  completeQuest: (questId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Mock data for development
const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Cypher Knight',
    type: 'warrior',
    rarity: 'rare',
    attack: 85,
    defense: 70,
    health: 100,
    speed: 50,
    special: 'Blockchain Slash',
    image: 'https://images.pexels.com/photos/7887135/pexels-photo-7887135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isNFT: true,
    tokenId: '0x123'
  },
  {
    id: '2',
    name: 'Data Mage',
    type: 'mage',
    rarity: 'epic',
    attack: 95,
    defense: 50,
    health: 80,
    speed: 75,
    special: 'Hash Blast',
    image: 'https://images.pexels.com/photos/8721342/pexels-photo-8721342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isNFT: true,
    tokenId: '0x456'
  },
  {
    id: '3',
    name: 'Crypto Archer',
    type: 'archer',
    rarity: 'uncommon',
    attack: 75,
    defense: 45,
    health: 70,
    speed: 90,
    special: 'Token Arrow',
    image: 'https://images.pexels.com/photos/8721341/pexels-photo-8721341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isNFT: false
  }
];

const mockItems: Item[] = [
  {
    id: '1',
    name: 'Ethereum Blade',
    type: 'weapon',
    rarity: 'epic',
    stat: 'attack',
    bonus: 20,
    description: 'A powerful sword forged in the Ethereum blockchain',
    image: 'https://images.pexels.com/photos/8566470/pexels-photo-8566470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isNFT: true,
    tokenId: '0x789'
  },
  {
    id: '2',
    name: 'Blockchain Shield',
    type: 'armor',
    rarity: 'rare',
    stat: 'defense',
    bonus: 15,
    description: 'A shield made from unbreakable blockchain technology',
    image: 'https://images.pexels.com/photos/8566553/pexels-photo-8566553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isNFT: true,
    tokenId: '0xabc'
  }
];

const mockLeaderboard: Player[] = [
  {
    id: '1',
    address: '0x123...789',
    username: 'CryptoWarrior',
    avatar: 'https://images.pexels.com/photos/15217119/pexels-photo-15217119/free-photo-of-shiny-metallic-mask-in-neon-light.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 10,
    experience: 5000,
    battleTokens: 2500
  },
  {
    id: '2',
    address: '0xabc...def',
    username: 'BlockchainMaster',
    avatar: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 8,
    experience: 4000,
    battleTokens: 1800
  },
  {
    id: '3',
    address: '0xghi...jkl',
    username: 'NFTCollector',
    avatar: 'https://images.pexels.com/photos/8850709/pexels-photo-8850709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    level: 7,
    experience: 3500,
    battleTokens: 1500
  }
];

const mockQuests = [
  {
    id: '1',
    name: 'First Battle',
    description: 'Complete your first battle',
    reward: 100,
    completed: false
  },
  {
    id: '2',
    name: 'Collector',
    description: 'Collect 5 NFT characters',
    reward: 250,
    completed: false
  },
  {
    id: '3',
    name: 'Market Trader',
    description: 'Buy or sell an item on the marketplace',
    reward: 150,
    completed: false
  }
];

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [characters, setCharacters] = useState<Character[]>(mockCharacters);
  const [items, setItems] = useState<Item[]>(mockItems);
  const [inventory, setInventory] = useState<{ characters: Character[], items: Item[] }>({
    characters: [mockCharacters[0]],
    items: [mockItems[0]]
  });
  const [battle, setBattle] = useState<Battle | null>(null);
  const [leaderboard, setLeaderboard] = useState<Player[]>(mockLeaderboard);
  const [marketplace, setMarketplace] = useState<{ characters: Character[], items: Item[] }>({
    characters: [mockCharacters[1], mockCharacters[2]],
    items: [mockItems[1]]
  });
  const [quests, setQuests] = useState(mockQuests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add a character to player's inventory
  const addCharacterToInventory = (character: Character) => {
    setInventory(prev => ({
      ...prev,
      characters: [...prev.characters, character]
    }));
  };

  // Add an item to player's inventory
  const addItemToInventory = (item: Item) => {
    setInventory(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  };

  // Create a new battle with an opponent
  const createBattle = async (opponentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call a smart contract
      // Here we're just simulating the process
      const opponent = leaderboard.find(p => p.id === opponentId);
      if (!opponent || !player) {
        throw new Error("Player or opponent not found");
      }
      
      const playerCharacter = inventory.characters[0];
      const opponentCharacter = characters.find(c => c.id === '2') || characters[0];
      
      const newBattle: Battle = {
        id: `battle-${Date.now()}`,
        player1: player,
        player2: opponent,
        player1Character: playerCharacter,
        player2Character: opponentCharacter,
        player1Health: playerCharacter.health,
        player2Health: opponentCharacter.health,
        currentTurn: 'player1',
        roundNumber: 1,
        status: 'active',
        tokenReward: 100,
        moves: []
      };
      
      setBattle(newBattle);
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Join an existing battle
  const joinBattle = async (battleId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call a smart contract
      // Simulate joining a battle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Normally we would fetch the battle details from the blockchain
      // For demo purposes, we'll create a mock battle
      if (!player) {
        throw new Error("Player not found");
      }
      
      const opponent = leaderboard[0];
      const playerCharacter = inventory.characters[0];
      const opponentCharacter = characters.find(c => c.id === '3') || characters[0];
      
      const newBattle: Battle = {
        id: battleId,
        player1: opponent,
        player2: player,
        player1Character: opponentCharacter,
        player2Character: playerCharacter,
        player1Health: opponentCharacter.health,
        player2Health: playerCharacter.health,
        currentTurn: 'player1',
        roundNumber: 1,
        status: 'active',
        tokenReward: 100,
        moves: []
      };
      
      setBattle(newBattle);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Make a move in a battle
  const makeBattleMove = async (move: BattleMove, itemId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!battle) {
        throw new Error("No active battle");
      }
      
      // Clone current battle state
      const updatedBattle = { ...battle };
      
      // Determine whose turn it is and who's the target
      const isPlayer1Turn = updatedBattle.currentTurn === 'player1';
      const attacker = isPlayer1Turn ? updatedBattle.player1Character : updatedBattle.player2Character;
      const attackerHealth = isPlayer1Turn ? updatedBattle.player1Health : updatedBattle.player2Health;
      const defenderHealth = isPlayer1Turn ? updatedBattle.player2Health : updatedBattle.player1Health;
      
      // Calculate damage based on move
      let damage = 0;
      
      switch (move) {
        case 'attack':
          // Basic attack based on character's attack stat
          damage = Math.floor(attacker.attack * (0.8 + Math.random() * 0.4));
          break;
        case 'defend':
          // Defending reduces incoming damage on next turn by boosting defense temporarily
          damage = 0;
          break;
        case 'special':
          // Special attack does more damage but has a chance to miss
          const hitChance = 0.7;
          if (Math.random() < hitChance) {
            damage = Math.floor(attacker.attack * 1.5);
          }
          break;
        case 'item':
          // Use an item if provided
          if (itemId) {
            const item = inventory.items.find(i => i.id === itemId);
            if (item) {
              if (item.stat === 'attack') {
                damage = Math.floor(attacker.attack * (1 + item.bonus / 100));
              } else {
                // Healing or buff item
                damage = 0;
              }
            }
          }
          break;
      }
      
      // Apply damage to the opponent
      if (isPlayer1Turn) {
        updatedBattle.player2Health = Math.max(0, defenderHealth - damage);
      } else {
        updatedBattle.player1Health = Math.max(0, defenderHealth - damage);
      }
      
      // Record the move
      updatedBattle.moves.push({
        round: updatedBattle.roundNumber,
        player: updatedBattle.currentTurn,
        move,
        damage: damage
      });
      
      // Check if battle is over
      if (updatedBattle.player1Health <= 0 || updatedBattle.player2Health <= 0) {
        updatedBattle.status = 'completed';
        updatedBattle.winner = updatedBattle.player1Health <= 0 ? 'player2' : 'player1';
        
        // If player won, add tokens
        if ((updatedBattle.winner === 'player1' && player?.id === updatedBattle.player1.id) ||
            (updatedBattle.winner === 'player2' && player?.id === updatedBattle.player2.id)) {
          setPlayer(prev => prev ? {
            ...prev,
            battleTokens: prev.battleTokens + updatedBattle.tokenReward,
            experience: prev.experience + 50
          } : null);
        }
      } else {
        // Switch turns
        updatedBattle.currentTurn = isPlayer1Turn ? 'player2' : 'player1';
        
        // If it was player2's turn, increment the round
        if (!isPlayer1Turn) {
          updatedBattle.roundNumber += 1;
        }
        
        // If it's now the AI's turn (opponent), simulate their move
        if ((updatedBattle.currentTurn === 'player1' && player?.id !== updatedBattle.player1.id) ||
            (updatedBattle.currentTurn === 'player2' && player?.id !== updatedBattle.player2.id)) {
          // AI makes a random move
          await new Promise(resolve => setTimeout(resolve, 1000));
          const aiMoves: BattleMove[] = ['attack', 'defend', 'special'];
          const randomMove = aiMoves[Math.floor(Math.random() * aiMoves.length)];
          await makeBattleMove(randomMove);
          return;
        }
      }
      
      // Update battle state
      setBattle(updatedBattle);
      
      // Simulate blockchain confirmation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Buy an NFT from the marketplace
  const buyNFT = async (type: 'character' | 'item', id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call a smart contract to purchase the NFT
      // Here we're just simulating the process
      if (!player) {
        throw new Error("Player not found");
      }
      
      // Find the NFT in the marketplace
      let nft;
      if (type === 'character') {
        nft = marketplace.characters.find(c => c.id === id);
        if (nft) {
          // Remove from marketplace
          setMarketplace(prev => ({
            ...prev,
            characters: prev.characters.filter(c => c.id !== id)
          }));
          
          // Add to inventory
          addCharacterToInventory(nft);
        }
      } else {
        nft = marketplace.items.find(i => i.id === id);
        if (nft) {
          // Remove from marketplace
          setMarketplace(prev => ({
            ...prev,
            items: prev.items.filter(i => i.id !== id)
          }));
          
          // Add to inventory
          addItemToInventory(nft);
        }
      }
      
      if (!nft) {
        throw new Error("NFT not found in marketplace");
      }
      
      // Deduct tokens from player (assuming a standard price of 500 tokens)
      const price = 500;
      setPlayer(prev => prev ? {
        ...prev,
        battleTokens: Math.max(0, prev.battleTokens - price)
      } : null);
      
      // Update quest status if applicable
      const marketQuestIndex = quests.findIndex(q => q.id === '3' && !q.completed);
      if (marketQuestIndex >= 0) {
        const updatedQuests = [...quests];
        updatedQuests[marketQuestIndex].completed = true;
        setQuests(updatedQuests);
        
        // Reward player
        setPlayer(prev => prev ? {
          ...prev,
          battleTokens: prev.battleTokens + updatedQuests[marketQuestIndex].reward
        } : null);
      }
      
      // Simulate blockchain confirmation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Sell an NFT to the marketplace
  const sellNFT = async (type: 'character' | 'item', id: string, price: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call a smart contract to list the NFT
      // Here we're just simulating the process
      let nft;
      
      if (type === 'character') {
        nft = inventory.characters.find(c => c.id === id);
        if (nft) {
          // Remove from inventory
          setInventory(prev => ({
            ...prev,
            characters: prev.characters.filter(c => c.id !== id)
          }));
          
          // Add to marketplace
          setMarketplace(prev => ({
            ...prev,
            characters: [...prev.characters, nft!]
          }));
        }
      } else {
        nft = inventory.items.find(i => i.id === id);
        if (nft) {
          // Remove from inventory
          setInventory(prev => ({
            ...prev,
            items: prev.items.filter(i => i.id !== id)
          }));
          
          // Add to marketplace
          setMarketplace(prev => ({
            ...prev,
            items: [...prev.items, nft!]
          }));
        }
      }
      
      if (!nft) {
        throw new Error("NFT not found in inventory");
      }
      
      // Update quest status if applicable
      const marketQuestIndex = quests.findIndex(q => q.id === '3' && !q.completed);
      if (marketQuestIndex >= 0) {
        const updatedQuests = [...quests];
        updatedQuests[marketQuestIndex].completed = true;
        setQuests(updatedQuests);
        
        // Reward player
        setPlayer(prev => prev ? {
          ...prev,
          battleTokens: (prev.battleTokens || 0) + updatedQuests[marketQuestIndex].reward
        } : null);
      }
      
      // Simulate blockchain confirmation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Complete a quest
  const completeQuest = async (questId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const questIndex = quests.findIndex(q => q.id === questId);
      if (questIndex < 0) {
        throw new Error("Quest not found");
      }
      
      if (quests[questIndex].completed) {
        throw new Error("Quest already completed");
      }
      
      // Mark quest as completed
      const updatedQuests = [...quests];
      updatedQuests[questIndex].completed = true;
      setQuests(updatedQuests);
      
      // Reward the player
      setPlayer(prev => prev ? {
        ...prev,
        battleTokens: prev.battleTokens + updatedQuests[questIndex].reward,
        experience: prev.experience + Math.floor(updatedQuests[questIndex].reward / 2)
      } : null);
      
      // Simulate blockchain confirmation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameContext.Provider
      value={{
        player,
        setPlayer,
        characters,
        items,
        inventory,
        battle,
        addCharacterToInventory,
        addItemToInventory,
        createBattle,
        joinBattle,
        makeBattleMove,
        leaderboard,
        marketplace,
        buyNFT,
        sellNFT,
        quests,
        completeQuest,
        loading,
        error
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};