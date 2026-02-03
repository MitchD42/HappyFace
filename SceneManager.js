//SceneManager.js
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { Face } from './Face.js';
import { EventController } from './EventController.js';
import { ProjectileManager } from './ProjectileManager.js';
import { UserScoreManager } from './UserScoreManager.js';
import { HappyFaceScoreManager } from './HappyFaceScoreManager.js';
import { animate } from './AnimationManager.js';
import { handleMouseMove } from './MouseMoveHandler.js';

class SceneManager {
    constructor() {
        this.bounds = {
            xMin: -5,
            xMax: 5,
            yMin: -2.25,
            yMax: 2.25,
            zMin: -2,
            zMax: 2
        };
        
        this.isGameRunning = false;
        this.isGameOver = false;
        
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initHighScoreDisplay();

        // Initialize UserScoreManager without the face object first
        this.userScoreManager = new UserScoreManager(null, this);

        // Initialize the Face object with the UserScoreManager and bounds
        this.face = new Face(this.scene, this.userScoreManager, this.bounds);

        // Now set the face object correctly in UserScoreManager
        this.userScoreManager.face = this.face;
        
        this.happyFaceScoreManager = new HappyFaceScoreManager(this.face, this);
        
        this.projectileManager = new ProjectileManager(this.scene, this.camera, this.userScoreManager, this.happyFaceScoreManager);

        // Initialize the EventController
        this.eventController = new EventController(
            this.camera, 
            this.renderer, 
            (mouseX, mouseY) => handleMouseMove(mouseX, mouseY, this.eventController, this.face, this.projectileManager), 
        );

        // Begin the animation loop (but game won't update until started)
        animate(this);
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.createBounds();
    }

    createBounds() {
        const geometry = new THREE.BoxGeometry(16.5, 7.5, 0);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        this.boundsBox = new THREE.Mesh(geometry, material);
        this.scene.add(this.boundsBox);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initHighScoreDisplay() {
        this.highScoreElement = document.createElement('div');
        this.highScoreElement.style.position = 'absolute';
        this.highScoreElement.style.top = '60px';
        this.highScoreElement.style.right = '10px';
        this.highScoreElement.style.color = '#FFD700';
        this.highScoreElement.style.fontSize = '24px';
        this.highScoreElement.style.fontFamily = 'Segoe UI, Arial, sans-serif';
        this.updateHighScoreDisplay();
        document.body.appendChild(this.highScoreElement);
    }

    getHighScore() {
        return parseInt(localStorage.getItem('happyface_highscore') || '0', 10);
    }

    setHighScore(score) {
        localStorage.setItem('happyface_highscore', score.toString());
        this.updateHighScoreDisplay();
    }

    updateHighScoreDisplay() {
        this.highScoreElement.innerHTML = `🏆 High Score: ${this.getHighScore()}`;
    }

    startGame() {
        this.isGameRunning = true;
        this.isGameOver = false;
    }

    endGame() {
        this.isGameRunning = false;
        this.isGameOver = true;
        
        const userScore = this.userScoreManager.score;
        const currentHighScore = this.getHighScore();
        const isNewHighScore = userScore > currentHighScore;
        
        if (isNewHighScore) {
            this.setHighScore(userScore);
        }
        
        // Show game over screen
        if (window.showGameOver) {
            window.showGameOver(userScore, Math.max(userScore, currentHighScore), isNewHighScore);
        }
    }

    resetGame() {
        // Reset scores
        this.userScoreManager.reset();
        this.happyFaceScoreManager.reset();
        
        // Clear projectiles
        this.projectileManager.clearAllProjectiles();
        
        // Reset face
        this.face.resetFace();
        
        this.isGameOver = false;
        this.updateHighScoreDisplay();
    }
}

export { SceneManager };
