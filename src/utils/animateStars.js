export const animateStars = (points, setScore) => {
    const starCount = points;

    // Find the star score counter element specifically by looking for a component with FaStar icon
    const scoreElement = document.querySelector('.flex.items-center.bg-gradient-to-r.from-cyan-500.to-teal-600');
    
    if (!scoreElement) {
        console.warn('Score element not found, animation will be simplified');
        // Just update the score without animation
        for (let i = 0; i < starCount; i++) {
            setTimeout(() => {
                setScore(prevScore => prevScore + 1);
            }, i * 50);
        }
        return;
    }
    
    const scoreRect = scoreElement.getBoundingClientRect();
    const centerX = scoreRect.left + scoreRect.width / 2;
    const centerY = scoreRect.top + scoreRect.height / 2;

    const codeEditorElement = document.querySelector('.ace_editor');
    if (!codeEditorElement) {
        for (let i = 0; i < starCount; i++) {
            setTimeout(() => {
                setScore(prevScore => prevScore + 1);
            }, i * 50);
        }
        return;
    }
    
    const codeEditorRect = codeEditorElement.getBoundingClientRect();

    // Current score value
    const scoreDisplay = scoreElement.querySelector('span') || scoreElement;
    const currentScore = parseInt(scoreDisplay.innerText || '0');
    const targetScore = currentScore + starCount;

    // Create a subtle flash effect on the editor (less intrusive)
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.left = `${codeEditorRect.left}px`;
    flash.style.top = `${codeEditorRect.top}px`;
    flash.style.width = `${codeEditorRect.width}px`;
    flash.style.height = `${codeEditorRect.height}px`;
    flash.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
    flash.style.borderRadius = '0.5rem';
    flash.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.3)';
    flash.style.zIndex = '9998';
    flash.style.pointerEvents = 'none'; // Make sure it doesn't block interaction
    document.body.appendChild(flash);

    // Fade out the flash
    setTimeout(() => {
        flash.style.transition = 'opacity 0.5s ease-out';
        flash.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(flash);
        }, 500);
    }, 100);

    // Advanced animation for the score counter itself
    // Clone the score element for animation
    const scoreCounterClone = document.createElement('div');
    scoreCounterClone.innerHTML = `+${starCount}`;
    scoreCounterClone.style.position = 'fixed';
    scoreCounterClone.style.fontSize = '18px';
    scoreCounterClone.style.fontWeight = 'bold';
    scoreCounterClone.style.color = '#06b6d4';
    scoreCounterClone.style.textShadow = '0 0 10px rgba(6, 182, 212, 0.8)';
    scoreCounterClone.style.left = `${centerX + 20}px`;
    scoreCounterClone.style.top = `${centerY - 20}px`;
    scoreCounterClone.style.opacity = '0';
    scoreCounterClone.style.zIndex = '10000';
    scoreCounterClone.style.pointerEvents = 'none';
    document.body.appendChild(scoreCounterClone);

    // Animate the counter
    setTimeout(() => {
        scoreCounterClone.style.transition = 'all 1.5s cubic-bezier(0.17, 0.89, 0.32, 1.25)';
        scoreCounterClone.style.opacity = '1';
        scoreCounterClone.style.transform = 'translateY(-30px)';

        setTimeout(() => {
            scoreCounterClone.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(scoreCounterClone);
            }, 500);
        }, 1500);
    }, 300);

    // Create a pulsing ring effect around the score counter
    const pulseRing = document.createElement('div');
    pulseRing.style.position = 'fixed';
    pulseRing.style.left = `${centerX - scoreRect.width/2 - 10}px`;
    pulseRing.style.top = `${centerY - scoreRect.height/2 - 10}px`;
    pulseRing.style.width = `${scoreRect.width + 20}px`;
    pulseRing.style.height = `${scoreRect.height + 20}px`;
    pulseRing.style.borderRadius = '12px';
    pulseRing.style.border = '2px solid #06b6d4';
    pulseRing.style.boxShadow = '0 0 10px rgba(6, 182, 212, 0.8)';
    pulseRing.style.opacity = '0';
    pulseRing.style.zIndex = '9997';
    pulseRing.style.pointerEvents = 'none';
    document.body.appendChild(pulseRing);

    // Animate the pulse
    setTimeout(() => {
        pulseRing.style.transition = 'all 0.5s ease-out';
        pulseRing.style.opacity = '0.8';
        pulseRing.style.transform = 'scale(1.1)';

        setTimeout(() => {
            pulseRing.style.opacity = '0';
            pulseRing.style.transform = 'scale(1.5)';
            setTimeout(() => {
                document.body.removeChild(pulseRing);
            }, 500);
        }, 500);
    }, 200);

    // Number ticking animation in the score counter
    let ticker = currentScore;
    const tickInterval = Math.max(10, 1000 / starCount); // Ensures animation completes in about 1 second

    const tickAnimation = setInterval(() => {
        if (ticker < targetScore) {
            ticker++;
            setScore(ticker);

            // Apply a small scale effect on each tick
            scoreDisplay.style.transform = 'scale(1.1)';
            setTimeout(() => {
                scoreDisplay.style.transform = 'scale(1)';
            }, 50);
        } else {
            clearInterval(tickAnimation);
        }
    }, tickInterval);

    // Cyber particle effects
    for (let i = 0; i < starCount * 2; i++) {
        const particle = document.createElement('div');
        const isPixel = Math.random() > 0.7;

        if (isPixel) {
            // Digital pixel style
            const pixelSize = Math.random() * 6 + 3;
            particle.style.width = `${pixelSize}px`;
            particle.style.height = `${pixelSize}px`;
            particle.style.backgroundColor = getRandomColor();
            particle.style.position = 'fixed';
            particle.style.zIndex = '9999';
            particle.style.borderRadius = '1px';
            particle.style.pointerEvents = 'none';
        } else {
            // Star style
            particle.innerHTML = '✦';
            particle.style.position = 'fixed';
            particle.style.color = getRandomColor();
            particle.style.fontSize = `${Math.random() * 10 + 14}px`;
            particle.style.zIndex = '9999';
            particle.style.textShadow = `0 0 5px ${getRandomColor(true)}`;
            particle.style.pointerEvents = 'none';
        }

        document.body.appendChild(particle);

        // Set starting position - spread particles across the editor
        const startX = codeEditorRect.left + Math.random() * codeEditorRect.width;
        const startY = codeEditorRect.top + Math.random() * codeEditorRect.height;

        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;

        // Create a curved path
        const endX = centerX;
        const endY = centerY;

        // Control points for bezier curve
        const cp1x = startX + (endX - startX) * (0.2 + Math.random() * 0.3);
        const cp1y = startY - 50 - Math.random() * 100;
        const cp2x = startX + (endX - startX) * (0.7 + Math.random() * 0.3);
        const cp2y = endY - 50 - Math.random() * 100;

        // Generate bezier curve points
        const numPoints = 60;
        const points = [];

        for (let t = 0; t <= 1; t += 1/numPoints) {
            // Cubic bezier formula
            const x = Math.pow(1-t, 3) * startX +
                    3 * Math.pow(1-t, 2) * t * cp1x +
                    3 * (1-t) * Math.pow(t, 2) * cp2x +
                    Math.pow(t, 3) * endX;

            const y = Math.pow(1-t, 3) * startY +
                    3 * Math.pow(1-t, 2) * t * cp1y +
                    3 * (1-t) * Math.pow(t, 2) * cp2y +
                    Math.pow(t, 3) * endY;

            points.push({x, y});
        }

        // Animate along path
        let currentPoint = 0;
        const speed = 700 + Math.random() * 800; // Duration in ms
        const startTime = performance.now();

        function animateParticle(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / speed, 1);

            if (progress < 1) {
                const pointIndex = Math.min(Math.floor(progress * points.length), points.length - 1);
                const point = points[pointIndex];

                particle.style.left = `${point.x}px`;
                particle.style.top = `${point.y}px`;

                // Scale and opacity animation
                const scaleProgress = isPixel ?
                    1 - Math.abs(2 * progress - 1) : // Pixels grow then shrink
                    Math.max(0.2, 1 - progress);     // Stars shrink continuously

                const opacityProgress = progress > 0.8 ?
                    5 * (1 - progress) : // Fade out at end
                    Math.min(progress * 5, 1); // Fade in at start

                if (isPixel) {
                    particle.style.transform = `scale(${scaleProgress})`;
                } else {
                    particle.style.fontSize = `${scaleProgress * (Math.random() * 10 + 14)}px`;
                }

                particle.style.opacity = opacityProgress;

                requestAnimationFrame(animateParticle);
            } else {
                document.body.removeChild(particle);
            }
        }

        // Start the animation with a small delay per particle
        setTimeout(() => {
            requestAnimationFrame(animateParticle);
        }, i * 50);
    }

    // Additional pulse effect on score counter
    setTimeout(() => {
        scoreElement.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease-out';
        scoreElement.style.transform = 'scale(1.2)';
        scoreElement.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.8)';
        
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
            scoreElement.style.boxShadow = '';
        }, 300);
    }, 700);
};

// Helper functions
function getRandomColor(bright = false) {
    const colors = bright ? 
        ['#06b6d4', '#0ea5e9', '#22d3ee', '#0891b2', '#14b8a6'] : // Bright teal/cyan
        ['#0e7490', '#0891b2', '#0369a1', '#0c4a6e', '#155e75']; // Darker teal/cyan
    return colors[Math.floor(Math.random() * colors.length)];
}