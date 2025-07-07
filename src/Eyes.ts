//Eyes.ts
import * as THREE from 'three'

class Eyes {
    private leftEye: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
    private rightEye: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>

    constructor(parentSphere: THREE.Mesh) {
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16)
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })

        // Create left eye - positioned further out to avoid clipping
        this.leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
        this.leftEye.position.set(-0.3, 0.3, 1.02)
        parentSphere.add(this.leftEye)

        // Create right eye - positioned further out to avoid clipping
        this.rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
        this.rightEye.position.set(0.3, 0.3, 1.02)
        parentSphere.add(this.rightEye)
    }

    // Add any methods related to eyes here
    public blink(): void {
        // Future implementation for blinking animation
    }
}

export { Eyes } 