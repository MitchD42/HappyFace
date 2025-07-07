import type { Face } from './Face'

class HappyFaceScoreManager {
    private face: Face
    private score: number = 0
    private scoreElement: HTMLDivElement

    constructor(face: Face) {
        this.face = face
        this.scoreElement = this.createScoreElement()
    }

    private createScoreElement(): HTMLDivElement {
        const scoreElement = document.createElement('div')
        scoreElement.style.position = 'absolute'
        scoreElement.style.top = '10px'
        scoreElement.style.left = '10px'
        scoreElement.style.color = 'white'
        scoreElement.style.fontSize = '40px'
        scoreElement.innerHTML = `Happy Face Score: ${this.score}`
        document.body.appendChild(scoreElement)
        return scoreElement
    }

    public addPoint(): void {
        this.score++
        this.scoreElement.innerHTML = `Happy Face Score: ${this.score}`
        this.face.updateColorBasedOnScore()

        // Reset the face every 100 points
        if (this.score % 100 === 0) {
            this.face.resetFace()
        }

        // Change the score color to yellow and then back to white
        this.flashScoreColor()
    }

    private flashScoreColor(): void {
        // Change color to yellow
        this.scoreElement.style.color = 'yellow'

        // Set a timeout to change the color back to white after a short duration
        setTimeout(() => {
            this.scoreElement.style.color = 'white'
        }, 100) // Adjust the duration (100ms) as needed
    }
}

export { HappyFaceScoreManager } 