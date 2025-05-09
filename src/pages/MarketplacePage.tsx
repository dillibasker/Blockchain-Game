import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Coins, BadgeDollarSign, ShieldCheck, AlertCircle } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { type Character, type Item } from '../contexts/GameContext';

const MarketplacePage: React.FC = () => {
  const { player, marketplace, buyNFT, loading, error } = useGame();
  const [activeTab, setActiveTab] = useState<'characters' | 'items'>('characters');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-16 h-16 text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-300">Connect your wallet to access the marketplace</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
          NFT Marketplace
        </h1>
        <p className="mt-2 text-gray-300 max-w-2xl mx-auto">
          Buy and sell unique characters and powerful items
        </p>
      </header>

      {/* Player Balance */}
      <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-purple-900/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Coins className="w-6 h-6 text-yellow-400 mr-2" />
            <span className="text-lg font-medium text-yellow-300">
              {player.battleTokens} $BATTLE
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Available Balance
          </div>
        </div>
      </div>

      {/* Marketplace Container */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-purple-900/30 shadow-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-purple-900/30">
          <TabButton 
            label="Characters"
            icon={<ShoppingBag className="w-5 h-5" />}
            isActive={activeTab === 'characters'}
            onClick={() => setActiveTab('characters')}
            count={marketplace.characters.length}
          />
          <TabButton 
            label="Items"
            icon={<ShieldCheck className="w-5 h-5" />}
            isActive={activeTab === 'items'}
            onClick={() => setActiveTab('items')}
            count={marketplace.items.length}
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
                  {marketplace.characters.map(character => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      isSelected={selectedCharacter?.id === character.id}
                      onClick={() => setSelectedCharacter(character)}
                      onBuy={() => buyNFT('character', character.id)}
                      loading={loading}
                    />
                  ))}
                </div>
              )}

              {/* Items Tab */}
              {activeTab === 'items' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketplace.items.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onClick={() => setSelectedItem(item)}
                      onBuy={() => buyNFT('item', item.id)}
                      loading={loading}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/30 border border-red-800/50 text-red-300 p-4 rounded-lg flex items-start"
        >
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
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
  onBuy: () => void;
  loading: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  isSelected, 
  onClick, 
  onBuy,
  loading 
}) => {
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
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center">
            <BadgeDollarSign className="w-4 h-4 text-red-400 mr-1" />
            <span className="text-red-300">ATK: {character.attack}</span>
          </div>
          <div className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-blue-400 mr-1" />
            <span className="text-blue-300">DEF: {character.defense}</span>
          </div>
        </div>

        {/* Price and Buy Button */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-yellow-300 font-medium">500 $BATTLE</span>
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onBuy();
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Buying...' : 'Buy Now'}
            </motion.button>
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
  onBuy: () => void;
  loading: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  isSelected, 
  onClick, 
  onBuy,
  loading 
}) => {
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

        {/* Stats */}
        <div className="text-sm mb-4">
          <div className="flex items-center">
            <BadgeDollarSign className="w-4 h-4 text-blue-400 mr-1" />
            <span className="text-blue-300">
              {item.stat.toUpperCase()}: +{item.bonus}%
            </span>
          </div>
        </div>

        {/* Price and Buy Button */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-yellow-300 font-medium">500 $BATTLE</span>
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onBuy();
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Buying...' : 'Buy Now'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketplacePage;