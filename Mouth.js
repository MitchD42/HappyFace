// Mouth.js
import * as THREE from 'https://unpkg.com/three/build/three.module.js';


class Mouth {
    constructor(faceSphere, userScoreManager) {
        this.faceSphere = faceSphere;
        this.userScoreManager = userScoreManager; // Added UserScoreManager
        this.mouth = null;
        this.createMouth();
    }

    createMouth() {
        // Define the shape of the mouth
        const mouthShape = new THREE.Shape();
        mouthShape.absarc(0, -0.2, 0.2, 0, Math.PI, true);

        // Create the geometry and material for the mouth
        const mouthGeometry = new THREE.ExtrudeGeometry(mouthShape, { amount: 0.2, bevelEnabled: false });
        const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        // Create the mouth mesh and position it on the face
        this.mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        
        this.faceSphere.add(this.mouth);
    }

    updateColorBasedOnScore() {
        const score = this.userScoreManager.score;
        // Calculate the red component based on the score, ranging from 1 (at score 0) to 0 (at score 200)
        const redIntensity = 1 - Math.min(score / 200, 1);
    
        // Create a new color with decreasing red, and green and blue always at 0
        const color = new THREE.Color(redIntensity, 0, 0); // Red decreases, green and blue are 0
        this.mouth.material.color = color;
    }
}

export { Mouth };