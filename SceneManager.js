//SceneManager.js
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { Face } from './Face.js';
import { EventController } from './EventController.js';
import { ProjectileManager } from './ProjectileManager.js'; // Import ProjectileManager
import { UserScoreManager } from './UserScoreManager.js'; // Import UserScoreManager
import { HappyFaceScoreManager } from './HappyFaceScoreManager.js';

class SceneManager {
    constructor() {
        this.bounds = {
            xMin: -5, // half of the box width
            xMax: 5,
            yMin: -2.25, // half of the box height
            yMax: 2.25,
            zMin: -2, // half of the box depth
            zMax: 2
        };
        
        this.initScene();
        this.initCamera();
        this.initRenderer();

        // Initialize UserScoreManager without the face object first
        this.userScoreManager = new UserScoreManager(null); // Temporary null, will be set properly after Face is created.

        // Initialize the Face object with the UserScoreManager and bounds
        this.face = new Face(this.scene, this.userScoreManager, this.bounds);

        // Now set the face object correctly in UserScoreManager
        this.userScoreManager.face = this.face;
        
        this.happyFaceScoreManager = new HappyFaceScoreManager();
        
        this.projectileManager = new ProjectileManager(this.scene, this.camera, this.userScoreManager, this.happyFaceScoreManager);

        // Initialize the EventController
        this.eventController = new EventController(
            this.camera, 
            this.renderer, 
            this.handleMouseMove.bind(this), 
            this.handleCanvasClick.bind(this)
        );

        // Begin the animation loop
        this.animate();
    }

    initScene() {
        // Set up the scene
        this.scene = new THREE.Scene();

        // this.createBounds();
    }

    createBounds() {
        const geometry = new THREE.BoxGeometry(10, 4.5, 4); // Adjust the size to match your visible area
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        this.boundsBox = new THREE.Mesh(geometry, material);
        this.scene.add(this.boundsBox);
    }

    initCamera() {
        // Set up the camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
    }

    initRenderer() {
        // Set up the renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    handleMouseMove(mouseX, mouseY) {
        // Normalize the mouse coordinates (range -1 to 1)
        const normMouseX = (mouseX / this.eventController.windowHalfX);
        const normMouseY = -(mouseY / this.eventController.windowHalfY);

        // Update the current mouse position in ProjectileManager
        this.projectileManager.setCurrentMousePosition(normMouseX, normMouseY);
    
        // Use the mouseX and mouseY provided by EventController
        // Update the face rotation based on mouse movement
        if (this.face && this.face.sphere) {
            this.face.sphere.rotation.y = mouseX / (2 * this.eventController.windowHalfX);
            this.face.sphere.rotation.x = mouseY / (2 * this.eventController.windowHalfY);
        }
    }

    handleCanvasClick(event) {
        // Handle canvas click logic
        // This method is called when the canvas is clicked
        // You can add specific actions here if needed
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
    
        // Move the face randomly
        if (this.face) {
            this.face.moveRandomly();
            // Update the face position in ProjectileManager
            this.projectileManager.setFacePosition(this.face.sphere.position.x, this.face.sphere.position.y, this.face.sphere.position.z);
        }
        // Update the projectile manager
        this.projectileManager.maybeLaunchProjectile();
    
        // Pass the renderer's dimensions to the updateProjectiles method
        this.projectileManager.updateProjectiles(this.renderer.domElement.width, this.renderer.domElement.height);
    
        // Render the scene with the camera
        this.renderer.render(this.scene, this.camera);
    }
}

export { SceneManager };