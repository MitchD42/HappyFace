function handleMouseMove(mouseX, mouseY, eventController, face, projectileManager) {
    // Normalize the mouse coordinates (range -1 to 1)
    const normMouseX = (mouseX / eventController.windowHalfX);
    const normMouseY = -(mouseY / eventController.windowHalfY);

    // Update the current mouse position in ProjectileManager
    projectileManager.setCurrentMousePosition(normMouseX, normMouseY);

    // Update the face rotation based on mouse movement
    if (face && face.sphere) {
        face.sphere.rotation.y = mouseX / (2 * eventController.windowHalfX);
        face.sphere.rotation.x = mouseY / (2 * eventController.windowHalfY);
    }
}

export { handleMouseMove };
