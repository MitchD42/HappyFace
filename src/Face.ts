import * as THREE from 'three'
import { Eyes } from './Eyes'
import { Mouth } from './Mouth'
import type { UserScoreManager } from './UserScoreManager'

interface Bounds {
    xMin: number
    xMax: number
    yMin: number
    yMax: number
    zMin: number
    zMax: number
}

class Face {
    private scene: THREE.Scene
    private userScoreManager: UserScoreManager
    public sphere!: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
    private eyes: Eyes | null = null
    private mouth: Mouth | null = null
    private bounds: Bounds
    private updateCount: number = 0
    private currentSpeed: number = 0.5
    private targetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
    private lerpFactor: number = 0.08

    constructor(scene: THREE.Scene, userScoreManager: UserScoreManager, bounds: Bounds) {
        this.scene = scene
        this.userScoreManager = userScoreManager
        this.bounds = bounds
        this.createFace()
    }

    private createFace(): void {
        const geometry = new THREE.SphereGeometry(1, 32, 32)
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
        this.sphere = new THREE.Mesh(geometry, material)
        this.scene.add(this.sphere)

        this.createFeatures()
    }

    private createFeatures(): void {
        this.eyes = new Eyes(this.sphere)
        this.mouth = new Mouth(this.sphere, this.userScoreManager)
    }

    public moveRandomly(): void {
        // Smoothly interpolate towards the target position
        this.sphere.position.lerp(this.targetPosition, this.lerpFactor)
        
        // Constrain the sphere to the bounding box
        this.sphere.position.x = Math.max(Math.min(this.sphere.position.x, this.bounds.xMax), this.bounds.xMin)
        this.sphere.position.y = Math.max(Math.min(this.sphere.position.y, this.bounds.yMax), this.bounds.yMin)
        this.sphere.position.z = Math.max(Math.min(this.sphere.position.z, this.bounds.zMax), this.bounds.zMin)
    }

    public setTargetPosition(x: number, y: number, z: number): void {
        this.targetPosition.set(x, y, z)
    }

    public updateColorBasedOnScore(): void {
        const score = this.userScoreManager.score
        const greenIntensity = 1 - Math.min(score / 100, 1) // Decreases from 1 to 0 as score increases

        // Create a new color with full red, decreasing green, and no blue
        const color = new THREE.Color(1, greenIntensity, 0) // Red stays at 1, green decreases, blue is 0
        this.sphere.material.color = color

        // Update the mouth's color based on the score
        if (this.mouth) {
            this.mouth.updateColorBasedOnScore()
        }
    }

    public resetFace(): void {
        // Logic to reset the face
        // For example, resetting the position:
        this.sphere.position.set(0, 0, 0)
        // You can add more reset logic here as needed
    }
}

export { Face } 