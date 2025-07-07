//MouseMoveHandler.ts
import * as THREE from 'three'
import type { EventController } from './EventController'
import type { Face } from './Face'
import type { ProjectileManager } from './ProjectileManager'

function handleMouseMove(
    mouseX: number, 
    mouseY: number, 
    eventController: EventController, 
    face: Face, 
    projectileManager: ProjectileManager
): void {
    // Convert mouse coordinates to normalized device coordinates [-1, 1]
    // mouseX and mouseY are already centered from EventController
    const normalizedX = mouseX / (window.innerWidth / 2)
    const normalizedY = -mouseY / (window.innerHeight / 2)
    
    // Set projectile target
    projectileManager.setCurrentMousePosition(normalizedX, normalizedY)
    
    // Convert mouse position to 3D world coordinates for face tracking
    const worldX = normalizedX * 3  // Scale to world bounds
    const worldY = normalizedY * 1.5  // Scale to world bounds
    face.setTargetPosition(worldX, worldY, 0)
}

export { handleMouseMove } 