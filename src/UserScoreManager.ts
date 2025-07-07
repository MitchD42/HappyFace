import type { Face } from './Face'

class UserScoreManager {
    public face: Face | null
    public score: number = 0
    private scoreElement: HTMLDivElement
    private goalMessageElement: HTMLDivElement | null = null

    constructor(face: Face | null) {
        this.face = face
        this.scoreElement = this.createScoreElement()
    }

    private createScoreElement(): HTMLDivElement {
        const scoreElement = document.createElement('div')
        scoreElement.style.position = 'absolute'
        scoreElement.style.top = '10px'
        scoreElement.style.right = '10px'
        scoreElement.style.color = 'white'
        scoreElement.style.fontSize = '40px'
        scoreElement.innerHTML = `User Score: ${this.score}`
        document.body.appendChild(scoreElement)
        return scoreElement
    }

    public addPoint(): void {
        this.score++
        this.scoreElement.innerHTML = `User Score: ${this.score}`
        
        if (this.face) {
            this.face.updateColorBasedOnScore()

            // Reset the face every 100 points
            if (this.score % 100 === 0) {
                this.face.resetFace()
            }
        }

        this.manageGoalMessage() // Manage the goal message based on the current score

        // Change the score color to green and then back to white
        this.flashScoreColor()
    }

    private flashScoreColor(): void {
        // Change color to green
        this.scoreElement.style.color = 'green'

        // Set a timeout to change the color back to white after a short duration
        setTimeout(() => {
            this.scoreElement.style.color = 'white'
        }, 100) // Adjust the duration (100ms) as needed
    }

    private manageGoalMessage(): void {
        if (this.score >= 40 && this.score <= 60) {
            if (!this.goalMessageElement) {
                console.log('Creating goal message element')
                this.goalMessageElement = this.createGoalMessageElement()
            }
        } else if (this.goalMessageElement) {
            console.log('Removing goal message element')
            this.goalMessageElement.remove()
            this.goalMessageElement = null
        }
    }

    private createGoalMessageElement(): HTMLDivElement {
        const goalMessageElement = document.createElement('div')
        goalMessageElement.style.position = 'absolute'
        goalMessageElement.style.top = '100px' // Adjust position as needed
        goalMessageElement.style.left = '50%'
        goalMessageElement.style.transform = 'translateX(-50%)'
        goalMessageElement.style.color = 'red'
        goalMessageElement.style.fontSize = '80px'
        goalMessageElement.innerHTML = 'After 50 user points the goal is to catch the projectiles.'
        document.body.appendChild(goalMessageElement)
        return goalMessageElement
    }
}

export { UserScoreManager } 