//EventController.ts
import * as THREE from 'three'

type MouseMoveCallback = (mouseX: number, mouseY: number) => void
type CanvasClickCallback = (event: MouseEvent) => void

class EventController {
    private camera: THREE.PerspectiveCamera
    private renderer: THREE.WebGLRenderer
    private onMouseMove: MouseMoveCallback | null
    private onCanvasClick: CanvasClickCallback | null

    public mouseX: number = 0
    public mouseY: number = 0
    private windowHalfX: number
    private windowHalfY: number

    // Bound event handlers
    private onDocumentMouseMoveBound: (event: MouseEvent) => void
    private onWindowResizeBound: () => void
    private onDocumentCanvasClickBound: (event: MouseEvent) => void

    constructor(
        camera: THREE.PerspectiveCamera, 
        renderer: THREE.WebGLRenderer, 
        onMouseMove?: MouseMoveCallback, 
        onCanvasClick?: CanvasClickCallback
    ) {
        this.camera = camera
        this.renderer = renderer
        this.onMouseMove = onMouseMove || null
        this.onCanvasClick = onCanvasClick || null

        this.windowHalfX = window.innerWidth / 2
        this.windowHalfY = window.innerHeight / 2

        // Bind event handlers
        this.onDocumentMouseMoveBound = this.onDocumentMouseMove.bind(this)
        this.onWindowResizeBound = this.onWindowResize.bind(this)
        this.onDocumentCanvasClickBound = this.onDocumentCanvasClick.bind(this)

        this.addEventListeners()
    }

    private addEventListeners(): void {
        document.addEventListener('mousemove', (event) => this.onDocumentMouseMove(event), false)
        window.addEventListener('resize', () => this.onWindowResize(), false)
        this.renderer.domElement.addEventListener('click', (event) => this.onDocumentCanvasClick(event), false)
    }   

    private onDocumentMouseMove(event: MouseEvent): void {
        this.mouseX = (event.clientX - this.windowHalfX)
        this.mouseY = (event.clientY - this.windowHalfY)

        // Call the provided onMouseMove callback
        if (this.onMouseMove) {
            this.onMouseMove(this.mouseX, this.mouseY)
        }
    }

    private onWindowResize(): void {
        this.windowHalfX = window.innerWidth / 2
        this.windowHalfY = window.innerHeight / 2

        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    private onDocumentCanvasClick(event: MouseEvent): void {
        if (this.onCanvasClick) {
            this.onCanvasClick(event)
        }
    }

    public removeEventListeners(): void {
        document.removeEventListener('mousemove', this.onDocumentMouseMoveBound)
        window.removeEventListener('resize', this.onWindowResizeBound)
        this.renderer.domElement.removeEventListener('click', this.onDocumentCanvasClickBound)
    }   
}

export { EventController } 