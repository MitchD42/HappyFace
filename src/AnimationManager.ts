//AnimationManager.ts
import type { SceneManager } from './SceneManager'

function animate(sceneManager: SceneManager): void {
    requestAnimationFrame(() => animate(sceneManager))

    // Only update game logic if not paused
    if (!sceneManager.paused) {
        // Update face position
        sceneManager.faceObject.moveRandomly()

        // Update face position for projectile manager
        const facePos = sceneManager.faceObject.sphere.position
        sceneManager.projectileManagerObject.setFacePosition(facePos.x, facePos.y, facePos.z)

        // Update projectiles
        sceneManager.projectileManagerObject.updateProjectiles(
            sceneManager.rendererObject.domElement.width, 
            sceneManager.rendererObject.domElement.height
        )

        // Maybe launch a new projectile
        sceneManager.projectileManagerObject.maybeLaunchProjectile()
    }

    // Always render the scene (even when paused)
    sceneManager.rendererObject.render(sceneManager.sceneObject, sceneManager.cameraObject)
}

export { animate } 