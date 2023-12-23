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
        // Parameters for motion
        const speed = 0.1; // Adjust as needed for slower or faster movement
        const deltaX = (Math.random() - 0.5) * speed;
        const deltaY = (Math.random() - 0.5) * speed;
        const deltaZ = (Math.random() - 0.5) * speed;
    
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
        const greenIntensity = 1 - Math.min(score / 200, 1); // Decreases from 1 to 0 as score increases

        // Create a new color with full red, decreasing green, and no blue
        const color = new THREE.Color(1, greenIntensity, 0); // Red stays at 1, green decreases, blue is 0
        this.sphere.material.color = color;

        // Update the mouth's color based on the score
        this.mouth.updateColorBasedOnScore();
    }
    
}

export { Face };