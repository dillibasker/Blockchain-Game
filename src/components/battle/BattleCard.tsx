import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import { type Character } from '../../contexts/GameContext';
import * as THREE from 'three';

interface BattleCardProps {
  character: Character;
  position: [number, number, number];
  rotation?: [number, number, number];
  isActive?: boolean;
  isAttacking?: boolean;
  isDefending?: boolean;
}

const BattleCard: React.FC<BattleCardProps> = ({ 
  character, 
  position, 
  rotation = [0, 0, 0], 
  isActive = false,
  isAttacking = false,
  isDefending = false
}) => {
  const cardRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const textureUrl = character.image;

  // Replace with actual texture from the character
  const texture = useTexture(textureUrl);

  // Animation
  useFrame((state, delta) => {
    if (!cardRef.current) return;
    
    // Hover effect when active
    if (isActive) {
      cardRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      
      // Glow effect
      if (glowRef.current) {
        glowRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      }
    }
    
    // Attack animation
    if (isAttacking) {
      cardRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 10) * 0.2;
    }
    
    // Defense animation
    if (isDefending) {
      cardRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Glow effect for active card */}
      {isActive && (
        <mesh 
          ref={glowRef}
          position={[0, 0, -0.05]}
          scale={[1.1, 1.6, 0.1]}
        >
          <boxGeometry args={[1, 1, 0.01]} />
          <meshBasicMaterial 
            color={character.type === 'warrior' ? "#ff4d4d" : 
                   character.type === 'mage' ? "#4da6ff" : 
                   character.type === 'archer' ? "#6dff4d" : 
                   character.type === 'tank' ? "#ffb44d" : "#ff4dff"}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {/* Card mesh */}
      <mesh ref={cardRef}>
        {/* Card body */}
        <boxGeometry args={[1, 1.5, 0.05]} />
        <meshStandardMaterial 
          color="#111" 
          metalness={0.7}
          roughness={0.2}
        />
        
        {/* Character image */}
        <mesh position={[0, 0.2, 0.03]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshBasicMaterial map={texture} />
        </mesh>
        
        {/* Card frame */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[1, 1.5, 0.01]} />
          <meshStandardMaterial 
            color={character.rarity === 'legendary' ? "#ffd700" : 
                  character.rarity === 'epic' ? "#9b30ff" : 
                  character.rarity === 'rare' ? "#4169e1" : 
                  character.rarity === 'uncommon' ? "#32cd32" : "#9e9e9e"}
            emissive={character.rarity === 'legendary' ? "#ffd700" : 
                     character.rarity === 'epic' ? "#9b30ff" : 
                     character.rarity === 'rare' ? "#4169e1" : 
                     character.rarity === 'uncommon' ? "#32cd32" : "#9e9e9e"}
            emissiveIntensity={0.5}
            wireframe
          />
        </mesh>
        
        {/* Stats display */}
        <group position={[0, -0.5, 0.03]}>
          <Text
            position={[-0.35, 0, 0.01]}
            fontSize={0.07}
            color="red"
            anchorX="center"
            anchorY="middle"
          >
            {character.attack}
          </Text>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.07}
            color="blue"
            anchorX="center"
            anchorY="middle"
          >
            {character.defense}
          </Text>
          <Text
            position={[0.35, 0, 0.01]}
            fontSize={0.07}
            color="green"
            anchorX="center"
            anchorY="middle"
          >
            {character.health}
          </Text>
        </group>
        
        {/* Character name */}
        <Text
          position={[0, 0.7, 0.03]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.9}
        >
          {character.name}
        </Text>
      </mesh>
    </group>
  );
};

export default BattleCard;