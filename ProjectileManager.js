import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { Projectile } from './Projectile.js';
import { UserScoreManager } from './UserScoreManager.js';
import { CollisionDetector } from './CollisionDetector.js';

class ProjectileManager {
    constructor(scene, camera, userScoreManager, happyFaceScoreManager) {
        this.scene = scene;
        this.camera = camera;
        this.projectiles = [];
        this.launchInterval = 500; // Time in milliseconds between projectile launches
        this.lastLaunchTime = Date.now();
        this.currentMousePos = new THREE.Vector2();
        this.facePosition = new THREE.Vector3();
        this.userScoreManager = userScoreManager;
        this.happyFaceScoreManager = happyFaceScoreManager;
        this.collisionDetector = new CollisionDetector(camera);
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
        
        const facePos = this.facePosition.clone();
        this.launchProjectile(facePos, dir);
        
        this.lastLaunchTime = Date.now();
    }
    
    launchProjectile(position, direction) {
        let speed = 0.1;
        const score = this.userScoreManager.score;

        if (score > 20) {
            speed = 0.1 + (score - 20) * 0.0005;
        }

        const projectileType = score < 50 ? 'happyFace' : 'user';
        const projectile = new Projectile(this.scene, position, direction, speed, projectileType);
        this.scene.add(projectile.mesh);
        this.projectiles.push(projectile);
    }

    updateProjectiles(rendererWidth, rendererHeight) {
        const onScreenProjectiles = [];

        this.projectiles.forEach(projectile => {
            projectile.update();

            const isColliding = this.collisionDetector.checkCollisionWithCursor(projectile, this.currentMousePos);
            const isOffScreen = this.collisionDetector.isProjectileOffScreen(projectile, rendererWidth, rendererHeight);

            if (isColliding) {
                if (this.userScoreManager.score < 50) {
                    this.happyFaceScoreManager.addPoint();
                } else {
                    this.userScoreManager.addPoint();
                }
            }

            if (!isOffScreen && !isColliding) {
                onScreenProjectiles.push(projectile);
            } else {
                this.removeProjectile(projectile, isOffScreen);
            }
        });

        this.projectiles = onScreenProjectiles;
    }

    removeProjectile(projectile, updateScore = true) {
        this.scene.remove(projectile.mesh);

        if (updateScore) {
            if (this.userScoreManager.score > 50) {
                this.happyFaceScoreManager.addPoint();
            } else {
                this.userScoreManager.addPoint();
            }
        }
    }

    maybeLaunchProjectile() {
        if (Date.now() - this.lastLaunchTime > this.launchInterval) {
            this.launchProjectileFromFace();
        }
    }
}

export { ProjectileManager };