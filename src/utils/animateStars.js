import confetti from 'canvas-confetti';

export const animateStars = (points, setScore) => {
    const starCount = points;
    const headerElement = document.querySelector('header');
    const scoreElement = headerElement.querySelector('.bg-yellow-400');
    const scoreRect = scoreElement.getBoundingClientRect();
    const centerX = scoreRect.left + scoreRect.width / 2;
    const centerY = scoreRect.top + scoreRect.height / 2;

    // Trigger confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    const codeEditorElement = document.querySelector('.ace_editor');
    const codeEditorRect = codeEditorElement.getBoundingClientRect();

    let scoreUpdated = 0;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.innerHTML = '⭐';
        star.style.position = 'fixed';
        star.style.fontSize = '24px';
        star.style.zIndex = '9999';
        document.body.appendChild(star);

        const startX = codeEditorRect.left + Math.random() * codeEditorRect.width;
        const startY = codeEditorRect.bottom + Math.random() * codeEditorRect.height;

        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;

        const midX = startX + (centerX - startX) * (0.3 + Math.random() * 0.4);
        const midY = startY + (centerY - startY) * (0.3 + Math.random() * 0.4);

        const animation = star.animate([
            { transform: 'translate(0, 0) scale(0.5)', opacity: 0 },
            { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 0.2 },  // Slower fade in
            { transform: `translate(${midX - startX}px, ${midY - startY}px) scale(1.2)`, offset: 0.6 },
            { transform: `translate(${centerX - startX}px, ${centerY - startY}px) scale(0.5)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-in-out'
        });

        animation.onfinish = () => {
            document.body.removeChild(star);
        };

        // Update score when the star is close to the target
        setTimeout(() => {
            if (scoreUpdated < starCount) {
                scoreUpdated++;
                setScore(prevScore => prevScore + 1);
            }
        }, animation.effect.getTiming().duration * 0.7);  // Update score at 80% of animation duration
    }
};