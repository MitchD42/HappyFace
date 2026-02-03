class HappyFaceScoreManager {
    constructor(face, sceneManager) {
        this.face = face;
        this.sceneManager = sceneManager;
        this.score = 0;
        this.scoreElement = this.createScoreElement();
    }

    createScoreElement() {
        const scoreElement = document.createElement('div');
        scoreElement.style.position = 'absolute';
        scoreElement.style.top = '10px';
        scoreElement.style.left = '10px';
        scoreElement.style.color = 'white';
        scoreElement.style.fontSize = '40px';
        scoreElement.style.fontFamily = 'Segoe UI, Arial, sans-serif';
        scoreElement.style.transition = 'transform 0.1s, color 0.1s';
        scoreElement.innerHTML = `Happy Face: ${this.score}`;
        document.body.appendChild(scoreElement);
        return scoreElement;
    }

    addPoint() {
        this.score++;
        this.scoreElement.innerHTML = `Happy Face: ${this.score}`;

        // Reset the face every 50 points
        if (this.score % 50 === 0) {
            this.face.resetFace();
        }

        this.flashScoreColor();
        
        // Trigger hit effect on screen
        if (window.triggerHitEffect) {
            window.triggerHitEffect();
        }
        
        // Check win condition - happy face wins at 100 points
        if (this.score >= 100 && this.sceneManager) {
            this.sceneManager.endGame();
        }
    }

    flashScoreColor() {
        // More visible flash - red since it's bad for the player
        this.scoreElement.style.color = '#FF4444';
        this.scoreElement.style.transform = 'scale(1.3)';
        this.scoreElement.style.textShadow = '0 0 20px #FF4444';

        setTimeout(() => {
            this.scoreElement.style.color = 'white';
            this.scoreElement.style.transform = 'scale(1)';
            this.scoreElement.style.textShadow = 'none';
        }, 200);
    }

    reset() {
        this.score = 0;
        this.scoreElement.innerHTML = `Happy Face: ${this.score}`;
    }
}

export { HappyFaceScoreManager };
