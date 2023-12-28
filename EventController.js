//EventController.js
class EventController {
    constructor(camera, renderer, onMouseMove, onCanvasClick) {
        this.camera = camera;
        this.renderer = renderer;
        this.onMouseMove = onMouseMove;
        this.onCanvasClick = onCanvasClick;

        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        // Bind event handlers
        this.onDocumentMouseMoveBound = this.onDocumentMouseMove.bind(this);
        this.onWindowResizeBound = this.onWindowResize.bind(this);
        this.onDocumentCanvasClickBound = this.onDocumentCanvasClick.bind(this);

        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener('mousemove', (event) => this.onDocumentMouseMove(event), false);
        window.addEventListener('resize', () => this.onWindowResize(), false);
        this.renderer.domElement.addEventListener('click', (event) => this.onDocumentCanvasClick(event), false);
    }   

    onDocumentMouseMove(event) {
        this.mouseX = (event.clientX - this.windowHalfX);
        this.mouseY = (event.clientY - this.windowHalfY);

        // Call the provided onMouseMove callback
        if (this.onMouseMove) {
            this.onMouseMove(this.mouseX, this.mouseY);
        }
    }

    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onDocumentCanvasClick(event) {
        if (this.onCanvasClick) {
            this.onCanvasClick(event);
        }
    }

    removeEventListeners() {
        document.removeEventListener('mousemove', this.onDocumentMouseMoveBound);
        window.removeEventListener('resize', this.onWindowResizeBound);
        this.renderer.domElement.removeEventListener('click', this.onDocumentCanvasClickBound);
    }   
}

export { EventController };