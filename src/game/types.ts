import * as THREE from 'three';

export interface Bounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
}

export interface GameState {
  isGameRunning: boolean;
  isGameOver: boolean;
  userScore: number;
  happyFaceScore: number;
  highScore: number;
}

export interface ProjectileData {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  createdAt: number;
}
