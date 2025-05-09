import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Stars, useHelper, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import BattleCard from './BattleCard';
import { type Battle, type BattleMove } from '../../contexts/GameContext';

interface BattleArenaProps {
  battle: Battle;
  playerIsPlayer1: boolean;
  onExecuteMove: (move: BattleMove) => void;
  lastMoveType?: BattleMove;
}

const BattleArena: React.FC<BattleArenaProps> = ({ 
  battle, 
  playerIsPlayer1, 
  onExecuteMove,
  lastMoveType 
}) => {
  const playerCharacter = playerIsPlayer1 ? battle.player1Character : battle.player2Character;
  const opponentCharacter = playerIsPlayer1 ? battle.player2Character : battle.player1Character;
  const playerHealth = playerIsPlayer1 ? battle.player1Health : battle.player2Health;
  const opponentHealth = playerIsPlayer1 ? battle.player2Health : battle.player1Health;
  const isPlayerTurn = (playerIsPlayer1 && battle.currentTurn === 'player1') || 
                      (!playerIsPlayer1 && battle.currentTurn === 'player2');

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden">
      <Canvas shadows>
        <color attach="background" args={['#050A1A']} />
        
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <BattleEnvironment />
        
        {/* Battle cards */}
        <BattleCard 
          character={playerCharacter} 
          position={[-1.5, 0, 0]} 
          isActive={isPlayerTurn}
          isAttacking={lastMoveType === 'attack' && isPlayerTurn}
          isDefending={lastMoveType === 'defend' && isPlayerTurn}
        />
        
        <BattleCard 
          character={opponentCharacter} 
          position={[1.5, 0, 0]} 
          rotation={[0, Math.PI, 0]}
          isActive={!isPlayerTurn}
          isAttacking={lastMoveType === 'attack' && !isPlayerTurn}
          isDefending={lastMoveType === 'defend' && !isPlayerTurn}
        />
        
        {/* Health bars */}
        <HealthBar 
          position={[-1.5, 1, 0]} 
          health={playerHealth} 
          maxHealth={playerCharacter.health} 
          color="#4ade80" 
        />
        
        <HealthBar 
          position={[1.5, 1, 0]} 
          health={opponentHealth} 
          maxHealth={opponentCharacter.health} 
          color="#ef4444" 
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <BattleLighting isPlayerTurn={isPlayerTurn} />
      </Canvas>
    </div>
  );
};

// Environment
const BattleEnvironment = () => {
  const floorRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (floorRef.current) {
      floorRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <>
      {/* Floor */}
      <mesh ref={floorRef} position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 6, 64]} />
        <meshStandardMaterial 
          color="#4a0080" 
          emissive="#4a0080"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>
    </>
  );
};

// Dynamic lighting based on turn
const BattleLighting = ({ isPlayerTurn }: { isPlayerTurn: boolean }) => {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  
  useEffect(() => {
    if (spotLightRef.current) {
      const targetX = isPlayerTurn ? -1.5 : 1.5;
      
      // Animate spotlight to focus on current player
      const animate = () => {
        if (!spotLightRef.current) return;
        const dx = targetX - spotLightRef.current.position.x;
        spotLightRef.current.position.x += dx * 0.05;
        
        if (Math.abs(dx) > 0.01) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [isPlayerTurn]);
  
  return (
    <>
      <directionalLight position={[0, 5, 5]} intensity={0.5} castShadow />
      <spotLight 
        ref={spotLightRef}
        position={[isPlayerTurn ? -1.5 : 1.5, 3, 2]} 
        angle={0.3} 
        penumbra={0.8} 
        intensity={1.5} 
        color={isPlayerTurn ? "#4ade80" : "#ef4444"}
        castShadow
      />
    </>
  );
};

// Health bar component
const HealthBar = ({ 
  position, 
  health, 
  maxHealth, 
  color 
}: { 
  position: [number, number, number]; 
  health: number; 
  maxHealth: number; 
  color: string;
}) => {
  const ratio = Math.max(0, health / maxHealth);
  
  return (
    <group position={position}>
      {/* Background */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[1, 0.1, 0.01]} />
        <meshBasicMaterial color="#333" transparent opacity={0.7} />
      </mesh>
      
      {/* Health fill */}
      <mesh position={[(ratio - 1) / 2, 0, 0]} scale={[ratio, 1, 1]}>
        <boxGeometry args={[1, 0.1, 0.01]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

export default BattleArena;