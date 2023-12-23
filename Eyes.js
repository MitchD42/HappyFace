// Eyes.js
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

class Eyes {
    constructor(faceSphere) {
        this.faceSphere = faceSphere;
        this.eye1 = null;
        this.eye2 = null;
        this.createEyes();
    }

    createEyes() {
        // Common geometry and material for both eyes
        const eyeGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        // Create the first eye
        this.eye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.eye1.position.set(-0.3, 0.3, 0.9); // Position might need to be adjusted
        this.faceSphere.add(this.eye1);

        // Create the second eye
        this.eye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.eye2.position.set(0.3, 0.3, 0.9); // Position might need to be adjusted
        this.faceSphere.add(this.eye2);
    }
}

export { Eyes };