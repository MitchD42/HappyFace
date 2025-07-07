import * as THREE from 'three'
import { Projectile } from './Projectile'
import type { UserScoreManager } from './UserScoreManager'
import type { HappyFaceScoreManager } from './HappyFaceScoreManager'
import { CollisionDetector } from './CollisionDetector'

class ProjectileManager {
    private scene: THREE.Scene
    private camera: THREE.PerspectiveCamera
    private projectiles: Projectile[] = []
    private launchInterval: number = 500 // Time in milliseconds between projectile launches
    private lastLaunchTime: number = Date.now()
    private currentMousePos: THREE.Vector2 = new THREE.Vector2()
    private facePosition: THREE.Vector3 = new THREE.Vector3()
    private userScoreManager: UserScoreManager
    private happyFaceScoreManager: HappyFaceScoreManager
    private collisionDetector: CollisionDetector

    constructor(
        scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, 
        userScoreManager: UserScoreManager, 
        happyFaceScoreManager: HappyFaceScoreManager
    ) {
        this.scene = scene
        this.camera = camera
        this.userScoreManager = userScoreManager
        this.happyFaceScoreManager = happyFaceScoreManager
        this.collisionDetector = new CollisionDetector(camera)
    }

    public setCurrentMousePosition(x: number, y: number): void {
        this.currentMousePos.x = x
        this.currentMousePos.y = y
    }

    public setFacePosition(x: number, y: number, z: number): void {
        this.facePosition.set(x, y, z)
    }

    public launchProjectileFromFace(): void {
        // Create direction based on mouse position relative to screen center
        // Mouse coordinates are already normalized [-1, 1]
        const dir = new THREE.Vector3(
            this.currentMousePos.x * 2.0,  // Scale X movement  
            this.currentMousePos.y * 2.0,  // Scale Y movement
            2.0  // Always move toward screen, but allow X/Y variation
        ).normalize()
        
        const facePos = this.facePosition.clone()
        this.launchProjectile(facePos, dir)
        
        this.lastLaunchTime = Date.now()
    }
    
    private launchProjectile(position: THREE.Vector3, direction: THREE.Vector3): void {
        let speed = 0.05  // Slower base speed
        const score = this.userScoreManager.score

        if (score > 20) {
            speed = 0.05 + (score - 20) * 0.0003  // Slower speed increase
        }

        const projectileType = score < 50 ? 'happyFace' : 'user'
        const projectile = new Projectile(this.scene, position, direction, speed, projectileType)
        this.scene.add(projectile.mesh)
        this.projectiles.push(projectile)
    }

    public updateProjectiles(rendererWidth: number, rendererHeight: number): void {
        const onScreenProjectiles: Projectile[] = []

        this.projectiles.forEach(projectile => {
            projectile.update()

            const isColliding = this.collisionDetector.checkCollisionWithCursor(projectile, this.currentMousePos)
            const isOffScreen = this.collisionDetector.isProjectileOffScreen(projectile, rendererWidth, rendererHeight)

            if (isColliding) {
                console.log('Collision detected! Current score:', this.userScoreManager.score)
                if (this.userScoreManager.score < 50) {
                    this.happyFaceScoreManager.addPoint()
                } else {
                    this.userScoreManager.addPoint()
                }
            }

            if (!isOffScreen && !isColliding) {
                onScreenProjectiles.push(projectile)
            } else {
                console.log('Removing projectile - isOffScreen:', isOffScreen, 'isColliding:', isColliding, 'position:', projectile.mesh.position)
                this.removeProjectile(projectile, isOffScreen)
            }
        })

        this.projectiles = onScreenProjectiles
    }

    private removeProjectile(projectile: Projectile, updateScore: boolean = true): void {
        this.scene.remove(projectile.mesh)

        if (updateScore) {
            if (this.userScoreManager.score > 50) {
                this.happyFaceScoreManager.addPoint()
            } else {
                this.userScoreManager.addPoint()
            }
        }
    }

    public maybeLaunchProjectile(): void {
        if (Date.now() - this.lastLaunchTime > this.launchInterval) {
            this.launchProjectileFromFace()
        }
    }
}

export { ProjectileManager } 