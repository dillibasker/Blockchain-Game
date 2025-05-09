import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BattlePage from './pages/BattlePage';
import MarketplacePage from './pages/MarketplacePage';
import InventoryPage from './pages/InventoryPage';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  return (
    <Web3Provider>
      <GameProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/battle" element={<BattlePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
          </Layout>
        </Router>
      </GameProvider>
    </Web3Provider>
  );
}

export default App;