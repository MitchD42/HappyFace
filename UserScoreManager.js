class UserScoreManager {
    constructor(face) {
        this.face = face; // store reference to the Face
        this.score = 0;
        this.scoreElement = this.createScoreElement();
        this.goalMessageElement = null; // Initialize to null
    }

    createScoreElement() {
        const scoreElement = document.createElement('div');
        scoreElement.style.position = 'absolute';
        scoreElement.style.top = '10px';
        scoreElement.style.right = '10px';
        scoreElement.style.color = 'white';
        scoreElement.style.fontSize = '40px';
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

        this.manageGoalMessage(); // Manage the goal message based on the current score

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

    manageGoalMessage() {
        if (this.score >= 40 && this.score <= 60) {
            if (!this.goalMessageElement) {
                console.log('Creating goal message element');
                this.goalMessageElement = this.createGoalMessageElement();
            }
        } else if (this.goalMessageElement) {
            console.log('Removing goal message element');
            this.goalMessageElement.remove();
            this.goalMessageElement = null;
        }
    }

    createGoalMessageElement() {
        const goalMessageElement = document.createElement('div');
        goalMessageElement.style.position = 'absolute';
        goalMessageElement.style.top = '100px'; // Adjust position as needed
        goalMessageElement.style.left = '50%';
        goalMessageElement.style.transform = 'translateX(-50%)';
        goalMessageElement.style.color = 'red';
        goalMessageElement.style.fontSize = '80px';
        goalMessageElement.innerHTML = 'After 50 user points the goal is to catch the projectiles.';
        document.body.appendChild(goalMessageElement);
        return goalMessageElement;
    }
}

export { UserScoreManager };