class HappyFaceScoreManager {
    constructor(face) {
        this.face = face; // Store reference to the Face
        this.score = 0;
        this.scoreElement = this.createScoreElement();
    }

    createScoreElement() {
        const scoreElement = document.createElement('div');
        scoreElement.style.position = 'absolute';
        scoreElement.style.top = '10px';
        scoreElement.style.left = '0px'; // Position on the other side of the screen
        scoreElement.style.color = 'white';
        scoreElement.style.fontSize = '40px';
        scoreElement.innerHTML = `Happy Face Score: ${this.score}`;
        document.body.appendChild(scoreElement);
        return scoreElement;
    }

    addPoint() {
        this.score++;
        this.scoreElement.innerHTML = `Happy Face Score: ${this.score}`;

        // Reset the face every 50 points
        if (this.score % 50 === 0) {
            this.face.resetFace();
        }

        // Change the score color to green and then back to white
        this.flashScoreColor();
    }

    flashScoreColor() {
        // Change color to green
        this.scoreElement.style.color = 'green';

        // Set a timeout to change the color back to white after a short duration
        setTimeout(() => {
            this.scoreElement.style.color = 'white';
        }, 100); // Adjust the duration (500ms) as needed
    }
}

export { HappyFaceScoreManager };