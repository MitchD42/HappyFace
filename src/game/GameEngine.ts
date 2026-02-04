import * as THREE from 'three';
import { Bounds } from './types';

// Score callback type
type ScoreCallback = (userScore: number, happyFaceScore: number, highScore: number) => void;
type GameOverCallback = (userScore: number, highScore: number, isNewHighScore: boolean) => void;
type HitCallback = () => void;

export class GameEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private bounds: Bounds;
  private animationId: number | null = null;

  // Game objects
  private faceSphere: THREE.Mesh | null = null;
  private eye1: THREE.Mesh | null = null;
  private eye2: THREE.Mesh | null = null;
  private mouth: THREE.Mesh | null = null;
  private projectiles: Array<{ mesh: THREE.Mesh; direction: THREE.Vector3; speed: number }> = [];

  // Game state
  private isGameRunning = false;
  private isGameOver = false;
  private userScore = 0;
  private happyFaceScore = 0;
  private updateCount = 0;
  private currentSpeed = 0.5;
  private lastLaunchTime = 0;
  private launchInterval = 500;

  // Mouse tracking
  private currentMousePos = new THREE.Vector2();
  private windowHalfX = 0;
  private windowHalfY = 0;

  // Callbacks
  private onScoreUpdate: ScoreCallback | null = null;
  private onGameOver: GameOverCallback | null = null;
  private onHit: HitCallback | null = null;

  constructor(container: HTMLElement) {
    this.bounds = {
      xMin: -5, xMax: 5,
      yMin: -2.25, yMax: 2.25,
      zMin: -2, zMax: 2
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setClearColor(0x000000);
    container.appendChild(this.renderer.domElement);

    this.windowHalfX = container.clientWidth / 2;
    this.windowHalfY = container.clientHeight / 2;

    this.createBounds();
    this.createFace();
    this.setupEventListeners(container);
    this.animate();
  }

  setCallbacks(onScoreUpdate: ScoreCallback, onGameOver: GameOverCallback, onHit: HitCallback) {
    this.onScoreUpdate = onScoreUpdate;
    this.onGameOver = onGameOver;
    this.onHit = onHit;
  }

  private createBounds() {
    const geometry = new THREE.BoxGeometry(16.5, 7.5, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const boundsBox = new THREE.Mesh(geometry, material);
    this.scene.add(boundsBox);
  }

  private createFace() {
    // Main face sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.faceSphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.faceSphere);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    this.eye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
    this.eye1.position.set(-0.3, 0.3, 0.9);
    this.faceSphere.add(this.eye1);

    this.eye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
    this.eye2.position.set(0.3, 0.3, 0.9);
    this.faceSphere.add(this.eye2);

    // Mouth
    const mouthShape = new THREE.Shape();
    mouthShape.absarc(0, -0.2, 0.2, 0, Math.PI, true);
    const mouthGeometry = new THREE.ExtrudeGeometry(mouthShape, { depth: 0.2, bevelEnabled: false });
    const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    this.faceSphere.add(this.mouth);
  }

  private setupEventListeners(container: HTMLElement) {
    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = event.clientX - rect.left - this.windowHalfX;
      const mouseY = event.clientY - rect.top - this.windowHalfY;

      const normMouseX = mouseX / this.windowHalfX;
      const normMouseY = -mouseY / this.windowHalfY;

      this.currentMousePos.set(normMouseX, normMouseY);

      if (this.faceSphere) {
        this.faceSphere.rotation.y = mouseX / (2 * this.windowHalfX);
        this.faceSphere.rotation.x = mouseY / (2 * this.windowHalfY);
      }
    };

    const onResize = () => {
      this.windowHalfX = container.clientWidth / 2;
      this.windowHalfY = container.clientHeight / 2;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    };

    container.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
  }

  private moveFaceRandomly() {
    if (!this.faceSphere) return;

    this.updateCount++;
    if (this.updateCount % 25 === 0) {
      this.currentSpeed = Math.random() * 0.03;
    }

    const deltaX = (Math.random() - 0.5) * this.currentSpeed;
    const deltaY = (Math.random() - 0.5) * this.currentSpeed;
    const deltaZ = 2.3 * (Math.random() - 0.5) * this.currentSpeed;

    this.faceSphere.position.x = Math.max(Math.min(this.faceSphere.position.x + deltaX, this.bounds.xMax), this.bounds.xMin);
    this.faceSphere.position.y = Math.max(Math.min(this.faceSphere.position.y + deltaY, this.bounds.yMax), this.bounds.yMin);
    this.faceSphere.position.z = Math.max(Math.min(this.faceSphere.position.z + deltaZ, this.bounds.zMax), this.bounds.zMin);
  }

  private updateFaceColor() {
    if (!this.faceSphere || !this.mouth) return;

    const greenIntensity = 1 - Math.min(this.userScore / 100, 1);
    (this.faceSphere.material as THREE.MeshBasicMaterial).color.setRGB(1, greenIntensity, 0);

    const redIntensity = 1 - Math.min(this.userScore / 150, 1);
    (this.mouth.material as THREE.MeshBasicMaterial).color.setRGB(redIntensity, 0, 0);
  }

  private launchProjectile() {
    if (!this.faceSphere) return;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.currentMousePos, this.camera);
    const dir = raycaster.ray.direction.normalize();
    dir.z = 0;

    let speed = 0.1;
    if (this.userScore > 20) {
      speed = 0.1 + (this.userScore - 20) * 0.0005;
    }

    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const color = this.userScore < 50 ? 0xff0000 : 0x00ff00;
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(this.faceSphere.position);

    this.scene.add(mesh);
    this.projectiles.push({ mesh, direction: dir, speed });

    this.lastLaunchTime = Date.now();
  }

  private updateProjectiles() {
    const toRemove: number[] = [];

    this.projectiles.forEach((projectile, index) => {
      projectile.mesh.position.add(projectile.direction.clone().multiplyScalar(projectile.speed));

      // Check collision with cursor
      const posNorm = projectile.mesh.position.clone().project(this.camera);
      const dist = this.currentMousePos.distanceTo(new THREE.Vector2(posNorm.x, posNorm.y));

      if (dist <= 0.05) {
        // Collision!
        if (this.userScore < 50) {
          this.happyFaceScore++;
          this.onHit?.();
          if (this.happyFaceScore >= 100) {
            this.endGame();
          }
        } else {
          this.userScore++;
          this.updateFaceColor();
        }
        toRemove.push(index);
        this.notifyScoreUpdate();
      } else if (posNorm.x < -1 || posNorm.x > 1 || posNorm.y < -1 || posNorm.y > 1) {
        // Off screen
        if (this.userScore > 50) {
          this.happyFaceScore++;
          this.onHit?.();
          if (this.happyFaceScore >= 100) {
            this.endGame();
          }
        } else {
          this.userScore++;
          this.updateFaceColor();
        }
        toRemove.push(index);
        this.notifyScoreUpdate();
      }
    });

    // Remove projectiles in reverse order
    toRemove.sort((a, b) => b - a).forEach(index => {
      this.scene.remove(this.projectiles[index].mesh);
      this.projectiles.splice(index, 1);
    });
  }

  private notifyScoreUpdate() {
    const highScore = this.getHighScore();
    this.onScoreUpdate?.(this.userScore, this.happyFaceScore, highScore);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.isGameRunning && !this.isGameOver) {
      this.moveFaceRandomly();

      if (Date.now() - this.lastLaunchTime > this.launchInterval) {
        this.launchProjectile();
      }

      this.updateProjectiles();
    }

    this.renderer.render(this.scene, this.camera);
  };

  getHighScore(): number {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('happyface_highscore') || '0', 10);
    }
    return 0;
  }

  setHighScore(score: number) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('happyface_highscore', score.toString());
    }
  }

  startGame() {
    this.isGameRunning = true;
    this.isGameOver = false;
    this.notifyScoreUpdate();
  }

  endGame() {
    this.isGameRunning = false;
    this.isGameOver = true;

    const currentHighScore = this.getHighScore();
    const isNewHighScore = this.userScore > currentHighScore;

    if (isNewHighScore) {
      this.setHighScore(this.userScore);
    }

    this.onGameOver?.(this.userScore, Math.max(this.userScore, currentHighScore), isNewHighScore);
  }

  resetGame() {
    this.userScore = 0;
    this.happyFaceScore = 0;
    this.isGameOver = false;

    // Clear projectiles
    this.projectiles.forEach(p => this.scene.remove(p.mesh));
    this.projectiles = [];

    // Reset face
    if (this.faceSphere) {
      this.faceSphere.position.set(0, 0, 0);
      (this.faceSphere.material as THREE.MeshBasicMaterial).color.setHex(0xffff00);
    }
    if (this.mouth) {
      (this.mouth.material as THREE.MeshBasicMaterial).color.setHex(0xff0000);
    }

    this.notifyScoreUpdate();
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
  }
}
