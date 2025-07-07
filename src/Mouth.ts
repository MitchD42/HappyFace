//Mouth.ts
import * as THREE from 'three'
import type { UserScoreManager } from './UserScoreManager'

class Mouth {
    private userScoreManager: UserScoreManager
    private mouthCurve: THREE.QuadraticBezierCurve3
    private mouthGeometry: THREE.TubeGeometry
    private mouthMaterial: THREE.MeshBasicMaterial
    private mouth: THREE.Mesh<THREE.TubeGeometry, THREE.MeshBasicMaterial>

    constructor(parentSphere: THREE.Mesh, userScoreManager: UserScoreManager) {
        this.userScoreManager = userScoreManager

        // Create a simple curve for the mouth - positioned further out to avoid clipping
        this.mouthCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-0.4, -0.2, 1.05),
            new THREE.Vector3(0, -0.4, 1.1),
            new THREE.Vector3(0.4, -0.2, 1.05)
        )

        this.mouthGeometry = new THREE.TubeGeometry(this.mouthCurve, 20, 0.08, 8, false)
        this.mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
        this.mouth = new THREE.Mesh(this.mouthGeometry, this.mouthMaterial)
        parentSphere.add(this.mouth)
    }

    public updateColorBasedOnScore(): void {
        const score = this.userScoreManager.score

        if (score > 100) {
            // Change mouth color to red
            this.mouthMaterial.color.set(0xff0000)
        } else {
            // Keep mouth color black
            this.mouthMaterial.color.set(0x000000)
        }
    }
}

export { Mouth } 