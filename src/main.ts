import './style.css'
import { SceneManager } from './SceneManager'

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container')
    if (gameContainer) {
        new SceneManager()
    }
}) 