import React from 'react';

const LeaderboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Leaderboard</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wins</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Placeholder data - replace with actual leaderboard data */}
            {[1, 2, 3].map((rank) => (
              <tr key={rank} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Player {rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor(Math.random() * 50)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Math.floor(Math.random() * 1000)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;