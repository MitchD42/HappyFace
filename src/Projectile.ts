//Projectile.ts
import * as THREE from 'three'

type ProjectileType = 'happyFace' | 'user'

class Projectile {
    public mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
    private scene: THREE.Scene
    private direction: THREE.Vector3
    private speed: number
    private type: ProjectileType
    private initialColor: number

    constructor(scene: THREE.Scene, position: THREE.Vector3, direction: THREE.Vector3, speed: number, type: ProjectileType) {
        this.scene = scene
        this.direction = direction.normalize()
        this.speed = speed
        this.type = type

        // Determine the initial color based on the type
        this.initialColor = type === 'happyFace' ? 0x00ff00 : 0xff0000  // Green for happyFace, red for user

        // Create the projectile mesh - make it larger and more visible
        const geometry = new THREE.SphereGeometry(0.2, 16, 16)
        const material = new THREE.MeshBasicMaterial({ 
            color: this.initialColor,
            transparent: false,
            opacity: 1.0
        })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.copy(position)
        
        // Add some debug logging
        console.log('Projectile created at:', position, 'with direction:', direction)
    }

    public update(): void {
        // Move the projectile in the specified direction
        this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed))

        // Temporarily disable color fading for debugging
        // this.updateColor()
    }

    private updateColor(): void {
        // Calculate the distance traveled (simplified)
        const distanceTraveled = this.mesh.position.length()

        // Fade effect: reduce the intensity based on distance - slower fade
        const fadeFactor = Math.max(0.3, 1 - distanceTraveled / 50) // Slower fade and minimum brightness

        // Apply the fade to the color
        const color = new THREE.Color(this.initialColor)
        color.multiplyScalar(fadeFactor)
        this.mesh.material.color = color
    }
}

export { Projectile } 