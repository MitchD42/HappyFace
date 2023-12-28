import * as THREE from 'https://unpkg.com/three/build/three.module.js';

class CollisionDetector {
    constructor(camera) {
        this.camera = camera;
    }

    isProjectileOffScreen(projectile, rendererWidth, rendererHeight) {
        // Transform projectile's position to normalized device coordinates
        const positionNormalized = projectile.mesh.position.clone();
        positionNormalized.project(this.camera);

        // Check if the projectile is off-screen
        return (
            positionNormalized.x < -1 || positionNormalized.x > 1 ||
            positionNormalized.y < -1 || positionNormalized.y > 1 ||
            positionNormalized.z < -1 || positionNormalized.z > 1
        );
    }

    checkCollisionWithCursor(projectile, currentMousePos) {
        // Transform projectile's position to normalized device coordinates
        const positionNormalized = projectile.mesh.position.clone();
        positionNormalized.project(this.camera);

        // Check for collision with the cursor
        const distanceToCursor = currentMousePos.distanceTo(new THREE.Vector2(positionNormalized.x, positionNormalized.y));
        const collisionThreshold = 0.05; // Adjust the threshold based on your scene

        return distanceToCursor <= collisionThreshold;
    }
}

export { CollisionDetector };