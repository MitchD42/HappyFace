//AnimationManager.js
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

export function animate(sceneManager) {
    requestAnimationFrame(() => animate(sceneManager));

    // Only update game logic if game is running
    if (sceneManager.isGameRunning && !sceneManager.isGameOver) {
        // Move the face randomly
        if (sceneManager.face) {
            sceneManager.face.moveRandomly();
            // Update the face position in ProjectileManager
            sceneManager.projectileManager.setFacePosition(
                sceneManager.face.sphere.position.x, 
                sceneManager.face.sphere.position.y, 
                sceneManager.face.sphere.position.z
            );
        }
        
        // Update the projectile manager
        sceneManager.projectileManager.maybeLaunchProjectile();

        // Pass the renderer's dimensions to the updateProjectiles method
        sceneManager.projectileManager.updateProjectiles(
            sceneManager.renderer.domElement.width, 
            sceneManager.renderer.domElement.height
        );
    }

    // Always render the scene
    sceneManager.renderer.render(sceneManager.scene, sceneManager.camera);
}
