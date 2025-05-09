import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Swords, Coins, BadgeDollarSign, ShieldCheck, BarChart4 } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { type Character, type Item } from '../contexts/GameContext';

const InventoryPage: React.FC = () => {
  const { player, inventory } = useGame();
  const [activeTab, setActiveTab] = useState<'characters' | 'items'>('characters');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ShieldAlert className="w-16 h-16 text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-300">Connect your wallet to view your inventory</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
          Inventory
        </h1>
        <p className="mt-2 text-gray-300 max-w-2xl mx-auto">
          Manage your collection of battle characters and powerful items
        </p>
      </header>

      {/* Inventory Container */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-purple-900/30 shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-purple-900/30">
          <TabButton 
            label="Characters"
            icon={<Swords className="w-5 h-5" />}
            isActive={activeTab === 'characters'}
            onClick={() => setActiveTab('characters')}
            count={inventory.characters.length}
          />
          <TabButton 
            label="Items"
            icon={<ShieldCheck className="w-5 h-5" />}
            isActive={activeTab === 'items'}
            onClick={() => setActiveTab('items')}
            count={inventory.items.length}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Characters Tab */}
              {activeTab === 'characters' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inventory.characters.map(character => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      isSelected={selectedCharacter?.id === character.id}
                      onClick={() => setSelectedCharacter(character)}
                    />
                  ))}
                </div>
              )}

              {/* Items Tab */}
              {activeTab === 'items' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inventory.items.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Selected Item Details */}
      <AnimatePresence>
        {selectedCharacter && (
          <CharacterDetailsModal
            character={selectedCharacter}
            onClose={() => setSelectedCharacter(null)}
          />
        )}
        {selectedItem && (
          <ItemDetailsModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick, count }) => (
  <button
    className={`flex items-center py-4 px-6 focus:outline-none transition-all ${
      isActive 
        ? 'bg-purple-900/30 text-purple-300 border-b-2 border-purple-500' 
        : 'text-gray-400 hover:text-gray-300 hover:bg-purple-900/10'
    }`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-2">{label}</span>
    <div className="ml-2 bg-purple-800/60 text-purple-300 text-xs px-2 py-0.5 rounded-full">
      {count}
    </div>
  </button>
);

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, isSelected, onClick }) => {
  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-600 to-amber-800 text-yellow-300';
      case 'epic': return 'from-purple-600 to-indigo-800 text-purple-300';
      case 'rare': return 'from-blue-600 to-indigo-800 text-blue-300';
      case 'uncommon': return 'from-green-600 to-teal-800 text-green-300';
      default: return 'from-gray-600 to-gray-800 text-gray-300';
    }
  };

  const rarityColor = getRarityColor(character.rarity);

  return (
    <motion.div
      className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border ${
        isSelected ? 'border-purple-500' : 'border-gray-700'
      } cursor-pointer transition-all hover:shadow-xl`}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
    >
      {/* Character Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover transition-transform hover:scale-110"
        />
      </div>

      {/* Character Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white">{character.name}</h3>
          <div className={`text-xs font-medium px-2 py-1 rounded bg-gradient-to-r ${rarityColor}`}>
            {character.rarity.charAt(0).toUpperCase() + character.rarity.slice(1)}
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-3">
          {character.type.charAt(0).toUpperCase() + character.type.slice(1)}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Swords className="w-4 h-4 text-red-400 mr-1" />
            <span className="text-red-300">ATK: {character.attack}</span>
          </div>
          <div className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-blue-400 mr-1" />
            <span className="text-blue-300">DEF: {character.defense}</span>
          </div>
          <div className="flex items-center">
            <BarChart4 className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-300">HP: {character.health}</span>
          </div>
          <div className="flex items-center">
            <BadgeDollarSign className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-yellow-300">NFT: {character.isNFT ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface ItemCardProps {
  item: Item;
  isSelected: boolean;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, isSelected, onClick }) => {
  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-600 to-amber-800 text-yellow-300';
      case 'epic': return 'from-purple-600 to-indigo-800 text-purple-300';
      case 'rare': return 'from-blue-600 to-indigo-800 text-blue-300';
      case 'uncommon': return 'from-green-600 to-teal-800 text-green-300';
      default: return 'from-gray-600 to-gray-800 text-gray-300';
    }
  };

  const rarityColor = getRarityColor(item.rarity);

  return (
    <motion.div
      className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border ${
        isSelected ? 'border-purple-500' : 'border-gray-700'
      } cursor-pointer transition-all hover:shadow-xl`}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
    >
      {/* Item Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform hover:scale-110"
        />
      </div>

      {/* Item Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white">{item.name}</h3>
          <div className={`text-xs font-medium px-2 py-1 rounded bg-gradient-to-r ${rarityColor}`}>
            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-3">
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </div>

        {/* Item stats */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <BarChart4 className="w-4 h-4 text-blue-400 mr-1" />
            <span className="text-blue-300">
              {item.stat.toUpperCase()}: +{item.bonus}%
            </span>
          </div>
          <div className="flex items-center">
            <BadgeDollarSign className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-yellow-300">NFT: {item.isNFT ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface CharacterDetailsModalProps {
  character: Character;
  onClose: () => void;
}

const CharacterDetailsModal: React.FC<CharacterDetailsModalProps> = ({ character, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl border border-purple-600/30 shadow-2xl w-full max-w-2xl overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* Character Image */}
        <div className="w-full md:w-1/2">
          <img
            src={character.image}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Character Details */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{character.name}</h2>
          
          <div className="mb-4 flex items-center">
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full 
              ${character.rarity === 'legendary' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-600/50' : 
                character.rarity === 'epic' ? 'bg-purple-900/50 text-purple-300 border border-purple-600/50' : 
                character.rarity === 'rare' ? 'bg-blue-900/50 text-blue-300 border border-blue-600/50' : 
                character.rarity === 'uncommon' ? 'bg-green-900/50 text-green-300 border border-green-600/50' : 
                'bg-gray-800 text-gray-300 border border-gray-700'}`}>
              {character.rarity.charAt(0).toUpperCase() + character.rarity.slice(1)}
            </span>
            
            <span className="mx-2 text-gray-500">•</span>
            
            <span className="text-gray-300">
              {character.type.charAt(0).toUpperCase() + character.type.slice(1)}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm uppercase text-gray-500 mb-1">Special Ability</h3>
              <p className="text-purple-300">{character.special}</p>
            </div>
            
            <div>
              <h3 className="text-sm uppercase text-gray-500 mb-2">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 p-3 rounded border border-gray-800">
                  <div className="text-red-400 text-sm mb-1">Attack</div>
                  <div className="text-2xl font-bold">{character.attack}</div>
                </div>
                <div className="bg-black/30 p-3 rounded border border-gray-800">
                  <div className="text-blue-400 text-sm mb-1">Defense</div>
                  <div className="text-2xl font-bold">{character.defense}</div>
                </div>
                <div className="bg-black/30 p-3 rounded border border-gray-800">
                  <div className="text-green-400 text-sm mb-1">Health</div>
                  <div className="text-2xl font-bold">{character.health}</div>
                </div>
                <div className="bg-black/30 p-3 rounded border border-gray-800">
                  <div className="text-yellow-400 text-sm mb-1">Speed</div>
                  <div className="text-2xl font-bold">{character.speed}</div>
                </div>
              </div>
            </div>
            
            {character.isNFT && (
              <div>
                <h3 className="text-sm uppercase text-gray-500 mb-1">NFT Details</h3>
                <div className="bg-black/30 p-3 rounded border border-gray-800 break-words">
                  <div className="text-gray-400 text-sm mb-1">Token ID</div>
                  <div className="text-yellow-300 font-mono">{character.tokenId}</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

interface ItemDetailsModalProps {
  item: Item;
  onClose: () => void;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl border border-purple-600/30 shadow-2xl w-full max-w-md overflow-hidden"
    >
      {/* Item Image */}
      <div className="h-64 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Item Details */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-2">{item.name}</h2>
        
        <div className="mb-4 flex items-center">
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full 
            ${item.rarity === 'legendary' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-600/50' : 
              item.rarity === 'epic' ? 'bg-purple-900/50 text-purple-300 border border-purple-600/50' : 
              item.rarity === 'rare' ? 'bg-blue-900/50 text-blue-300 border border-blue-600/50' : 
              item.rarity === 'uncommon' ? 'bg-green-900/50 text-green-300 border border-green-600/50' : 
              'bg-gray-800 text-gray-300 border border-gray-700'}`}>
            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
          </span>
          
          <span className="mx-2 text-gray-500">•</span>
          
          <span className="text-gray-300">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm uppercase text-gray-500 mb-1">Description</h3>
            <p className="text-gray-300">{item.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm uppercase text-gray-500 mb-2">Effect</h3>
            <div className="bg-black/30 p-3 rounded border border-gray-800">
              <div className="text-blue-400 text-sm mb-1">
                {item.stat.charAt(0).toUpperCase() + item.stat.slice(1)} Bonus
              </div>
              <div className="text-2xl font-bold">+{item.bonus}%</div>
            </div>
          </div>
          
          {item.isNFT && (
            <div>
              <h3 className="text-sm uppercase text-gray-500 mb-1">NFT Details</h3>
              <div className="bg-black/30 p-3 rounded border border-gray-800 break-words">
                <div className="text-gray-400 text-sm mb-1">Token ID</div>
                <div className="text-yellow-300 font-mono">{item.tokenId}</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default InventoryPage;