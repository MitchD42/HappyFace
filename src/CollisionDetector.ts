//CollisionDetector.ts
import * as THREE from 'three'
import type { Projectile } from './Projectile'

class CollisionDetector {
    private camera: THREE.PerspectiveCamera

    constructor(camera: THREE.PerspectiveCamera) {
        this.camera = camera
    }

    public checkCollisionWithCursor(projectile: Projectile, mousePos: THREE.Vector2): boolean {
        // Convert mouse position to 3D world coordinates
        const mouseWorldPos = new THREE.Vector3(mousePos.x, mousePos.y, 0.5)
        mouseWorldPos.unproject(this.camera)
        
        // Create a ray from camera through mouse position
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mousePos, this.camera)
        
        // Check if the ray intersects with the projectile
        const intersects = raycaster.intersectObject(projectile.mesh)
        
        if (intersects.length > 0) {
            return true
        }
        
        // Fallback: check distance in world space
        const distance = projectile.mesh.position.distanceTo(mouseWorldPos)
        const collisionThreshold = 1.0  // Larger threshold for easier catching
        
        return distance < collisionThreshold
    }

    public isProjectileOffScreen(projectile: Projectile, screenWidth: number, screenHeight: number): boolean {
        const frustum = new THREE.Frustum()
        const cameraMatrix = new THREE.Matrix4().multiplyMatrices(
            this.camera.projectionMatrix, 
            this.camera.matrixWorldInverse
        )
        frustum.setFromProjectionMatrix(cameraMatrix)

        return !frustum.intersectsObject(projectile.mesh)
    }
}

export { CollisionDetector } 