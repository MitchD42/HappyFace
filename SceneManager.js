//SceneManager.js
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { Face } from './Face.js';
import { EventController } from './EventController.js';
import { ProjectileManager } from './ProjectileManager.js'; // Import ProjectileManager
import { UserScoreManager } from './UserScoreManager.js'; // Import UserScoreManager
import { HappyFaceScoreManager } from './HappyFaceScoreManager.js';
import { animate } from './AnimationManager.js'; // Import the animate function
import { handleMouseMove } from './MouseMoveHandler.js'; // Import the handleMouseMove function

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
        
        this.happyFaceScoreManager = new HappyFaceScoreManager(this.face);
        
        this.projectileManager = new ProjectileManager(this.scene, this.camera, this.userScoreManager, this.happyFaceScoreManager);

        // Initialize the EventController
        this.eventController = new EventController(
            this.camera, 
            this.renderer, 
            (mouseX, mouseY) => handleMouseMove(mouseX, mouseY, this.eventController, this.face, this.projectileManager), 
        );

        // Begin the animation loop
        animate(this);  // Pass the SceneManager object to the animate function
    }

    initScene() {
        // Set up the scene
        this.scene = new THREE.Scene();

        // this.createBounds();
    }

    createBounds() {
        const geometry = new THREE.BoxGeometry(20, 10, 10); // Adjust the size to match your visible area
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
}
export { SceneManager };