// Projectile.js
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

class Projectile {
    constructor(scene, startPosition, direction, speed) {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.speed = speed; // Store the speed
        this.direction = direction.normalize(); // Normalize the direction
        this.direction.z = 0; // Ensure no movement in Z direction
        // Store the creation time of the projectile
        this.creationTime = Date.now();

        // Set the initial position of the projectile to the startPosition
        this.mesh.position.copy(startPosition);

        scene.add(this.mesh);
    }

    update() {
        // Use the stored speed to update the position
        this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed));
    }

    isOffScreen(windowWidth, windowHeight) {
        const x = this.mesh.position.x;
        const y = this.mesh.position.y;
    
        // Use the half-size of the boundary box as the off-screen check
        const windowHalfX = 8.3; // Double the previous value
        const windowHalfY = 3.7; // Double the previous value
    
        // Determine if the projectile is off-screen
        return x < -windowHalfX || x > windowHalfX ||
               y < -windowHalfY || y > windowHalfY;
    }  
}

export { Projectile };