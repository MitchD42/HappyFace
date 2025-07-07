//SceneManager.ts
import * as THREE from 'three'
import { Face } from './Face'
import { EventController } from './EventController'
import { ProjectileManager } from './ProjectileManager'
import { UserScoreManager } from './UserScoreManager'
import { HappyFaceScoreManager } from './HappyFaceScoreManager'
import { animate } from './AnimationManager'
import { handleMouseMove } from './MouseMoveHandler'

interface Bounds {
    xMin: number
    xMax: number
    yMin: number
    yMax: number
    zMin: number
    zMax: number
}

class SceneManager {
    private scene: THREE.Scene
    private camera: THREE.PerspectiveCamera
    private renderer: THREE.WebGLRenderer
    private bounds: Bounds
    private boundsBox: THREE.Mesh
    private face: Face
    private userScoreManager: UserScoreManager
    private happyFaceScoreManager: HappyFaceScoreManager
    private projectileManager: ProjectileManager
    private eventController: EventController
    private isPaused: boolean = false

    constructor() {
        this.bounds = {
            xMin: -5, // half of the box width
            xMax: 5,
            yMin: -2.25, // half of the box height
            yMax: 2.25,
            zMin: -2, // half of the box depth
            zMax: 2
        }
        
        this.initScene()
        this.initCamera()
        this.initRenderer()

        // Initialize UserScoreManager without the face object first
        this.userScoreManager = new UserScoreManager(null!) // Temporary null, will be set properly after Face is created.

        // Initialize the Face object with the UserScoreManager and bounds
        this.face = new Face(this.scene, this.userScoreManager, this.bounds)

        // Now set the face object correctly in UserScoreManager
        this.userScoreManager.face = this.face
        
        this.happyFaceScoreManager = new HappyFaceScoreManager(this.face)
        
        this.projectileManager = new ProjectileManager(this.scene, this.camera, this.userScoreManager, this.happyFaceScoreManager)

        // Initialize the EventController
        this.eventController = new EventController(
            this.camera, 
            this.renderer, 
            (mouseX: number, mouseY: number) => handleMouseMove(mouseX, mouseY, this.eventController, this.face, this.projectileManager), 
        )

        // Begin the animation loop
        animate(this)  // Pass the SceneManager object to the animate function

        // Setup pause button
        this.setupPauseButton()
    }

    private initScene(): void {
        // Set up the scene
        this.scene = new THREE.Scene()

        this.createBounds()
    }

    private createBounds(): void {
        // Remove the visual boundary box - keep bounds for collision detection only
        const geometry = new THREE.BoxGeometry(16.5, 7.5, 0)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false })
        this.boundsBox = new THREE.Mesh(geometry, material)
        // Don't add to scene since we don't want to see it
        // this.scene.add(this.boundsBox)
    }

    private initCamera(): void {
        // Set up the camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.z = 5
    }

    private initRenderer(): void {
        // Set up the renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(0x000000, 1)
        
        // Append to the game container instead of body
        const gameContainer = document.getElementById('game-container')
        if (gameContainer) {
            gameContainer.appendChild(this.renderer.domElement)
        } else {
            document.body.appendChild(this.renderer.domElement)
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        })
    }

    // Getters for properties needed by other modules
    get sceneObject(): THREE.Scene {
        return this.scene
    }

    get cameraObject(): THREE.PerspectiveCamera {
        return this.camera
    }

    get rendererObject(): THREE.WebGLRenderer {
        return this.renderer
    }

    get faceObject(): Face {
        return this.face
    }

    get projectileManagerObject(): ProjectileManager {
        return this.projectileManager
    }

    get userScoreManagerObject(): UserScoreManager {
        return this.userScoreManager
    }

    get happyFaceScoreManagerObject(): HappyFaceScoreManager {
        return this.happyFaceScoreManager
    }

    get paused(): boolean {
        return this.isPaused
    }

    private setupPauseButton(): void {
        const pauseButton = document.getElementById('pause-button')
        if (pauseButton) {
            pauseButton.addEventListener('click', () => {
                this.togglePause()
            })
        }

        // Add keyboard shortcut (spacebar) to toggle pause
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault() // Prevent page scroll
                this.togglePause()
            }
        })
    }

    private togglePause(): void {
        this.isPaused = !this.isPaused
        const pauseButton = document.getElementById('pause-button')
        const pauseOverlay = document.getElementById('pause-overlay')
        
        if (this.isPaused) {
            if (pauseButton) pauseButton.textContent = '▶️ RESUME'
            if (pauseOverlay) pauseOverlay.classList.add('visible')
        } else {
            if (pauseButton) pauseButton.textContent = '⏸️ PAUSE'
            if (pauseOverlay) pauseOverlay.classList.remove('visible')
        }
    }
}

export { SceneManager } 