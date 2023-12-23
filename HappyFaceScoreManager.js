class HappyFaceScoreManager {
    constructor() {
        this.score = 0;
        this.scoreElement = this.createScoreElement();
    }

    createScoreElement() {
        const scoreElement = document.createElement('div');
        scoreElement.style.position = 'absolute';
        scoreElement.style.top = '10px';
        scoreElement.style.left = '10px'; // Position on the other side of the screen
        scoreElement.style.color = 'white';
        scoreElement.style.fontSize = '24px';
        scoreElement.innerHTML = `Happy Face Score: ${this.score}`;
        document.body.appendChild(scoreElement);
        return scoreElement;
    }

    addPoint() {
        this.score++;
        this.scoreElement.innerHTML = `Happy Face Score: ${this.score}`;
    }
}

export { HappyFaceScoreManager };