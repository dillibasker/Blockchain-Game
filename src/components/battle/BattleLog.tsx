import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, AlertCircle } from 'lucide-react';

interface BattleLogProps {
  messages: string[];
  isVisible: boolean;
  error?: string | null;
}

const BattleLog: React.FC<BattleLogProps> = ({ messages, isVisible, error }) => {
  const logRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (logRef.current && isVisible) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-black/40 backdrop-blur-md rounded-lg border border-purple-900/50 mt-4 overflow-hidden"
    >
      <div className="flex items-center p-2 border-b border-purple-900/30">
        <Scroll className="w-4 h-4 text-purple-400 mr-2" />
        <span className="text-sm text-purple-300 font-medium">Battle Log</span>
      </div>
      
      <div 
        ref={logRef}
        className="p-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-gray-900"
      >
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-900/30 border border-red-800/50 text-red-300 p-2 rounded mb-2 flex items-start"
            >
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
          
          {messages.map((message, index) => (
            <motion.div
              key={`${index}-${message.substring(0, 10)}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="py-1.5 border-b border-gray-800/50 last:border-b-0"
            >
              <span className="text-sm text-gray-300">{message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BattleLog;