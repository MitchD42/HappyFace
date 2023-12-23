// UserScoreManager.js
class UserScoreManager {
    constructor(face) {
        this.face = face; // store reference to the Face
        this.score = 0;
        this.scoreElement = this.createScoreElement();
    }

    createScoreElement() {
        const scoreElement = document.createElement('div');
        scoreElement.style.position = 'absolute';
        scoreElement.style.top = '10px';
        scoreElement.style.right = '10px';
        scoreElement.style.color = 'white';
        scoreElement.style.fontSize = '24px';
        scoreElement.innerHTML = `User Score: ${this.score}`;
        document.body.appendChild(scoreElement);
        return scoreElement;
    }

    addPoint() {
        this.score++;
        this.scoreElement.innerHTML = `User Score: ${this.score}`;
        this.face.updateColorBasedOnScore(); // Update face color whenever the score changes
    }
}

export { UserScoreManager };