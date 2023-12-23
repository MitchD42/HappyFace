//ProjectileManager.js
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { Projectile } from './Projectile.js';
import { UserScoreManager } from './UserScoreManager.js';

class ProjectileManager {
    constructor(scene, camera, userScoreManager, happyFaceScoreManager) {
        this.scene = scene;
        this.camera = camera;
        this.projectiles = [];
        this.launchInterval = 500; // Time in milliseconds between projectile launches
        this.lastLaunchTime = Date.now();
        this.currentMousePos = new THREE.Vector2(); // Store current mouse position
        this.facePosition = new THREE.Vector3(); // Position of the face
        this.userScoreManager = userScoreManager;
        this.happyFaceScoreManager = happyFaceScoreManager;
    }

    setCurrentMousePosition(x, y) {
        this.currentMousePos.x = x;
        this.currentMousePos.y = y;
    }

    setFacePosition(x, y, z) {
        this.facePosition.set(x, y, z);
    }

    launchProjectileFromFace() {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.currentMousePos, this.camera);
        const dir = raycaster.ray.direction.normalize();
        
        // Use the updated face position
        const facePos = this.facePosition.clone();
        this.launchProjectile(facePos, dir);
        
        this.lastLaunchTime = Date.now();
    }
    

    launchProjectile(position, direction) {
        let speed = 0.1; // Default speed
        const score = this.userScoreManager.score; // Get the current user score

        // Update speed based on score with a revised formula
        if (score > 20) {
            speed = 0.1 + (score - 20) * 0.0005;
        }

        const projectile = new Projectile(this.scene, position, direction, speed);
        this.scene.add(projectile.mesh);
        this.projectiles.push(projectile);
    }

    updateProjectiles(rendererWidth, rendererHeight) {
        // Create a new array for projectiles that remain on screen
        const onScreenProjectiles = [];
    
        // Update each projectile and check if it is off-screen or collides with the cursor
        this.projectiles.forEach(projectile => {
            projectile.update();
    
            // Transform projectile's position to normalized device coordinates
            const positionNormalized = projectile.mesh.position.clone();
            positionNormalized.project(this.camera);
    
            // Check for collision with the cursor
            const distanceToCursor = this.currentMousePos.distanceTo(new THREE.Vector2(positionNormalized.x, positionNormalized.y));
            const collisionThreshold = 0.05; // Adjust the threshold based on your scene
    
            // Determine the reason for removal
            const isOffScreen = projectile.isOffScreen(rendererWidth, rendererHeight);
            const isColliding = distanceToCursor <= collisionThreshold;
    
            if (isColliding) {
                // If the projectile collides with the cursor, increment HappyFace's score
                this.happyFaceScoreManager.addPoint();
            }
    
            if (!isOffScreen && !isColliding) {
                // Keep on-screen and non-colliding projectiles
                onScreenProjectiles.push(projectile);
            } else {
                // Remove off-screen or colliding projectiles
                // Update score only if it's off-screen
                this.removeProjectile(projectile, isOffScreen);
            }
        });

        
    
        // Update the projectiles array to only include on-screen projectiles
        this.projectiles = onScreenProjectiles;
    }
    

    removeProjectile(projectile, updateScore = true) {
        this.scene.remove(projectile.mesh);
    
        // Update the score only if specified
        if (updateScore) {
            this.userScoreManager.addPoint(); // Increment the score
        }
    }

    maybeLaunchProjectile() {
        if (Date.now() - this.lastLaunchTime > this.launchInterval) {
            this.launchProjectileFromFace();
        }
    }
}

export { ProjectileManager };