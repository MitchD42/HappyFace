// Face.js
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { Eyes } from './Eyes.js';
import { Mouth } from './Mouth.js';

class Face {
    constructor(scene, userScoreManager, bounds) {
        this.scene = scene;
        this.userScoreManager = userScoreManager; // store reference to the UserScoreManager
        this.sphere = null;
        this.eyes = null;
        this.mouth = null;
        this.bounds = bounds;
        this.updateCount = 0; // Add a counter to track the number of moves
        this.currentSpeed = 0.5; // Initialize current speed
        this.createFace();
    }

    createFace() {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);

        this.createFeatures();
    }

    createFeatures() {
        this.eyes = new Eyes(this.sphere);
        this.mouth = new Mouth(this.sphere, this.userScoreManager); // Pass userScoreManager to Mouth
    }

    moveRandomly() {
        this.updateCount++; // Increment the update counter

        // Check if it's time to change the speed
        if (this.updateCount % 25 === 0) {
            // Randomize speed between 0 and 0.5
            this.currentSpeed = Math.random() * 0.03;
        }

        // Use the current speed for movement
        const deltaX = (Math.random() - 0.5) * this.currentSpeed;
        const deltaY = (Math.random() - 0.5) * this.currentSpeed;
        const deltaZ = 2.3 * (Math.random() - 0.5) * this.currentSpeed;
    
        // Update the sphere's position
        this.sphere.position.x += deltaX;
        this.sphere.position.y += deltaY;
        this.sphere.position.z += deltaZ;
    
        // Constrain the sphere to the bounding box
        this.sphere.position.x = Math.max(Math.min(this.sphere.position.x, this.bounds.xMax), this.bounds.xMin);
        this.sphere.position.y = Math.max(Math.min(this.sphere.position.y, this.bounds.yMax), this.bounds.yMin);
        this.sphere.position.z = Math.max(Math.min(this.sphere.position.z, this.bounds.zMax), this.bounds.zMin);
    }
    

    updateColorBasedOnScore() {
        const score = this.userScoreManager.score;
        const greenIntensity = 1 - Math.min(score / 100, 1); // Decreases from 1 to 0 as score increases

        // Create a new color with full red, decreasing green, and no blue
        const color = new THREE.Color(1, greenIntensity, 0); // Red stays at 1, green decreases, blue is 0
        this.sphere.material.color = color;

        // Update the mouth's color based on the score
        this.mouth.updateColorBasedOnScore();
    }

    resetFace() {
        // Logic to reset the face
        // For example, resetting the position:
        this.sphere.position.set(0, 0, 0);
        // You can add more reset logic here as needed
    }
    
}

export { Face };