class UserScoreManager {
    constructor(face, sceneManager) {
        this.face = face;
        this.sceneManager = sceneManager;
        this.score = 0;
        this.scoreElement = this.createScoreElement();
        this.goalMessageElement = null;
    }

    createScoreElement() {
        const scoreElement = document.createElement('div');
        scoreElement.style.position = 'absolute';
        scoreElement.style.top = '10px';
        scoreElement.style.right = '10px';
        scoreElement.style.color = 'white';
        scoreElement.style.fontSize = '40px';
        scoreElement.style.fontFamily = 'Segoe UI, Arial, sans-serif';
        scoreElement.style.transition = 'transform 0.1s, color 0.1s';
        scoreElement.innerHTML = `User Score: ${this.score}`;
        document.body.appendChild(scoreElement);
        return scoreElement;
    }

    addPoint() {
        this.score++;
        this.scoreElement.innerHTML = `User Score: ${this.score}`;
        this.face.updateColorBasedOnScore();

        // Reset the face every 100 points
        if (this.score % 100 === 0) {
            this.face.resetFace();
        }

        this.manageGoalMessage();
        this.flashScoreColor();
        
        // Check for new high score and show indicator
        if (this.sceneManager && this.score > this.sceneManager.getHighScore()) {
            this.showNewHighScoreIndicator();
        }
    }

    flashScoreColor() {
        // More visible flash effect
        this.scoreElement.style.color = '#00FF00';
        this.scoreElement.style.transform = 'scale(1.3)';
        this.scoreElement.style.textShadow = '0 0 20px #00FF00';

        setTimeout(() => {
            this.scoreElement.style.color = 'white';
            this.scoreElement.style.transform = 'scale(1)';
            this.scoreElement.style.textShadow = 'none';
        }, 200);
    }

    showNewHighScoreIndicator() {
        if (!this.newHighScoreElement) {
            this.newHighScoreElement = document.createElement('div');
            this.newHighScoreElement.style.position = 'absolute';
            this.newHighScoreElement.style.top = '100px';
            this.newHighScoreElement.style.right = '10px';
            this.newHighScoreElement.style.color = '#FFD700';
            this.newHighScoreElement.style.fontSize = '20px';
            this.newHighScoreElement.style.fontFamily = 'Segoe UI, Arial, sans-serif';
            this.newHighScoreElement.style.animation = 'pulse 0.5s ease-in-out infinite alternate';
            this.newHighScoreElement.innerHTML = '🎉 NEW HIGH SCORE!';
            document.body.appendChild(this.newHighScoreElement);
        }
    }

    manageGoalMessage() {
        if (this.score >= 40 && this.score <= 60) {
            if (!this.goalMessageElement) {
                this.goalMessageElement = this.createGoalMessageElement();
            }
        } else if (this.goalMessageElement) {
            this.goalMessageElement.remove();
            this.goalMessageElement = null;
        }
    }

    createGoalMessageElement() {
        const goalMessageElement = document.createElement('div');
        goalMessageElement.style.position = 'absolute';
        goalMessageElement.style.top = '150px';
        goalMessageElement.style.left = '50%';
        goalMessageElement.style.transform = 'translateX(-50%)';
        goalMessageElement.style.color = '#4ECDC4';
        goalMessageElement.style.fontSize = '28px';
        goalMessageElement.style.fontFamily = 'Segoe UI, Arial, sans-serif';
        goalMessageElement.style.textAlign = 'center';
        goalMessageElement.style.background = 'rgba(0,0,0,0.7)';
        goalMessageElement.style.padding = '15px 25px';
        goalMessageElement.style.borderRadius = '10px';
        goalMessageElement.innerHTML = '🎯 After 50 points: CATCH the projectiles!';
        document.body.appendChild(goalMessageElement);
        return goalMessageElement;
    }

    reset() {
        this.score = 0;
        this.scoreElement.innerHTML = `User Score: ${this.score}`;
        
        if (this.goalMessageElement) {
            this.goalMessageElement.remove();
            this.goalMessageElement = null;
        }
        
        if (this.newHighScoreElement) {
            this.newHighScoreElement.remove();
            this.newHighScoreElement = null;
        }
    }
}

export { UserScoreManager };
